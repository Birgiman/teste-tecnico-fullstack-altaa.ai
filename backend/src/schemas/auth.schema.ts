/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .email('Email inválido')
    .transform((email) => email.toLowerCase().trim()),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres'),
});

export const loginSchema = z.object({
  email: z
    .email('Email inválido')
    .transform((email) => email.toLowerCase().trim()),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .max(100, 'Senha muito longa'),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;