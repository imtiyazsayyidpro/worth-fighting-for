import Link from "next/link";
import { ArrowLeft, Brain } from "lucide-react";
import { redirect } from "next/navigation";

import { AddMemoryForm } from "@/components/memory/add-memory-form";
import { MemoryList } from "@/components/memory/memory-list";
import { BrandMark } from "@/components/layout/brand-mark";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getUserMemories } from "@/lib/memory/queries";

export default async function MemoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const memories = await getUserMemories(user.id);

  return (
    <main className="min-h-screen px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="font-heading text-lg font-semibold leading-tight">
                Worth Fighting For
              </p>
              <p className="text-sm text-muted-foreground">
                {user.displayName}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Dashboard
          </Link>
        </header>

        <section className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-secondary/30 text-primary">
              <Brain className="size-5" aria-hidden />
            </span>
            <h1 className="font-heading text-4xl font-semibold tracking-tight">
              Your Memory
            </h1>
          </div>
          <p className="text-base text-muted-foreground">
            Facts the mediator keeps in mind about you across sessions. These are
            private — your partner cannot see them.
          </p>
        </section>

        <section className="space-y-4">
          <AddMemoryForm />
          <MemoryList
            memories={memories.map((m) => ({
              id: m.id,
              fact: m.fact,
              createdAt: m.createdAt.toISOString(),
            }))}
          />
        </section>
      </div>
    </main>
  );
}
