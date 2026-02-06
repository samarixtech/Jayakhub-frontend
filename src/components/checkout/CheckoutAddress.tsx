// src/components/checkout/CheckoutAddress.tsx

import React from "react";
import { Home, Plus, ChevronRight, MapPin } from "lucide-react";

const CheckoutAddress: React.FC = () => {
  // Mock data for saved addresses
  const addresses = [
    {
      id: 1,
      label: "Home",
      address: "123 Main Street, Islamabad",
      icon: Home,
      selected: true,
    },
    {
      id: 2,
      label: "Work",
      address: "Office 45, yellow Area, F8",
      icon: MapPin,
      selected: false,
    },
  ];

  return (
    <div className="bg-[#E8F4F1] p-6 rounded-xl shadow-md border border-[#FFF9EE]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">1. Delivery Address</h2>
        <button className="text-sm text-[#0B5D4E] font-semibold flex items-center hover:text-[#B6932F] transition">
          Change <ChevronRight size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`flex items-start p-3 rounded-lg border-2 transition cursor-pointer 
                            ${addr.selected ? "border-[#0B5D4E] bg-[#0B5D4E] text-white" : "border-[#FFF9EE] hover:border-gray-300"}`}
          >
            <addr.icon
              className={`w-5 h-5 mt-1 mr-3 ${addr.selected ? "text-[#0B5D4E]" : "text-gray-500"}`}
            />
            <div>
              <p className="font-semibold">{addr.label}</p>
              <p className="text-sm text-gray-600">{addr.address}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 flex items-center justify-center space-x-2 py-3 border border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-50 transition">
        <Plus size={18} />
        <span className="font-semibold text-sm">Add New Address</span>
      </button>
    </div>
  );
};

export default CheckoutAddress;
