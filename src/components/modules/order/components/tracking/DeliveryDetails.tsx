import React from "react";
import { MapPin, CreditCard } from "lucide-react";

interface DeliveryDetailsProps {
  userName?: string;
  address?: {
    fullAddress: string;
  };
  paymentMethod: string;
  paymentDetails?: {
    cardType?: string;
    cardNumber?: string;
  };
}

export const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  userName,
  address,
  paymentMethod,
  paymentDetails,
}) => {
  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white">
      <div className=" flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-[#346853]" />
        <h3 className="font-bold text-gray-900">Delivery Address</h3>
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">
          {userName || "Grand Indonesia East Mall"}
        </h4>
        <p className="text-sm text-gray-500 leading-relaxed">
          {address?.fullAddress ||
            "Level 3, Shop 10-12, Jl. M.H. Thamrin No.1, Jakarta Pusat, 10310"}
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-3">
          <div className="w-8 h-5 border bg-white rounded flex items-center justify-center">
            {paymentMethod === "card" ? (
              <CreditCard size={12} />
            ) : (
              <div className="text-[10px] font-bold">COD</div>
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">
              Paid via {paymentDetails?.cardType || "Cash"}
            </p>
            <p className="text-xs text-gray-500">
              {paymentDetails?.cardNumber || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
