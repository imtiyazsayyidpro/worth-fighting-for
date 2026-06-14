import { PartnershipStatus } from "@/lib/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { invitePartnerSchema } from "@/lib/validation/partnership";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.emailVerified) {
    return Response.json(
      {
        error:
          "Please verify your email before connecting with your partner.",
      },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = invitePartnerSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid invite input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const targetUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: {
      id: true,
      email: true,
      displayName: true,
    },
  });

  if (!targetUser) {
    return Response.json(
      { error: "No account found with that email" },
      { status: 404 },
    );
  }

  if (targetUser.id === user.id) {
    return Response.json({ error: "Cannot invite yourself" }, { status: 400 });
  }

  const existingPartnership = await prisma.partnership.findFirst({
    where: {
      status: {
        in: [PartnershipStatus.PENDING, PartnershipStatus.ACCEPTED],
      },
      OR: [
        { userAId: user.id },
        { userBId: user.id },
        { userAId: targetUser.id },
        { userBId: targetUser.id },
      ],
    },
    select: {
      id: true,
    },
  });

  if (existingPartnership) {
    return Response.json(
      { error: "Already connected or has a pending invite" },
      { status: 409 },
    );
  }

  const partnership = await prisma.partnership.create({
    data: {
      userAId: user.id,
      userBId: targetUser.id,
      status: PartnershipStatus.PENDING,
    },
    select: {
      id: true,
      status: true,
      userB: {
        select: {
          id: true,
          email: true,
          displayName: true,
        },
      },
    },
  });

  return Response.json(
    {
      partnership: {
        id: partnership.id,
        status: partnership.status,
        partner: partnership.userB,
      },
    },
    { status: 201 },
  );
}
