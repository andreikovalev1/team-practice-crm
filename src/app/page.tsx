import { cookies } from "next/headers";
import LogoutButton from "@/features/auth/LogoutButton";
import { redirect } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig"

interface User {
  id: string;
  email: string;
  department_name?: string;
  position_name?: string;
  profile?: {
    avatar?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface GetUsersResponse {
  data?: { users: User[] };
  errors?: Array<{ message: string }>;
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if(!token) {
    redirect(ROUTES.LOGIN);
  }

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
      // body: JSON.stringify({
      //   query: `
      //     query GetUsers {
      //       users {
      //         id
      //         email
      //       }
      //     }
      //   `,
      // }),
      body: JSON.stringify({
        query: `
          query GetUsers {
            users {
              id
              email
              department_name
              position_name
              profile {
                avatar
                first_name
                last_name
              }
            }
          }
        `,
      }),
      cache: "no-store", // Говорим Next.js не кэшировать этот запрос (всегда свежие данные)
    });

    const result: GetUsersResponse = await response.json();

    // Проверяем, вернул ли бэкенд ошибки (например, Unauthorized)
    if (result.errors) {
      authError = true;
    } else if (result.data) {
      users = result.data.users;
    }
  } catch {
    authError = true;
  }

  if (authError) {
    redirect(ROUTES.LOGIN)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black shadow-sm rounded-xl">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Пользователи CRM (SSR)
        </h1>
        
        <div className="w-full space-y-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-6 border rounded-xl border-zinc-200 bg-zinc-50 dark:bg-zinc-900 shadow-sm"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-3">
                {user.profile?.avatar && (
                  <img
                    src={user.profile.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}

                <div>
                  <p className="text-lg font-semibold text-black dark:text-white">
                    {user.profile?.first_name} {user.profile?.last_name}
                  </p>

                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
              </div>

              {/* Department + Position */}
              <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <p>
                  Department:{" "}
                  <span className="font-medium">
                    {user.department_name || "—"}
                  </span>
                </p>

                <p>
                  Position:{" "}
                  <span className="font-medium">
                    {user.position_name || "—"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <LogoutButton />
      </main>
    </div>
  );
}