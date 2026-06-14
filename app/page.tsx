import Link from "next/link";

import { BrandMark, Orb, Wordmark } from "@/components/layout/brand-mark";

const ideas = [
  {
    title: "Gently guided",
    body: "A calm presence helps you take turns, slow down, and truly hear one another — one honest moment at a time.",
    soft: "var(--blush-soft)",
    mark: (
      <span
        className="rounded-full"
        style={{ width: 13, height: 13, border: "1.5px solid var(--blush)" }}
      />
    ),
  },
  {
    title: "Private by design",
    body: "Your words stay between the two of you. What you each tell the mediator in private stays private — always.",
    soft: "var(--sage-soft)",
    mark: (
      <span
        style={{
          width: 12,
          height: 15,
          border: "1.5px solid var(--sage)",
          borderRadius: "4px 4px 6px 6px",
        }}
      />
    ),
  },
  {
    title: "Closer, not further",
    body: "Turn the moments that pull you apart into the ones that bring you back — and grow closer for having stayed.",
    soft: "var(--blush-soft)",
    mark: <BrandMark size={16} color="var(--blush)" />,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* nav */}
      <header className="flex items-center justify-between px-6 py-6 sm:px-[54px]">
        <Link href="/" className="flex items-center gap-3">
          <BrandMark size={26} />
          <Wordmark size={16} className="hidden sm:inline" />
          <Wordmark size={13} className="sm:hidden" />
        </Link>
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            className="rounded-full border border-line2 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-panel2"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition-opacity hover:opacity-90"
          >
            Begin together
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="grid items-center gap-10 px-6 pb-16 pt-6 sm:px-[54px] lg:grid-cols-[1.05fr_.95fr] lg:pb-16 lg:pt-10">
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-blush">
            For the two of you
          </p>
          <h1 className="font-heading text-[42px] leading-[1.06] tracking-tight sm:text-[62px]">
            Come back to the same side.
          </h1>
          <p className="mt-5 max-w-[480px] text-lg leading-relaxed text-muted-foreground sm:text-[19px]">
            A quiet, guided space for the two of you to move through the hard
            moments — and find your way back to each other.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/register"
              className="rounded-full bg-foreground px-8 py-4 text-center text-base font-bold text-background transition-opacity hover:opacity-90"
            >
              Begin together
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-line2 px-7 py-4 text-center text-base font-semibold transition-colors hover:bg-panel2"
            >
              Log in
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-2.5 text-[13.5px] text-faint">
            <span>Private</span>
            <span className="opacity-50">·</span>
            <span>Just the two of you</span>
            <span className="opacity-50">·</span>
            <span>Free to start</span>
          </div>
        </div>

        {/* orb visual */}
        <div
          className="relative grid aspect-square place-items-center overflow-hidden rounded-[28px]"
          style={{
            background: "linear-gradient(160deg, var(--blush-soft), var(--sage-soft))",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 46%, var(--orb-glow), transparent 60%)",
            }}
          />
          <Orb size={160} />
          <p className="absolute inset-x-0 bottom-6 text-center text-[12.5px] uppercase tracking-[0.16em] text-ink/55">
            A steady, gentle presence
          </p>
        </div>
      </section>

      {/* three ideas */}
      <section className="px-6 pb-14 sm:px-[54px]">
        <div className="grid gap-5 sm:grid-cols-3">
          {ideas.map((idea) => (
            <div
              key={idea.title}
              className="rounded-[20px] border border-border bg-card p-7"
            >
              <div
                className="mb-[18px] grid size-[38px] place-items-center rounded-full"
                style={{ background: idea.soft }}
              >
                {idea.mark}
              </div>
              <h3 className="font-heading text-[22px]">{idea.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {idea.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* closing moment */}
      <section className="px-6 pb-14 sm:px-[54px]">
        <div
          className="overflow-hidden rounded-[28px] px-6 py-12 text-center sm:px-10 sm:py-[70px]"
          style={{
            background: "linear-gradient(160deg, var(--bg2), var(--blush-soft))",
          }}
        >
          <Orb size={54} className="mx-auto mb-6" />
          <p className="mx-auto max-w-[680px] font-heading text-[27px] leading-[1.3] sm:text-[38px]">
            The goal was never to win the argument. It&rsquo;s to stay on the same
            side.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-full bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90"
          >
            Begin together
          </Link>
        </div>
      </section>

      {/* disclaimer */}
      <footer className="px-6 pb-12 text-center sm:px-[54px]">
        <p className="mx-auto max-w-[560px] text-[12.5px] leading-relaxed text-faint">
          Worth Fighting For is a supportive space, not a substitute for
          professional therapy or care. If you&rsquo;re in crisis or either of you
          is unsafe, please reach out to a qualified professional or local
          emergency services.
        </p>
      </footer>
    </main>
  );
}
