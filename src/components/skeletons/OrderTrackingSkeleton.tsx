import { Skeleton } from "@/components/ui/skeleton";

export default function OrderTrackingSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="flex justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Skeleton className="w-full h-[300px] rounded-2xl" />
            <Skeleton className="w-full h-[300px] rounded-2xl" />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Skeleton className="w-full h-[120px] rounded-2xl" />
            <Skeleton className="w-full h-[300px] rounded-2xl" />
            <Skeleton className="w-full h-[150px] rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
