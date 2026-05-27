import { SkeletonList } from "@/components/ui/skeleton-states";

export default function CountriesLoading() {
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-wrap gap-3 w-full items-start sm:items-center">
        <div className="h-10 w-full sm:w-64 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-10 w-20 rounded-lg bg-white/5 animate-pulse" />
      </div>

      <div className="relative overflow-hidden rounded-2xl glass-light border border-white/[0.06] p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
            <div className="h-8 w-64 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-96 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="h-10 w-40 rounded-lg bg-white/5 animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>

      <SkeletonList count={6} />
    </div>
  );
}
