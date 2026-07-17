import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      {/* Temporary placeholder header for Phase 1. 
          Will be replaced with proper Sidebar + Topbar in Phase 6. */}
      <header className="sticky top-0 z-40 border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-heading font-semibold">Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
