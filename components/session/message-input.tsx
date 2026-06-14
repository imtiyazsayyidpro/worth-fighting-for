"use client";

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
  /** Show the message in the transcript immediately, before the request resolves. */
  onOptimisticSend?: (text: string) => void;
  canSend: boolean;
  isPaused: boolean;
  placeholder: string;
};

export function MessageInput({
  sessionId,
  onMessageSent,
  onOptimisticSend,
  canSend,
  isPaused,
  placeholder,
}: MessageInputProps) {
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, 120)}px`;
  }, [content]);

  async function send() {
    const trimmedContent = content.trim();
    if (!canSend || isPaused || !trimmedContent || isSending) return;

    // Clear the box and show the message in the transcript right away.
    setContent("");
    setError(null);
    setIsSending(true);
    onOptimisticSend?.(trimmedContent);

    const response = await fetch(`/api/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: trimmedContent }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not send message");
      setContent(trimmedContent); // give the words back
      setIsSending(false);
      // resync the transcript so the un-sent message doesn't linger
      await onMessageSent();
      return;
    }

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
  const disabled = isPaused || !canSend;

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={cn(
          "flex items-end gap-2.5 rounded-[22px] border border-line2 bg-field py-2 pl-4 pr-2 transition-opacity",
          disabled && "opacity-70",
        )}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={content}
          disabled={isSending || disabled}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-[14.5px] leading-snug outline-none placeholder:text-faint"
        />
        <button
          type="submit"
          disabled={isSending || disabled || !hasContent}
          aria-label="Send message"
          className="grid size-[38px] flex-none place-items-center rounded-full bg-foreground text-[16px] text-background transition-all hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
        >
          ↑
        </button>
      </div>
      {error ? (
        <p className="mt-2 px-1 text-sm text-blushd">{error}</p>
      ) : null}
    </form>
  );
}
