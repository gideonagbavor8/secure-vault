'use client';

import { useState } from 'react';
import { Plus, ShieldAlert } from 'lucide-react';
import { useVaults } from '@/hooks/useVaults';
import { Vault } from '@/types/vault';
import { VaultCard } from '@/components/vaults/VaultCard';
import { CreateVaultModal } from '@/components/vaults/CreateVaultModal';
import { EditVaultModal } from '@/components/vaults/EditVaultModal';
import { Button } from '@/components/ui/button';

export default function VaultsPage() {
  const { vaults, isLoading, error, refetch } = useVaults();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);

  const handleEditClick = (vault: Vault) => {
    setSelectedVault(vault);
    setIsEditOpen(true);
  };

  const handleDeleted = () => {
    refetch();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
        <ShieldAlert className="w-16 h-16 text-vault-danger" />
        <h2 className="text-2xl font-bold text-foreground">Failed to load vaults</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={() => refetch()} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Vaults</h1>
          <p className="text-muted-foreground mt-1">Manage your secure credential vaults.</p>
        </div>
        
        {/* Desktop Create Button */}
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="hidden md:flex bg-vault-primary text-vault-primary-foreground hover:bg-vault-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Vault
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse border border-border" />
          ))}
        </div>
      ) : vaults.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-xl bg-card/50">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Plus className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">No vaults yet</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            Create your first vault to start securely storing and managing your credentials.
          </p>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-vault-primary text-vault-primary-foreground hover:bg-vault-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create your first vault
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 md:pb-0">
          {vaults.map((vault) => (
            <VaultCard 
              key={vault.id} 
              vault={vault} 
              onEdit={handleEditClick} 
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setIsCreateOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-vault-primary text-vault-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Create Vault"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modals */}
      <CreateVaultModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSuccess={refetch}
      />
      
      <EditVaultModal 
        isOpen={isEditOpen} 
        onClose={() => {
          setIsEditOpen(false);
          setTimeout(() => setSelectedVault(null), 200);
        }} 
        onSuccess={refetch}
        vault={selectedVault}
      />
    </div>
  );
}
