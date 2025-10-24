import { z } from 'zod';

export const ConvertRequestSchema = z.object({
  input: z.string().min(1, 'Input cannot be empty'),
  direction: z.enum(['toRoman', 'toNumeric', 'auto']).optional().default('auto'),
});

export type ConvertRequestDTO = z.infer<typeof ConvertRequestSchema>;
