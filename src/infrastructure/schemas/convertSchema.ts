import { z } from 'zod';

export const ConvertRequestSchema = z.object({
  value: z.string().min(1, 'El valor no puede estar vacío'),
});

export type ConvertRequestDTO = z.infer<typeof ConvertRequestSchema>;
