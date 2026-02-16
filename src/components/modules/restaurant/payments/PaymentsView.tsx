"use client";

import React from "react";
import PaymentStatsCard from "./PaymentStatsCard";
import PayoutsList from "./PayoutsList";
import TransactionsTable, { Transaction } from "./TransactionsTable";
import {
  DollarSign,
  AlertCircle,
  CreditCard,
  ChevronDown,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "#ORD-9921",
    customerName: "Alex Doe",
    type: "ORDER",
    date: "Feb 14, 2:30 PM",
    netAmount: 45.0,
    fee: -2.5,
    total: 42.5,
  },
  {
    id: "#ORD-9920",
    customerName: "Sarah Smith",
    type: "ORDER",
    date: "Feb 14, 1:15 PM",
    netAmount: 120.0,
    fee: -5.8,
    total: 114.2,
  },
  {
    id: "#REF-1022",
    reference: "Ref: #ORD-9880",
    type: "REFUND",
    date: "Feb 14, 11:00 AM",
    netAmount: -32.0,
    fee: 0.0,
    total: -32.0,
  },
  {
    id: "#ORD-9919",
    customerName: "John Wick",
    type: "ORDER",
    date: "Feb 14, 10:45 AM",
    netAmount: 85.0,
    fee: -4.0,
    total: 81.0,
  },
];

const PaymentsView = () => {
  return (
    <div className="p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Button variant="outline" className="bg-white border-gray-200">
          <span>Last 30 Days</span>
          <ChevronDown className="ml-2 w-4 h-4 text-gray-400" />
        </Button>
        <Button variant="outline" className="bg-white border-gray-200">
          <Download className="mr-2 w-4 h-4 text-gray-400" />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PaymentStatsCard
          label="Available Balance"
          amount="$3,450.00"
          subtext="Next Payout: Today"
          subtextClassName="text-primary font-medium"
          icon={<CreditCard className="w-5 h-5 text-primary" />}
        />
        <PaymentStatsCard
          label="Funds on Hold"
          amount="$120.00"
          subtext="Reserve funds for disputes"
          subtextClassName="text-gray-500 font-normal"
          icon={<AlertCircle className="w-5 h-5 text-yellow-600" />}
        />
        <PaymentStatsCard
          label="Total Payouts (30d)"
          amount="$12,840.00"
          subtext="+12% vs last month"
          subtextClassName="text-primary font-medium"
          icon={<DollarSign className="w-5 h-5 text-blue-600" />}
        />
      </div>

      {/* Payouts Section */}
      <PayoutsList />

      {/* Transactions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 space-y-4">
        <div className="flex justify-between items-center pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Transactions
            </h2>
            <p className="text-sm text-gray-500">
              All orders, refunds, and adjustments
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-9 text-sm"
            >
              <span className="sr-only">Filter</span>
              Filter
            </Button>
            <Button variant="ghost" className="h-9 text-sm">
              View All
            </Button>
          </div>
        </div>
        <TransactionsTable data={MOCK_TRANSACTIONS} />
      </div>
    </div>
  );
};

export default PaymentsView;
