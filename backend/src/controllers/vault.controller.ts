import { NextFunction, Request, Response } from 'express';
import * as vaultService from '../services/vault.service';
import { UnauthorisedError, ValidationError } from '../errors';

function getUserId(req: Request): string {
  const userId = req.user?.userId;
  if (!userId) {
    throw new UnauthorisedError();
  }

  return userId;
}

function getVaultId(req: Request): string {
  const vaultId = req.params.id;
  if (!vaultId) {
    throw new ValidationError('Vault id is required');
  }

  return vaultId;
}

export async function createVault(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = getUserId(req);
    const vault = await vaultService.createVault(userId, req.body);

    res.status(201).json(vault);
  } catch (error) {
    next(error);
  }
}

export async function getVaults(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = getUserId(req);
    const vaults = await vaultService.getUserVaults(userId);

    res.status(200).json({
      vaults,
      count: vaults.length,
    });
  } catch (error) {
    next(error);
  }
}

export async function getVault(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = getUserId(req);
    const vaultId = getVaultId(req);
    const vault = await vaultService.getVaultById(vaultId, userId);

    res.status(200).json(vault);
  } catch (error) {
    next(error);
  }
}

export async function updateVault(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = getUserId(req);
    const vaultId = getVaultId(req);
    const vault = await vaultService.updateVault(vaultId, userId, req.body);

    res.status(200).json(vault);
  } catch (error) {
    next(error);
  }
}

export async function deleteVault(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = getUserId(req);
    const vaultId = getVaultId(req);

    await vaultService.softDeleteVault(vaultId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function restoreVault(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = getUserId(req);
    const vaultId = getVaultId(req);
    const vault = await vaultService.restoreVault(vaultId, userId);

    res.status(200).json(vault);
  } catch (error) {
    next(error);
  }
}
