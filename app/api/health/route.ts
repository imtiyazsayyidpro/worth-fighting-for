import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({ status: "ok" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database health check failed";

    return Response.json({ error: message }, { status: 500 });
  }
}
