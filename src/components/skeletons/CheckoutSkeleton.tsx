import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/modules/discovery/layout/Header";

export default function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="py-10 px-4 md:px-8 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Title Loading */}
          <Skeleton className="h-10 w-64 mb-8 bg-gray-200" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Personal Details Skeleton */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                </div>
              </div>

              {/* Delivery Address Skeleton */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              {/* Payment Method Skeleton */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="w-5 h-5 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-16 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Skeleton */}
            <div className="lg:col-span-4">
              <div className="sticky top-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-4 w-10" />
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
