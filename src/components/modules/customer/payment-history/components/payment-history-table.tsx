import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { generateInvoicePDF } from "@/utils/InvoicePDF";

interface PaymentHistoryTableProps {
    orders: any[];
    loading: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    startIndex: number;
    itemsPerPage: number;
}

export function PaymentHistoryTable({
    orders,
    loading,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    itemsPerPage,
}: PaymentHistoryTableProps) {
    const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const columns: Column<any>[] = [
        {
            header: "DESCRIPTION",
            headerClassName: "text-[10px] font-bold tracking-wider text-[#64748B] uppercase min-w-[200px]",
            className: "py-4",
            cell: (order) => {
                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null;
                let imageUrl = null;
                if (firstItem?.image) {
                    imageUrl = firstItem.image.startsWith("http")
                        ? firstItem.image
                        : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${firstItem.image.replace(/\\/g, "/")}`;
                }

                return (
                    <div className="flex items-center gap-3">
                        {imageUrl ? (
                            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-100">
                                <Image
                                    width={36}
                                    height={36}
                                    src={imageUrl}
                                    alt={firstItem?.name || "Item"}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0" />
                        )}
                        <div className="flex flex-col">
                            <span className="font-bold text-[#1E293B] text-[15px] line-clamp-1">
                                {firstItem?.name || "Order Component"}
                                {order.items?.length > 1 && ` +${order.items.length - 1} more`}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "DATE",
            headerClassName: "text-[10px] font-bold tracking-wider text-[#64748B] uppercase min-w-[150px]",
            cell: (order) => (
                <span className="text-[15px] font-medium text-[#64748B]">
                    {order.orderDate} • {order.orderTime}
                </span>
            ),
        },
        {
            header: "METHOD",
            headerClassName: "text-[10px] font-bold tracking-wider text-[#64748B] uppercase min-w-[120px]",
            cell: (order) => {
                const method = order.paymentMethod?.toLowerCase() === "card"
                    ? "Visa"
                    : order.paymentMethod?.toLowerCase() === "cod"
                        ? "Cash"
                        : order.paymentMethod;
                const details = order.paymentDetails?.cardNumber && order.paymentDetails?.cardNumber !== "N/A"
                    ? ` •• ${order.paymentDetails.cardNumber.slice(-4)}`
                    : "";

                return (
                    <span className="text-[15px] font-medium text-[#4B5563]">
                        {method}{details}
                    </span>
                );
            },
        },
        {
            header: "AMOUNT",
            headerClassName: "text-[10px] font-bold tracking-wider text-[#64748B] uppercase min-w-[100px]",
            cell: (order) => {
                const isRefund = order.status === "refunded";
                return (
                    <span
                        className={`text-[15px] font-black ${isRefund ? "text-[#10b981]" : "text-[#1E293B]"}`}
                    >
                        {isRefund ? "+" : ""}${Number(order.totalAmount || 0).toFixed(2)}
                    </span>
                )
            },
        },
        {
            header: "RECEIPT",
            headerClassName: "text-[10px] font-bold tracking-wider text-[#64748B] uppercase text-right w-[80px]",
            className: "text-right",
            cell: (order) =>
                order.status !== "refunded" && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            generateInvoicePDF(order);
                        }}
                        className="h-[26px] px-3 rounded-md border border-gray-200 text-[#1E293B] font-bold text-[10px] hover:bg-gray-50 flex items-center justify-center ml-auto shadow-sm"
                    >
                        <span>PDF</span>
                    </Button>
                ),
        },
    ];

    return (
        <Card className="rounded-[24px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden bg-white">
            <CardHeader className="border-b border-gray-100 pt-6 pb-6 px-8 flex flex-row items-center justify-between">
                <CardTitle className="text-[16px] font-bold text-[#1E293B]">
                    Transactions
                </CardTitle>
                <div className="flex items-center gap-2">
                    {["All", "Cards", "Cash"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all shadow-sm ${activeTab === tab
                                    ? "bg-[#f0fdf4] text-[#10b981] border border-[#10b981]"
                                    : "text-[#6B7280] bg-white hover:text-[#374151] border border-gray-100"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="p-0 relative pb-16 overflow-x-auto w-full">
                <div className="min-w-[600px]">
                    <GlobalTable
                        data={currentOrders}
                        columns={columns}
                        loading={loading}
                        emptyMessage="No transactions found"
                        rowClassName={(order) => order.status === "refunded" ? "bg-[#f0fdf4]" : ""}
                    />
                </div>

                {/* pagination */}
                {!loading && orders.length > 0 && (
                    <div className="absolute bottom-5 left-8 right-8 flex items-center justify-between pointer-events-none">
                        <span className="text-[12px] text-gray-400 font-medium">
                            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, orders.length)} of {orders.length}
                        </span>

                        {totalPages > 1 && (
                            <div className="flex gap-2 items-center pointer-events-auto">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50 border border-gray-100 bg-white shadow-sm font-bold text-[12px]"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm font-bold text-[12px] transition ${currentPage === page ? "text-white bg-[#225539]" : "text-[#4B5563] bg-white border border-gray-100 hover:text-gray-900"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50 border border-gray-100 bg-white shadow-sm font-bold text-[12px]"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
