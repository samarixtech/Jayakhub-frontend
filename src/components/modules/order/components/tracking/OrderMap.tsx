import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface OrderMapProps {
  address: {
    latitude: number;
    longitude: number;
  };
}

export const OrderMap: React.FC<OrderMapProps> = ({ address }) => {
  return (
    <div className="w-full h-[300px] bg-blue-50 rounded-2xl border border-gray-100 overflow-hidden relative">
      <iframe
        title="Order Location"
        src={
          address
            ? `https://maps.google.com/maps?q=${address.latitude},${address.longitude}&z=15&output=embed`
            : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24097834749!2d106.829518!3d-6.175392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1652802379149!5m2!1sen!2sid"
        }
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      {/* Overlay controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm p-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-sm hover:bg-gray-100"
        >
          <Plus size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-sm hover:bg-gray-100"
        >
          <Minus size={16} />
        </Button>
      </div>
    </div>
  );
};
