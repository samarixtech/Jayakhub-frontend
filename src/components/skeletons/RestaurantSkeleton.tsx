import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 w-full border-b border-gray-100 bg-white" />

      {/* Hero Section Skeleton */}
      <div className="w-full relative">
        {/* Banner Image */}
        <Skeleton className="h-[250px] md:h-[350px] w-full rounded-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20 md:-mt-24 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            {/* Profile Image */}
            <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-lg shrink-0" />

            <div className="flex-1 w-full text-center md:text-left flex flex-col items-center md:items-start gap-3">
              <div className="flex flex-col md:flex-row md:items-center gap-2 w-full justify-center md:justify-start">
                {/* Name */}
                <Skeleton className="h-8 w-3/4 md:w-1/3" />
                {/* Badge */}
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Tags */}
              <Skeleton className="h-4 w-1/2 md:w-1/4" />

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-4 w-full">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Categories Skeleton */}
        <div className="sticky top-[80px] z-30 bg-white py-2 mb-6 border-b border-gray-100 flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-10">
            {/* Category Section Skeleton */}
            <div>
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 rounded-xl border border-gray-100 overflow-hidden flex"
                  >
                    <Skeleton className="w-32 h-full shrink-0" />
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
