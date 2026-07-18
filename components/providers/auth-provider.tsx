"use client"

/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { authApi } from "@/lib/api"
import { getDemoUser } from "@/lib/demo-users"
import type { User } from "@/types"

type AuthStatus = "loading" | "authenticated" | "guest"

interface AuthContextValue {
  user: User | null
  accessToken: string | null
  status: AuthStatus
  login: (values: { email: string; password: string }) => Promise<User>
  register: (values: { name: string; email: string; password: string }) => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const TOKEN_KEY = "caffora-access-token"
const DEMO_USER_KEY = "caffora-demo-user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  useEffect(() => {
    let active = true
    const storedDemoUser = localStorage.getItem(DEMO_USER_KEY)
    const storedToken = localStorage.getItem(TOKEN_KEY)

    if (storedDemoUser) {
      try {
        const demoUser = JSON.parse(storedDemoUser) as User
        setUser(demoUser)
        setAccessToken(storedToken)
        setStatus("authenticated")
        return () => {
          active = false
        }
      } catch {
        localStorage.removeItem(DEMO_USER_KEY)
      }
    }

    setAccessToken(storedToken)
    authApi
      .me(storedToken)
      .then((currentUser) => {
        if (!active) return
        setUser(currentUser)
        setStatus("authenticated")
      })
      .catch(() => {
        if (!active) return
        localStorage.removeItem(TOKEN_KEY)
        setAccessToken(null)
        setUser(null)
        setStatus("guest")
      })

    return () => {
      active = false
    }
  }, [])

  const commitSession = useCallback((currentUser: User, token: string, demo = false) => {
    localStorage.setItem(TOKEN_KEY, token)
    if (demo) localStorage.setItem(DEMO_USER_KEY, JSON.stringify(currentUser))
    else localStorage.removeItem(DEMO_USER_KEY)
    setAccessToken(token)
    setUser(currentUser)
    setStatus("authenticated")
    return currentUser
  }, [])

  const login = useCallback(
    async (values: { email: string; password: string }) => {
      const demoUser = getDemoUser(values.email, values.password)
      if (demoUser) {
        return commitSession(demoUser, `demo-token-${demoUser.role.toLowerCase()}`, true)
      }

      const payload = await authApi.login(values)
      return commitSession(payload.user, payload.accessToken)
    },
    [commitSession]
  )

  const register = useCallback(
    async (values: { name: string; email: string; password: string }) => {
      const payload = await authApi.register(values)
      return commitSession(payload.user, payload.accessToken)
    },
    [commitSession]
  )

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => undefined)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(DEMO_USER_KEY)
    setAccessToken(null)
    setUser(null)
    setStatus("guest")
  }, [])

  const value = useMemo(
    () => ({ user, accessToken, status, login, register, logout }),
    [accessToken, login, logout, register, status, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
