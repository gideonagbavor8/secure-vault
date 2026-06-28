import { z } from 'zod';

const HEX_COLOUR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export const createVaultSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(50, { message: 'Name must be at most 50 characters' }),
    colour: z
      .string()
      .regex(HEX_COLOUR_PATTERN, {
        message: 'Colour must be a valid 6-digit hex code',
      })
      .optional(),
    icon: z
      .string()
      .max(10, { message: 'Icon must be at most 10 characters' })
      .optional(),
  })
  .strict();

export type CreateVaultDto = z.infer<typeof createVaultSchema>;

export const updateVaultSchema = createVaultSchema.partial().strict();

export type UpdateVaultDto = Partial<CreateVaultDto>;
