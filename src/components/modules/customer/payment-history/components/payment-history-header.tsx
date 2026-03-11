import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { generatePaymentHistoryPDF } from "@/lib/utils/PaymentHistoryPDF";

interface PaymentHistoryHeaderProps {
  orders: any[];
  summary: any;
  userEmail: string;
  userName: string;
}

export function PaymentHistoryHeader({
  orders,
  summary,
  userEmail,
  userName,
}: PaymentHistoryHeaderProps) {
  const t = useTranslations("CustomerDashboard.PaymentHistory");
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <Typography
          variant="h2"
          className="text-[#1E293B] font-bold text-[22px] tracking-tight"
        >
          {t("title")}
        </Typography>
        <Typography className="text-[#64748B] text-[13px] font-medium mt-1">
          {t("subtitle")}
        </Typography>
      </div>
      <div className="flex items-center gap-3">
        <Button
          onClick={() =>
            generatePaymentHistoryPDF(orders, summary, userEmail, userName)
          }
          className="h-10 rounded-full bg-white text-[#1E293B] hover:bg-gray-50 border border-gray-200 shadow-sm font-bold text-[13px] px-5"
        >
          <FileDown className="w-4 h-4 mr-2 stroke-[2.5px]" /> {t("export_pdf")}
        </Button>
      </div>
    </header>
  );
}
