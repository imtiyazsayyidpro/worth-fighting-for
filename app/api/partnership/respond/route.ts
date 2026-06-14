import { PartnershipStatus } from "@/lib/generated/prisma/enums";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { respondToPartnershipSchema } from "@/lib/validation/partnership";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = respondToPartnershipSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid response input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const partnership = await prisma.partnership.findFirst({
    where: {
      id: parsed.data.partnershipId,
      userBId: user.id,
      status: PartnershipStatus.PENDING,
    },
    select: {
      id: true,
    },
  });

  if (!partnership) {
    return Response.json({ error: "Invite not found" }, { status: 404 });
  }

  if (parsed.data.action === "decline") {
    await prisma.partnership.delete({
      where: { id: partnership.id },
    });

    return Response.json({ status: "declined" });
  }

  await prisma.partnership.update({
    where: { id: partnership.id },
    data: { status: PartnershipStatus.ACCEPTED },
  });

  return Response.json({ status: "accepted" });
}
