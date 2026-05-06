import { Skeleton } from "@/components/ui/skeleton";

export default function PublicPageLoading() {
  return (
    <div className="space-y-16">
      {/* Hero Section Skeleton */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-crimson/5 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 md:px-6 text-center space-y-6">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-12 md:h-16 w-3/4 max-w-3xl mx-auto" />
          <Skeleton className="h-6 w-2/3 max-w-2xl mx-auto" />
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-36 rounded-lg" />
            <Skeleton className="h-12 w-36 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl glass-light p-6 border border-white/[0.06] space-y-4"
            >
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
