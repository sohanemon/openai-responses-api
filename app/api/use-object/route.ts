import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { listingSchema } from "./schema";

export const maxDuration = 30;

export async function POST(req: Request) {
  const context: any = await req.json();

  const result = streamObject({
    model: context.useResponsesApi ? openai.responses("gpt-4o-mini") : openai("gpt-4o-mini",),
    prompt: `Generate listing for a gaming mouse`,
    experimental_telemetry: {
      functionId: context.useResponsesApi ? "generate-listing-responses" : "generate-listing",
      isEnabled: true,
    },
    schema: listingSchema,

  });

  return result.toTextStreamResponse();
}
