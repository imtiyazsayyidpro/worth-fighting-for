import { prisma } from "@/lib/prisma";

import { getAuthSession } from "./session";

export async function getCurrentUser() {
  const session = await getAuthSession();

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      emailVerified: true,
    },
  });
}
