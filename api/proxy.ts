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
    'http://localhost'
].filter(Boolean);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const frontendUrl = process.env.VITE_FRONTEND_URL;
  const backendUrl = process.env.VITE_BACKEND_URL;

  if (!frontendUrl) {
    return res.status(500).json({ error: 'VITE_FRONTEND_URL environment variable is not set' });
  }
  if (!backendUrl) {
    return res.status(500).json({ error: 'VITE_BACKEND_URL environment variable is not set' });
  }

  const isVercel = process.env.VITE_VERCEL_ENV === 'true';
  const origin = !isVercel && req.headers.origin && allowedOrigins.includes(req.headers.origin) 
    ? req.headers.origin 
    : frontendUrl;

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  const targetUrl = `${backendUrl}${req.url?.replace(/^\/api/, '/api') || ''}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...Object.fromEntries(
          Object.entries(req.headers).filter(([key]) => !key.startsWith('x-vercel-'))
        ),
        host: new URL(backendUrl).host,
      },
      body:
        req.method !== 'GET' && req.method !== 'HEAD' && req.body
          ? typeof req.body === 'string'
            ? req.body
            : JSON.stringify(req.body)
          : undefined,
    });

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    res.status(response.status);
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    const data = await response.arrayBuffer();
    res.send(Buffer.from(data));
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy request', details: (error as Error).message });
  }
}