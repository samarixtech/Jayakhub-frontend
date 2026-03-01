"use client";
import { useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store/store";
import { clearCart } from "@/redux/slices/cartSlice";

export default function OrderConfirmedView() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { country, language, id } = params;

  // Clear cart on mount when order successfully placed
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="w-full flex items-center justify-center p-4 py-12 md:py-20">
      <div className="flex flex-col items-center text-center max-w-md w-full">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-[#346853]/10 rounded-full flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-[#346853] rounded-full flex items-center justify-center">
            <Check className="text-white w-8 h-8 stroke-3" />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
          Order Placed!
        </h1>
        <p className="text-gray-500 mb-1">
          Your order{" "}
          <span className="font-bold text-gray-900">{id || "88291"}</span> is
          confirmed.
        </p>
        <p className="text-gray-500 mb-8">Sit tight, good food is coming!</p>

        {/* Actions */}
        <div className="space-y-4 w-full px-8">
          <Button
            onClick={() => router.push(`/${country}/${language}/order/${id}`)}
            className="w-full h-12 bg-[#346853] hover:bg-[#2a5443] text-white font-bold rounded-lg shadow-lg shadow-[#346853]/20"
          >
            Track Order
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push(`/${country}/${language}/restaurants`)}
            className="w-full text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-transparent"
          >
            Continue Order
          </Button>
        </div>
      </div>
    </div>
  );
}
