import { prisma } from '../lib/prisma';
import { Prisma, Vault as PrismaVault } from '@prisma/client';
import {
  createVaultSchema,
  CreateVaultDto,
  updateVaultSchema,
  UpdateVaultDto,
} from '../dto/vault.dto';
import { NotFoundError, ValidationError } from '../errors';
import { logEvent } from '../utils/auditLogger';

const DEFAULT_VAULT_COLOUR = '#2D6A4F';

type VaultCredentialCount = {
  _count: {
    credentials: number;
  };
};

export type Vault = Omit<PrismaVault, 'deletedAt'> & Partial<VaultCredentialCount>;

const vaultSelect = {
  id: true,
  userId: true,
  name: true,
  colour: true,
  icon: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.VaultSelect;

const vaultWithCredentialCountSelect = {
  ...vaultSelect,
  _count: {
    select: {
      credentials: {
        where: {
          deletedAt: null,
        },
      },
    },
  },
} satisfies Prisma.VaultSelect;

type UpdatableVaultField = keyof UpdateVaultDto;
type ChangedFields = Partial<
  Record<
    UpdatableVaultField,
    {
      previous: string | null;
      current: string | null;
    }
  >
>;

function formatValidationError(error: { issues: Array<{ message: string }> }): string {
  return error.issues.map((issue) => issue.message).join(', ');
}

async function validateUserExists(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }
}

async function findActiveVaultOrThrow(vaultId: string, userId: string): Promise<PrismaVault> {
  const vault = await prisma.vault.findFirst({
    where: {
      id: vaultId,
      userId,
      deletedAt: null,
    },
  });

  if (!vault) {
    throw new NotFoundError('Vault not found');
  }

  return vault;
}

/**
 * Service layer for Vault management.
 */

/**
 * Create a new Vault.
 */
export async function createVault(userId: string, data: CreateVaultDto): Promise<Vault> {
  const parseResult = createVaultSchema.safeParse(data);
  if (!parseResult.success) {
    throw new ValidationError(formatValidationError(parseResult.error));
  }

  await validateUserExists(userId);

  const vault = await prisma.vault.create({
    data: {
      userId,
      name: parseResult.data.name,
      colour: parseResult.data.colour ?? DEFAULT_VAULT_COLOUR,
      icon: parseResult.data.icon ?? null,
    },
    select: vaultSelect,
  });

  await logEvent({
    userId,
    action: 'VAULT_CREATED',
    ipAddress: '127.0.0.1',
    metadata: { vaultId: vault.id },
  });

  return vault;
}

/**
 * Get all active vaults for a user.
 */
export async function getUserVaults(userId: string): Promise<Vault[]> {
  const vaults = await prisma.vault.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: vaultWithCredentialCountSelect,
  });

  return vaults;
}

/**
 * Get a specific vault by ID.
 */
export async function getVaultById(vaultId: string, userId: string): Promise<Vault> {
  const vault = await prisma.vault.findFirst({
    where: {
      id: vaultId,
      userId,
      deletedAt: null,
    },
    select: vaultWithCredentialCountSelect,
  });

  if (!vault) {
    throw new NotFoundError('Vault not found');
  }

  return vault;
}

/**
 * Update an existing Vault.
 */
export async function updateVault(vaultId: string, userId: string, data: UpdateVaultDto): Promise<Vault> {
  const parseResult = updateVaultSchema.safeParse(data);
  if (!parseResult.success) {
    throw new ValidationError(formatValidationError(parseResult.error));
  }

  const updateData = parseResult.data;
  const existingVault = await findActiveVaultOrThrow(vaultId, userId);

  const changedFields: ChangedFields = {};
  if (updateData.name !== undefined && updateData.name !== existingVault.name) {
    changedFields.name = {
      previous: existingVault.name,
      current: updateData.name,
    };
  }
  if (updateData.colour !== undefined && updateData.colour !== existingVault.colour) {
    changedFields.colour = {
      previous: existingVault.colour,
      current: updateData.colour,
    };
  }
  if (updateData.icon !== undefined && updateData.icon !== existingVault.icon) {
    changedFields.icon = {
      previous: existingVault.icon,
      current: updateData.icon,
    };
  }

  const updatedVault = await prisma.vault.update({
    where: { id: vaultId },
    data: {
      name: updateData.name,
      colour: updateData.colour,
      icon: updateData.icon,
    },
    select: vaultSelect,
  });

  await logEvent({
    userId,
    action: 'VAULT_UPDATED',
    ipAddress: '127.0.0.1',
    metadata: {
      vaultId,
      changedFields,
    },
  });

  return updatedVault;
}

/**
 * Soft-delete a Vault and its associated credentials.
 */
export async function softDeleteVault(vaultId: string, userId: string): Promise<void> {
  await findActiveVaultOrThrow(vaultId, userId);

  const now = new Date();

  const credentialCount = await prisma.$transaction(async (tx) => {
    const activeCredentialCount = await tx.credential.count({
      where: {
        vaultId,
        deletedAt: null,
      },
    });

    await tx.vault.update({
      where: { id: vaultId },
      data: { deletedAt: now },
    });

    await tx.credential.updateMany({
      where: {
        vaultId,
        deletedAt: null,
      },
      data: { deletedAt: now },
    });

    return activeCredentialCount;
  });

  await logEvent({
    userId,
    action: 'VAULT_DELETED',
    ipAddress: '127.0.0.1',
    metadata: {
      vaultId,
      credentialCount,
    },
  });
}

/**
 * Restore a soft-deleted Vault and its credentials.
 */
export async function restoreVault(vaultId: string, userId: string): Promise<Vault> {
  const existingVault = await prisma.vault.findFirst({
    where: {
      id: vaultId,
      userId,
      deletedAt: { not: null },
    },
  });

  if (!existingVault) {
    throw new NotFoundError('Vault not found');
  }

  const deletedAtTimestamp = existingVault.deletedAt;
  if (!deletedAtTimestamp) {
    throw new NotFoundError('Vault not found');
  }

  const [restoredVault] = await prisma.$transaction([
    prisma.vault.update({
      where: { id: vaultId },
      data: { deletedAt: null },
      select: vaultSelect,
    }),
    prisma.credential.updateMany({
      where: {
        vaultId,
        deletedAt: deletedAtTimestamp,
      },
      data: { deletedAt: null },
    }),
  ]);

  await logEvent({
    userId,
    action: 'VAULT_RESTORED',
    ipAddress: '127.0.0.1',
    metadata: { vaultId },
  });

  return restoredVault;
}
