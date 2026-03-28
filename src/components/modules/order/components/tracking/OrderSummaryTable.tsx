import React from "react";
import { Utensils } from "lucide-react";
import { useCLC } from "@/context/CLCContext";

interface OrderSummaryTableProps {
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export const OrderSummaryTable: React.FC<OrderSummaryTableProps> = ({
  items,
  subtotal,
  deliveryFee,
  total,
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
            const imageUrl = item.image
              ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.replace(/\/+$/, "")}/${item.image.replace(/^\/+/, "").replace(/\\/g, "/")}`
              : null;

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
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <span className="font-bold text-gray-900 shrink-0 ml-4">
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
        <div className="flex justify-between text-[#346853] text-sm font-medium">
          <span>Delivery Fee</span>
          <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "N/A"}</span>
        </div>
      </div>

      <div className="flex justify-between items-end border-t border-gray-100 pt-4">
        <span className="font-bold text-lg text-gray-900">Total</span>
        <span className="font-bold text-xl text-gray-900">
          {formatPrice(total + 10)}
        </span>
      </div>
    </div>
  );
};
