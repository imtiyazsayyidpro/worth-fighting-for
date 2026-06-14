import { getCurrentUser } from "@/lib/auth/current-user";
import { createMemory, getUserMemories } from "@/lib/memory/queries";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memories = await getUserMemories(user.id);

  return Response.json({ memories });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const fact = typeof body?.fact === "string" ? body.fact.trim() : "";

  if (!fact) {
    return Response.json({ error: "fact is required" }, { status: 400 });
  }

  const memory = await createMemory(user.id, fact);

  return Response.json({ memory }, { status: 201 });
}
