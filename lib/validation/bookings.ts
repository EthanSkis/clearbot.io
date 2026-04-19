import { z } from 'zod';

export const BookingCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  company: z.string().max(200).optional().nullable(),
  focus: z.enum(['brand', 'web', 'ads', 'content', 'video', 'other']).optional().nullable(),
  preferred_slot: z.string().datetime().optional().nullable(),
  preferred_slot_label: z.string().max(120).optional().nullable(),
  timezone: z.string().max(80).optional().nullable(),
  notes: z.string().max(4000).optional().nullable(),
  source: z.string().max(120).optional().nullable()
});

export const BookingPatchSchema = z.object({
  status: z.enum(['new', 'contacted', 'scheduled', 'dropped'])
});

export type BookingCreate = z.infer<typeof BookingCreateSchema>;
export type BookingPatch = z.infer<typeof BookingPatchSchema>;
