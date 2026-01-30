import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex h-[53px] items-center px-4">
          <Skeleton className="h-6 w-28" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex h-[53px] border-b border-border">
        <Skeleton className="h-full flex-1" />
        <Skeleton className="h-full flex-1" />
      </div>

      {/* Notification skeletons */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 border-b border-border px-4 py-3">
          <Skeleton className="h-5 w-5 shrink-0 mt-1" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
