import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.next();
  }

  let isExpired = false;
  if (!authToken) {
    isExpired = true;
  } else {
    try {
      const payloadBase64 = authToken.split('.')[1];
      const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(decodedJson);
      
      if (payload.exp * 1000 < Date.now() + 10000) {
        isExpired = true;
      }
    } catch {
      isExpired = true;
    }
  }

  if (!isExpired) {
    return NextResponse.next();
  }

  try {
    const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/api/graphql';
    
    const res = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation {
            updateToken {
              access_token
              refresh_token
            }
          }
        `
      })
    });

    const json = await res.json();
    const newAccessToken = json.data?.updateToken?.access_token;
    const newRefreshToken = json.data?.updateToken?.refresh_token;

    if (newAccessToken) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('cookie', `auth_token=${newAccessToken}; refresh_token=${newRefreshToken || refreshToken}`);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      response.cookies.set('auth_token', newAccessToken, { path: '/', maxAge: 3600 });
      if (newRefreshToken) {
        response.cookies.set('refresh_token', newRefreshToken, { path: '/', maxAge: 2592000 });
      }

      return response;
    }
  } catch {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Указываем, на каких маршрутах должен работать
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};