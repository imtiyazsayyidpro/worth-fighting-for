"use client";

import { KeyboardEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Check, Pencil, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Memory = {
  id: string;
  fact: string;
  createdAt: string;
};

type MemoryItemProps = {
  memory: Memory;
};

function MemoryItem({ memory }: MemoryItemProps) {
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

  return (
    <li className="group flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 px-4 py-3 shadow-romantic backdrop-blur-sm transition-all">
      {editing ? (
        <div className="flex flex-1 flex-col gap-2">
          <Input
            ref={inputRef}
            defaultValue={memory.fact}
            onKeyDown={handleKeyDown}
            disabled={saving}
            className="h-9 rounded-lg"
          />
          {editError ? (
            <p className="text-xs text-destructive">{editError}</p>
          ) : null}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              className="gap-1"
              onClick={saveEdit}
              disabled={saving}
            >
              <Check className="size-3.5" aria-hidden />
              {saving ? "Saving…" : "Save"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1"
              onClick={cancelEdit}
              disabled={saving}
            >
              <X className="size-3.5" aria-hidden />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <span className="mt-0.5 text-sm leading-relaxed text-foreground/90 flex-1">
            {memory.fact}
          </span>
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Edit memory"
              onClick={startEdit}
            >
              <Pencil className="size-3.5" aria-hidden />
            </Button>
            <Button
              size="icon-sm"
              variant="destructive"
              aria-label="Delete memory"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          </div>
        </>
      )}
    </li>
  );
}

type MemoryListProps = {
  memories: Memory[];
};

export function MemoryList({ memories }: MemoryListProps) {
  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border/70 bg-card/60 px-6 py-14 text-center backdrop-blur-sm">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-secondary/25 text-primary">
          <Brain className="size-6" aria-hidden />
        </span>
        <p className="font-heading text-lg font-medium text-foreground">
          No memories yet
        </p>
        <p className="max-w-xs text-sm text-muted-foreground">
          The mediator will pick up on things you share in sessions, or you can
          add notes manually above.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {memories.map((memory) => (
        <MemoryItem key={memory.id} memory={memory} />
      ))}
    </ul>
  );
}
