import { PartnershipStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export function getAcceptedPartnershipForUser(userId: string) {
  return prisma.partnership.findFirst({
    where: {
      status: PartnershipStatus.ACCEPTED,
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    select: {
      id: true,
    },
  });
}
