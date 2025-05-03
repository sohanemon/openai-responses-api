import { openai } from "@ai-sdk/openai";
import { generateText, streamObject } from "ai";
import { listingSchema } from "./schema";
import { observeOpenAI } from 'langfuse'
import OpenAI from "openai";


export const maxDuration = 30;

export async function POST(req: Request) {
  const context: any = await req.json();
  const { text, usage } = await generateText({
    model: openai.responses('gpt-4o-mini'),
    prompt: 'Generate listing for a gaming mouse',
    providerOptions: {
      openai: {
        store: true,
      },
    },
  });

  console.info("⚡[route.ts:13] text:", text);

  return new Response(text);

  // const openai = observeOpenAI(new OpenAI());
  // const res = await openai.chat.completions.create({
  //   model: 'gpt-4o-mini',
  //   messages: [
  //     {
  //       role: 'user',
  //       content: `Generate listing for a gaming mouse`,
  //     },
  //   ]
  // });





  // const result = streamObject({
  //   model: context.useResponsesApi ? openai.responses("gpt-4o-mini") : openai("gpt-4o-mini",),
  //   prompt: `Generate listing for a gaming mouse`,
  //   experimental_telemetry: {
  //     functionId: context.useResponsesApi ? "generate-listing-responses" : "generate-listing",
  //     isEnabled: true,
  //   },
  //   schema: listingSchema,
  //
  // });
  //
  // return result.toTextStreamResponse();
}
