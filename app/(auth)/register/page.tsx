import { Suspense } from "react"
import type { Metadata } from "next"
import { AuthForm } from "@/components/features/auth/auth-form"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Caffora account to save favorites, track orders, and shop faster.",
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[640px] w-full rounded-2xl" />}>
      <AuthForm mode="register" />
    </Suspense>
  )
}
