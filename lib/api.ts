import type { ApiResponse, User } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"

interface RequestOptions extends RequestInit {
  token?: string | null
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...init } = options
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | { message?: string } | null

  if (!response.ok) {
    throw new ApiError(payload?.message ?? "Request failed", response.status)
  }

  if (payload && "success" in payload && payload.success && "data" in payload) {
    return payload.data as T
  }

  return payload as T
}

export interface AuthPayload {
  user: User
  accessToken: string
}

export const authApi = {
  login: (values: { email: string; password: string }) =>
    apiRequest<AuthPayload>("/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    }),
  register: (values: { name: string; email: string; password: string }) =>
    apiRequest<AuthPayload>("/auth/register", {
      method: "POST",
      body: JSON.stringify(values),
    }),
  me: (token?: string | null) => apiRequest<User>("/auth/me", { token }),
  logout: () => apiRequest<{ message?: string }>("/auth/logout", { method: "POST" }),
}
