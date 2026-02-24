import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-60" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2 border-b border-gray-100 pb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        {/* Table Header */}
        <div className="flex gap-4 mb-4 border-b border-gray-100 pb-2">
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[120px]" />
          <div className="flex-1" />
          <Skeleton className="h-4 w-[60px]" />
        </div>

        {/* Rows */}
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-b-0"
          >
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-9 w-[120px]" />
            <span className="text-gray-200">to</span>
            <Skeleton className="h-9 w-[120px]" />
            <div className="flex-1" />
            <Skeleton className="h-6 w-[40px] rounded-full" />
          </div>
        ))}

        {/* Button */}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-11 w-40" />
        </div>
      </div>
    </div>
  );
}
