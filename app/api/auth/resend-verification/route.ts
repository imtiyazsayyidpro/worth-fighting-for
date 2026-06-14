import { getCurrentUser } from "@/lib/auth/current-user";
import { generateVerificationToken } from "@/lib/auth/verification-token";
import { sendMail } from "@/lib/email/mailer";
import { verificationEmail } from "@/lib/email/templates";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.emailVerified) {
    return Response.json({ message: "Email is already verified" });
  }

  const { token, expiresAt } = generateVerificationToken();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: token,
      emailVerificationExpiry: expiresAt,
    },
  });

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const verifyUrl = `${appUrl}/api/auth/verify?token=${token}`;
  const emailContent = verificationEmail({
    displayName: user.displayName,
    verifyUrl,
  });

  try {
    await sendMail({ to: user.email, ...emailContent });
  } catch (err) {
    console.error("Resend verification email failed", err);
    return Response.json(
      { error: "Could not send verification email. Please try again later." },
      { status: 500 },
    );
  }

  return Response.json({ message: "Verification email sent" });
}
