import { Skeleton } from "@/components/ui/skeleton";

export default function WarCriminalsLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-4 w-32 bg-white/10" />
          <Skeleton className="h-10 w-64 bg-white/10" />
          <Skeleton className="h-5 w-96 max-w-full bg-white/10" />
        </div>

        <div className="mb-8 rounded-2xl glass-light p-5 border border-white/[0.06]">
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-64 bg-white/10" />
            <Skeleton className="h-10 w-40 bg-white/10" />
            <Skeleton className="h-10 w-48 bg-white/10" />
            <Skeleton className="h-10 w-40 bg-white/10" />
            <Skeleton className="h-10 w-24 bg-white/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl glass-light border border-white/[0.06] overflow-hidden">
              <div className="relative aspect-[4/3] bg-white/5">
                <Skeleton className="w-full h-full bg-white/10" />
              </div>
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4 bg-white/10" />
                <Skeleton className="h-4 w-1/3 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <div className="flex gap-1">
                  <Skeleton className="h-4 w-12 bg-white/10" />
                  <Skeleton className="h-4 w-12 bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
