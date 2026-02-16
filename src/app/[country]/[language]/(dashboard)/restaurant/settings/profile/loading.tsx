import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2 border-b border-gray-100 pb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>

        {/* Image Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Cuisines */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-24" />
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-11 w-36" />
        </div>
      </div>
    </div>
  );
}
