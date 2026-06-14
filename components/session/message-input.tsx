"use client";

import { ArrowUp } from "lucide-react";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type MessageInputProps = {
  sessionId: string;
  onMessageSent: () => Promise<void> | void;
  canSend: boolean;
  isPaused: boolean;
  partnerName: string;
};

export function MessageInput({
  sessionId,
  onMessageSent,
  canSend,
  isPaused,
  partnerName,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grow the textarea with its content, up to a sensible cap.
  useEffect(() => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 200)}px`;
  }, [content]);

  async function send() {
    const trimmedContent = content.trim();

    if (!canSend || isPaused || !trimmedContent || isSending) {
      return;
    }

    setIsSending(true);
    setError(null);

    const response = await fetch(`/api/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: trimmedContent }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not send message");
      setIsSending(false);
      return;
    }

    setContent("");
    await onMessageSent();
    setIsSending(false);
    textareaRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  }

  const hasContent = content.trim().length > 0;
  const effectivelyDisabled = isPaused || !canSend;

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={cn(
          "flex items-end gap-2 rounded-3xl border bg-card p-2 shadow-romantic transition-colors",
          !effectivelyDisabled
            ? "border-border/70 focus-within:border-primary/50"
            : "border-border/50 opacity-70",
        )}
      >
        <textarea
          ref={textareaRef}
          className="max-h-50 min-h-9 flex-1 resize-none bg-transparent px-3 py-1.5 text-base leading-relaxed outline-none placeholder:text-muted-foreground md:text-sm"
          disabled={isSending || effectivelyDisabled}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isPaused
              ? "Session paused — click Resume to continue"
              : canSend
                ? "Share what's on your mind…"
                : `Waiting for ${partnerName}…`
          }
          rows={1}
          value={content}
        />

        <button
          type="submit"
          disabled={isSending || effectivelyDisabled || !hasContent}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/85 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Send message"
        >
          <ArrowUp className={cn("size-5", isSending && "animate-pulse")} aria-hidden />
        </button>
      </div>

      {error ? (
        <p className="mt-2 px-1 text-sm text-destructive">{error}</p>
      ) : null}
    </form>
  );
}
