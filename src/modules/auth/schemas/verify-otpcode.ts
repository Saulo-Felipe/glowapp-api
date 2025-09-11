import z from 'zod';

export const VerifyOtpCodeSchema = z.object({
  email: z.string().email(),
  otp: z.string(),
});

export type VerifyOtpCodeDTO = z.infer<typeof VerifyOtpCodeSchema>;
