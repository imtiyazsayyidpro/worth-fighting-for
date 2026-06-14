import { Orb } from "@/components/layout/brand-mark";
import type { SessionMessage } from "@/lib/sessions/messages";

type MessageListProps = {
  messages: SessionMessage[];
  currentUserId: string;
  partnerName: string;
  mediatorThinking?: boolean;
};

export function MessageList({
  messages,
  currentUserId,
  partnerName,
  mediatorThinking = false,
}: MessageListProps) {
  // Welcome / first moment
  if (messages.length === 0) {
    return (
      <div className="animate-fade flex flex-1 flex-col items-center justify-center px-2.5 py-8 text-center">
        <Orb size={88} className="animate-drift mb-[30px]" />
        <h2 className="max-w-[360px] font-heading text-[28px] leading-[1.25]">
          You&rsquo;re both here. That already matters.
        </h2>
        <p className="mx-auto mt-3.5 max-w-[340px] text-[15.5px] leading-[1.7] text-muted-foreground">
          Take a slow breath. There&rsquo;s no rush and nothing to win here —
          only the two of you, finding your way back. When you&rsquo;re ready,
          share what&rsquo;s been sitting with you.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col justify-end gap-8">
      {messages.map((message) => {
        if (message.senderType === "MEDIATOR") {
          return (
            <div
              key={message.id}
              className="animate-rise mx-auto max-w-[520px] px-1.5 py-2 text-center"
            >
              <Orb size={24} className="mx-auto mb-3" />
              <div className="whitespace-pre-wrap font-heading text-[19px] leading-[1.5]">
                {message.content}
              </div>
            </div>
          );
        }

        const isCurrentUser = message.senderId === currentUserId;

        if (isCurrentUser) {
          return (
            <div
              key={message.id}
              className="animate-rise max-w-[78%] self-end"
            >
              <div className="mb-1.5 mr-1 text-right text-[10.5px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                You
              </div>
              <div className="whitespace-pre-wrap rounded-[18px_6px_18px_18px] bg-you-bub px-4 py-3 text-[14.5px] leading-snug text-you-ink">
                {message.content}
              </div>
            </div>
          );
        }

        return (
          <div key={message.id} className="animate-rise max-w-[78%] self-start">
            <div className="mb-1.5 ml-1 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
              {message.senderDisplayName ?? partnerName}
            </div>
            <div className="whitespace-pre-wrap rounded-[6px_18px_18px_18px] bg-part-bub px-4 py-3 text-[14.5px] leading-snug text-part-ink">
              {message.content}
            </div>
          </div>
        );
      })}

      {mediatorThinking ? (
        <div className="animate-fade py-1.5 text-center" aria-live="polite">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-panel2 px-[18px] py-2.5">
            <span className="inline-flex gap-1">
              <Dot />
              <Dot delay="0.2s" />
              <Dot delay="0.4s" />
            </span>
            <span className="text-[13px] italic text-muted-foreground">
              The mediator is reflecting…
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="size-1.5 rounded-full bg-blush"
      style={{
        animation: "wf-typing 1.3s ease-in-out infinite",
        animationDelay: delay,
      }}
    />
  );
}
