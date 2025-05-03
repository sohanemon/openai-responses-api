
interface GetAiHeadersParams {
  conversation?: string;
  projectId?: string;
  trace?: string;
}





export const getStreamingHeaders = () => ({
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
});
