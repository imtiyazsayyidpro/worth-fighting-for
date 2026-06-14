import { getPhase } from "@/lib/ai/phases";

type PhaseIndicatorProps = {
  currentPhase: string | null;
};

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  if (!currentPhase) return null;

  const phase = getPhase(currentPhase);

  return (
    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary/80">
      {phase.label}
    </span>
  );
}
