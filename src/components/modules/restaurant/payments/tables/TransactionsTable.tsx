"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTransactions, TransactionItem } from "../hooks/useTransactions";
import TransactionDetailSidebar, {
  TransactionDetail,
} from "../components/TransactionDetailSidebar";
import { useCLC } from "@/context/CLCContext";
import { formatOrderDateTime } from "@/lib/utils/date";

function isoToOrderDateTime(isoStr: string): string {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .toLowerCase();
  return formatOrderDateTime(`${day}/${month}/${year}`, time);
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "completed" || s === "delivered")
    return (
      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50">
        {status}
      </Badge>
    );
  if (s === "rejected" || s === "cancelled" || s === "failed")
    return (
      <Badge className="bg-red-50 text-red-500 border-red-100 hover:bg-red-50">
        {status}
      </Badge>
    );
  if (s === "pending")
    return (
      <Badge className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-50">
        {status}
      </Badge>
    );
  return (
    <Badge className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50">
      {status}
    </Badge>
  );
}

export default function TransactionsTable() {
  const tTransactions = useTranslations("RestaurantDashboard.Payments.transactions");
  const { formatPrice } = useCLC();

  const {
    data,
    loading,
    error,
    page,
    paymentMethod,
    handlePageChange,
    handlePaymentMethodChange,
  } = useTransactions();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetail | null>(null);

  const handleRowClick = (t: TransactionItem) => {
    const formatted = isoToOrderDateTime(t.date);
    const [datePart, timePart] = formatted.split(" • ");
    setSelectedTransaction({
      id: t.orderId,
      type: "Order" as const,
      date: datePart ?? formatted,
      time: timePart ?? "",
      customer: t.customerName,
      paymentMethod: t.method,
      total: `${Math.abs(parseFloat(t.total)).toFixed(2)}`,
      netAmount: t.netAmount,
      commission: t.commission,
      deliveryFee: t.deliveryFee,
    });
    setSidebarOpen(true);
  };

  const totalPages = data?.totalPages ?? 1;
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h3 className="text-[16px] font-bold text-[#1a1a1a]">
              {tTransactions("title")}
            </h3>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {tTransactions("countSubtitle", {
                count: data?.items.length ?? 0,
                total: data?.totalCount ?? 0,
              })}
            </p>
          </div>
          <Select
            value={paymentMethod || "all"}
            onValueChange={(val) =>
              handlePaymentMethodChange(val === "all" ? "" : val)
            }
          >
            <SelectTrigger className="h-8 w-[130px] text-[12px] font-semibold border-gray-200 rounded-lg">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="cod">COD</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-500 py-8">{error}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {tTransactions("transaction")}
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Customer
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {tTransactions("date")}
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {tTransactions("method")}
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  {tTransactions("netAmount")}
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  {tTransactions("commission")}
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  {tTransactions("deliveryFee")}
                </TableHead>
                <TableHead className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider text-right">
                  {tTransactions("total")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.items ?? []).length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-sm text-gray-400 py-10"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                (data?.items ?? []).map((t) => (
                  <TableRow
                    key={t.orderId}
                    className="border-gray-50 cursor-pointer hover:bg-gray-50/80 transition-colors"
                    onClick={() => handleRowClick(t)}
                  >
                    <TableCell className="font-bold text-[13px] text-emerald-600">
                      {t.orderId}
                    </TableCell>
                    <TableCell className="text-[13px] text-gray-600">
                      {t.customerName}
                    </TableCell>
                    <TableCell className="text-[13px] text-gray-500">
                      {isoToOrderDateTime(t.date)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                    <TableCell className="text-[13px] text-gray-600 capitalize">
                      {t.method}
                    </TableCell>
                    <TableCell className={`text-[13px] font-bold text-right ${parseFloat(t.netAmount) < 0 ? "text-red-500" : "text-[#1a1a1a]"}`}>
                      {formatPrice(parseFloat(t.netAmount))}
                    </TableCell>
                    <TableCell className="text-[13px] font-medium text-red-400 text-right">
                      {formatPrice(parseFloat(t.commission))}
                    </TableCell>
                    <TableCell className="text-[13px] font-medium text-gray-400 text-right">
                      {formatPrice(parseFloat(t.deliveryFee))}
                    </TableCell>
                    <TableCell className={`text-[14px] font-black text-right ${parseFloat(t.total) < 0 ? "text-red-500" : "text-[#1a1a1a]"}`}>
                      {formatPrice(parseFloat(t.total))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-end gap-1 mt-5">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg border-gray-200"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {pages.map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                className={`w-8 h-8 rounded-lg text-[12px] font-bold ${
                  p === page
                    ? "bg-[#346853] hover:bg-[#2a5644] text-white border-0"
                    : "border-gray-200 text-gray-600"
                }`}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 rounded-lg border-gray-200"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <TransactionDetailSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        transaction={selectedTransaction}
      />
    </>
  );
}
