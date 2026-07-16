"use client";

import React from "react";
import { useCLC } from "@/context/CLCContext";
import { useTranslations } from "next-intl";

interface CloseRegisterOrdersListProps {
  orders: any[];
}

export const CloseRegisterOrdersList = ({
  orders,
}: CloseRegisterOrdersListProps) => {
  const t = useTranslations("POS.closeRegister.ordersList");
  const { formatPrice } = useCLC();

  return (
    <div className="border-t border-gray-100 pt-5">
      <h3 className="text-[11px] font-bold text-[#556977] tracking-wide mb-3 uppercase">
        {t("title")}
      </h3>

      {!orders || orders.length === 0 ? (
        <p className="text-[12.5px] text-gray-400 text-center py-3">
          {t("empty")}
        </p>
      ) : (
        <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-[12.5px] font-bold text-[#1b2d22] truncate">
                  {order.itemName}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  {order.type}
                  {order.tableName
                    ? ` • ${t("table", { name: order.tableName })}`
                    : ""}{" "}
                  • {order.paymentMethod}
                </p>
              </div>
              <span className="text-[12.5px] font-bold text-[#1b2d22] shrink-0">
                {formatPrice(order.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
