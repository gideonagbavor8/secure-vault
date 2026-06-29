import { useState } from 'react';
import { CreateVaultPayload, UpdateVaultPayload, Vault } from '../types/vault';
import * as vaultApi from '../lib/api/vaults';

interface UseVaultMutationsOptions {
  onSuccess?: () => void;
}

export function useVaultMutations(options?: UseVaultMutationsOptions) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleMutation = async <T,>(mutationFn: () => Promise<T>): Promise<T | undefined> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mutationFn();
      if (options?.onSuccess) {
        options.onSuccess();
      }
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err) || 'Mutation failed');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  const createVault = async (payload: CreateVaultPayload): Promise<Vault | undefined> => {
    return handleMutation(() => vaultApi.createVault(payload));
  };

  const updateVault = async (id: string, payload: UpdateVaultPayload): Promise<Vault | undefined> => {
    return handleMutation(() => vaultApi.updateVault(id, payload));
  };

  const deleteVault = async (id: string): Promise<void | undefined> => {
    return handleMutation(() => vaultApi.deleteVault(id));
  };

  const restoreVault = async (id: string): Promise<Vault | undefined> => {
    return handleMutation(() => vaultApi.restoreVault(id));
  };

  return {
    createVault,
    updateVault,
    deleteVault,
    restoreVault,
    isLoading,
    error,
  };
}
