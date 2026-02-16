import React from "react";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { Badge } from "@/components/ui/badge";

export interface Transaction {
  id: string; // #ORD-9921
  type: "ORDER" | "REFUND" | "ADJUSTMENT";
  customerName?: string; // Alex Doe
  reference?: string; // Ref: #ORD-9880
  date: string; // Feb 14, 2:30 PM
  netAmount: number; // 45.00
  fee: number; // -2.50
  total: number; // 42.50
}

interface TransactionsTableProps {
  data: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ data }) => {
  const columns: Column<Transaction>[] = [
    {
      header: "TRANSACTION",
      cell: (item) => (
        <div>
          <span className="font-bold text-emerald-600 block">{item.id}</span>
          <span className="text-xs text-gray-500">
            {item.customerName
              ? `Customer: ${item.customerName}`
              : item.reference}
          </span>
        </div>
      ),
    },
    {
      header: "TYPE",
      cell: (item) => (
        <Badge
          className={`rounded-sm px-2 py-0.5 text-[10px] font-bold shadow-none border-none ${
            item.type === "ORDER"
              ? "bg-gray-100 text-gray-600"
              : item.type === "REFUND"
                ? "bg-red-50 text-red-600"
                : "bg-blue-50 text-blue-600"
          }`}
        >
          {item.type}
        </Badge>
      ),
    },
    {
      header: "DATE",
      accessorKey: "date",
      className: "text-gray-900 font-medium",
    },
    {
      header: "NET AMOUNT",
      cell: (item) => (
        <span
          className={`font-medium ${
            item.netAmount < 0 ? "text-red-500" : "text-gray-900"
          }`}
        >
          {item.netAmount < 0 ? "-" : ""}${Math.abs(item.netAmount).toFixed(2)}
        </span>
      ),
    },
    {
      header: "FEE",
      cell: (item) => (
        <span className="text-gray-400">${Math.abs(item.fee).toFixed(2)}</span>
      ),
    },
    {
      header: "TOTAL",
      cell: (item) => (
        <span className="font-bold text-gray-900">
          {item.total < 0 ? "-" : ""}${Math.abs(item.total).toFixed(2)}
        </span>
      ),
    },
  ];

  return <GlobalTable data={data} columns={columns} />;
};

export default TransactionsTable;
