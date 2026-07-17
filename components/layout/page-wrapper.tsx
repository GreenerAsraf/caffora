import { cn } from "@/lib/utils"

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  noPadding?: boolean
}

export function PageWrapper({ children, className, noPadding = false, ...props }: PageWrapperProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl",
        !noPadding && "px-4 sm:px-6 lg:px-8 py-8 md:py-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
