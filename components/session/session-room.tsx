"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Orb } from "@/components/layout/brand-mark";
import { MessageInput } from "@/components/session/message-input";
import { MessageList } from "@/components/session/message-list";
import { getPhase, PHASES } from "@/lib/ai/phases";
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
  const [pauseLoading, setPauseLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number | null>(null);

  const refreshMessages = useCallback(async () => {
    const response = await fetch(`/api/sessions/${sessionId}/messages`, {
      cache: "no-store",
    });
    if (!response.ok) return;

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

  // Scroll to the bottom only when arriving at the session (first render) or
  // when a new message actually appears — not on every poll refresh, which
  // would yank the view down and stop the reader mid-sentence.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const count = messages.length;
    const prevCount = prevMessageCountRef.current;
    prevMessageCountRef.current = count;

    if (prevCount === null) {
      // Returning to / opening the session: jump straight to the latest.
      node.scrollTo({ top: node.scrollHeight });
      return;
    }

    if (count > prevCount) {
      // A genuinely new message landed: ease down to it.
      node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  // Show the just-sent message immediately, then let the mediator reflect.
  const addOptimistic = useCallback(
    (text: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          sessionId,
          senderType: "USER",
          senderId: currentUserId,
          senderDisplayName: "You",
          content: text,
          phase: null,
          createdAt: new Date().toISOString(),
        },
      ]);
      setCurrentSpeaker("MEDIATOR");
    },
    [sessionId, currentUserId],
  );

  const isPaused = sessionStatus === "PAUSED";
  const isWelcome = messages.length === 0;
  const mediatorThinking = currentSpeaker === "MEDIATOR" && !isPaused;
  const canSend = !isPaused && isUsersTurn(currentSpeaker, currentUserSlot);

  // Phase progress
  const phase = currentPhase ? getPhase(currentPhase) : PHASES[0];
  const phaseIdx = PHASES.findIndex((p) => p.key === phase.key) + 1;
  const phasePct = `${(phaseIdx / PHASES.length) * 100}%`;

  // Turn display (label / dot / placeholder)
  const turn = (() => {
    if (isPaused)
      return {
        label: "Session paused",
        dot: "var(--muted)",
        ph: "Paused — resume when you are both ready.",
      };
    if (isWelcome)
      return {
        label: "Take a breath. There's no rush.",
        dot: "var(--muted)",
        ph: "Whenever you're ready, share what's on your heart…",
      };
    if (currentSpeaker === "MEDIATOR")
      return {
        label: "The mediator is reflecting",
        dot: "var(--blush)",
        ph: "A moment of quiet while it gathers a thought…",
      };
    if (currentSpeaker === "BOTH")
      return {
        label: "The floor is open to either of you",
        dot: "var(--blush)",
        ph: "Either of you can speak now…",
      };
    if (currentSpeaker === currentUserSlot)
      return {
        label: "Your turn",
        dot: "var(--blush)",
        ph: "Take your time. Say it gently…",
      };
    return {
      label: `Waiting for ${partnerName}`,
      dot: "var(--sage)",
      ph: `It's ${partnerName}'s turn — take a breath and listen.`,
    };
  })();

  async function handlePauseToggle() {
    setPauseLoading(true);
    const response = await fetch(`/api/sessions/${sessionId}/pause`, {
      method: "POST",
    });
    setPauseLoading(false);
    if (response.ok) {
      const body = await response.json();
      setSessionStatus(body.status === "PAUSED" ? "PAUSED" : "ACTIVE");
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
      {/* header */}
      <div className="z-10 flex-none border-b border-border bg-background">
        <div className="flex items-center gap-3 px-[18px] py-3.5">
          <Link
            href="/dashboard"
            className="grid size-9 flex-none place-items-center rounded-full border border-line2 text-[17px] transition-colors hover:bg-panel2"
            aria-label="Back to dashboard"
          >
            ‹
          </Link>
          <div className="flex flex-1 items-center justify-center gap-2.5">
            <Orb size={30} className="flex-none" />
            <div className="leading-tight">
              <div className="text-[13.5px] font-bold">
                A conversation with {partnerName}
              </div>
              <div className="text-[11.5px] text-muted-foreground">
                Your mediator is here, guiding gently
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePauseToggle}
            disabled={pauseLoading}
            className="flex-none whitespace-nowrap rounded-full border border-line2 px-[15px] py-2 text-[12.5px] font-semibold transition-colors hover:bg-panel2 disabled:opacity-60"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>

        {/* phase indicator */}
        <div className="mx-auto w-full max-w-[720px] px-[22px] pb-3">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-blush">
              {phase.label}
            </span>
            <span className="text-[10px] tracking-wide text-faint">
              Phase {phaseIdx} of {PHASES.length}
            </span>
          </div>
          <div className="h-[3px] overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full transition-[width] duration-700"
              style={{
                width: phasePct,
                background: "linear-gradient(90deg, var(--sage), var(--blush))",
              }}
            />
          </div>
        </div>
      </div>

      {/* transcript */}
      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-auto">
        <div className="mx-auto flex min-h-full w-full max-w-[720px] flex-col px-[22px] pb-9 pt-6">
          <MessageList
            currentUserId={currentUserId}
            messages={messages}
            mediatorThinking={mediatorThinking}
            partnerName={partnerName}
          />
        </div>
      </div>

      {/* composer */}
      <div className="flex-none border-t border-border bg-background">
        <div className="mx-auto w-full max-w-[720px] px-5 pb-[18px] pt-3.5">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span
              className="size-[7px] rounded-full"
              style={{
                background: turn.dot,
                boxShadow: "0 0 0 4px var(--blush-soft)",
              }}
            />
            <span className="text-[13px] font-semibold">{turn.label}</span>
          </div>
          <MessageInput
            canSend={canSend}
            isPaused={isPaused}
            placeholder={turn.ph}
            onMessageSent={refreshMessages}
            onOptimisticSend={addOptimistic}
            sessionId={sessionId}
          />
          <p className="mx-auto mt-3 max-w-[380px] text-center text-[11px] leading-snug text-faint">
            A supportive space, not a substitute for professional care. If either
            of you is in crisis, please reach out to a professional.
          </p>
        </div>
      </div>
    </div>
  );
}
