import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Payout {
  id: string;
  date: string; // e.g., "Today, 4:00 PM"
  amount: string;
  bankAccount: string;
  status: "IN TRANSIT" | "PAID";
}



interface PayoutsListProps {
  payouts: Payout[];
}

const PayoutsList = ({ payouts }: PayoutsListProps) => {
  return (
    <Card className="border-gray-100 shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50">
        <div>
          <CardTitle className="text-lg font-bold text-gray-900">
            Payouts
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Transfers to your bank account ending in •••• 4242
          </p>
        </div>
        <Button
          variant="ghost"
          className="text-primary hover:text-primary/90 hover:bg-primary/10 font-medium text-sm"
        >
          View All Payouts
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-4 gap-4 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
            <div>Date</div>
            <div>Amount</div>
            <div>Bank Account</div>
            <div>Status</div>
          </div>

          {/* Rows */}
          {payouts.map((payout) => (
            <div
              key={payout.id}
              className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 cursor-pointer group"
            >
              <div className="text-sm font-medium text-gray-700">
                {payout.date}
              </div>
              <div className="text-sm font-bold text-gray-900">
                {payout.amount}
              </div>
              <div className="text-sm text-gray-500">{payout.bankAccount}</div>
              <div className="flex items-center justify-between">
                <Badge
                  className={`rounded-sm px-2 py-0.5 text-[10px] font-bold shadow-none border-none ${
                    payout.status === "IN TRANSIT"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {payout.status}
                </Badge>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
              </div>
            </div>
          ))}
          {payouts.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No payouts found for this period.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayoutsList;
