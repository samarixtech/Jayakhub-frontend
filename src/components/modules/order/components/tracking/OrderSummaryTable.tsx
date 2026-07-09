import React from "react";
import { Utensils } from "lucide-react";
import { useCLC } from "@/context/CLCContext";

interface Coupon {
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

interface OrderSummaryTableProps {
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  coupon?: Coupon | null;
}

export const OrderSummaryTable: React.FC<OrderSummaryTableProps> = ({
  items,
  subtotal,
  deliveryFee,
  total,
  coupon,
}) => {
  const { formatPrice } = useCLC();
  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white">
      <div className="flex items-center gap-2 mb-6">
        <Utensils className="w-4 h-4 text-[#346853]" />
        <h3 className="font-bold text-gray-900">Order Summary</h3>
      </div>

      <div className="space-y-4 mb-6">
        {items &&
          items.map((item: any, idx: number) => {
            const imageUrl = item.image || null;

            return (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex flex-1 gap-3">
                  {/* Image */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Utensils className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-900">
                        {item.quantity}x
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    {item.discount && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">
                          -{formatPrice(parseFloat(item.discount))}
                        </span>
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatPrice(item.originalPrice || item.price)}
                        </span>
                      </div>
                    )}
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-bold text-[#346853] shrink-0 ml-4">
                  {formatPrice(item.price)}
                </span>
              </div>
            );
          })}
      </div>

      <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-4">
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Delivery Fee</span>
          <span className={deliveryFee === 0 ? "text-emerald-600 font-medium" : ""}>
            {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
          </span>
        </div>
        {coupon && (
          <div className="flex justify-between text-emerald-600 text-sm font-medium">
            <span className="flex items-center gap-1">
              Coupon
              <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {coupon.code}
              </span>
              <span className="text-gray-400 text-xs font-normal">
                ({coupon.discountType === "percentage" ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)} off)
              </span>
            </span>
            <span>- {formatPrice(coupon.discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end border-t border-gray-100 pt-4">
        <span className="font-bold text-lg text-gray-900">Total</span>
        <span className="font-bold text-xl text-gray-900">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
};
