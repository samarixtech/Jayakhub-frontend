"use client";
import React from "react";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { Badge } from "@/components/ui/badge";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import { useTranslations } from "next-intl";
import { useCLC } from "@/context/CLCContext";
import { Payout } from "../hooks/usePayouts";

interface PayoutsTableProps {
  data: Payout[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "paid":
      return "bg-green-100 text-green-700 hover:bg-green-100";
    case "pending":
    case "processing":
    case "stripe_error":
    case "on hold":
      return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
    case "failed":
    case "rejected":
      return "bg-red-50 text-red-700 hover:bg-red-50";
    default:
      return "bg-gray-100 text-gray-700 hover:bg-gray-100";
  }
};

const formatDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const PayoutsTable: React.FC<PayoutsTableProps> = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  const t = useTranslations("RestaurantDashboard.Payouts.table");
  const { formatPrice } = useCLC();

  const columns: Column<Payout>[] = [
    {
      header: t("payoutId"),
      accessorKey: "id",
      className: "font-semibold text-gray-900",
    },
    {
      header: t("amount"),
      cell: (payout) => (
        <span className="font-bold text-gray-900">{formatPrice(payout.amount)}</span>
      ),
    },
    {
      header: t("status"),
      cell: (payout) => {
        const displayStatus = payout.status.toLowerCase() === "stripe_error" ? "on hold" : payout.status;
        return (
          <Badge
            className={`rounded-full px-3 py-1 text-[10px] font-bold shadow-none border-none capitalize ${getStatusColor(payout.status)}`}
          >
            {displayStatus}
          </Badge>
        );
      },
    },
    {
      header: t("requestedAt"),
      cell: (payout) => (
        <span className="text-gray-500 text-sm">{formatDate(payout.requestedAt)}</span>
      ),
    },
    {
      header: t("processedAt"),
      cell: (payout) => (
        <span className="text-gray-500 text-sm">{formatDate(payout.processedAt)}</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <GlobalTable data={data} columns={columns} loading={loading} />
      {!loading && data.length > 0 && totalPages > 1 && (
        <div className="p-5 flex justify-end">
          <GlobalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default PayoutsTable;
