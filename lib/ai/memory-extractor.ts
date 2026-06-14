import {
  getChatCompletion,
  type OpenRouterMessage,
  type OpenRouterTool,
} from "@/lib/ai/openrouter";
import { MEMORY_EXTRACTION_PROMPT } from "@/lib/ai/memory-prompt";
import type { SessionMessage } from "@/lib/sessions/messages";

const saveMemoriesTool: OpenRouterTool = {
  type: "function",
  function: {
    name: "save_memories",
    description:
      "Save any new noteworthy facts discovered about the user. Pass an empty array if nothing new was found.",
    parameters: {
      type: "object",
      properties: {
        facts: {
          type: "array",
          items: { type: "string" },
          description:
            "List of new facts to remember. Each fact is one short sentence. May be empty.",
        },
      },
      required: ["facts"],
      additionalProperties: false,
    },
  },
};

type ExtractNewMemoriesParams = {
  displayName: string;
  existingFacts: string[];
  recentMessages: SessionMessage[];
};

export async function extractNewMemories({
  displayName,
  existingFacts,
  recentMessages,
}: ExtractNewMemoriesParams): Promise<string[]> {
  try {
    const systemPrompt = MEMORY_EXTRACTION_PROMPT.replaceAll(
      "{displayName}",
      displayName,
    );

    const existingFactsSection =
      existingFacts.length > 0
        ? `Known facts about ${displayName}:\n${existingFacts.map((f) => `- ${f}`).join("\n")}`
        : `No facts about ${displayName} are known yet.`;

    const transcript = recentMessages
      .map((m) => {
        const speaker =
          m.senderType === "MEDIATOR"
            ? "Mediator"
            : (m.senderDisplayName ?? "Partner");
        return `${speaker}: ${m.content}`;
      })
      .join("\n");

    const messages: OpenRouterMessage[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `${existingFactsSection}\n\nLatest session transcript:\n${transcript}\n\nExtract any new facts about ${displayName} from this exchange.`,
      },
    ];

    const response = await getChatCompletion(messages, undefined, [saveMemoriesTool], {
      type: "function",
      function: { name: "save_memories" },
    });

    const toolCall = response.tool_calls?.find(
      (call) => call.function?.name === "save_memories",
    );

    if (!toolCall?.function?.arguments) {
      return [];
    }

    const parsed = JSON.parse(toolCall.function.arguments) as { facts?: unknown };

    if (!Array.isArray(parsed.facts)) {
      return [];
    }

    return parsed.facts.filter((f): f is string => typeof f === "string" && f.trim().length > 0);
  } catch {
    return [];
  }
}
