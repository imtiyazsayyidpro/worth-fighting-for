export function DecorativeBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* base aurora wash */}
      <div className="absolute inset-0 aurora opacity-90" />

      {/* floating soft orbs */}
      <div className="animate-float-slow absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div
        className="animate-float-slow absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-secondary/30 blur-3xl"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="animate-float-slow absolute -bottom-24 left-1/3 h-72 w-72 rounded-full blur-3xl"
        style={{
          animationDelay: "-7s",
          background: "oklch(0.88 0.06 50 / 0.35)",
        }}
      />

      {/* subtle top fade for legibility under the header */}
      <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-background/70 to-transparent" />
    </div>
  );
}
