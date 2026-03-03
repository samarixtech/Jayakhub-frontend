import React from "react";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UIOrder as Order } from "../hooks/useOrders";

interface OrdersTableProps {
  data: Order[];
  onViewOrder: (order: Order) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  data,
  onViewOrder,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "READY":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "OUT FOR DELIVERY":
        return "bg-blue-50 text-blue-700 hover:bg-blue-50"; // Darker text for visibility
      case "PREPARING":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "DELIVERED":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "REJECTED":
      case "CANCELLED":
        return "bg-red-50 text-red-700 hover:bg-red-50"; // Destructive color
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  const columns: Column<Order>[] = [
    {
      header: "ORDER ID",
      accessorKey: "id",
      className: "font-semibold text-gray-900",
    },
    {
      header: "CUSTOMER",
      accessorKey: "customerName",
      className: "font-medium text-gray-700",
    },
    {
      header: "SUMMARY",
      cell: (order) => (
        <span className="text-gray-500 text-sm truncate max-w-[200px] block">
          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
        </span>
      ),
    },
    {
      header: "TOTAL",
      cell: (order) => (
        <span className="font-bold text-gray-900">
          ${order.total.toFixed(2)}
        </span>
      ),
    },
    {
      header: "DATE & TIME",
      accessorKey: "date",
      className: "text-gray-500 text-sm",
    },
    {
      header: "STATUS",
      cell: (order) => (
        <Badge
          className={`rounded-full px-3 py-1 text-[10px] font-bold shadow-none border-none ${getStatusColor(order.status)}`}
        >
          {order.status}
        </Badge>
      ),
    },
    {
      header: "ACTION",
      cell: (order) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            onViewOrder(order);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <GlobalTable
      data={data}
      columns={columns}
      loading={loading}
      paginationParams={{
        currentPage,
        totalPages,
        onPageChange,
      }}
      onRowClick={onViewOrder}
    />
  );
};

export default OrdersTable;
