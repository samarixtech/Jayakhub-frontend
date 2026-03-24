import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface RecentOrdersTableProps {
  orders: any[];
  formatCurrency: (amount: number) => string;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
  formatCurrency,
}) => {
  const t = useTranslations("RestaurantDashboard");

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "pending")
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#fff7d1] text-[#b8860b]">
          {t("recentOrders.status.new")}
        </span>
      );
    if (s === "ready")
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e6f0ff] text-[#2b6cb0]">
          {t("recentOrders.status.preparing")}
        </span>
      );
    if (s === "delivered")
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#e8f6f0] text-[#1eb589]">
          {t("recentOrders.status.delivered")}
        </span>
      );
    if (s === "rejected")
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#fff0f0] text-[#ef4444]">
          {t("recentOrders.status.rejected")}
        </span>
      );
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600">
        {status}
      </span>
    );
  };

  const columns: Column<any>[] = [
    {
      header: t("recentOrders.columns.order"),
      cell: (item) => (
        <span className="text-[13px] font-bold text-[#1b2d22]">
          {item.orderId}
        </span>
      ),
      className: "py-4",
      headerClassName: "w-[25%] uppercase tracking-wider",
    },
    {
      header: t("recentOrders.columns.customer"),
      cell: (item) => (
        <div className="text-[13px] font-bold text-[#1b2d22] truncate max-w-[150px]">
          {item.customerName}
        </div>
      ),
      className: "py-4",
      headerClassName: "w-[25%] uppercase tracking-wider",
    },
    {
      header: t("recentOrders.columns.items"),
      cell: (item) => (
        <span className="text-[13px] font-medium text-[#1b2d22]">
          {t("recentOrders.itemsCount", { count: item.itemCount || 0 })}
        </span>
      ),
      className: "py-4",
      headerClassName: "w-[15%] uppercase tracking-wider",
    },
    {
      header: t("recentOrders.columns.total"),
      cell: (item) => (
        <span className="text-[13px] font-bold text-[#1b2d22]">
          {formatCurrency(item.totalPrice)}
        </span>
      ),
      className: "py-4",
      headerClassName: "w-[15%] uppercase tracking-wider",
    },
    {
      header: t("recentOrders.columns.status"),
      cell: (item) => getStatusBadge(item.orderStatus),
      className: "py-4",
      headerClassName: "w-[20%] uppercase tracking-wider",
    },
  ];

  return (
    <Card className="rounded-[16px] border-gray-100 shadow-sm flex flex-col w-full overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-6 pt-6">
        <div className="space-y-1">
          <CardTitle className="text-[16px] font-bold text-[#1b2d22]">
            {t("recentOrders.title")}
          </CardTitle>
          <CardDescription className="text-[12px] text-[#8ea89a] font-medium">
            {t("recentOrders.subtitle")}
          </CardDescription>
        </div>
        <Link
          href="/restaurant/orders"
          className="text-[13px] font-bold text-[#357252] flex items-center gap-1 hover:underline"
        >
          {t("recentOrders.viewAll")} <span>→</span>
        </Link>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto w-full pb-4 px-6 md:px-0 lg:-mx-4 lg:w-auto">
        <div className="min-w-[600px] w-full lg:px-4">
          <GlobalTable
            data={orders || []}
            columns={columns}
            emptyMessage={t("recentOrders.noOrders")}
            rowClassName={() => "transition-colors"}
          />
        </div>
      </CardContent>
    </Card>
  );
};
