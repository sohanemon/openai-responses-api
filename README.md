# NextJs, Vercel AI SDK, and Langfuse Example

This example repo demostrates how to use Langfuse to instrument a NextJs app with the Vercel AI SDK. This repo is based on the [next-openai](https://github.com/vercel/ai/tree/main/examples/next-openai) example.

Relevant Files:

- `instrumentation.ts` - Register the `LangfuseExporter`
- `app/routes/api/*` - Enable `experimental_telemetry` in AI SDK routes

See the integration docs for more information and a step-by-step guide: https://langfuse.com/docs/integrations/vercel-ai-sdk
