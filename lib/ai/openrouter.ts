type OpenRouterRole = "system" | "user" | "assistant";

export type OpenRouterMessage = {
  role: OpenRouterRole;
  content: string;
};

export type OpenRouterTool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  };
};

export type OpenRouterToolChoice =
  | "auto"
  | "none"
  | {
      type: "function";
      function: {
        name: string;
      };
    };

export type OpenRouterToolCall = {
  id?: string;
  type?: "function";
  function?: {
    name?: string;
    arguments?: string;
  };
};

export type OpenRouterAssistantMessage = {
  role?: "assistant";
  content?: string | null;
  tool_calls?: OpenRouterToolCall[];
};

type OpenRouterChoice = {
  message?: OpenRouterAssistantMessage;
};

type OpenRouterResponse = {
  choices?: OpenRouterChoice[];
};

export class OpenRouterError extends Error {
  status: number;
  responseBody: string;

  constructor(status: number, responseBody: string) {
    super(`OpenRouter request failed with ${status}`);
    this.name = "OpenRouterError";
    this.status = status;
    this.responseBody = responseBody;
  }
}

const OPENROUTER_CHAT_COMPLETIONS_URL =
  "https://openrouter.ai/api/v1/chat/completions";

export async function getChatCompletion(
  messages: OpenRouterMessage[],
  model = process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet",
  tools?: OpenRouterTool[],
  tool_choice?: OpenRouterToolChoice,
) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const response = await fetch(OPENROUTER_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      ...(tools ? { tools } : {}),
      ...(tool_choice ? { tool_choice } : {}),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new OpenRouterError(response.status, errorBody);
  }

  const body = (await response.json()) as OpenRouterResponse;
  const message = body.choices?.[0]?.message;

  if (!message) {
    throw new Error("OpenRouter returned no assistant message");
  }

  return message;
}
