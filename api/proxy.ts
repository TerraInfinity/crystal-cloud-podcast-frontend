import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

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

  // Determine if this is a request for /api/proxy-thumbnail
  const isThumbnailRequest = req.url?.startsWith('/api/proxy-thumbnail');

  // Construct the target URL, preserving query parameters for cache-busting
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
    // Make the backend request using axios
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: backendHeaders,
      data: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      responseType: 'arraybuffer', // Handle binary data (e.g., images) correctly
    });

    // Log backend response details
    const responseHeaders = response.headers;
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

    // If this is a thumbnail request, set cache headers
    if (isThumbnailRequest) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }

    // Pass through all headers from backend, except Cache-Control if overridden
    for (const [key, value] of Object.entries(responseHeaders)) {
      if (key.toLowerCase() !== 'cache-control' || !isThumbnailRequest) {
        console.log(`Setting response header: ${key}: ${value}`);
        res.setHeader(key, value);
      }
    }

    // Send the raw response body (image data)
    res.status(response.status).send(Buffer.from(response.data));
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