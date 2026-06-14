import Link from "next/link";
import { redirect } from "next/navigation";

import { AddMemoryForm } from "@/components/memory/add-memory-form";
import { MemoryList } from "@/components/memory/memory-list";
import { BrandMark, Wordmark } from "@/components/layout/brand-mark";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getCurrentPartnershipStatus } from "@/lib/partnership/status";
import { getUserMemories } from "@/lib/memory/queries";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function MemoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const [memories, partnership] = await Promise.all([
    getUserMemories(user.id),
    getCurrentPartnershipStatus(user.id),
  ]);
  const partnerName =
    "partner" in partnership && partnership.partner
      ? partnership.partner.displayName
      : "your partner";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-5 py-4 sm:px-10">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <BrandMark size={24} />
          <Wordmark size={14} className="hidden sm:inline" />
        </Link>
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-blushd"
          >
            <span className="text-base">‹</span> Dashboard
          </Link>
          <span className="hidden size-[30px] place-items-center rounded-full bg-blush-soft text-[13px] font-bold text-blushd sm:grid">
            {initials(user.displayName)}
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[600px] px-[22px] pb-11 pt-[30px]">
        {/* intro */}
        <div className="mb-[22px]">
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full bg-sage-soft px-3 py-1.5">
            <span className="size-[13px] rounded-[3px_3px_4px_4px] border-[1.5px] border-sage" />
            <span className="text-[11.5px] font-bold tracking-wide text-sage">
              Private to you
            </span>
          </div>
          <h1 className="font-heading text-[32px] leading-[1.12]">
            Your memory
          </h1>
          <p className="mt-2.5 max-w-[460px] text-[15.5px] leading-relaxed text-muted-foreground">
            These are the things your mediator gently keeps in mind about you,
            from one session to the next — so you don&rsquo;t have to start over
            each time.{" "}
            <strong className="font-semibold text-foreground">
              Only you can see them. {partnerName} never will.
            </strong>
          </p>
        </div>

        <AddMemoryForm />

        <MemoryList
          partnerName={partnerName}
          memories={memories.map((m) => ({
            id: m.id,
            fact: m.fact,
            createdAt: m.createdAt.toISOString(),
          }))}
        />

        <p className="mx-auto mt-7 max-w-[420px] text-center text-[11.5px] leading-relaxed text-faint">
          A supportive space, not a substitute for professional care.
        </p>
      </div>
    </main>
  );
}
