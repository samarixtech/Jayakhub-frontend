import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// ==========================================
// 1. PROFILE SKELETON
// ==========================================
export function ProfileSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start animate-in fade-in duration-500">
            {/* Sidebar Skeleton */}
            <aside className="lg:col-span-4 w-full space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                    <CardContent className="p-6 text-center">
                        <div className="relative mx-auto mb-4">
                            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4 space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-10 w-full rounded-lg" />
                        ))}
                    </CardContent>
                </Card>
            </aside>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-8 space-y-6 w-full">
                {/* Personal Info Card */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-gray-100 pb-4">
                        <Skeleton className="h-6 w-1/3" />
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// ==========================================
// 2. ORDERS SKELETON
// ==========================================
export function OrdersSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Filters Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-24 rounded-full" />
                    <Skeleton className="h-10 w-28 rounded-full" />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-2 pl-6 shadow-sm flex items-center gap-6 mb-8">
                <Skeleton className="h-5 w-16" />
                <div className="flex gap-4">
                    <Skeleton className="h-5 w-20 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                </div>
            </div>

            {/* Order Cards List */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row items-center p-5 gap-6">
                                {/* Left: Image & Info */}
                                <div className="flex items-center gap-4 w-full md:w-[35%]">
                                    <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>

                                {/* Middle: Items Summary */}
                                <div className="hidden md:block w-[30%]">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                </div>

                                {/* Right: Status & Actions */}
                                <div className="flex items-center justify-end gap-6 w-full md:w-[35%] ml-auto">
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-16" />
                                    <Skeleton className="h-9 w-24 rounded-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// ==========================================
// 3. ADDRESSES SKELETON
// ==========================================
export function AddressesSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-11 w-32 rounded-full" />
                </div>
            </div>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardContent className="p-0">
                    {/* Mock Table Header */}
                    <div className="grid grid-cols-2 md:grid-cols-5 p-4 border-b border-gray-100 gap-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full hidden md:block" />
                        <Skeleton className="h-4 w-full hidden md:block" />
                        <Skeleton className="h-4 w-full hidden md:block" />
                    </div>
                    {/* Mock Table Rows */}
                    {[1, 2, 3, 4].map((row) => (
                        <div key={row} className="grid grid-cols-2 md:grid-cols-5 p-4 gap-4 items-center border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            </div>
                            <div className="flex justify-end md:hidden">
                                <Skeleton className="h-8 w-16 rounded-lg" />
                            </div>
                            <div className="space-y-1 hidden md:block">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>
                            <Skeleton className="h-6 w-16 rounded-lg hidden md:block" />
                            <div className="hidden md:flex justify-end gap-2">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <Skeleton className="h-9 w-9 rounded-full" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

// ==========================================
// 4. BILLING SKELETON
// ==========================================
export function BillingSkeleton() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] p-5">
            <div className="max-w-full mx-auto animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <Skeleton className="h-8 w-32 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 one-rounded-full" />
                        <Skeleton className="h-11 w-32 rounded-full" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                        <Skeleton className="h-3 w-24 mb-4" />
                        <Skeleton className="h-10 w-40" />
                    </Card>
                    <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                        <Skeleton className="h-3 w-24 mb-4" />
                        <Skeleton className="h-10 w-40" />
                    </Card>
                </div>

                {/* Transactions Table Skeleton */}
                <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                    <div className="px-8 flex justify-between items-center border-b border-gray-50 h-[88px]">
                        <Skeleton className="h-7 w-32" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-16 rounded-lg" />
                            <Skeleton className="h-8 w-16 rounded-lg" />
                            <Skeleton className="h-8 w-16 rounded-lg" />
                        </div>
                    </div>

                    <div className="p-0">
                        <div className="grid grid-cols-2 md:grid-cols-5 px-8 py-3 border-b border-gray-50 bg-white">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-3 w-16 hidden md:block" />
                            <Skeleton className="h-3 w-16 hidden md:block" />
                            <Skeleton className="h-3 w-16 hidden md:block" />
                            <Skeleton className="h-3 w-16 ml-auto" />
                        </div>
                        {[1, 2, 3, 4].map((row) => (
                            <div key={row} className="grid grid-cols-2 md:grid-cols-5 items-center px-8 py-4 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-3 w-24 hidden md:block" />
                                <Skeleton className="h-3 w-24 hidden md:block" />
                                <Skeleton className="h-4 w-16 font-bold hidden md:block" />
                                <Skeleton className="h-7 w-12 rounded-lg ml-auto" />
                            </div>
                        ))}
                    </div>

                    {/* Footer / Pagination */}
                    <div className="p-6 border-t border-gray-50 flex justify-between items-center">
                        <Skeleton className="h-3 w-32" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

// ==========================================
// 5. WALLET SKELETON
// ==========================================
export function WalletSkeleton() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-11 w-40 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4 w-full">
                        <Skeleton className="aspect-[1.586/1] w-full rounded-2xl" />
                        <div className="flex gap-3">
                            <Skeleton className="h-9 flex-1 rounded-xl" />
                            <Skeleton className="h-9 flex-1 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
// ==========================================
// 6. PAYMENT HISTORY SKELETON
// ==========================================
export function PaymentHistorySkeleton() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] py-4 md:p-6 transition-all">
            <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-24 rounded-full" />
                </div>

                {/* Transactions Card Skeleton */}
                <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
                    <div className="p-6 border-b border-gray-100">
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <div className="p-0">
                        {/* Table Header */}
                        <div className="grid grid-cols-2 md:grid-cols-6 p-4 border-b border-gray-100 gap-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full hidden md:block" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full hidden md:block" />
                            <Skeleton className="h-4 w-full hidden md:block" />
                            <Skeleton className="h-4 w-full hidden md:block" />
                        </div>
                        {/* Table Rows */}
                        {[1, 2, 3, 4, 5].map((row) => (
                            <div key={row} className="grid grid-cols-2 md:grid-cols-6 p-4 gap-4 items-center border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                    <div className="space-y-2 hidden md:block">
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                                <div className="space-y-2 hidden md:block">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16 md:hidden" />
                                </div>
                                <div className="space-y-1 hidden md:block">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-4 w-16 hidden md:block" />
                                <div className="flex justify-end">
                                    <Skeleton className="h-8 w-24 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
