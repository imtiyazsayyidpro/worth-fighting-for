import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Guided check-ins",
    description:
      "Gentle prompts that help you say the thing you've been circling around.",
    icon: (
      <path
        d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.7 8.7 0 0 1-3.9-.9L3 20.5l1.5-5.1a8.4 8.4 0 0 1-.9-3.9A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Private by design",
    description:
      "A quiet room for two. Your words stay between the both of you — always.",
    icon: (
      <>
        <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
        <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Grow closer",
    description:
      "Turn the hard moments into understanding, one honest conversation at a time.",
    icon: (
      <path
        d="m12 3 1.9 4.8L19 9.5l-4 3.4 1.2 5.1L12 15.6 7.8 18l1.2-5.1-4-3.4 5.1-1.7L12 3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center px-6">
      {/* Hero */}
      <section className="flex w-full max-w-3xl flex-col items-center pt-20 pb-16 text-center sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-primary" />
          A sanctuary for two
        </span>

        <h1 className="mt-7 font-heading text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-7xl">
          Fight <span className="text-gradient italic">for</span> each other,
          <br className="hidden sm:block" /> not with each other.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          A space for the two of you, whenever you need it — to slow down,
          listen, and find your way back to one another.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-13 rounded-xl px-8 text-base shadow-romantic"
            nativeButton={false}
            render={<Link href="/register">Begin together</Link>}
          />
          <Button
            size="lg"
            variant="outline"
            className="h-13 rounded-xl bg-card/60 px-8 text-base backdrop-blur-sm"
            nativeButton={false}
            render={<Link href="/login">Log in</Link>}
          />
        </div>

        <p className="mt-6 text-sm text-muted-foreground/80">
          Private · Just the two of you · Free to start
        </p>
      </section>

      {/* Features */}
      <section className="grid w-full max-w-5xl gap-5 pb-20 sm:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="group gap-0 border-border/60 bg-card/70 p-6 text-left shadow-romantic backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-card/90"
          >
            <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-secondary/25 text-primary transition-transform duration-300 group-hover:scale-105">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="size-6"
                aria-hidden
              >
                {feature.icon}
              </svg>
            </span>
            <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </Card>
        ))}
      </section>

      {/* Closing quote */}
      <section className="w-full max-w-3xl pb-28">
        <Card className="relative overflow-hidden border-border/60 bg-linear-to-br from-primary/10 via-card/70 to-secondary/15 px-8 py-12 text-center shadow-romantic backdrop-blur-md sm:px-14">
          <span
            aria-hidden
            className="pointer-events-none absolute left-6 top-2 font-heading text-8xl leading-none text-primary/15 select-none"
          >
            &ldquo;
          </span>
          <p className="font-heading text-2xl font-medium italic leading-snug text-foreground sm:text-3xl">
            The goal isn&rsquo;t to win the argument. It&rsquo;s to stay on the
            same side.
          </p>
          <p className="mt-6 text-sm font-medium tracking-wide text-muted-foreground uppercase">
            Worth Fighting For
          </p>
        </Card>
      </section>
    </main>
  );
}
