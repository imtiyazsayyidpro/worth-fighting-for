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
    <main className="flex h-dvh flex-col">
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
