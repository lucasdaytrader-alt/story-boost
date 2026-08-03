import { Skeleton, ElementCardSkeleton } from "@/components/ui/Skeleton";

export default function PackDetailLoading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper">
      <div className="flex items-center gap-2 px-2 py-2">
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      <div className="px-4 pb-3">
        <Skeleton className="mb-3.5 h-36 w-full rounded-3xl" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 shrink-0 rounded-full" />
        ))}
      </div>

      <section className="grid grid-cols-2 gap-3 px-4 pb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <ElementCardSkeleton key={i} />
        ))}
      </section>
    </div>
  );
}
