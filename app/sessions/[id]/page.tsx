import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SessionRoom } from "@/components/session/session-room";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { getSessionForUser } from "@/lib/sessions/access";
import { getMessagesForSession } from "@/lib/sessions/messages";
import { getUserSlot } from "@/lib/sessions/turn";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const session = await getSessionForUser(id, user.id);

  if (!session) {
    redirect("/dashboard");
  }

  const currentUserSlot = getUserSlot(session.partnership, user.id);

  if (!currentUserSlot) {
    redirect("/dashboard");
  }

  const partner =
    currentUserSlot === "USER_A"
      ? await getUserDisplayName(session.partnership.userBId)
      : await getUserDisplayName(session.partnership.userAId);
  const messages = await getMessagesForSession(session.id);
  const partnerName = partner?.displayName ?? "your partner";

  return (
    <main className="flex h-dvh flex-col text-foreground">
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="size-5" aria-hidden />
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-primary-foreground shadow-romantic">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-semibold leading-tight">
                Your mediator
              </p>
              <p className="truncate text-sm text-muted-foreground">
                A conversation with {partnerName}
              </p>
            </div>
          </div>
        </div>
      </header>

      <SessionRoom
        currentUserId={user.id}
        currentUserSlot={currentUserSlot}
        initialCurrentSpeaker={session.currentSpeaker}
        initialCurrentPhase={session.currentPhase}
        initialStatus={session.status}
        initialMessages={messages}
        partnerName={partnerName}
        sessionId={session.id}
      />
    </main>
  );
}

function getUserDisplayName(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      displayName: true,
    },
  });
}
