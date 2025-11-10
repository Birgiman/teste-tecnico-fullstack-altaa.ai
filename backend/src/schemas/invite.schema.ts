import { ROLE_VALUES } from '@/types/role.types.js';
import { z } from 'zod';

export const createInviteSchema = z.object({
  email: z.email('E-mail inválido'),
  role: z.enum(ROLE_VALUES).default('MEMBER'),
  expiresInDays: z
    .number()
    .int()
    .min(1, 'Dias de expiração deve ser no mínimo 1')
    .max(30, 'Dias de expiração deve ser no máximo 30')
    .optional()
    .default(7),
});

export const createInviteParamsSchema = z.object({
  id: z.uuid('ID da empresa inválido'),
});

export const acceptInviteSchema = z.object({
  token: z.string().min(16, 'Token inválido'),
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;
export type CreateInviteParams = z.infer<typeof createInviteParamsSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
