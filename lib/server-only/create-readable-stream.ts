import type OpenAI from 'openai';
import type { Stream } from 'openai/streaming';

export type OpenAiResponsesStream =
  Stream<OpenAI.Responses.ResponseStreamEvent> & {
    _request_id?: string | null;
  };

interface ReadableWithId {
  stream: ReadableStream<Uint8Array>;
  responseId: Promise<string>;
}

export function createReadableStreamResponsesAPI(
  stream: OpenAiResponsesStream,
): ReadableWithId {
  let resolveResponseId!: (id: string) => void;
  const responseId = new Promise<string>((resolve) => {
    resolveResponseId = resolve;
  });

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (event.type === 'response.created') {
            resolveResponseId(event.response.id);
          }

          if (
            event.type === 'response.output_text.delta' ||
            event.type === 'response.refusal.delta'
          ) {
            const chunk = event.delta;
            if (chunk !== undefined) {
              const text =
                typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
              controller.enqueue(new TextEncoder().encode(text));
            }
          } else if (event.type === 'response.failed') {
            const errMsg = event.response?.error ?? 'Unknown error';
            controller.enqueue(
              new TextEncoder().encode(`\nError: ${errMsg}\n`),
            );
          } else if (event.type === 'response.completed') {
            break;
          }
        }
      } catch (err: any) {
        controller.enqueue(
          new TextEncoder().encode(`[Stream Error] ${err.message}\n`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return { stream: readable, responseId };
}
