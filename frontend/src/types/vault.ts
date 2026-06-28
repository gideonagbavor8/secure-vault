export interface Vault {
  id: string;
  userId: string;
  name: string;
  colour: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  _count?: {
    credentials: number;
  };
}

export interface CreateVaultPayload {
  name: string;
  colour?: string;
  icon?: string;
}

export type UpdateVaultPayload = Partial<CreateVaultPayload>;
