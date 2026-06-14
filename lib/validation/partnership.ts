import { z } from "zod";

export const invitePartnerSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((email) => email.toLowerCase()),
});

export const respondToPartnershipSchema = z.object({
  partnershipId: z.string().min(1),
  action: z.enum(["accept", "decline"]),
});

export type InvitePartnerInput = z.infer<typeof invitePartnerSchema>;
export type RespondToPartnershipInput = z.infer<
  typeof respondToPartnershipSchema
>;
