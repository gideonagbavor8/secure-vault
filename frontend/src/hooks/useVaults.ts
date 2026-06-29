import { useState, useEffect, useCallback } from 'react';
import { Vault } from '../types/vault';
import { getAllVaults } from '../lib/api/vaults';

export function useVaults() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVaults = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllVaults();
      setVaults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err) || 'Failed to fetch vaults'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaults();
  }, [fetchVaults]);

  return { vaults, isLoading, error, refetch: fetchVaults };
}
