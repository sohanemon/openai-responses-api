import { createReadableStreamResponsesAPI } from "@/lib/server-only/create-readable-stream";
import { createResponseStream } from "@/lib/server-only/create-response-stream";
import { listingSchema } from "./schema";

export const maxDuration = 30;

export async function POST(req: Request) {
  const context: any = await req.json();

  const stream = await createResponseStream(
    {
      input: 'Generate listing for a gaming mouse',
      schema: listingSchema,
      schemaName: 'listingSchema',
      tools: [
        {
          type: 'file_search',
          vector_store_ids: [process.env.VECTOR_STORE__AMAZON_GUIDELINE__ID ?? ''],
          max_num_results: 3,
        },
      ],
    },
  );

  const res = createReadableStreamResponsesAPI(stream);

  return new Response(res.stream,);
}
