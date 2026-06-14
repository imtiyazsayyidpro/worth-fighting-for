import { Prisma } from "@/lib/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";
import { setAuthCookie } from "@/lib/auth/session";
import { generateVerificationToken } from "@/lib/auth/verification-token";
import { sendMail } from "@/lib/email/mailer";
import { verificationEmail } from "@/lib/email/templates";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid registration input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const { token, expiresAt } = generateVerificationToken();

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        passwordHash,
        displayName: parsed.data.displayName,
        emailVerified: false,
        emailVerificationToken: token,
        emailVerificationExpiry: expiresAt,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        emailVerified: true,
      },
    });

    await setAuthCookie({ userId: user.id, email: user.email });

    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    const verifyUrl = `${appUrl}/api/auth/verify?token=${token}`;
    const emailContent = verificationEmail({
      displayName: user.displayName,
      verifyUrl,
    });

    // Fire and forget — don't block registration if email fails
    sendMail({ to: user.email, ...emailContent }).catch((err) => {
      console.error("Verification email failed to send", err);
    });

    return Response.json({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    console.error("Registration failed", error);

    return Response.json({ error: "Registration failed" }, { status: 500 });
  }
}
