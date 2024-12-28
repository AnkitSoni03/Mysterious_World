import { z } from 'zod';

export const messageSchema = z.object({
    content: z
        .string()
        .min(1, 'Message must be at least 1 character long')
        .max(500, 'Message must be at most 500 characters long')
})