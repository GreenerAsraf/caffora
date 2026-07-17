"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { NAV_LINKS_PUBLIC, SITE_INFO } from "@/lib/constants"
import { cn } from "@/lib/utils"

// ─── Mock session state (replace with real auth later) ────────────────────────
const MOCK_USER = null as null | { name: string; email: string; avatar?: string; role: "USER" | "ADMIN" }
const MOCK_CART_COUNT = 0

export function NavbarClient() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const user = MOCK_USER
  const cartCount = MOCK_CART_COUNT

  // Track scroll for shadow effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
      {/* Desktop Navigation Links */}
      <nav
        className="hidden md:flex items-center gap-1 mr-2"
        aria-label="Main navigation"
      >
        {NAV_LINKS_PUBLIC.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 focus-brand",
              isActive(link.href)
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            aria-current={isActive(link.href) ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Theme Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger render={
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        } />
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 cursor-pointer">
            <Sun className="h-4 w-4" /> Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 cursor-pointer">
            <Moon className="h-4 w-4" /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 cursor-pointer">
            <Monitor className="h-4 w-4" /> System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Wishlist */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden sm:flex h-9 w-9 rounded-lg relative"
        aria-label="Wishlist"
        render={<Link href={user ? "/dashboard/wishlist" : "/login"} />}
      >
        <Heart className="h-4 w-4" />
      </Button>

      {/* Cart */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg relative"
        aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
        render={<Link href="/cart" />}
      >
        <ShoppingCart className="h-4 w-4" />
          {cartCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0"
              aria-hidden="true"
            >
              {cartCount > 99 ? "99+" : cartCount}
            </Badge>
          )}
      </Button>

      {/* User / Auth */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button
              variant="ghost"
              className="hidden md:flex items-center gap-2 h-9 px-2 rounded-lg"
              aria-label="User menu"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium max-w-[100px] truncate">
                {user.name.split(" ")[0]}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          } />
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-sm">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/dashboard" className="gap-2 cursor-pointer" />}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/orders" className="gap-2 cursor-pointer" />}>
              <Package className="h-4 w-4" /> My Orders
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/profile" className="gap-2 cursor-pointer" />}>
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/dashboard/settings" className="gap-2 cursor-pointer" />}>
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          render={<Link href="/login" />}
          size="sm"
          className="hidden md:flex h-9 bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
        >
          <LogIn className="h-3.5 w-3.5" />
          Sign In
        </Button>
      )}

      {/* Mobile Menu */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-lg"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        } />
        <SheetContent side="right" className="w-72 p-0">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle className="text-left font-heading">
              {SITE_INFO.name}
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 p-4" aria-label="Mobile navigation">
            {NAV_LINKS_PUBLIC.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}

            <Separator className="my-2" />

            <Link
              href="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
                  {cartCount}
                </Badge>
              )}
            </Link>

            <Link
              href={user ? "/dashboard/wishlist" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>

            <Separator className="my-2" />

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <button className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
