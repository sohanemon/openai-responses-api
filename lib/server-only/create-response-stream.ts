import type { AllOrNone, SelectivePartial } from '@sohanemon/utils';
import OpenAI from 'openai';
import type { RequestOptions } from 'openai/core';
import { observeOpenAI } from "langfuse";

import { zodResponseFormat } from 'openai/helpers/zod';
import type { ResponseFormatTextConfig } from 'openai/src/resources/responses/responses.js';
import type { z } from 'zod';

type OpenAiRequest = OpenAI.Responses.ResponseCreateParamsNonStreaming;
type RequestBody = Omit<SelectivePartial<OpenAiRequest, 'model'>, 'stream'> &
  AllOrNone<{
    schema: z.ZodObject<any>;
    schemaName: string;
  }>;

export async function createResponseStream(
  { schema, schemaName, model = 'gpt-4o-mini', ...body }: RequestBody,
  options?: RequestOptions,
) {
  const openai = observeOpenAI(new OpenAI());

  return openai?.responses.create(
    {
      model,
      stream: true,
      truncation: 'auto',
      text: schema
        ? {
          format: {
            type: 'json_schema',
            ...zodResponseFormat(schema, schemaName).json_schema,
          } as ResponseFormatTextConfig,
        }
        : undefined,
      ...body,
    },
    options,
  );
}
