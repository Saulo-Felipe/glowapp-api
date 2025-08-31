import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type SignInDto = z.infer<typeof SignInSchema>;
