import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_MDM_API_URL;

async function handler(req: NextRequest) {
  // Extract the path from the incoming request and construct the target URL
  const path = req.nextUrl.pathname.replace('/api/mdm', '');
  const url = `${API_BASE_URL}${path}${req.nextUrl.search}`;

  // Create new headers, copying from the original request
  const headers = new Headers(req.headers);
  // The host header is automatically set by fetch, so we don't need to forward it
  headers.delete('host');

  try {
    // Forward the request to the target API
    const apiResponse = await fetch(url, {
      method: req.method,
      headers: headers,
      // Forward the body only if it's a method that can have one
      body: (req.method !== 'GET' && req.method !== 'HEAD') ? req.body : null,
      // @ts-ignore
      duplex: 'half',
    });

    // Forward the response back to the client
    const responseHeaders = new Headers(apiResponse.headers);

    return new NextResponse(apiResponse.body, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('[API PROXY] error:', error);
    return NextResponse.json(
      { message: 'Error forwarding request' },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH };
