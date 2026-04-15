import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title?: string
  description?: string
  action?: React.ReactNode
  onRetry?: () => void
  retryText?: string
}

export function ErrorState({
  icon: Icon = AlertCircle,
  title = "Something went wrong",
  description = "We encountered an error while loading this data. Please try again.",
  action,
  onRetry,
  retryText = "Try Again",
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-destructive/20 bg-destructive/5 p-8 text-center animate-in fade-in-50",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <Icon className="h-10 w-10 text-destructive" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
          {description}
        </p>
      )}
      <div className="mt-4 flex gap-4 justify-center">
        {action}
        {!action && onRetry && (
          <Button variant="default" onClick={onRetry}>
            {retryText}
          </Button>
        )}
      </div>
    </div>
  )
}
