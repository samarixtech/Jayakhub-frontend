"use client";

import React from "react";

interface FinanceReportPDFProps {
  data: any;
  pdfRef: React.Ref<HTMLDivElement>;
  filterLabel: string;
}

export const FinanceReportPDF = ({
  data,
  pdfRef,
  filterLabel,
}: FinanceReportPDFProps) => {
  if (!data) return null;

  return (
    <div className="absolute top-[-9999px] left-[-9999px] w-[800px] -z-50 pointer-events-none bg-white">
      <div
        ref={pdfRef}
        className="w-[800px] bg-white p-12 text-black border border-transparent"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Finance Summary Report
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Period: {filterLabel}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Generated Date: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">
              {data.restaurantName || "Jayak Hub Partner"}
            </p>
            <p className="text-gray-500 font-medium tracking-tight">
              Restaurant Finance Dashboard
            </p>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Total Revenue
            </p>
            <p className="text-2xl font-black text-gray-900">
              ${data.metrics.totalRevenue}
            </p>
          </div>
          <div className="bg-emerald-50 p-5 border border-emerald-100 rounded-lg text-center">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
              Net Profit
            </p>
            <p className="text-2xl font-black text-emerald-700">
              ${data.metrics.netProfit}
            </p>
          </div>
          <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Platform Fees
            </p>
            <p className="text-2xl font-black text-gray-900">
              ${data.metrics.platformFees}
            </p>
          </div>
          <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Avg Order Value
            </p>
            <p className="text-2xl font-black text-gray-900">
              ${data.metrics.avgOrderValue}
            </p>
          </div>
        </div>

        {/* Tax & Commissions Breakdown */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
            Tax & Commissions Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Tax Collected</span>
              <span className="font-bold text-gray-900">
                ${data.metrics.taxCollected}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">
                Platform Commission
              </span>
              <span className="font-bold text-gray-900">
                ${data.metrics.platformCommission}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">
                Payment Processing
              </span>
              <span className="font-bold text-gray-900">
                ${data.metrics.paymentProcessing}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Delivery Costs</span>
              <span className="font-bold text-gray-900">
                ${data.metrics.deliveryCosts}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
            Payment Methods
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {data.paymentMethods.map((pm: any) => (
              <div
                key={pm.method}
                className="bg-white p-4 border border-gray-100 rounded-lg shadow-sm"
              >
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                  {pm.method}
                </p>
                <div className="flex justify-between items-end">
                  <p className="text-xl font-black text-gray-900">
                    ${pm.amount}
                  </p>
                  <p className="text-sm font-semibold text-emerald-600">
                    {Math.round(pm.percentage)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
            Transaction History
          </h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800 text-sm">
                <th className="py-3 px-2 font-bold text-gray-600">ID</th>
                <th className="py-3 px-2 font-bold text-gray-600">Date</th>
                <th className="py-3 px-2 font-bold text-gray-600">Type</th>
                <th className="py-3 px-2 font-bold text-gray-600">Method</th>
                <th className="py-3 px-2 font-bold text-gray-600 text-right">
                  Fee
                </th>
                <th className="py-3 px-2 font-bold text-gray-600 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.items.map((t: any, idx: number) => (
                <tr
                  key={t.orderId}
                  className="border-b border-gray-100 text-[13px]"
                >
                  <td className="py-4 px-2 font-bold text-emerald-700 font-mono">
                    {t.orderId}
                  </td>
                  <td className="py-4 px-2 text-gray-500 font-medium whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${t.type === "Refund" ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"}`}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-gray-600 font-medium capitalize">
                    {t.method}
                  </td>
                  <td className="py-4 px-2 text-gray-400 font-medium text-right">
                    ${Math.abs(parseFloat(t.fee)).toFixed(2)}
                  </td>
                  <td className="py-4 px-2 font-black text-gray-900 text-right">
                    {parseFloat(t.total) < 0 ? "-" : ""}$
                    {Math.abs(parseFloat(t.total)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 text-center text-gray-400 text-xs font-bold tracking-widest border-t border-gray-100 pt-6">
          <p>CONFIDENTIAL FINANCE REPORT - SECURELY GENERATED BY JAYAK HUB</p>
        </div>
      </div>
    </div>
  );
};
