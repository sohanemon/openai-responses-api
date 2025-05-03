import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { listingSchema } from "./schema";

export const maxDuration = 30;

export async function POST(req: Request) {

  const result = streamObject({
    model: openai("gpt-4o-mini"),
    prompt: `Generate listing for a gaming mouse`,
    experimental_telemetry: {
      functionId: 'testing-repro-repo',
      isEnabled: true,
    },
    schema: listingSchema,
  });

  return result.toTextStreamResponse();
}
