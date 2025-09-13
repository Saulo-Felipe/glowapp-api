import z from 'zod';

export const SignUpSchema = z
  .object({
    // name: z.string().min(1, 'Nome é obrigatório'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'Confirmar senha deve ter pelo menos 6 caracteres'),
    otp: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

export type SignUpDTO = z.infer<typeof SignUpSchema>;
