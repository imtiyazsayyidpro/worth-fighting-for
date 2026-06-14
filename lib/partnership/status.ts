import { PartnershipStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

type Partner = {
  id: string;
  email: string;
  displayName: string;
};

export type CurrentPartnershipStatus =
  | { status: "none" }
  | { status: "pending_sent"; partner: Partner }
  | { status: "pending_received"; partnershipId: string; partner: Partner }
  | { status: "connected"; partner: Partner };

export async function getCurrentPartnershipStatus(
  userId: string,
): Promise<CurrentPartnershipStatus> {
  const partnership = await prisma.partnership.findFirst({
    where: {
      OR: [{ userAId: userId }, { userBId: userId }],
    },
    include: {
      userA: {
        select: {
          id: true,
          email: true,
          displayName: true,
        },
      },
      userB: {
        select: {
          id: true,
          email: true,
          displayName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!partnership) {
    return { status: "none" };
  }

  const partner = partnership.userAId === userId ? partnership.userB : partnership.userA;

  if (partnership.status === PartnershipStatus.ACCEPTED) {
    return { status: "connected", partner };
  }

  if (partnership.userAId === userId) {
    return { status: "pending_sent", partner };
  }

  return {
    status: "pending_received",
    partnershipId: partnership.id,
    partner,
  };
}
