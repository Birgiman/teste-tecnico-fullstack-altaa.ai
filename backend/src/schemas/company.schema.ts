import { ROLE_VALUES } from '@/types/role.types.js';
import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  logoUrl: z.url('URL inválida').optional().nullable(),
});

export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),
  logoUrl: z.url('URL inválida').optional().nullable(),
});

export const listCompaniesSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, 'Página deve ser maior que 0')
    .optional()
    .default(1),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, 'Limite deve ser entre 1 e 100')
    .optional()
    .default(10),
});

export const companyIdSchema = z.object({
  id: z.uuid('ID inválido'),
});

export const selectActiveCompanySchema = companyIdSchema;

export const removeMemberParamsSchema = z.object({
  id: z.uuid('ID da empresa inválido'),
  userId: z.uuid('ID do usuário inválido'),
});

export const updateMemberRoleParamsSchema = z.object({
  id: z.uuid('ID da empresa inválido'),
  userId: z.uuid('ID do usuário inválido'),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(
    ROLE_VALUES.filter((role) => role !== 'OWNER') as ['ADMIN', 'MEMBER'],
    {
      message:
        'Role deve ser ADMIN ou MEMBER. OWNER não pode ser atribuído ou alterado.',
    },
  ),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type ListCompaniesInput = z.infer<typeof listCompaniesSchema>;
export type CompanyIdInput = z.infer<typeof companyIdSchema>;
export type SelectActiveCompanyInput = z.infer<
  typeof selectActiveCompanySchema
>;
export type UpdateMemberRoleParamsInput = z.infer<
  typeof updateMemberRoleParamsSchema
>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
