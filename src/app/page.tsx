import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "@/features/auth/LogoutButton";

interface User {
  id: string;
  email: string;
}

interface GetUsersResponse {
  data?: {
    users: User[];
  };
  errors?: Array<{ message: string }>;
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let users: User[] = [];
  let authError = false;

  const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3001/api/graphql';

  try {
    const response = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "", 
      },
      body: JSON.stringify({
        query: `
          query GetUsers {
            users {
              id
              email
            }
          }
        `,
      }),
      cache: "no-store", // Говорим Next.js не кэшировать этот запрос (всегда свежие данные)
    });

    const result: GetUsersResponse = await response.json();

    // Проверяем, вернул ли бэкенд ошибки (например, Unauthorized)
    if (result.errors) {
      console.error("GraphQL Ошибки:", result.errors);
      authError = true;
    } else if (result.data) {
      users = result.data.users;
    }
  } catch (err) {
    console.error("Ошибка сети при SSR:", err);
    authError = true;
  }

  if (authError || !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
        <div className="text-center flex flex-col items-center gap-4">
          <p className="text-zinc-600 dark:text-zinc-300 text-lg">
            Доступ закрыт. Для просмотра данных необходимо войти в систему.
          </p>
          <Link
            href="/auth"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Перейти к авторизации
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black shadow-sm rounded-xl">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Пользователи CRM (SSR)
        </h1>
        
        <div className="w-full space-y-4">
          {users.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg border-zinc-200 bg-zinc-50 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-300 font-medium">{user.email}</p>
              <p className="text-xs text-zinc-400">ID: {user.id}</p>
            </div>
          ))}
        </div>

        <LogoutButton />
      </main>
    </div>
  );
}