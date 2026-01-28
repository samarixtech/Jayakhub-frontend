"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, CreditCard, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getMyCardsAction } from "@/app/actions/customer/userprofile";
import LocalizedLink from "@/components/navigation/LocalizedLink";

const PaymentMethodsCard = () => {
  const [defaultCard, setDefaultCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefaultCard = async () => {
      const result = await getMyCardsAction();
      if (result.success && result.data) {
        // FIND DEFAULT CARD
        const foundDefault = result.data.find(
          (card: any) => card.isDefault === true,
        );
        setDefaultCard(foundDefault);
      }
      setLoading(false);
    };

    fetchDefaultCard();
  }, []);

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
        <LocalizedLink href="/customer/wallet">
          {" "}
          <Button
            variant="outline"
            className="rounded-xl px-5 border-gray-200 text-xs font-bold cursor-pointer"
          >
            Manage
          </Button>
        </LocalizedLink>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : defaultCard ? (
          <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-3xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-[#1A1F71] p-2 rounded-lg">
                <CreditCard className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 capitalize">
                  {defaultCard.cardType || "Card"} ending in{" "}
                  {defaultCard.cardNumber.slice(-4)}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Expires {defaultCard.expiryDate} • Default
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-3xl border border-dashed">
            <p className="text-xs text-gray-500">No default card set</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsCard;
