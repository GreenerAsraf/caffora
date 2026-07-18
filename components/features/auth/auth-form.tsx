"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Eye, EyeOff, Globe, Loader2, LockKeyhole, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/providers/auth-provider"
import { DEMO_USERS } from "@/lib/demo-users"
import { loginSchema, registerSchema, type LoginValues, type RegisterValues } from "@/lib/validations/auth"

type Mode = "login" | "register"
type FormValues = LoginValues | RegisterValues

interface AuthFormProps {
  mode: Mode
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isLogin = mode === "login"
  const redirectTo = searchParams.get("next") || "/dashboard"
  const schema = useMemo(() => (isLogin ? loginSchema : registerSchema), [isLogin])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: isLogin ? { email: "", password: "" } : { name: "", email: "", password: "", confirmPassword: "" },
  })

  const { register: registerField, handleSubmit, formState, setValue } = form
  const { errors, isSubmitting } = formState

  const onSubmit = async (values: FormValues) => {
    try {
      if (isLogin) {
        const currentUser = await login(values as LoginValues)
        toast.success("Welcome back to Caffora")
        router.push(currentUser.role === "ADMIN" && redirectTo === "/dashboard" ? "/dashboard/admin" : redirectTo)
      } else {
        const { name, email, password } = values as RegisterValues
        await register({ name, email, password })
        toast.success("Your Caffora account is ready")
        router.push(redirectTo)
      }
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed"
      toast.error(message)
    }
  }

  const fillDemo = (role: "user" | "admin") => {
    const demo = DEMO_USERS[role]
    setValue("email", demo.email, { shouldValidate: true })
    setValue("password", demo.password, { shouldValidate: true })
    if (!isLogin) {
      setValue("name", demo.name, { shouldValidate: true })
      setValue("confirmPassword", demo.password, { shouldValidate: true })
    }
    toast.info(`${demo.role === "ADMIN" ? "Admin" : "User"} demo credentials filled`)
  }

  const title = isLogin ? "Sign in to Caffora" : "Create your Caffora account"
  const description = isLogin ? "Track orders, manage your wishlist, and continue checkout." : "Join Caffora to save favorites, place orders, and manage your profile."

  return (
    <Card className="rounded-2xl border-border/80 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-3 text-center">
        <Link href="/" className="mx-auto flex items-center gap-2 rounded-lg focus-brand" aria-label="Caffora home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground">C</span>
          <span className="font-heading text-2xl font-bold text-foreground">Caffora</span>
        </Link>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-playfair font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Button type="button" variant="outline" className="h-11 w-full gap-2 rounded-full" onClick={() => toast.info("Google sign-in will be connected after OAuth keys are configured.")}>
          <Globe className="h-4 w-4" aria-hidden="true" />
          Continue with Google
        </Button>

        <div className="relative text-center text-xs text-muted-foreground">
          <span className="relative z-10 bg-card px-3">or use email</span>
          <div className="absolute left-0 top-1/2 h-px w-full bg-border" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          {!isLogin ? (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input id="name" autoComplete="name" className="h-11 pl-10" aria-invalid={Boolean("name" in errors && errors.name)} aria-describedby="name-error" {...registerField("name" as keyof FormValues)} />
              </div>
              {"name" in errors && errors.name ? <p id="name-error" className="text-sm text-destructive">{errors.name.message}</p> : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input id="email" type="email" autoComplete="email" className="h-11 pl-10" aria-invalid={Boolean(errors.email)} aria-describedby="email-error" {...registerField("email")} />
            </div>
            {errors.email ? <p id="email-error" className="text-sm text-destructive">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input id="password" type={showPassword ? "text" : "password"} autoComplete={isLogin ? "current-password" : "new-password"} className="h-11 pl-10 pr-10" aria-invalid={Boolean(errors.password)} aria-describedby="password-error" {...registerField("password")} />
              <Button type="button" variant="ghost" size="icon-sm" className="absolute right-2 top-1/2 -translate-y-1/2" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password ? <p id="password-error" className="text-sm text-destructive">{errors.password.message}</p> : null}
          </div>

          {!isLogin ? (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" className="h-11 pl-10 pr-10" aria-invalid={Boolean("confirmPassword" in errors && errors.confirmPassword)} aria-describedby="confirm-password-error" {...registerField("confirmPassword" as keyof FormValues)} />
                <Button type="button" variant="ghost" size="icon-sm" className="absolute right-2 top-1/2 -translate-y-1/2" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"} onClick={() => setShowConfirmPassword((value) => !value)}>
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {"confirmPassword" in errors && errors.confirmPassword ? <p id="confirm-password-error" className="text-sm text-destructive">{errors.confirmPassword.message}</p> : null}
            </div>
          ) : null}

          <Button type="submit" className="h-11 w-full rounded-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="ghost" className="h-10 rounded-full" onClick={() => fillDemo("user")}>Demo user</Button>
          <Button type="button" variant="ghost" className="h-10 rounded-full" onClick={() => fillDemo("admin")}>Demo admin</Button>
        </div>

        {isLogin ? (
          <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            <p>User: {DEMO_USERS.user.email} / {DEMO_USERS.user.password}</p>
            <p>Admin: {DEMO_USERS.admin.email} / {DEMO_USERS.admin.password}</p>
          </div>
        ) : null}

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "New to Caffora?" : "Already have an account?"}{" "}
          <Link className="font-medium text-primary hover:underline" href={isLogin ? "/register" : "/login"}>{isLogin ? "Create an account" : "Sign in"}</Link>
        </p>
      </CardContent>
    </Card>
  )
}
