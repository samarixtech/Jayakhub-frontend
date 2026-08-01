import Link from "next/link";
import {
  UtensilsCrossed,
  ShieldCheck,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import useLocale from "@/hooks/useLocals";

export const QuickActions = () => {
  const t = useTranslations("CustomerDashboard.QuickActions");
  const { country, language } = useLocale();

  const QUICK_ACTIONS = [
    {
      label: t("order_food"),
      icon: UtensilsCrossed,
      color: "text-primary",
      hrefSuffix: "/restaurants",
    },
    {
      label: t("kyc_verify"),
      icon: ShieldCheck,
      color: "text-gold-deep",
      hrefSuffix: "/customer/profile-settings",
    },
    {
      label: t("payment_methods"),
      icon: CreditCard,
      color: "text-navy",
      hrefSuffix: "/customer/wallet",
    },
  ];

  return (
    <Card className="border-none shadow-sm rounded-4xl bg-white p-8 h-fit">
      <Typography className="text-lg font-black text-navy mb-6">
        {t("quick_actions")}
      </Typography>
      <div className="space-y-3">
        {QUICK_ACTIONS.map((action) => {
          const content = (
            <>
              <div className="flex items-center gap-3">
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <span className="text-sm font-bold text-navy">
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
                <Link href={`/${country}/${language}${action.hrefSuffix}`}>{content}</Link>
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
