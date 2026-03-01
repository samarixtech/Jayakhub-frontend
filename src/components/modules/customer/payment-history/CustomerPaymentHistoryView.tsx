"use client";

import { useState, useEffect } from "react";
import {
  FileDown,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  CreditCard,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { generateInvoicePDF } from "@/utils/InvoicePDF";
import Image from "next/image";

import { PaymentHistorySkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";

export default function CustomerPaymentHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Tabs for transaction table
  const [activeTab, setActiveTab] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Design shows ~4 rows

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { getAllOrders } = await import("@/app/actions/customer/order");
        const res = await getAllOrders();
        if (res.success && res.data?.data) {
          if (Array.isArray(res.data.data.orders)) {
            setOrders(res.data.data.orders);
          }
          if (res.data.data.summary) {
            setSummary(res.data.data.summary);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Simple filtering mapped to tabs just as placeholder logic
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "Credits" && order.status !== "refunded") return false;
    if (activeTab === "Debits" && order.status === "refunded") return false;
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

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
              <span className="font-bold text-[#1E293B] text-[14px] line-clamp-1">
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
        <span className="text-[14px] font-medium text-[#64748B]">
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
          <span className="text-[14px] font-medium text-[#4B5563]">
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
            className={`text-[15px] font-black ${isRefund ? "text-[#10b981]" : "text-[#1E293B]"
              }`}
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

  if (loading) return <PaymentHistorySkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 xl:p-10 transition-all font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Typography
              variant="h2"
              className="text-[#1E293B] font-bold text-[22px] tracking-tight"
            >
              Payment History
            </Typography>
            <Typography className="text-[#64748B] text-[13px] font-medium mt-1">
              View your payment transactions and billing
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </button>
            <Button className="h-10 rounded-full bg-white text-[#1E293B] hover:bg-gray-50 border border-gray-200 shadow-sm font-bold text-[13px] px-5">
              <FileDown className="w-4 h-4 mr-2 stroke-[2.5px]" /> Export PDF
            </Button>
          </div>
        </header>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {/* Total Spent */}
          <Card className="rounded-[20px] border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pt-5 pb-5 px-5 bg-white">
            <div className="flex gap-4 items-center">
              <div className="w-[46px] h-[46px] rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
                <span className="text-[#10b981] text-lg font-bold stroke-[2px]">$</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase mb-0.5">
                  Total Spent
                </span>
                <span className="text-[22px] font-black text-[#1E293B] leading-none tracking-tight">
                  ${Number(summary.totalSpend || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </Card>

          {/* This Month */}
          <Card className="rounded-[20px] border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pt-5 pb-5 px-5 bg-white">
            <div className="flex gap-4 items-center">
              <div className="w-[46px] h-[46px] rounded-full bg-[#f0f9ff] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase mb-0.5">
                  This Month
                </span>
                <span className="text-[22px] font-black text-[#1E293B] leading-none tracking-tight">
                  $286.00
                </span>
              </div>
            </div>
          </Card>

          {/* Pending */}
          <Card className="rounded-[20px] border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pt-5 pb-5 px-5 bg-white">
            <div className="flex gap-4 items-center">
              <div className="w-[46px] h-[46px] rounded-full bg-[#fff7ed] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase mb-0.5">
                  Pending
                </span>
                <span className="text-[22px] font-black text-[#1E293B] leading-none tracking-tight">
                  {summary.totalPendingOrders || 0} Pending
                </span>
              </div>
            </div>
          </Card>

          {/* Next Billing */}
          <Card className="rounded-[20px] border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pt-5 pb-5 px-5 bg-white">
            <div className="flex gap-4 items-center">
              <div className="w-[46px] h-[46px] rounded-full bg-[#f5f3ff] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase mb-0.5">
                  Next Billing
                </span>
                <span className="text-[22px] font-black text-[#1E293B] leading-none tracking-tight">
                  Dec 01
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Transactions Table Card */}
        <Card className="rounded-[24px] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden bg-white">
          <CardHeader className="border-b border-gray-100 pt-6 pb-6 px-8 flex flex-row items-center justify-between">
            <CardTitle className="text-[16px] font-bold text-[#1E293B]">
              Transactions
            </CardTitle>
            <div className="flex items-center gap-2">
              {["All", "Credits", "Debits"].map((tab) => (
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

            {/* Custom styled pagination */}
            {!loading && filteredOrders.length > 0 && (
              <div className="absolute bottom-5 left-8 right-8 flex items-center justify-between pointer-events-none">
                <span className="text-[12px] text-gray-400 font-medium">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
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
      </div>
    </div>
  );
}
