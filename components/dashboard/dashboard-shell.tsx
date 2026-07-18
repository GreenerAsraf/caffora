"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { BarChart3, Boxes, FolderTree, Heart, Home, LayoutDashboard, LogOut, Package, Settings, ShoppingBag, User, Users } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/providers/auth-provider"
import { cn, getInitials } from "@/lib/utils"

const userLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: Package },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

const adminLinks = [
  { href: "/dashboard/admin", label: "Admin Home", icon: BarChart3 },
  { href: "/dashboard/admin/products", label: "Products", icon: Boxes },
  { href: "/dashboard/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, status, logout } = useAuth()

  useEffect(() => {
    if (status === "guest") router.replace("/login?next=/dashboard")
  }, [router, status])

  useEffect(() => {
    if (!user) return
    if (pathname.startsWith("/dashboard/admin") && user.role !== "ADMIN") {
      toast.error("Admin access is required.")
      router.replace("/dashboard")
    }
  }, [pathname, router, user])

  if (status === "loading" || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Loading dashboard...</div>
  }

  const links = user.role === "ADMIN" ? adminLinks : userLinks

  const handleLogout = async () => {
    await logout()
    toast.success("Signed out successfully")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-muted/20 lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-border bg-background lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">C</div>
            <div>
              <p className="font-playfair text-xl font-bold">Caffora</p>
              <p className="text-xs text-muted-foreground">{user.role === "ADMIN" ? "Admin workspace" : "Customer dashboard"}</p>
            </div>
          </div>

          <nav className="mt-6 grid gap-1" aria-label="Dashboard navigation">
            {links.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <Separator className="my-5" />

          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <Home className="h-4 w-4" /> Storefront
          </Link>
          <Link href="/products" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <ShoppingBag className="h-4 w-4" /> Products
          </Link>

          <div className="mt-auto hidden pt-6 lg:block">
            <div className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center gap-3">
                <Avatar><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Signed in as {user.role.toLowerCase()}</p>
              <h1 className="font-playfair text-2xl font-bold">{user.role === "ADMIN" ? "Admin Dashboard" : "My Dashboard"}</h1>
            </div>
            <div className="flex items-center gap-3">
              <Avatar><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar>
              <Button variant="outline" className="hidden sm:inline-flex" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
