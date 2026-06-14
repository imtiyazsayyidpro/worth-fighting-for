import type { Speaker } from "@/lib/generated/prisma/enums";
import { type UserSlot } from "@/lib/sessions/turn";
import { cn } from "@/lib/utils";

type TurnIndicatorProps = {
  currentSpeaker: Speaker | null;
  currentUserSlot: UserSlot;
  partnerName: string;
  isPaused?: boolean;
};

export function TurnIndicator({
  currentSpeaker,
  currentUserSlot,
  partnerName,
  isPaused = false,
}: TurnIndicatorProps) {
  let label = `Waiting for ${partnerName}…`;
  let tone = "text-muted-foreground";
  let pulse = true;

  if (isPaused) {
    label = "Session paused";
    tone = "text-amber-600";
    pulse = false;
  } else if (currentSpeaker === "MEDIATOR") {
    label = "Mediator is responding…";
    tone = "text-primary";
  } else if (currentSpeaker === "BOTH") {
    label = "The floor is open — either of you can respond";
    tone = "text-emerald-600";
    pulse = false;
  } else if (currentSpeaker === currentUserSlot) {
    label = "It's your turn to share";
    tone = "text-emerald-600";
    pulse = false;
  }

  return (
    <div className={cn("flex items-center gap-2 text-xs font-medium", tone)}>
      <span
        className={cn(
          "size-1.5 rounded-full bg-current",
          pulse && "animate-pulse",
        )}
        aria-hidden
      />
      {label}
    </div>
  );
}
