import { z } from "zod";

import {
  getChatCompletion,
  type OpenRouterMessage,
  type OpenRouterTool,
} from "@/lib/ai/openrouter";
import { MEDIATOR_SYSTEM_PROMPT } from "@/lib/ai/mediator-prompt";
import { getPhase, PHASE_KEYS, type PhaseKey } from "@/lib/ai/phases";
import type { Speaker } from "@/lib/generated/prisma/enums";
import type { SessionMessage } from "@/lib/sessions/messages";
import { getNextUserSlot, type UserSlot } from "@/lib/sessions/turn";

const respondAndRouteTool: OpenRouterTool = {
  type: "function",
  function: {
    name: "respond_and_route",
    description:
      "Respond as the mediator and choose who should speak next in the session.",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "The mediator's concise reply to show in the session.",
        },
        next_speaker: {
          type: "string",
          enum: ["SAME_SPEAKER", "OTHER_PARTNER", "BOTH"],
          description:
            "Who should speak next after the mediator reply, relative to who just spoke: SAME_SPEAKER asks the partner who just spoke to continue (elaborate, clarify, or soften), OTHER_PARTNER hands the turn to the partner who did NOT just speak, and BOTH opens the floor to both partners. Whoever you address by name in your reply must match this choice.",
        },
        next_phase: {
          type: "string",
          enum: PHASE_KEYS,
          description:
            "The session phase after this reply. Usually the same as the current phase — advance to the next phase only when this part of the conversation feels genuinely resolved or complete. You may also move back a phase if needed.",
        },
        safety_flag: {
          type: "boolean",
          description:
            "Set to true if the message suggests the person may be considering self-harm, describes abuse, or indicates they are in danger. When true, the floor is opened to both partners regardless of next_speaker.",
        },
      },
      required: ["message", "next_speaker", "next_phase", "safety_flag"],
      additionalProperties: false,
    },
  },
};

const respondAndRouteSchema = z.object({
  message: z.string().trim().min(1),
  next_speaker: z.enum(["SAME_SPEAKER", "OTHER_PARTNER", "BOTH"]),
  next_phase: z.enum(PHASE_KEYS),
  safety_flag: z.boolean().default(false),
});

type MediatorReply = {
  reply: string;
  nextSpeaker: Extract<Speaker, "USER_A" | "USER_B" | "BOTH">;
  nextPhase: PhaseKey;
  safetyFlag: boolean;
};

type MediatorRoutingContext = {
  userADisplayName: string;
  userBDisplayName: string;
  lastSpeakerDisplayName: string;
  currentPhase?: string | null;
  userAMemories?: string[];
  userBMemories?: string[];
};

function buildMemorySection(displayName: string, facts: string[]): string {
  if (facts.length === 0) return "";
  const lines = facts.map((f) => `- ${f}`).join("\n");
  return `What we know about ${displayName}:\n${lines}`;
}

export async function getMediatorReply(
  messages: SessionMessage[],
  lastSpeakerSlot: UserSlot,
  routingContext: MediatorRoutingContext,
) {
  const otherSpeakerSlot = getNextUserSlot(lastSpeakerSlot);
  const otherPartnerDisplayName =
    lastSpeakerSlot === "USER_A"
      ? routingContext.userBDisplayName
      : routingContext.userADisplayName;

  const currentPhaseKey = (routingContext.currentPhase ?? "CHECK_IN") as PhaseKey;
  const currentPhase = getPhase(currentPhaseKey);

  const memorySections = [
    buildMemorySection(routingContext.userADisplayName, routingContext.userAMemories ?? []),
    buildMemorySection(routingContext.userBDisplayName, routingContext.userBMemories ?? []),
  ]
    .filter(Boolean)
    .join("\n\n");

  const openRouterMessages: OpenRouterMessage[] = [
    {
      role: "system",
      content: MEDIATOR_SYSTEM_PROMPT,
    },
    ...(memorySections
      ? [
          {
            role: "system" as const,
            content: `Background context about the partners (use to inform your empathy and responses, do not reference directly unless relevant):\n\n${memorySections}`,
          },
        ]
      : []),
    {
      role: "system",
      content: `The two partners are ${routingContext.userADisplayName} and ${routingContext.userBDisplayName}. The most recent message was sent by ${routingContext.lastSpeakerDisplayName}; the other partner is ${otherPartnerDisplayName}. When you call respond_and_route, pick the next speaker relative to who just spoke: SAME_SPEAKER asks ${routingContext.lastSpeakerDisplayName} to continue, OTHER_PARTNER hands the turn to ${otherPartnerDisplayName}, and BOTH opens the floor to both. If you address a single partner by name in your reply, that person must be the one you route to.\n\nCurrent session phase: ${currentPhase.key} (${currentPhase.label}) — ${currentPhase.description}`,
    },
  ];

  for (const message of messages) {
    if (message.senderType === "USER") {
      openRouterMessages.push({
        role: "user",
        content: `${message.senderDisplayName ?? "Partner"}: ${message.content}`,
      });
    }

    if (message.senderType === "MEDIATOR") {
      openRouterMessages.push({
        role: "assistant",
        content: message.content,
      });
    }
  }

  try {
    const message = await getChatCompletion(
      openRouterMessages,
      undefined,
      [respondAndRouteTool],
      {
        type: "function",
        function: {
          name: "respond_and_route",
        },
      },
    );

    const toolCall = message.tool_calls?.find(
      (call) => call.function?.name === "respond_and_route",
    );

    if (!toolCall?.function?.arguments) {
      throw new Error("Mediator did not return respond_and_route tool call");
    }

    let parsedArguments: unknown;

    try {
      parsedArguments = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("Mediator returned invalid tool call JSON");
    }

    const parsed = respondAndRouteSchema.safeParse(parsedArguments);

    if (!parsed.success) {
      throw new Error("Mediator returned invalid respond_and_route arguments");
    }

    const safetyFlag = parsed.data.safety_flag;

    // Safety override: if flagged, always open the floor to both partners
    // and keep the current phase unchanged.
    const nextSpeaker: MediatorReply["nextSpeaker"] = safetyFlag
      ? "BOTH"
      : parsed.data.next_speaker === "BOTH"
        ? "BOTH"
        : parsed.data.next_speaker === "SAME_SPEAKER"
          ? lastSpeakerSlot
          : otherSpeakerSlot;

    const nextPhase: PhaseKey = safetyFlag
      ? currentPhaseKey
      : parsed.data.next_phase;

    return {
      reply: parsed.data.message,
      nextSpeaker,
      nextPhase,
      safetyFlag,
    } satisfies MediatorReply;
  } catch (error) {
    console.error("Mediator OpenRouter/tool-call failure", error);
    throw error;
  }
}
