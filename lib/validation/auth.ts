import { z } from 'zod';

export const EmailPasswordSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(200)
});

export const SignupSchema = EmailPasswordSchema.extend({
  access_code: z.string().min(1).max(80),
  terms_accepted: z.literal(true)
});

export const ProviderLookupSchema = z.object({
  email: z.string().email().max(320)
});

export const PasswordResetSchema = z.object({
  email: z.string().email().max(320)
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof EmailPasswordSchema>;
