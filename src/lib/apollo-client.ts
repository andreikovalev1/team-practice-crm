'use client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  Observable,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import {
  CombinedGraphQLErrors,
  ServerError,
} from "@apollo/client/errors";

const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  "http://localhost:3001/api/graphql";

const httpLink = new HttpLink({
  uri: graphqlUrl,
});

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const setCookie = (name: string, value: string, maxAge: number) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
};

const clearAuth = () => {
  if (typeof document === "undefined") return;
  document.cookie = "auth_token=; Max-Age=0; path=/";
  document.cookie = "refresh_token=; Max-Age=0; path=/";
  localStorage.removeItem("auth-storage");
  window.location.href = "/auth/login";
};

const authLink = setContext((_, { headers }) => {
  const token = getCookie("auth_token");
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

let refreshPromise: Promise<string> | null = null;

const refreshToken = async (): Promise<string> => {
  const refresh = getCookie("refresh_token");

  if (!refresh) throw new Error("No refresh token");

  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refresh}`,
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

  const json = await response.json();
  const newAccessToken = json.data?.updateToken?.access_token;
  const newRefreshToken = json.data?.updateToken?.refresh_token;

  if (!newAccessToken) throw new Error("Failed to refresh token");

  setCookie("auth_token", newAccessToken, 60 * 60);
  if (newRefreshToken) {
    setCookie("refresh_token", newRefreshToken, 60 * 60 * 24 * 30);
  }

  return newAccessToken;
};

const errorLink = onError(({ error, operation, forward }) => {
  if (!error) return;

  if (
    operation.operationName === "Login" ||
    operation.operationName === "login" ||
    operation.operationName === "Register" ||
    operation.operationName === "register"
  ) {
    return;
  }

  let isUnauthorized = false;

  if (CombinedGraphQLErrors.is(error)) {
    isUnauthorized = error.errors.some((err) => {
      const message = err.message?.toLowerCase() || "";
      const code = err.extensions?.code;
      return (
        code === "UNAUTHENTICATED" ||
        message.includes("unauthorized") ||
        message.includes("jwt expired") ||
        message === "bad request exception"
      );
    });
  }

  if (!isUnauthorized && ServerError.is(error)) {
    if (error.statusCode === 401) {
      isUnauthorized = true;
    }
  }

  if (!isUnauthorized) return;

  return new Observable((observer) => {
    if (!refreshPromise) {
      refreshPromise = refreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    refreshPromise
      .then((newAccessToken) => {
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        }));
        forward(operation).subscribe(observer);
      })
      .catch((refreshError) => {
        clearAuth();
        observer.error(refreshError);
      });
  });
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export default client;