import { Heart, Sparkles } from "lucide-react";

import type { SessionMessage } from "@/lib/sessions/messages";
import { cn, formatTime } from "@/lib/utils";

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
  if (messages.length === 0 && !mediatorThinking) {
    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-3xl bg-linear-to-br from-primary to-secondary text-primary-foreground shadow-romantic">
          <Heart className="size-7 fill-current" aria-hidden />
        </span>
        <div className="space-y-1.5">
          <p className="font-heading text-2xl font-semibold text-foreground">
            You&rsquo;re in a safe space
          </p>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            Take a breath. Share what&rsquo;s on your heart, and your mediator
            will help you and {partnerName} truly hear each other.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {messages.map((message) => {
        if (message.senderType === "MEDIATOR") {
          return (
            <article className="flex flex-col items-center gap-1.5" key={message.id}>
              <div className="max-w-[min(92%,46rem)] rounded-3xl border border-primary/15 bg-linear-to-br from-primary/10 to-secondary/15 px-5 py-4 text-sm leading-relaxed text-foreground shadow-romantic">
                <div className="mb-2 flex items-center justify-center gap-1.5 text-xs font-medium tracking-wide text-primary uppercase">
                  <Sparkles className="size-3.5" aria-hidden />
                  Mediator
                </div>
                <p className="whitespace-pre-wrap break-words text-center">
                  {message.content}
                </p>
              </div>
              <p className="text-xs text-muted-foreground/80">
                {formatTime(message.createdAt)}
              </p>
            </article>
          );
        }

        const isCurrentUser = message.senderId === currentUserId;

        return (
          <article
            className={cn(
              "flex flex-col gap-1",
              isCurrentUser ? "items-end" : "items-start",
            )}
            key={message.id}
          >
            <div
              className={cn(
                "max-w-[min(82%,42rem)] px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                isCurrentUser
                  ? "rounded-3xl rounded-br-md bg-primary text-primary-foreground"
                  : "rounded-3xl rounded-bl-md border border-border/60 bg-card text-foreground",
              )}
            >
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>
            <p className="px-1 text-xs text-muted-foreground/80">
              {isCurrentUser
                ? "You"
                : (message.senderDisplayName ?? partnerName)}{" "}
              · {formatTime(message.createdAt)}
            </p>
          </article>
        );
      })}

      {mediatorThinking ? (
        <div className="flex flex-col items-center gap-1.5" aria-live="polite">
          <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-4 py-2.5 shadow-sm">
            <Sparkles className="size-3.5 text-primary" aria-hidden />
            <span className="flex gap-1">
              <Dot />
              <Dot delay="150ms" />
              <Dot delay="300ms" />
            </span>
          </div>
          <p className="text-xs text-muted-foreground/80">
            Mediator is reflecting…
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="size-1.5 animate-bounce rounded-full bg-primary/70"
      style={{ animationDelay: delay, animationDuration: "1s" }}
    />
  );
}
