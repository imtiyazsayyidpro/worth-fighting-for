import { SenderType, type Speaker } from "@/lib/generated/prisma/enums";
import { getMediatorReply } from "@/lib/ai/mediator";
import { extractNewMemories } from "@/lib/ai/memory-extractor";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";
import { getSessionForUser } from "@/lib/sessions/access";
import { getMessagesForSession } from "@/lib/sessions/messages";
import { createMemory, getUserMemories } from "@/lib/memory/queries";
import { getNextUserSlot, getUserSlot, isUsersTurn } from "@/lib/sessions/turn";
import { createMessageSchema } from "@/lib/validation/message";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const session = await getSessionForUser(id, user.id);

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  const messages = await getMessagesForSession(session.id);

  return Response.json({
    status: session.status,
    currentSpeaker: session.currentSpeaker,
    currentPhase: session.currentPhase,
    messages,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const session = await getSessionForUser(id, user.id);

  if (!session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === "PAUSED") {
    return Response.json({ error: "Session is paused" }, { status: 403 });
  }

  const userSlot = getUserSlot(session.partnership, user.id);

  if (!userSlot || !isUsersTurn(session.currentSpeaker, userSlot)) {
    return Response.json({ error: "Not your turn" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createMessageSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid message input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const fallbackNextSpeaker = getNextUserSlot(userSlot);

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: {
        sessionId: session.id,
        senderType: SenderType.USER,
        senderId: user.id,
        content: parsed.data.content,
      },
      include: {
        sender: {
          select: {
            displayName: true,
          },
        },
      },
    }),
    prisma.session.update({
      where: { id: session.id },
      data: { currentSpeaker: "MEDIATOR" },
    }),
  ]);

  let mediatorMessage:
    | {
        id: string;
        sessionId: string;
        senderType: string;
        senderId: string | null;
        senderDisplayName: string | null;
        content: string;
        phase: string | null;
        createdAt: string;
    }
    | null = null;
  let warning: string | undefined;
  let finalSpeaker: Speaker = fallbackNextSpeaker;
  let finalPhase: string | null = session.currentPhase;

  try {
    const [history, userAMemories, userBMemories] = await Promise.all([
      getMessagesForSession(session.id),
      getUserMemories(session.partnership.userAId),
      getUserMemories(session.partnership.userBId),
    ]);
    const mediatorReply = await getMediatorReply(history, userSlot, {
      userADisplayName: session.partnership.userA.displayName,
      userBDisplayName: session.partnership.userB.displayName,
      lastSpeakerDisplayName: user.displayName,
      currentPhase: session.currentPhase,
      userAMemories: userAMemories.map((m) => m.fact),
      userBMemories: userBMemories.map((m) => m.fact),
    });

    const [createdMediatorMessage] = await prisma.$transaction([
      prisma.message.create({
        data: {
          sessionId: session.id,
          senderType: SenderType.MEDIATOR,
          senderId: null,
          content: mediatorReply.reply,
        },
      }),
      prisma.session.update({
        where: { id: session.id },
        data: {
          currentSpeaker: mediatorReply.nextSpeaker,
          currentPhase: mediatorReply.nextPhase,
        },
      }),
    ]);

    mediatorMessage = {
      id: createdMediatorMessage.id,
      sessionId: createdMediatorMessage.sessionId,
      senderType: createdMediatorMessage.senderType,
      senderId: createdMediatorMessage.senderId,
      senderDisplayName: null,
      content: createdMediatorMessage.content,
      phase: createdMediatorMessage.phase,
      createdAt: createdMediatorMessage.createdAt.toISOString(),
    };
    finalSpeaker = mediatorReply.nextSpeaker;
    finalPhase = mediatorReply.nextPhase;

    try {
      const existingMemories = await getUserMemories(user.id);
      const recentMessages = history.slice(-10);
      const newFacts = await extractNewMemories({
        displayName: user.displayName,
        existingFacts: existingMemories.map((m) => m.fact),
        recentMessages,
      });
      await Promise.all(newFacts.map((fact) => createMemory(user.id, fact)));
    } catch (memoryError) {
      console.error("Memory extraction failed (non-critical)", memoryError);
    }
  } catch (error) {
    console.error("Mediator response failed", error);
    warning = "Mediator response failed";

    await prisma.session.update({
      where: { id: session.id },
      data: { currentSpeaker: fallbackNextSpeaker },
    });
  }

  return Response.json(
    {
      status: session.status,
      currentSpeaker: finalSpeaker,
      currentPhase: finalPhase,
      message: {
        id: message.id,
        sessionId: message.sessionId,
        senderType: message.senderType,
        senderId: message.senderId,
        senderDisplayName: message.sender?.displayName ?? null,
        content: message.content,
        phase: message.phase,
        createdAt: message.createdAt.toISOString(),
      },
      mediatorMessage,
      warning,
    },
    { status: warning ? 200 : 201 },
  );
}
