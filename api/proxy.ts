import type { VercelRequest, VercelResponse } from '@vercel/node';

const allowedOrigins = [
  'https://backend.terrainfinity.ca',
  'http://backend.terrainfinity.ca',
  'https://crystalcloudpodcast.terrainfinity.ca',
  'http://crystalcloudpodcast.terrainfinity.ca',
  'https://bambicloudpodcast.terrainfinity.ca',
  'http://bambicloudpodcast.terrainfinity.ca',
  'https://glaumcloudpodcast.terrainfinity.ca',
  'http://glaumcloudpodcast.terrainfinity.ca',
  'http://localhost:3000',
  'http://localhost',
].filter(Boolean);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Log incoming request details
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  const frontendUrl = process.env.VITE_FRONTEND_URL;
  const backendUrl = process.env.VITE_BACKEND_URL;

  // Check environment variables
  if (!frontendUrl) {
    console.error('Missing VITE_FRONTEND_URL');
    return res.status(500).json({ error: 'VITE_FRONTEND_URL environment variable is not set' });
  }
  if (!backendUrl) {
    console.error('Missing VITE_BACKEND_URL');
    return res.status(500).json({ error: 'VITE_BACKEND_URL environment variable is not set' });
  }

  const isVercel = process.env.VITE_VERCEL_ENV === 'true';
  const origin = !isVercel && req.headers.origin && allowedOrigins.includes(req.headers.origin)
    ? req.headers.origin
    : frontendUrl;
  console.log('Determined origin:', origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  const targetUrl = `${backendUrl}${req.url?.replace(/^\/api/, '/api') || ''}`;
  console.log('Target URL:', targetUrl);

  // Prepare headers for backend request
  const backendHeaders = {
    ...Object.fromEntries(
      Object.entries(req.headers).filter(([key]) => !key.startsWith('x-vercel-'))
    ),
    host: new URL(backendUrl).host,
  };
  console.log('Headers sent to backend:', backendHeaders);

  try {
    // Make the backend request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: backendHeaders,
      body:
        req.method !== 'GET' && req.method !== 'HEAD' && req.body
          ? typeof req.body === 'string'
            ? req.body
            : JSON.stringify(req.body)
          : undefined,
    });

    // Log backend response details
    const responseHeaders = Object.fromEntries(response.headers.entries());
    console.log('Backend response:', {
      status: response.status,
      headers: responseHeaders,
      contentType: responseHeaders['content-type'] || 'Not set',
      contentEncoding: responseHeaders['content-encoding'] || 'none',
    });

    // Set CORS headers for the client
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    // Pass through all headers from backend
    res.status(response.status);
    for (const [key, value] of Object.entries(responseHeaders)) {
      console.log(`Setting response header: ${key}: ${value}`);
      res.setHeader(key, value);
    }

    // Send raw response body as buffer
    const data = await response.arrayBuffer();
    console.log('Response body length:', data.byteLength);
    res.send(Buffer.from(data));
  } catch (error) {
    // Detailed error logging
    console.error('Proxy error occurred:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      targetUrl,
      requestHeaders: backendHeaders,
    });
    res.status(500).json({
      error: 'Failed to proxy request',
      details: (error as Error).message,
    });
  }
}