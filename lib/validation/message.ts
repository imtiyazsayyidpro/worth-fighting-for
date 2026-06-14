import { z } from "zod";

export const createMessageSchema = z.object({
  content: z.string().trim().min(1).max(4000),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
