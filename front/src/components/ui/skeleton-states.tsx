import * as React from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface SkeletonListProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  itemClassName?: string
}

export function SkeletonList({
  count = 6,
  className,
  itemClassName,
  ...props
}: SkeletonListProps) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("flex flex-col space-y-3 rounded-xl border p-4", itemClassName)}
        >
          <Skeleton className="h-[125px] w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
          <div className="pt-4 flex items-center justify-between">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rowCount?: number
  columnCount?: number
}

export function SkeletonTable({
  rowCount = 5,
  columnCount = 5,
  className,
  ...props
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-md border", className)} {...props}>
      {/* Table Header Skeleton */}
      <div className="border-b bg-muted/50 p-4">
        <div className="flex items-center gap-4">
          {Array.from({ length: columnCount }).map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-4 flex-1" />
          ))}
        </div>
      </div>

      {/* Table Body Skeletons */}
      <div className="divide-y">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex items-center gap-4 p-4">
            {Array.from({ length: columnCount }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                className={cn(
                  "h-4 flex-1",
                  // Make some columns slightly different widths randomly for a more natural look
                  colIndex === 0 ? "max-w-[100px]" :
                  colIndex === columnCount - 1 ? "max-w-[80px]" : ""
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
