import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceSkeleton() {
    return (
        <div className="w-full max-w-[1200px] mx-auto pb-12 space-y-6">
            {/* Header Actions */}
            <div className="flex justify-end items-center gap-3 pt-1">
                <Skeleton className="h-9 w-[140px] rounded-md" />
                <Skeleton className="h-9 w-[100px] rounded-md" />
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-gray-100 shadow-sm bg-white">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-9 w-9 rounded-xl" />
                            </div>
                            <div className="space-y-2 mt-4">
                                <Skeleton className="h-8 w-32" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Revenue Trend + Payment Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Revenue Chart */}
                <Card className="lg:col-span-3 border-gray-100 shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-60 mt-1" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-5 mb-4 mt-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="w-full h-[200px] rounded-lg mt-4" />
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="lg:col-span-2 border-gray-100 shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center mb-6 mt-4">
                            <Skeleton className="h-[160px] w-[160px] rounded-full" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-4 w-8" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tax & Commissions + Payouts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-100 shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-40 mt-1" />
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            ))}
                        </div>
                        <Skeleton className="h-[48px] w-full rounded-xl mt-4" />
                    </CardContent>
                </Card>

                <Card className="border-gray-100 shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-4 w-48 mt-1" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                    </CardHeader>
                    <CardContent className="mt-4">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-px w-full" />
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
