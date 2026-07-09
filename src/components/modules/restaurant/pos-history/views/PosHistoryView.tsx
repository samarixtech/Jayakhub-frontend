"use client";

import { ClipboardList, DollarSign, TrendingUp, Award, Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { useCLC } from "@/context/CLCContext";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import { Input } from "@/components/ui/input";
import GlobalSelect from "@/components/common/GlobalSelect";
import { usePosHistory, PosOrderRow } from "../hooks/usePosHistory";

const TABLE_COLUMNS = [
  "Order ID",
  "Order Type",
  "Cashier",
  "Payment Method",
  "Items",
  "Total",
  "Status",
  "Time",
];

const ORDER_TYPE_OPTIONS = [
  { value: "all", label: "All Order Types" },
  { value: "Dine-In", label: "Dine-In" },
  { value: "TakeAway", label: "TakeAway" },
  { value: "Delivery", label: "Delivery" },
  { value: "Walk-in", label: "Walk-In" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "all", label: "All Payment Methods" },
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
  rejected: "bg-red-50 text-red-500",
};

function StatusPill({ status }: { status: string }) {
  const key = (status || "").toLowerCase();
  const style = STATUS_STYLES[key] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${style}`}>
      {status}
    </span>
  );
}

function itemsSummary(order: PosOrderRow) {
  if (!order.items || order.items.length === 0) return "—";
  return order.items.map((i) => `${i.quantity}x ${i.itemName}`).join(", ");
}

export default function PosHistoryView() {
  const { formatPrice } = useCLC();
  const {
    stats,
    statsLoading,
    orders,
    ordersLoading,
    page,
    totalPages,
    handlePageChange,
    orderType,
    setOrderType,
    paymentMethod,
    setPaymentMethod,
    searchQuery,
    setSearchQuery,
  } = usePosHistory();

  const STATS = [
    {
      label: "Total Orders",
      icon: ClipboardList,
      value: stats ? stats.totalOrders : "--",
    },
    {
      label: "Total Sales",
      icon: DollarSign,
      value: stats ? formatPrice(stats.totalSales) : "--",
    },
    {
      label: "Avg. Order Value",
      icon: TrendingUp,
      value: stats ? formatPrice(stats.avgOrderValue) : "--",
    },
    {
      label: "Top Seller (Cashier)",
      icon: Award,
      value: stats?.topSeller ? stats.topSeller.name : "--",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, icon: Icon, value }) => (
          <div
            key={label}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50">
              <Icon className="w-5 h-5 text-[#357252]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-[22px] font-bold text-[#1a1a1a] leading-none truncate">
                {statsLoading ? "--" : value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h3 className="font-bold text-[15px] text-[#1a1a1a] shrink-0">Orders</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="pl-9 h-10 bg-white border-gray-200 focus:ring-[#1F4D36] focus:border-[#1F4D36]"
              />
            </div>
            <div className="w-full sm:w-[170px]">
              <GlobalSelect
                value={orderType}
                onChange={setOrderType}
                options={ORDER_TYPE_OPTIONS}
                placeholder="Order Type"
                className="h-10"
              />
            </div>
            <div className="w-full sm:w-[170px]">
              <GlobalSelect
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={PAYMENT_METHOD_OPTIONS}
                placeholder="Payment Method"
                className="h-10"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                      <p className="text-[13px] font-medium">Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length} className="px-5 py-16">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <ClipboardList className="w-10 h-10 mb-3 text-gray-200" />
                      <p className="font-bold text-[14px]">No data</p>
                      <p className="text-[12px] text-gray-400 mt-1">
                        Order data will appear here once connected.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3.5 text-[13px] font-bold text-[#357252]">{order.id}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-700">{order.orderType}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-700">{order.userId}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-700">{order.paymentMethod}</td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500 max-w-[260px] truncate">
                      {itemsSummary(order)}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-gray-900">
                      {formatPrice(order.grandTotal)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={order.orderStatus} />
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500 whitespace-nowrap">
                      {format(new Date(order.createdAt), "dd/MM/yyyy, hh:mm a")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <GlobalPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={ordersLoading}
          />
        )}
      </div>
    </div>
  );
}
