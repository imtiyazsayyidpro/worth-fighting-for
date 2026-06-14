import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    redirect("/dashboard?verify_error=1");
  }

  const user = await prisma.user.findFirst({
    where: { emailVerificationToken: token },
    select: {
      id: true,
      emailVerified: true,
      emailVerificationExpiry: true,
    },
  });

  if (!user || !user.emailVerificationExpiry || user.emailVerificationExpiry < new Date()) {
    redirect("/dashboard?verify_error=1");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    },
  });

  redirect("/dashboard?verified=1");
}
