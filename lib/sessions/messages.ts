import { prisma } from "@/lib/prisma";

export type SessionMessage = {
  id: string;
  sessionId: string;
  senderType: string;
  senderId: string | null;
  senderDisplayName: string | null;
  content: string;
  phase: string | null;
  createdAt: string;
};

export async function getMessagesForSession(
  sessionId: string,
): Promise<SessionMessage[]> {
  const messages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: {
          displayName: true,
        },
      },
    },
  });

  return messages.map((message) => ({
    id: message.id,
    sessionId: message.sessionId,
    senderType: message.senderType,
    senderId: message.senderId,
    senderDisplayName: message.sender?.displayName ?? null,
    content: message.content,
    phase: message.phase,
    createdAt: message.createdAt.toISOString(),
  }));
}
