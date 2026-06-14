import { getCurrentUser } from "@/lib/auth/current-user";
import { deleteMemory, updateMemory } from "@/lib/memory/queries";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const fact = typeof body?.fact === "string" ? body.fact.trim() : "";

  if (!fact) {
    return Response.json({ error: "fact is required" }, { status: 400 });
  }

  const memory = await updateMemory(id, user.id, fact);

  if (!memory) {
    return Response.json({ error: "Memory not found" }, { status: 404 });
  }

  return Response.json({ memory });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteMemory(id, user.id);

  if (!deleted) {
    return Response.json({ error: "Memory not found" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
