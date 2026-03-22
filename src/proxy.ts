import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface TokenPayload {
  exp?: number;
}

interface RefreshResponse {
  data?: {
    updateToken?: {
      access_token?: string;
      refresh_token?: string;
    };
  };
  errors?: Array<{ message: string }>;
}

function isTokenInvalid(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      return true;
    }

    for (const part of parts) {
      atob(part.replace(/-/g, '+').replace(/_/g, '/'));
    }

    const decodedJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(decodedJson) as TokenPayload;

    if (typeof payload.exp !== 'number') return true;

    if (payload.exp * 1000 < Date.now() + 10_000) {
      return true;
    }

    return false;
  } catch {
    return true;
  }
}

async function tryRefresh(
  refreshToken: string,
  graphqlUrl: string
): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  try {
    const res = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation {
            updateToken {
              access_token
              refresh_token
            }
          }
        `,
      }),
    });

    const json = (await res.json()) as RefreshResponse;

    if (json.errors) {
      console.error('[Proxy] Token refresh errors:', json.errors);
      return { accessToken: null, refreshToken: null };
    }

    return {
      accessToken: json.data?.updateToken?.access_token || null,
      refreshToken: json.data?.updateToken?.refresh_token || null,
    };
  } catch (error) {
    console.error('[Proxy] Refresh fetch error:', error);
    return { accessToken: null, refreshToken: null };
  }
}

export async function proxy(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const refreshTokenValue = request.cookies.get('refresh_token')?.value;

  if (!refreshTokenValue) {
    return NextResponse.next();
  }

  if (authToken && !isTokenInvalid(authToken)) {
    return NextResponse.next();
  }

  const graphqlUrl =
    process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/api/graphql';

  const newTokens = await tryRefresh(refreshTokenValue, graphqlUrl);

  if (!newTokens.accessToken) {
    const response = NextResponse.redirect(
      new URL('/auth/login', request.url)
    );
    response.cookies.delete('auth_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    'cookie',
    `auth_token=${newTokens.accessToken}; refresh_token=${newTokens.refreshToken || refreshTokenValue}`
  );

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.cookies.set('auth_token', newTokens.accessToken, {
    path: '/',
    maxAge: 3600,
    httpOnly: false,
    sameSite: 'lax',
  });

  if (newTokens.refreshToken) {
    response.cookies.set('refresh_token', newTokens.refreshToken, {
      path: '/',
      maxAge: 2592000,
      httpOnly: false,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth).*)'],
};