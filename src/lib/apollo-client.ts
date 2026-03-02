import { 
  ApolloClient, 
  InMemoryCache, 
  HttpLink, 
  from, 
  Observable,
  FetchResult,
  Operation
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/api/graphql';

const httpLink = new HttpLink({ uri: graphqlUrl });

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
  return match ? match[2] : null;
};

const authLink = setContext((_, { headers }) => {
  const token = getCookie('auth_token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    }
  };
});

let refreshPromise: Promise<string> | null = null;

interface CustomGraphQLError {
  message: string;
  extensions?: { code?: string; };
}

interface CustomNetworkError extends Error {
  statusCode?: number;
}

interface CustomErrorResponse {
  graphQLErrors?: CustomGraphQLError[];
  networkError?: CustomNetworkError;
  operation: Operation;
  forward: (operation: Operation) => Observable<FetchResult>;
}

// 3. Умный перехватчик ошибок
const errorLink = onError((options) => {
  const { graphQLErrors, networkError, operation, forward } = options as unknown as CustomErrorResponse;
  
  // 🔥 ВЫВОДИМ ВООБЩЕ ВСЕ ОШИБКИ БЕЗ ФИЛЬТРОВ 🔥
  console.log(`[Apollo РЕНТГЕН] Упал запрос: ${operation.operationName}`);
  console.log(`[Apollo РЕНТГЕН] GraphQL Ошибки:`, graphQLErrors);
  console.log(`[Apollo РЕНТГЕН] Network Ошибка:`, networkError);

  if (operation.operationName === 'Login' || operation.operationName === 'login') {
    return;
  }

  let isUnauthorized = false;

  if (graphQLErrors) {
    isUnauthorized = graphQLErrors.some((err: CustomGraphQLError) => {
      const msg = err.message.toLowerCase();
      // Выводим текст ошибки, чтобы точно знать, что пишет бэкенд
      console.log(`[Apollo РЕНТГЕН] Текст ошибки: "${msg}", Код: "${err.extensions?.code}"`);
      
      return (
        err.extensions?.code === 'UNAUTHENTICATED' || 
        msg.includes('unauthorized') || 
        msg.includes('jwt expired') || 
        msg.includes('invalid token')
      );
    });
  }

  if (networkError && networkError.statusCode === 401) {
    isUnauthorized = true;
  }

  if (isUnauthorized) {
    console.log("[Apollo РЕНТГЕН] 🚨 Распознана ошибка авторизации! Запускаем рефреш...");
    
    const refreshToken = getCookie('refresh_token');
    if (!refreshToken) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
      return;
    }

    if (!refreshPromise) {
      refreshPromise = fetch(graphqlUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
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
      })
      .then(res => res.json())
      .then(res => {
        const newAccessToken = res.data?.updateToken?.access_token;
        const newRefreshToken = res.data?.updateToken?.refresh_token;

        if (!newAccessToken) throw new Error("Токен не получен");

        document.cookie = `auth_token=${newAccessToken}; path=/; max-age=3600`;
        if (newRefreshToken) {
          document.cookie = `refresh_token=${newRefreshToken}; path=/; max-age=2592000`;
        }

        console.log("[Apollo РЕНТГЕН] ✅ Рефреш успешен!");
        return newAccessToken as string;
      })
      .catch((err: unknown) => {
        console.error("Ошибка обновления токена:", err);
        if (typeof document !== 'undefined') {
          document.cookie = 'auth_token=; Max-Age=0; path=/';
          document.cookie = 'refresh_token=; Max-Age=0; path=/';
        }
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
    }

    return new Observable<FetchResult>((observer) => {
      refreshPromise!
        .then((newAccessToken: string) => {
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          
          const subscriber = forward(operation).subscribe({
            next: (result) => observer.next(result),
            error: (error) => observer.error(error),
            complete: () => observer.complete()
          });

          return () => subscriber.unsubscribe();
        })
        .catch((error: unknown) => observer.error(error));
    });
  } else {
    console.log("[Apollo РЕНТГЕН] ❌ Это не ошибка авторизации, пропускаем дальше в компонент.");
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;