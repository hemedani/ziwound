import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden pt-32 pb-12">
        <div className="container px-4 md:px-8">
          <Skeleton className="h-4 w-32 mb-6" />
          <Skeleton className="h-px w-10 mb-4" />
          <Skeleton className="h-12 md:h-14 w-3/4 mb-4" />
          <Skeleton className="h-5 w-1/2 mb-6" />
          <div className="flex gap-3 mb-8">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-36 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container mx-auto max-w-7xl px-4 md:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery skeleton */}
            <div className="rounded-2xl glass-light p-6 border border-white/[0.06]">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Skeleton className="md:col-span-2 md:row-span-2 h-[200px] md:h-[320px] rounded-xl" />
                <Skeleton className="h-[150px] rounded-xl" />
                <Skeleton className="h-[150px] rounded-xl" />
                <Skeleton className="h-[150px] rounded-xl" />
              </div>
            </div>

            {/* Description skeleton */}
            <div className="rounded-2xl glass-light p-6 md:p-8 border border-white/[0.06]">
              <Skeleton className="h-6 w-32 mb-5" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Linked report skeleton */}
            <div className="rounded-2xl glass-light p-6 border border-white/[0.06]">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl glass-strong p-5 border border-white/[0.08]">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
