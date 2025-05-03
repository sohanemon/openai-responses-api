import { openai } from "@ai-sdk/openai";
import { Output, generateText, streamText } from "ai";
import { listingSchema } from "./schema";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const context: any = await req.json();

  const result = await generateText({
    model: openai.responses("gpt-4o-mini"),
    system: 'check guidance from the file. if not available in the file then say i don\'t know.',
    prompt: `create a listing for sports towel`,
    experimental_telemetry: {
      functionId: 'mannual-file-search',
      isEnabled: true,
    },
    // experimental_output: Output.object({ schema: listingSchema }),
    tools: {
      fileSearch: {
        description: "A file search tool that returns context about the user query",
        parameters: z.object({
          queries: z
            .array(z.string())
            .describe(
              "An array of search queries. Generate multiple diverse queries to find relevant files that could assist the user.",
            ),
        }),
        execute: async ({ queries }) => {
          const response = await fetch(`https://api.openai.com/v1/vector_stores/vs_nywcCRDxyDwo18z1xYLjvgx8/search`, {
            method: "POST",
            body: JSON.stringify({ query: queries?.join(', ') }),
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          })

          console.log(`OpenAI API response status: ${response.status}`)

          const responseText = await response.text()

          const results = JSON.parse(responseText)
          if (!results?.data?.length) {
            return "No files found matching your query."
          } else {
            const output = [
              "<sources>",
              results.data.flatMap((res: any) => [
                `<result file_id='${res.file_id}' file_name='${res.file_name}'>`,
                ...(res.content || []).map((part: any) => `<content>${part.text}</content>`),
                `</result>`,
              ]),
              "</sources>",
            ].join("\n")

            console.info("⚡[route.ts:59] output:", output);
            return output
          }
        },
      },
    }
  });


  console.info("⚡[route.ts:67] result.response:", result.text);
  return new Response(result.text);
}
