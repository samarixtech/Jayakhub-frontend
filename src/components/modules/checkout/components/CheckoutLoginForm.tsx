import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CheckoutLoginForm = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
        <User className="w-10 h-10 text-[#346853]" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Login to Place Order
        </h2>
        <p className="text-gray-500 max-w-sm mx-auto">
          Please sign in or create an account to proceed with your order and
          manage your delivery details.
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          onClick={() => router.push("/login")}
          className="bg-[#346853] hover:bg-[#2a5443] text-white px-8 rounded-full font-bold h-12"
        >
          Login / Sign Up
        </Button>
      </div>
    </div>
  );
};
