import { useState } from "react";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { cn } from "@/lib/utils";
import OrderDetailSidebar, { OrderDetail } from "./OrderDetailSidebar";
import { useTranslations } from "next-intl";
import { GlobalPagination } from "@/components/common/GlobalPagination";

interface Order {
  id: string;
  orderId: string;
  date: string;
  time: string;
  status: string | "Completed" | "Preparing" | "Cancelled";
  customer: string;
  items: string;
  source: string;
  total: string;
  rawData?: any;
}

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "complete":
    case "completed":
    case "paid":
      return "bg-emerald-50 text-emerald-600";
    case "pending":
    case "preparing":
    case "prepare":
    case "ready":
      return "bg-amber-50 text-amber-600";
    case "cancelled":
    case "rejected":
    case "reject":
      return "bg-red-50 text-red-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

interface RecentOrdersProps {
  orders?: any[];
  totalCount?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const RecentOrders = ({ orders = [], totalCount = 0, page = 1, totalPages = 1, onPageChange }: RecentOrdersProps) => {
  const t = useTranslations("RestaurantDashboard.Reports.recentOrders");
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const formattedOrders: Order[] = orders.map((o: any) => {
    const d = new Date(o.createdAt);
    return {
      id: o.orderId,
      orderId: o.orderId,
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
      customer: o.customerName || t("guest"),
      items: o.summary || t("noDetails"),
      source: o.source || "N/A",
      total: `$${Number(o.totalPrice).toFixed(2)}`,
      rawData: o,
    };
  });

  const handleOrderClick = (order: Order) => {
    const raw = order.rawData;
    setSelectedOrder({
      id: order.id,
      orderId: order.orderId,
      date: order.date,
      time: order.time,
      status: order.status as any,
      customer: order.customer,
      source: order.source,
      total: order.total,
      paymentMethod: raw?.paymentMethod || "N/A",
      prepDuration: raw?.prepareTime ? `${raw.prepareTime} min` : "N/A",
      subtotal: order.total,
      tax: "$0.00",
      itemsList: raw?.items?.map((item: any) => ({
        name: item.name,
        qty: item.quantity,
        price: Number(item.price),
        total: Number(item.price) * Number(item.quantity),
      })),
    });
    setSidebarOpen(true);
  };

  const handleAllOrdersClick = () => {
    if (formattedOrders.length > 0) {
      handleOrderClick(formattedOrders[0]);
    }
  };

  const columns: Column<Order>[] = [
    {
      header: t("columns.order"),
      cell: (item) => (
        <div className="flex flex-col gap-1 py-1">
          <span className="font-bold text-[#1b2d22] text-[13px]">
            {item.orderId}
          </span>
          <span className="text-[11px] text-[#8ea89a]">
            {item.date}, {item.time}
          </span>
        </div>
      ),
    },
    {
      header: t("columns.status"),
      cell: (item) => (
        <div className="py-2">
          <span
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg leading-none inline-flex max-w-min",
              getStatusStyles(item.status),
            )}
          >
            {item.status}
          </span>
        </div>
      ),
    },
    {
      header: t("columns.customer"),
      cell: (item) => (
        <span className="text-[#1b2d22] font-medium text-[13px]">
          {item.customer}
        </span>
      ),
    },
    {
      header: t("columns.items"),
      cell: (item) => (
        <span className="text-[#657a8a] text-[12px]">{item.items}</span>
      ),
    },
    {
      header: t("columns.source"),
      cell: (item) => (
        <span className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-[11px] font-bold max-w-min">
          {item.source}
        </span>
      ),
    },
    {
      header: t("columns.total"),
      cell: (item) => (
        <span className="font-bold text-[#1b2d22] text-[13px]">
          {item.total}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[16px] font-bold text-gray-900">{t("title")}</h2>
          <p className="text-[12px] text-gray-500 mt-0.5">
            {t("subtitle")}
          </p>
        </div>
        <button
          onClick={handleAllOrdersClick}
          className="text-[12px] font-bold text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t("allOrders")}
        </button>
      </div>

      <GlobalTable
        data={formattedOrders}
        columns={columns}
        onRowClick={handleOrderClick}
      />

      {/* Pagination Footer */}
      {totalPages > 1 && onPageChange && (
        <div className="mt-4">
          <GlobalPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      <OrderDetailSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        order={selectedOrder}
      />
    </div>
  );
};

export default RecentOrders;
