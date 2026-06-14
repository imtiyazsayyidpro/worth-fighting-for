"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type State = "idle" | "submitting" | "error";

export function AddMemoryForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fact = inputRef.current?.value.trim() ?? "";
    if (!fact) return;

    setState("submitting");
    setError(null);

    const response = await fetch("/api/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fact }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setState("error");
      setError(body?.error ?? "Could not add memory");
      return;
    }

    if (inputRef.current) inputRef.current.value = "";
    setState("idle");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-[26px] rounded-[18px] border border-border bg-card p-4 shadow-[0_16px_40px_-36px_var(--shadow)]"
    >
      <div className="flex items-end gap-2.5">
        <input
          ref={inputRef}
          name="fact"
          placeholder="Add a note about yourself…"
          disabled={state === "submitting"}
          className="flex-1 rounded-[12px] border border-line2 bg-field px-3.5 py-3 text-[14.5px] outline-none transition-shadow placeholder:text-faint focus:border-blush focus:shadow-[0_0_0_3px_var(--blush-soft)]"
          required
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="whitespace-nowrap rounded-[12px] bg-foreground px-5 py-3 text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {state === "submitting" ? "Adding…" : "Add"}
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-blushd">{error}</p> : null}
    </form>
  );
}
