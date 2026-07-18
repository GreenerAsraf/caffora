import { ProductGridSkeleton } from "@/components/skeletons/product-grid-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <Skeleton className="h-11 w-72" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <div className="flex flex-col gap-8 md:flex-row">
          <aside className="w-full shrink-0 space-y-4 md:w-64">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </aside>
          <main className="flex-1 space-y-6">
            <Skeleton className="h-11 w-full" />
            <ProductGridSkeleton />
          </main>
        </div>
      </div>
    </div>
  )
}
