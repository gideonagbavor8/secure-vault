'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Edit2, Trash2, ExternalLink, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Vault } from '@/types/vault';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useVaultMutations } from '@/hooks/useVaultMutations';
import { useToast } from '@/hooks/use-toast';

interface VaultCardProps {
  vault: Vault;
  onEdit: (vault: Vault) => void;
  onDeleted: () => void;
}

export function VaultCard({ vault, onEdit, onDeleted }: VaultCardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { deleteVault, isLoading: isDeleting } = useVaultMutations({
    onSuccess: () => {
      onDeleted();
      toast({
        title: "Vault deleted",
        description: "The vault has been successfully deleted.",
      });
      setIsDeleteDialogOpen(false);
    }
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCardClick = () => {
    router.push(`/vaults/${vault.id}`);
  };

  const handleDeleteConfirm = () => {
    deleteVault(vault.id);
  };

  return (
    <>
      <div 
        className="group relative flex flex-col p-5 bg-card border border-border rounded-xl cursor-pointer transition-all duration-200 ease-in-out hover:shadow-[var(--shadow-elevated)] hover:scale-[1.01] hover:border-border-hover overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Left Border Accent */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ backgroundColor: vault.colour || 'var(--vault-primary)' }}
        />

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 border border-border text-2xl">
            {vault.icon || '🛡️'}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleCardClick}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(vault)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-vault-danger focus:bg-vault-danger/10 focus:text-vault-danger"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-1" title={vault.name}>
            {vault.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Created {formatDistanceToNow(new Date(vault.createdAt), { addSuffix: true })}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="w-4 h-4 mr-1.5" />
            <span className="font-medium text-foreground">{vault._count?.credentials || 0}</span>
            <span className="ml-1">credentials</span>
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vault</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{vault.name}&quot;? This will move it to the trash and it will be permanently deleted after 30 days.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-vault-danger hover:bg-vault-danger/90 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
