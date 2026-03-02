import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6">
      {/* Skeleton Header */}
      <div className="bg-gray-100 rounded-2xl h-24 w-full animate-pulse"></div>

      {/* Skeleton Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm h-[130px] flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Skeleton Chart */}
          <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm h-[360px] animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="w-full h-[280px] bg-gray-50 rounded"></div>
          </div>
        </div>
        {/* Skeleton Activity */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm h-[360px] animate-pulse">
            <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0"></div>
                  <div className="flex flex-col gap-2 w-full mt-1">
                    <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton Table (Full Width) */}
      <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm min-h-[300px] w-full animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-12 bg-gray-50 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
