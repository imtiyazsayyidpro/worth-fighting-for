"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Orb } from "@/components/layout/brand-mark";

export type Memory = {
  id: string;
  fact: string;
  createdAt: string;
};

function MemoryItem({ memory }: { memory: Memory }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setEditing(true);
    setEditError(null);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }

  function cancelEdit() {
    setEditing(false);
    setEditError(null);
    if (inputRef.current) inputRef.current.value = memory.fact;
  }

  async function saveEdit() {
    const fact = inputRef.current?.value.trim() ?? "";
    if (!fact || fact === memory.fact) {
      cancelEdit();
      return;
    }

    setSaving(true);
    setEditError(null);

    const response = await fetch(`/api/memory/${memory.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fact }),
    });

    setSaving(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setEditError(body?.error ?? "Could not save");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/memory/${memory.id}`, { method: "DELETE" });
    router.refresh();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") saveEdit();
    if (event.key === "Escape") cancelEdit();
  }

  if (editing) {
    return (
      <div className="rounded-[15px] border border-blush bg-card px-4 py-3.5 shadow-[0_0_0_3px_var(--blush-soft)]">
        <input
          ref={inputRef}
          defaultValue={memory.fact}
          onKeyDown={handleKeyDown}
          disabled={saving}
          className="mb-3 w-full rounded-[10px] border border-line2 bg-field px-3 py-2.5 text-[14.5px] outline-none focus:border-blush"
        />
        {editError ? (
          <p className="mb-2 text-xs text-blushd">{editError}</p>
        ) : null}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelEdit}
            disabled={saving}
            className="rounded-full border border-line2 px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-panel2 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveEdit}
            disabled={saving}
            className="rounded-full bg-foreground px-[18px] py-2 text-[13px] font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-start gap-3 rounded-[15px] border border-border bg-card px-4 py-[15px] transition-colors hover:border-line2">
      <span className="mt-[7px] size-[7px] flex-none rounded-full bg-blush" />
      <p className="flex-1 text-[14.5px] leading-snug">{memory.fact}</p>
      <div className="flex flex-none gap-1">
        <button
          type="button"
          onClick={startEdit}
          aria-label="Edit memory"
          className="grid size-[30px] place-items-center rounded-lg text-[13px] text-muted-foreground transition-colors hover:bg-panel2 hover:text-foreground"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Delete memory"
          className="grid size-[30px] place-items-center rounded-lg text-[15px] text-muted-foreground transition-colors hover:bg-blush-soft hover:text-blushd disabled:opacity-50"
        >
          ×
        </button>
      </div>
    </div>
  );
}

type MemoryListProps = {
  memories: Memory[];
  partnerName: string;
};

export function MemoryList({ memories, partnerName }: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="rounded-[18px] border border-dashed border-line2 bg-card px-7 py-11 text-center">
        <Orb size={58} className="mx-auto mb-[18px]" />
        <h2 className="font-heading text-[22px]">
          Nothing here yet — and that&rsquo;s okay.
        </h2>
        <p className="mx-auto mt-2.5 max-w-[360px] text-[14.5px] leading-relaxed text-muted-foreground">
          As you and {partnerName} talk, your mediator will gently remember what
          matters to you. You can also add a note about yourself above, anytime —
          what helps you feel heard, what&rsquo;s hard, what you&rsquo;re working
          on.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 px-0.5">
        <h2 className="font-heading text-[17px]">
          What the mediator remembers
        </h2>
        <span className="text-xs text-faint">· {memories.length}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {memories.map((memory) => (
          <MemoryItem key={memory.id} memory={memory} />
        ))}
      </div>
      <p className="mt-5 px-0.5 text-[12.5px] leading-relaxed text-faint">
        Your mediator will also quietly add to this as the two of you talk — you
        can edit or remove anything, anytime.
      </p>
    </div>
  );
}
