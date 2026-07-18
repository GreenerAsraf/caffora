import type { ApiResponse, User } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"

interface RequestOptions extends RequestInit {
  token?: string | null
  _retry?: boolean
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// Callback invoked when a token is refreshed — AuthProvider subscribes to update state
let _onTokenRefreshed: ((newToken: string) => void) | null = null
export function setOnTokenRefreshed(cb: (newToken: string) => void) {
  _onTokenRefreshed = cb
}

const TOKEN_KEY = "caffora-access-token"

let _isRefreshing = false
let _refreshQueue: Array<(token: string | null) => void> = []

async function tryRefreshToken(): Promise<string | null> {
  if (_isRefreshing) {
    return new Promise((resolve) => {
      _refreshQueue.push(resolve)
    })
  }
  _isRefreshing = true
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
    if (!res.ok) {
      _refreshQueue.forEach((cb) => cb(null))
      _refreshQueue = []
      return null
    }
    const body = await res.json()
    const newToken: string = body?.data?.accessToken ?? null
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken)
      _onTokenRefreshed?.(newToken)
    }
    _refreshQueue.forEach((cb) => cb(newToken))
    _refreshQueue = []
    return newToken
  } catch {
    _refreshQueue.forEach((cb) => cb(null))
    _refreshQueue = []
    return null
  } finally {
    _isRefreshing = false
  }
}

async function doFetch<T>(path: string, options: RequestOptions): Promise<T> {
  const { token, headers, _retry, ...init } = options
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

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    return await doFetch<T>(path, options)
  } catch (err) {
    // Don't attempt refresh for demo tokens — they have no real refresh cookie
    const isDemo = options.token?.startsWith('demo-')
    if (err instanceof ApiError && err.status === 401 && !options._retry && !isDemo) {
      const newToken = await tryRefreshToken()
      if (newToken) {
        return doFetch<T>(path, { ...options, token: newToken, _retry: true })
      }
    }
    throw err
  }
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

export const productsApi = {
  list: (params?: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString()
    return apiRequest<any>(`/products${query ? `?${query}` : ""}`)
  },
  getById: (id: string) => apiRequest<any>(`/products/${id}`),
  create: (data: any, token: string) =>
    apiRequest<any>("/products", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: any, token: string) =>
    apiRequest<any>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    apiRequest<{ message: string }>(`/products/${id}`, { method: "DELETE", token }),
}

export const categoriesApi = {
  list: () => apiRequest<any>("/categories"),
  getBySlug: (slug: string) => apiRequest<any>(`/categories/${slug}`),
  create: (data: any, token: string) =>
    apiRequest<any>("/categories", { method: "POST", body: JSON.stringify(data), token }),
  update: (id: string, data: any, token: string) =>
    apiRequest<any>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data), token }),
  delete: (id: string, token: string) =>
    apiRequest<{ message: string }>(`/categories/${id}`, { method: "DELETE", token }),
}

export const cartApi = {
  get: (token: string) => apiRequest<any>("/cart", { token }),
  addItem: (productId: string, quantity: number, token: string) =>
    apiRequest<any>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
      token,
    }),
  updateItem: (itemId: string, quantity: number, token: string) =>
    apiRequest<any>(`/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
      token,
    }),
  removeItem: (itemId: string, token: string) =>
    apiRequest<{ message: string }>(`/cart/items/${itemId}`, { method: "DELETE", token }),
  clear: (token: string) =>
    apiRequest<{ message: string }>("/cart", { method: "DELETE", token }),
}

export const ordersApi = {
  create: (address: any, token: string) =>
    apiRequest<any>("/orders", { method: "POST", body: JSON.stringify({ address }), token }),
  list: (params: { page?: number; limit?: number } = {}, token: string) => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append("page", String(params.page))
    if (params.limit) searchParams.append("limit", String(params.limit))
    const query = searchParams.toString()
    return apiRequest<any>(`/orders${query ? `?${query}` : ""}`, { token })
  },
  getById: (id: string, token: string) => apiRequest<any>(`/orders/${id}`, { token }),
  updateStatus: (id: string, status: string, token: string) =>
    apiRequest<any>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      token,
    }),
}

export const reviewsApi = {
  getForProduct: (productId: string) => apiRequest<any>(`/reviews/product/${productId}`),
  create: (productId: string, rating: number, comment: string | undefined, token: string) =>
    apiRequest<any>("/reviews", {
      method: "POST",
      body: JSON.stringify({ productId, rating, comment }),
      token,
    }),
  delete: (id: string, token: string) =>
    apiRequest<{ message: string }>(`/reviews/${id}`, { method: "DELETE", token }),
}

export const usersApi = {
  list: (params: { page?: number; limit?: number } = {}, token: string) => {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.append("page", String(params.page))
    if (params.limit) searchParams.append("limit", String(params.limit))
    const query = searchParams.toString()
    return apiRequest<any>(`/users${query ? `?${query}` : ""}`, { token })
  },
  getById: (id: string, token: string) => apiRequest<any>(`/users/${id}`, { token }),
  updateRole: (id: string, role: string, token: string) =>
    apiRequest<any>(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
      token,
    }),
  updateProfile: (data: any, token: string) =>
    apiRequest<any>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }),
}

export const dashboardApi = {
  getUser: (token: string) => apiRequest<any>("/dashboard", { token }),
  getAdmin: (token: string) => apiRequest<any>("/dashboard/admin", { token }),
  getAnalytics: (token: string) => apiRequest<any>("/dashboard/admin/analytics", { token }),
  getWishlist: (token: string) => apiRequest<any>("/dashboard/wishlist", { token }),
  toggleWishlist: (productId: string, token: string) =>
    apiRequest<any>("/dashboard/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ productId }),
      token,
    }),
}
