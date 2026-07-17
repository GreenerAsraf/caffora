import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface border border-border shadow-sm">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] w-full bg-muted">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-4 bg-card">
        {/* Category */}
        <Skeleton className="mb-2 h-3 w-16" />
        
        {/* Title */}
        <Skeleton className="mb-2 h-5 w-3/4" />
        
        {/* Rating */}
        <Skeleton className="mt-1.5 h-3 w-24" />

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-8 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
