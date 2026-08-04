import { Skeleton, HeaderSkeleton } from "@/components/ui/Skeleton";

export default function BuscaLoading() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper sm:max-w-2xl lg:max-w-5xl xl:max-w-6xl">
      <HeaderSkeleton />

      <div className="px-4 pt-3">
        <Skeleton className="h-[52px] w-full rounded-2xl" />
      </div>

      <div className="px-4 pt-6">
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
