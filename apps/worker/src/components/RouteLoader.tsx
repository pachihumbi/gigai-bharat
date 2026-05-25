import { Skeleton } from "@/components/ui/skeleton";

export function RouteLoader() {
  return (
    <div className="min-h-screen bg-gradient-hero px-4 pb-36 pt-6">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="mt-2 h-4 w-64 rounded" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    </div>
  );
}
