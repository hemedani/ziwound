import { Skeleton } from "@/components/ui/skeleton";

export default function WarCrimesLoading() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Skeleton className="h-px w-12" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-px w-12" />
        </div>
        <Skeleton className="h-10 md:h-12 w-72 mx-auto" />
        <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl bg-white/[0.02] border border-white/[0.06] p-1 gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      <div className="rounded-2xl glass-light p-5 border border-white/[0.06] space-y-4">
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 flex-1 min-w-[180px] rounded-lg" />
          <Skeleton className="h-10 flex-1 min-w-[180px] rounded-lg" />
          <Skeleton className="h-10 flex-1 min-w-[180px] rounded-lg" />
          <Skeleton className="h-10 flex-1 min-w-[180px] rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map / List placeholder */}
          <div className="rounded-2xl glass-light p-5 border border-white/[0.06] min-h-[400px] space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>

          {/* List Cards */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl glass-light p-5 border border-white/[0.06] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex items-center gap-4 pt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <div className="rounded-2xl glass-light p-5 border border-white/[0.06] space-y-4">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl glass-light p-5 border border-white/[0.06] space-y-4">
            <Skeleton className="h-5 w-28" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    {i < 3 && <Skeleton className="w-px h-8" />}
                  </div>
                  <div className="space-y-1 pb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
