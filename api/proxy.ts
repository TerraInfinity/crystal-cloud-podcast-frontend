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

async function sendLog(level: string, message: string, data: object) {
  try {
    await axios.post(
      'https://logs.terrainfinity.ca/api/frontend-log', 
      {
        message,
        level,
        data,
      },
      {
        headers: {
          'x-api-key': 'ebfb7ff0-g2f6-r1c8-ief3-nfba17be410c',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (logError) {
    let errorMessage = 'Unknown error';
    if (logError instanceof Error) {
      errorMessage = logError.message;
    } else if (typeof logError === 'string') {
      errorMessage = logError;
    } else {
      errorMessage = String(logError);
    }
    console.error('Failed to send log to log server:', errorMessage);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await sendLog('info', 'Proxy request started', {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });
  console.log('Incoming request:', { method: req.method, url: req.url, headers: req.headers });

  const frontendUrl = process.env.VITE_FRONTEND_URL;
  const backendUrl = process.env.VITE_BACKEND_URL;

  if (!frontendUrl) {
    await sendLog('error', 'Missing VITE_FRONTEND_URL', {});
    console.error('Missing VITE_FRONTEND_URL');
    return res.status(500).json({ error: 'VITE_FRONTEND_URL environment variable is not set' });
  }
  if (!backendUrl) {
    await sendLog('error', 'Missing VITE_BACKEND_URL', {});
    console.error('Missing VITE_BACKEND_URL');
    return res.status(500).json({ error: 'VITE_BACKEND_URL environment variable is not set' });
  }

  const isVercel = process.env.VITE_VERCEL_ENV === 'true';
  const origin = !isVercel && req.headers.origin && allowedOrigins.includes(req.headers.origin)
    ? req.headers.origin
    : frontendUrl;
  await sendLog('info', 'Determined origin', { origin });
  console.log('Determined origin:', origin);

  if (req.method === 'OPTIONS') {
    await sendLog('info', 'Handling OPTIONS request', {});
    console.log('Handling OPTIONS request');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }

  const targetUrl = `${backendUrl}${req.url?.replace(/^\/api/, '/api') || ''}`;
  console.log('Target URL:', targetUrl);

  const backendHeaders = {
    ...Object.fromEntries(
      Object.entries(req.headers).filter(([key]) => !key.startsWith('x-vercel-'))
    ),
    host: new URL(backendUrl).host,
  };
  await sendLog('info', 'Making backend request', {
    targetUrl,
    method: req.method,
    headers: backendHeaders,
  });
  console.log('Headers sent to backend:', backendHeaders);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: backendHeaders,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const responseHeaders = response.headers;
    const dataSnippet = response.ok 
      ? await response.text().then(text => text.substring(0, 100)) 
      : 'Error response';
    await sendLog('info', 'Received backend response', {
      status: response.status,
      headers: Object.fromEntries(responseHeaders.entries()),
      contentType: responseHeaders.get('content-type') || 'Not set',
      contentEncoding: responseHeaders.get('content-encoding') || 'none',
      dataSnippet,
    });
    console.log('Backend response:', {
      status: response.status,
      headers: Object.fromEntries(responseHeaders.entries()),
      contentType: responseHeaders.get('content-type') || 'Not set',
      contentEncoding: responseHeaders.get('content-encoding') || 'none',
    });

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    res.status(response.status);
    for (const [key, value] of responseHeaders.entries()) {
      console.log(`Setting response header: ${key}: ${value}`);
      res.setHeader(key, value);
    }

    const responseData = response.ok ? await response.json() : { error: 'Error response' };
    res.send(responseData);
  } catch (error) {
    let errorMessage = 'Unknown error';
    let errorStack = 'No stack trace';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack || 'No stack trace';
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = String(error);
    }

    await sendLog('error', 'Proxy error occurred', {
      message: errorMessage,
      stack: errorStack,
      targetUrl,
      requestHeaders: backendHeaders,
    });
    console.error('Proxy error occurred:', {
      message: errorMessage,
      stack: errorStack,
      targetUrl,
      requestHeaders: backendHeaders,
    });
    res.status(500).json({
      error: 'Failed to proxy request',
      details: errorMessage,
    });
  }
}