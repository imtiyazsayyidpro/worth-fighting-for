export type PhaseKey =
  | "CHECK_IN"
  | "EXPLORATION"
  | "REFLECTION"
  | "RESOLUTION"
  | "CLOSING";

export type Phase = {
  key: PhaseKey;
  label: string;
  description: string;
};

export const PHASES: Phase[] = [
  {
    key: "CHECK_IN",
    label: "Check-in",
    description:
      "Understand what's going on and how each person is feeling right now. Help both partners feel safe and heard before going deeper.",
  },
  {
    key: "EXPLORATION",
    label: "Exploration",
    description:
      "Dig into the underlying needs, concerns, and perspectives behind the issue. Encourage each partner to share their experience without judgment.",
  },
  {
    key: "REFLECTION",
    label: "Reflection",
    description:
      "Help each partner reflect on what they've heard and acknowledge the other's experience. Build empathy and shared understanding.",
  },
  {
    key: "RESOLUTION",
    label: "Resolution",
    description:
      "Guide the partners toward concrete steps, compromises, or agreements. Focus on what they can do differently or commit to going forward.",
  },
  {
    key: "CLOSING",
    label: "Closing",
    description:
      "Summarize what was discussed and any agreements reached. End on a constructive, affirming note that reinforces the partners' care for each other.",
  },
];

export const PHASE_KEYS = PHASES.map((p) => p.key) as [
  PhaseKey,
  ...PhaseKey[],
];

export function getPhase(key: string): Phase {
  return PHASES.find((p) => p.key === key) ?? PHASES[0];
}
