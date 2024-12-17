'use client';

import { useEffect, useState } from 'react';

export default function SharedApp({
  params,
}: {
  params: { sessionId: string; version: string };
}) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        const response = await fetch(`/api/apps/${params.sessionId}/${params.version}`);
        if (!response.ok) {
          throw new Error('Failed to fetch HTML');
        }
        const htmlContent = await response.text();
        setHtml(htmlContent);
      } catch (error) {
        console.error('Error fetching HTML:', error);
      }
    };

    fetchHtml();
  }, [params.sessionId, params.version]);

  return (
    <div className="w-screen h-screen">
      <iframe 
        srcDoc={html}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-forms"
        style={{ height: '100vh' }}
        scrolling='no'
      />
    </div>
  );
}
