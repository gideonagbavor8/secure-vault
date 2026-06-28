import client from './client';
import { Vault, CreateVaultPayload, UpdateVaultPayload } from '../../types/vault';

export const getAllVaults = async (): Promise<Vault[]> => {
  const { data } = await client.get<Vault[]>('/api/vaults');
  return data;
};

export const getVaultById = async (id: string): Promise<Vault> => {
  const { data } = await client.get<Vault>(`/api/vaults/${id}`);
  return data;
};

export const createVault = async (payload: CreateVaultPayload): Promise<Vault> => {
  const { data } = await client.post<Vault>('/api/vaults', payload);
  return data;
};

export const updateVault = async (id: string, payload: UpdateVaultPayload): Promise<Vault> => {
  const { data } = await client.patch<Vault>(`/api/vaults/${id}`, payload);
  return data;
};

export const deleteVault = async (id: string): Promise<void> => {
  await client.delete(`/api/vaults/${id}`);
};

export const restoreVault = async (id: string): Promise<Vault> => {
  const { data } = await client.patch<Vault>(`/api/vaults/${id}/restore`);
  return data;
};
