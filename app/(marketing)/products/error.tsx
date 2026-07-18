"use client"

import { RefreshCcw, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export default function ProductsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <EmptyState
          icon={ShoppingBag}
          title="Products could not load"
          description="The catalog is temporarily unavailable. Refresh the section to try fetching the latest products again."
          action={
            <Button onClick={() => reset()} className="gap-2 rounded-full">
              <RefreshCcw className="h-4 w-4" />
              Try again
            </Button>
          }
        />
      </div>
    </div>
  )
}
