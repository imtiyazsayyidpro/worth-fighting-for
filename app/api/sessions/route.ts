import { SessionStatus, Speaker } from "@/lib/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { getAcceptedPartnershipForUser } from "@/lib/sessions/partnership";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnership = await getAcceptedPartnershipForUser(user.id);

  if (!partnership) {
    return Response.json({ sessions: [] });
  }

  const sessions = await prisma.session.findMany({
    where: {
      partnershipId: partnership.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      status: true,
      currentSpeaker: true,
      currentPhase: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json({ sessions });
}

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnership = await getAcceptedPartnershipForUser(user.id);

  if (!partnership) {
    return Response.json(
      { error: "Connect with your partner before starting a session" },
      { status: 400 },
    );
  }

  const session = await prisma.session.create({
    data: {
      partnershipId: partnership.id,
      status: SessionStatus.ACTIVE,
      currentSpeaker: Speaker.USER_A,
      currentPhase: "CHECK_IN",
    },
    select: {
      id: true,
      status: true,
      currentSpeaker: true,
      currentPhase: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json({ session }, { status: 201 });
}
