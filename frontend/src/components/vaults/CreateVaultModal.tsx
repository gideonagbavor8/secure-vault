'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVaultMutations } from '@/hooks/useVaultMutations';
import { useToast } from '@/hooks/use-toast';

const vaultSchema = z.object({
  name: z.string().min(1, 'Vault name is required').max(50, 'Must be 50 characters or less'),
  icon: z.string().optional(),
  colour: z.string().optional(),
});

type VaultFormData = z.infer<typeof vaultSchema>;

const ICONS = ['🔐', '🏦', '💼', '🛡️', '🔑', '💳', '🌐', '📧', '🖥️', '📱', '🎮', '🏠', '🚗', '✈️', '🎓', '💰', '🏥', '📂', '🔒', '⚙️'];
const COLOURS = [
  '#00C389', // vault-primary
  '#A050FF', // vault-accent
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#EC4899', // Pink
];

interface CreateVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateVaultModal({ isOpen, onClose, onSuccess }: CreateVaultModalProps) {
  const { toast } = useToast();
  const { createVault, isLoading } = useVaultMutations({
    onSuccess: () => {
      onSuccess();
      toast({
        title: "Vault created successfully",
        description: "Your new vault is ready to use.",
      });
      reset();
      onClose();
    }
  });

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<VaultFormData>({
    resolver: zodResolver(vaultSchema),
    defaultValues: {
      name: '',
      icon: '🛡️',
      colour: '#00C389',
    }
  });

  const nameValue = watch('name');
  const selectedIcon = watch('icon');
  const selectedColour = watch('colour');

  const onSubmit = async (data: VaultFormData) => {
    try {
      await createVault(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast({
        title: "Error creating vault",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Vault</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="name">Vault Name</Label>
              <span className="text-xs text-muted-foreground">{nameValue.length}/50</span>
            </div>
            <Input 
              id="name" 
              placeholder="e.g. Work Credentials" 
              {...register('name')} 
              maxLength={50}
              className={errors.name ? "border-vault-danger" : ""}
            />
            {errors.name && <p className="text-sm text-vault-danger">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-5 gap-2 max-h-[120px] overflow-y-auto p-1">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setValue('icon', icon)}
                  className={`flex items-center justify-center w-10 h-10 text-xl rounded-md transition-all ${
                    selectedIcon === icon 
                      ? 'bg-vault-primary/20 ring-2 ring-vault-primary scale-110' 
                      : 'bg-muted hover:bg-muted-hover'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Colour Accent</Label>
            <div className="flex flex-wrap gap-2 pt-1">
              {COLOURS.map((colour) => (
                <button
                  key={colour}
                  type="button"
                  onClick={() => setValue('colour', colour)}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    selectedColour === colour 
                      ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110' 
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: colour }}
                  title={colour}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-vault-primary text-vault-primary-foreground hover:bg-vault-primary/90">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Vault
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
