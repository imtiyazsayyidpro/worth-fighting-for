import { cn } from "@/lib/utils";

/** Two souls, gently overlapping — the Worth Fighting For emblem. */
export function BrandMark({
  size = 24,
  color,
  className,
}: {
  size?: number;
  /** When set, both circles use this stroke (e.g. a single accent variant). */
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle
        cx="15"
        cy="19"
        r="11"
        stroke={color ?? "var(--ink)"}
        strokeWidth="1.6"
      />
      <circle
        cx="23"
        cy="19"
        r="11"
        stroke={color ?? "var(--blush)"}
        strokeWidth="1.6"
      />
    </svg>
  );
}

/** The brand wordmark in Marcellus. */
export function Wordmark({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("font-heading whitespace-nowrap", className)}
      style={{ fontSize: size, letterSpacing: "0.05em" }}
    >
      WORTH FIGHTING FOR
    </span>
  );
}

/**
 * The mediator: an abstract, gently breathing rose-gold presence.
 * No face, no name — a steady light that holds the space.
 */
export function Orb({
  size = 88,
  glow = true,
  className,
}: {
  size?: number;
  glow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {glow ? (
        <div
          className="animate-glow absolute rounded-full"
          style={{
            inset: "-45%",
            background:
              "radial-gradient(circle, var(--orb-glow), transparent 70%)",
            filter: `blur(${Math.max(6, Math.round(size / 6))}px)`,
          }}
        />
      ) : null}
      <div
        className="animate-breathe h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(circle at 36% 30%, var(--orb1), var(--orb2) 72%)",
          boxShadow: "0 10px 40px -8px var(--orb-glow)",
        }}
      />
    </div>
  );
}
