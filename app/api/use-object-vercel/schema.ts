import { z } from 'zod';

export const listingSchema = z.object({
  listing:
    z.object({
      title: z.string().describe('title of listing'),
      description: z.string().describe('description of listing'),
      features: z.array(z.string()).describe('features of listing'),
    }),
});

