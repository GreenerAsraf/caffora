"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  ShoppingCart,
  Heart,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  User,
  LogIn,
  LogOut,
  LayoutDashboard,
  Package,
  Settings,
  ChevronDown,
  UserPlus,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "@/components/providers/theme-provider"
import { useAuth } from "@/components/providers/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { NAV_LINKS_PUBLIC, SITE_INFO } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function NavbarClient() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const { user, status, logout } = useAuth()
  const { itemCount } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const cartCount = itemCount
  const isGuest = status !== "authenticated" || !user

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    setIsLoggingOut(false)
    setMobileOpen(false)
    toast.success("Signed out successfully")
    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
      <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
        {NAV_LINKS_PUBLIC.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 focus-brand",
              isActive(link.href)
                ? "bg-primary/10 font-semibold text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            aria-current={isActive(link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" aria-label="Toggle theme">
              {resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer gap-2">
            <Sun className="h-4 w-4" /> Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer gap-2">
            <Moon className="h-4 w-4" /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer gap-2">
            <Monitor className="h-4 w-4" /> System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="relative hidden h-9 w-9 rounded-lg sm:flex"
        aria-label="Wishlist"
        render={<Link href={user ? "/dashboard/wishlist" : "/login?next=/dashboard/wishlist"} />}
      >
        <Heart className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-lg"
        aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
        render={<Link href="/cart" />}
      >
        <ShoppingCart className="h-4 w-4" />
        {cartCount > 0 ? (
          <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center border-0 bg-primary p-0 text-[10px] text-primary-foreground" aria-hidden="true">
            {cartCount > 99 ? "99+" : cartCount}
          </Badge>
        ) : null}
      </Button>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="hidden h-9 items-center gap-2 rounded-lg px-2 md:flex" aria-label="User menu">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[100px] truncate text-sm font-medium">{user.name.split(" ")[0]}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard"} className="cursor-pointer gap-2" />}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/orders" className="cursor-pointer gap-2" />}>
              <Package className="h-4 w-4" /> My Orders
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/profile" className="cursor-pointer gap-2" />}>
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/settings" className="cursor-pointer gap-2" />}>
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="hidden items-center gap-2 md:flex">
          <Button render={<Link href="/login" />} size="sm" variant="outline" className="h-9 gap-1.5 rounded-full">
            <LogIn className="h-3.5 w-3.5" />
            Sign In
          </Button>
          <Button render={<Link href="/register" />} size="sm" className="h-9 gap-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <UserPlus className="h-3.5 w-3.5" />
            Sign Up
          </Button>
        </div>
      )}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg md:hidden" aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          }
        />
        <SheetContent side="right" className="w-72 p-0">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="text-left font-heading">{SITE_INFO.name}</SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
            {NAV_LINKS_PUBLIC.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            <Separator className="my-2" />

            <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 ? <Badge className="ml-auto flex h-5 min-w-5 items-center justify-center border-0 bg-primary px-1 text-[10px] text-primary-foreground">{cartCount}</Badge> : null}
            </Link>

            <Link href={user ? "/dashboard/wishlist" : "/login?next=/dashboard/wishlist"} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>

            <Separator className="my-2" />

            {isGuest ? (
              <div className="grid gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  <UserPlus className="h-4 w-4" /> Sign Up
                </Link>
              </div>
            ) : (
              <>
                <Link href={user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard"} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button type="button" disabled={isLoggingOut} onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
