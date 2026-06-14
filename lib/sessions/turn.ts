import type { Speaker } from "@/lib/generated/prisma/enums";

type PartnershipUsers = {
  userAId: string;
  userBId: string;
};

export type UserSlot = "USER_A" | "USER_B";

export function getUserSlot(
  partnership: PartnershipUsers,
  userId: string,
): UserSlot | null {
  if (partnership.userAId === userId) {
    return "USER_A";
  }

  if (partnership.userBId === userId) {
    return "USER_B";
  }

  return null;
}

export function isUsersTurn(currentSpeaker: Speaker, slot: UserSlot) {
  return currentSpeaker === slot || currentSpeaker === "BOTH";
}

export function getNextUserSlot(slot: UserSlot): UserSlot {
  return slot === "USER_A" ? "USER_B" : "USER_A";
}
