"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PaymentMethodsContent } from "./payment-methods/payment-methods-content";

const PaymentMethodsCard = () => {
  return (
    <Card className="rounded-3xl p-8 border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        <div>
          <CardTitle className="text-lg font-bold text-gray-900">
            Payment Methods
          </CardTitle>
          <p className="text-xs text-gray-400 mt-1">
            Manage your saved cards and default payment
          </p>
        </div>
        <Link href="/customer/wallet">
          <Button
            variant="outline"
            className="rounded-xl px-5 border-gray-200 text-xs font-bold cursor-pointer"
          >
            Manage
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <PaymentMethodsContent />
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsCard;
