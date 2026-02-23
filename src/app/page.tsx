import client from "@/lib/apollo-client";
import { gql } from "@apollo/client";

import Link from "next/link";

interface User {
  id: string;
  email: string;
}

interface GetUsersResponse {
  users: User[];
}

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
    }
  }
`;

export default async function Home() {
  let data: GetUsersResponse | undefined;
  let authError = false;

  try {
    const response = await client.query<GetUsersResponse>({
      query: GET_USERS,
    });
    data = response.data;
  } catch {
    authError = true;
  }

  if (authError || !data || !data.users) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
        <div className="text-center flex flex-col items-center gap-4">
          <p className="text-zinc-600 dark:text-zinc-300 text-lg">
            Доступ закрыт. Для просмотра данных необходимо войти в систему.
          </p>
          <Link
            href="/Auth"
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
      <main className="flex w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black shadow-sm">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Пользователи CRM (SSR)
        </h1>
        
        <div className="w-full space-y-4">
          {data.users.map((user) => (
            <div key={user.id} className="p-4 border rounded-lg border-zinc-200">
              <p className="text-zinc-600 dark:text-zinc-300">{user.email}</p>
            </div>
          ))}
        </div>

        <a href="https://nextjs.org/docs" className="mt-10 text-sm text-zinc-400 hover:underline">
          Documentation
        </a>
      </main>
    </div>
  );
}