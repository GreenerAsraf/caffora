"use client"

import { RefreshCcw, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <EmptyState
      icon={LayoutDashboard}
      title="Dashboard could not load"
      description="Your dashboard data did not finish loading. Retry to reconnect to the latest account and order information."
      action={
        <Button onClick={() => reset()} className="gap-2 rounded-full">
          <RefreshCcw className="h-4 w-4" />
          Try again
        </Button>
      }
    />
  )
}
