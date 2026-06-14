"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DisclaimerBanner } from "@/components/layout/disclaimer-banner";
import { MessageInput } from "@/components/session/message-input";
import { MessageList } from "@/components/session/message-list";
import { PauseButton } from "@/components/session/pause-button";
import { PhaseIndicator } from "@/components/session/phase-indicator";
import { TurnIndicator } from "@/components/session/turn-indicator";
import type { SessionStatus, Speaker } from "@/lib/generated/prisma/enums";
import type { SessionMessage } from "@/lib/sessions/messages";
import { isUsersTurn, type UserSlot } from "@/lib/sessions/turn";

type SessionRoomProps = {
  sessionId: string;
  currentUserId: string;
  currentUserSlot: UserSlot;
  partnerName: string;
  initialMessages: SessionMessage[];
  initialCurrentSpeaker: Speaker;
  initialCurrentPhase: string | null;
  initialStatus: SessionStatus;
};

export function SessionRoom({
  sessionId,
  currentUserId,
  currentUserSlot,
  partnerName,
  initialMessages,
  initialCurrentSpeaker,
  initialCurrentPhase,
  initialStatus,
}: SessionRoomProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [currentSpeaker, setCurrentSpeaker] = useState(initialCurrentSpeaker);
  const [currentPhase, setCurrentPhase] = useState(initialCurrentPhase);
  const [sessionStatus, setSessionStatus] = useState(initialStatus);

  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshMessages = useCallback(async () => {
    const response = await fetch(`/api/sessions/${sessionId}/messages`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    const body = await response.json();
    setMessages(body.messages ?? []);
    setCurrentSpeaker(body.currentSpeaker ?? initialCurrentSpeaker);
    setCurrentPhase(body.currentPhase ?? null);
    if (body.status) setSessionStatus(body.status);
  }, [initialCurrentSpeaker, sessionId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void refreshMessages();
    }, 2000);

    return () => window.clearInterval(interval);
  }, [refreshMessages]);

  // Keep the conversation pinned to the latest message.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, currentSpeaker]);

  const isPaused = sessionStatus === "PAUSED";
  const canSend = isUsersTurn(currentSpeaker, currentUserSlot);

  function handlePauseToggle(nowPaused: boolean) {
    setSessionStatus(nowPaused ? "PAUSED" : "ACTIVE");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
          <MessageList
            currentUserId={currentUserId}
            messages={messages}
            mediatorThinking={currentSpeaker === "MEDIATOR" && !isPaused}
            partnerName={partnerName}
          />
        </div>
      </div>

      <div className="border-t border-border/50 bg-card/60 backdrop-blur-md">
        <div className="mx-auto w-full max-w-3xl px-4 py-3 sm:px-6">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <TurnIndicator
              currentSpeaker={isPaused ? null : currentSpeaker}
              currentUserSlot={currentUserSlot}
              partnerName={partnerName}
              isPaused={isPaused}
            />
            <div className="flex items-center gap-2">
              <PhaseIndicator currentPhase={currentPhase} />
              <PauseButton
                sessionId={sessionId}
                isPaused={isPaused}
                onToggle={handlePauseToggle}
              />
            </div>
          </div>
          <MessageInput
            canSend={canSend}
            isPaused={isPaused}
            onMessageSent={refreshMessages}
            partnerName={partnerName}
            sessionId={sessionId}
          />
          <DisclaimerBanner className="mt-3 px-1" />
        </div>
      </div>
    </div>
  );
}
