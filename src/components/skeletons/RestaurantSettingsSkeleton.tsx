import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 space-y-6 animate-pulse">
            {/* Header */}
            <div className="space-y-2 border-b border-gray-100 pb-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
            </div>

            {/* Input Rows Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-11 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-11 w-full" />
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-32 w-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-11 w-full" />
                </div>
            </div>

            {/* Footer/Button */}
            <div className="flex justify-end pt-6 mt-4 border-t border-gray-100">
                <Skeleton className="h-11 w-36" />
            </div>
        </div>
    );
}
