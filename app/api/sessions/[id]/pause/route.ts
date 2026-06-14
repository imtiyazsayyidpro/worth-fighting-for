import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { getSessionForUser } from "@/lib/sessions/access";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const session = await getSessionForUser(id, user.id);

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === "COMPLETED") {
    return Response.json(
      { error: "Completed sessions cannot be paused or resumed" },
      { status: 400 },
    );
  }

  const newStatus = session.status === "ACTIVE" ? "PAUSED" : "ACTIVE";

  const updated = await prisma.session.update({
    where: { id: session.id },
    data: { status: newStatus },
    select: { status: true },
  });

  return Response.json({ status: updated.status });
}
