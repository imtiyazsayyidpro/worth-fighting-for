"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        ref={inputRef}
        name="fact"
        placeholder="Add a note about yourself…"
        className="h-10 flex-1 rounded-xl px-4"
        disabled={state === "submitting"}
        required
      />
      <Button
        type="submit"
        size="lg"
        className="h-10 gap-1.5 rounded-xl px-4"
        disabled={state === "submitting"}
      >
        <PlusCircle className="size-4" aria-hidden />
        {state === "submitting" ? "Adding…" : "Add"}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
