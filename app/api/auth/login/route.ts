import { verifyPassword } from "@/lib/auth/password";
import { setAuthCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid login input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        displayName: true,
        emailVerified: true,
      },
    });

    if (
      !user ||
      !(await verifyPassword(parsed.data.password, user.passwordHash))
    ) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    await setAuthCookie({ userId: user.id, email: user.email });

    return Response.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Login failed", error);

    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
