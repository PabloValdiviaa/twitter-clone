import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-[53px] items-center gap-4 px-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Banner */}
      <Skeleton className="h-[200px] w-full rounded-none" />

      {/* Profile info */}
      <div className="px-4 pb-3">
        <div className="flex items-end justify-between">
          <Skeleton className="-mt-[68px] h-[134px] w-[134px] rounded-full border-4 border-background" />
          <Skeleton className="mt-3 h-9 w-28 rounded-full" />
        </div>
        <div className="mt-3 space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="mt-3 flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex h-[53px] border-b border-border">
        <Skeleton className="h-full flex-1" />
        <Skeleton className="h-full flex-1" />
        <Skeleton className="h-full flex-1" />
      </div>

      {/* Posts */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-b border-border px-4 py-3">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
