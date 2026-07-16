"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface ShiftReportPDFProps {
  data: any;
  pdfRef: React.Ref<HTMLDivElement>;
}

export const ShiftReportPDF = ({ data, pdfRef }: ShiftReportPDFProps) => {
  const t = useTranslations("POS.shiftReportPdf");
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
              {t("title")}
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              {t("generatedDate", { date: new Date().toLocaleString() })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900">{t("brand")}</p>
            <p className="text-gray-500 font-medium tracking-tight">
              {t("operator", { name: data?.user?.name || t("unknown") })}
            </p>
            <p className="text-gray-500 font-medium uppercase text-xs mt-1">
              {t("role", { role: data?.user?.role?.replace("_", " ") ?? "" })}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t("totalSales")}
            </p>
            <p className="text-2xl font-black text-gray-900">
              ${data?.metrics?.totalSales?.toFixed(2) || "0.00"}
            </p>
          </div>
          <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t("transactions")}
            </p>
            <p className="text-2xl font-black text-gray-900">
              {data?.metrics?.transactions || 0}
            </p>
          </div>
          <div className="bg-gray-50 p-5 border border-gray-200 rounded-lg">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              {t("avgOrder")}
            </p>
            <p className="text-2xl font-black text-gray-900">
              ${data?.metrics?.averageOrder?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
            {t("paymentSummary")}
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <span className="font-semibold text-gray-600">
                {t("cashPayments")}
              </span>
              <span className="font-black text-gray-900">
                ${data?.paymentSummary?.cash?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <span className="font-semibold text-gray-600">
                {t("cardPayments")}
              </span>
              <span className="font-black text-gray-900">
                ${data?.paymentSummary?.card?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Full Order Dump */}
        {data?.orders && data.orders.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 mb-4">
              {t("orderHistory")}
            </h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800 text-sm">
                  <th className="py-3 px-2 font-bold text-gray-600">
                    {t("colTime")}
                  </th>
                  <th className="py-3 px-2 font-bold text-gray-600">
                    {t("colOrderId")}
                  </th>
                  <th className="py-3 px-2 font-bold text-gray-600 max-w-[200px]">
                    {t("colItemName")}
                  </th>
                  <th className="py-3 px-2 font-bold text-gray-600">
                    {t("colType")}
                  </th>
                  <th className="py-3 px-2 font-bold text-gray-600">
                    {t("colPayment")}
                  </th>
                  <th className="py-3 px-2 font-bold text-gray-600 text-right">
                    {t("colAmount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order: any, idx: number) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 text-[13px]"
                  >
                    <td className="py-4 px-2 text-gray-500 font-medium whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-2 font-mono text-gray-500 break-all w-[150px]">
                      {order.id}
                    </td>
                    <td className="py-4 px-2 font-bold text-gray-900 wrap-break-word max-w-[200px]">
                      {order.itemName || t("customOrder")}
                    </td>
                    <td className="py-4 px-2">
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wide">
                        {order.type}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-semibold text-gray-600">
                      {order.paymentMethod}
                    </td>
                    <td className="py-4 px-2 font-black text-gray-900 text-right">
                      ${Number(order.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-16 text-center text-gray-400 text-xs font-bold tracking-widest border-t border-gray-100 pt-6">
          <p>{t("endOfReport")}</p>
        </div>
      </div>
    </div>
  );
};
