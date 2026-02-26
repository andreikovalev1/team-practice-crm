import { cookies } from "next/headers";
import LogoutButton from "@/features/auth/LogoutButton";
import { redirect } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig"

import EmployeeTable from "@/features/employee/EmployeeTable";

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
      cache: "no-store",
    });

    const result: GetUsersResponse = await response.json();

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
    <main>
      <EmployeeTable employees={users}/>
      <LogoutButton />
    </main>
  );
}