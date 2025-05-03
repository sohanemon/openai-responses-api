'use client';

import { experimental_useObject as useObject } from '@ai-sdk/react';
import { useState } from 'react';
import { listingSchema } from '../api/use-object-vercel/schema';

export default function Page() {
  const [useResponsesApi, setUseResponsesApi] = useState(true);
  const { submit, isLoading, object, stop } = useObject({
    api: '/api/use-object-vercel',
    schema: listingSchema,
  });
  console.info("⚡[page.tsx:10] object:", object);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 m-4">
      <label htmlFor='useResponsesApi'><input id='useResponsesApi' type='checkbox' checked={useResponsesApi} onChange={(e) => setUseResponsesApi(e.target.checked)} /> <span>use responses api</span></label>
      <button
        className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md disabled:bg-blue-200"
        onClick={async () => {
          submit({ useResponsesApi });
        }}
        disabled={isLoading}
      >
        Generate listing
      </button>

      {isLoading && (
        <div className="mt-4 text-gray-500">
          <div>Loading...</div>
          <button
            type="button"
            className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
            onClick={() => stop()}
          >
            STOP
          </button>
        </div>
      )}

      <pre className='container'>
        {JSON.stringify(object, null, 2)?.toString()}
      </pre>
    </div>
  );
}
