import { z } from 'zod';

export const SendOtpCodeSchema = z.object({
  email: z.email(),
});

export type SendOtpCodeDTO = z.infer<typeof SendOtpCodeSchema>;
