import { getCurrentUser } from "@/lib/auth/current-user";
import { getCurrentPartnershipStatus } from "@/lib/partnership/status";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const partnership = await getCurrentPartnershipStatus(user.id);

  return Response.json(partnership);
}
