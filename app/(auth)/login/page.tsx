import { Suspense } from "react"
import type { Metadata } from "next"
import { AuthForm } from "@/components/features/auth/auth-form"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Caffora account to manage orders, wishlist, and checkout.",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[560px] w-full rounded-2xl" />}>
      <AuthForm mode="login" />
    </Suspense>
  )
}
