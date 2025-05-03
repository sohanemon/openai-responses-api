import { getBaseUrl, getCookieStore } from '../utils/helper';

interface GetAiHeadersParams {
  conversation?: string;
  projectId?: string;
  trace?: string;
}

export async function getHeadersForHelicone({
  conversation,
  projectId = 'unknown',
}: GetAiHeadersParams) {
  const c = await getCookieStore();
  const user = c.get('user')?.value ?? 'unknown';

  return {
    'Helicone-Property-Session': process.env.NEXT_PUBLIC_VERCEL_ENV,
    'Helicone-Property-Conversation': conversation,
    'Helicone-Property-App': getBaseUrl(),
    'Helicone-Property-ProjectId': projectId,
    'Helicone-Property-Id': projectId,
    'Helicone-Property-User': user,
    'Helicone-Session-Id': `${projectId}-${conversation}`,
    'Helicone-Session-Path': `/${projectId}/${conversation}`,
    'Helicone-Session-Name': `${user}-${projectId}`,
    // 'helicone-stream-usage': 'true',
  };
}

export async function getMetadata({
  conversation = 'unknown',
  projectId = 'unknown',
}: GetAiHeadersParams) {
  const c = await getCookieStore();
  const user = c.get('user')?.value ?? 'unknown';

  return {
    session: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'localhost',
    conversation,
    'app-url': getBaseUrl(),
    'project-id': projectId,
    user,
  };
}

export const getStreamingHeaders = () => ({
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
});
