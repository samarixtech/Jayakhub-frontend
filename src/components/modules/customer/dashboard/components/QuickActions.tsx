import Link from "next/link";
import {
  UtensilsCrossed,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  country: string;
  language: string;
}

const QUICK_ACTIONS = [
  {
    label: "Order Food",
    icon: UtensilsCrossed,
    color: "text-emerald-600",
    hrefSuffix: "/restaurants",
  },
  {
    label: "Reorder",
    icon: RotateCcw,
    color: "text-blue-500",
    hrefSuffix: null,
  },
  {
    label: "KYC Verify",
    icon: ShieldCheck,
    color: "text-amber-600",
    hrefSuffix: "/customer/profile-settings",
  },
  {
    label: "Payment Methods",
    icon: CreditCard,
    color: "text-purple-600",
    hrefSuffix: "/customer/wallet",
  },
];

export const QuickActions = ({ country, language }: QuickActionsProps) => {
  return (
    <Card className="border-none shadow-sm rounded-4xl bg-white p-8 h-fit">
      <Typography className="text-lg font-black text-gray-900 mb-6">
        Quick Actions
      </Typography>
      <div className="space-y-3">
        {QUICK_ACTIONS.map((action) => {
          const content = (
            <>
              <div className="flex items-center gap-3">
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-sm font-bold text-gray-700">
                  {action.label}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </>
          );

          if (action.hrefSuffix) {
            return (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-between h-14 px-5 rounded-2xl border-gray-50 bg-white hover:bg-gray-50 group transition-all"
                asChild
              >
                <Link href={`/${country}/${language}${action.hrefSuffix}`}>
                  {content}
                </Link>
              </Button>
            );
          }

          return (
            <Button
              key={action.label}
              variant="outline"
              className="w-full justify-between h-14 px-5 rounded-2xl border-gray-50 bg-white hover:bg-gray-50 group transition-all"
            >
              {content}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};
