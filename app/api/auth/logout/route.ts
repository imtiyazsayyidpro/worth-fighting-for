import { clearAuthCookie } from "@/lib/auth/session";

export async function POST() {
  await clearAuthCookie();

  return Response.json({ status: "ok" });
}
