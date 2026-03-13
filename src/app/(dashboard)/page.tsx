import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/app/configs/routesConfig";
import EmployeeTable from "@/features/employee/EmployeeTable";
import TokenUpdater from "@/components/TokenUpdater";
import { User } from "@/types/user.types";

interface GraphQLResponse {
  data?: { users: User[] };
  errors?: Array<{
    message: string;
    extensions?: { code?: string };
  }>;
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

const graphqlUrl =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3001/api/graphql";

const USERS_QUERY = `
  query GetUsers {
    users {
      id
      email
      department_name
      position_name
      created_at
      role
      profile {
        avatar
        first_name
        last_name
      }
    }
  }
`;

async function fetchUsers(token: string): Promise<GraphQLResponse> {
  const response = await fetch(graphqlUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: USERS_QUERY }),
    cache: "no-store",
  });
  return (await response.json()) as GraphQLResponse;
}

function isAuthError(result: GraphQLResponse): boolean {
  if (!result.errors) return false;
  return result.errors.some((err) => {
    const message = (err.message ?? "").toLowerCase();
    const code = err.extensions?.code ?? "";
    return (
      code === "UNAUTHENTICATED" ||
      message.includes("unauthorized") ||
      message.includes("jwt expired") ||
      message.includes("jwt malformed")
    );
  });
}

async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string | null; newRefreshToken: string | null }> {
  try {
    const res = await fetch(graphqlUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({
        query: `mutation { updateToken { access_token refresh_token } }`,
      }),
    });

    const json = (await res.json()) as RefreshResponse;

    if (json.errors) {
      return { accessToken: null, newRefreshToken: null };
    }

    return {
      accessToken: json.data?.updateToken?.access_token ?? null,
      newRefreshToken: json.data?.updateToken?.refresh_token ?? null,
    };
  } catch {
    return { accessToken: null, newRefreshToken: null };
  }
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const refresh = cookieStore.get("refresh_token")?.value;

  if (!token && !refresh) {
    redirect(ROUTES.LOGIN);
  }

  // Попытка 1: запрос с текущим токеном
  if (token) {
    const result = await fetchUsers(token);

    if (result.data && !isAuthError(result)) {
      return (
        <main>
          <EmployeeTable employees={result.data.users} />
        </main>
      );
    }
  }

  // Попытка 2: refresh + повторный запрос
  if (refresh) {
    const newTokens = await refreshAccessToken(refresh);

    if (newTokens.accessToken) {
      const result = await fetchUsers(newTokens.accessToken);

      if (result.data) {
        return (
          <main>
            <TokenUpdater
              accessToken={newTokens.accessToken}
              refreshToken={newTokens.newRefreshToken}
            />
            <EmployeeTable employees={result.data.users} />
          </main>
        );
      }
    }
  }

  redirect(ROUTES.LOGIN);
}