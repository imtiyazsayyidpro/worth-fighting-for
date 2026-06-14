import { prisma } from "@/lib/prisma";

export function getSessionForUser(sessionId: string, userId: string) {
  return prisma.session.findFirst({
    where: {
      id: sessionId,
      partnership: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
    },
    include: {
      partnership: {
        include: {
          userA: {
            select: {
              displayName: true,
            },
          },
          userB: {
            select: {
              displayName: true,
            },
          },
        },
      },
    },
  });
}
