import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export function PaymentHistoryMetrics({ summary }: { summary: any }) {
  const t = useTranslations("CustomerDashboard.PaymentHistory");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      {/* Total Spent */}
      <Card className="rounded-[20px] border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pt-5 pb-5 px-5 bg-white">
        <div className="flex gap-4 items-center">
          <div className="w-[46px] h-[46px] rounded-full bg-[#f0fdf4] flex items-center justify-center shrink-0">
            <span className="text-[#10b981] text-lg font-bold stroke-[2px]">
              $
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase mb-0.5">
              {t("total_spent")}
            </span>
            <span className="text-[22px] font-black text-[#1E293B] leading-none tracking-tight">
              $
              {Number(summary?.totalSpend || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </Card>

      {/* This Month */}
      <Card className="rounded-[20px] border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pt-5 pb-5 px-5 bg-white">
        <div className="flex gap-4 items-center">
          <div className="w-[46px] h-[46px] rounded-full bg-[#f0f9ff] flex items-center justify-center shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase mb-0.5">
              {t("this_month")}
            </span>
            <span className="text-[22px] font-black text-[#1E293B] leading-none tracking-tight">
              ${summary?.thisMonthSpentAmount || "0.00"}
            </span>
          </div>
        </div>
      </Card>

      {/* Pending */}
      <Card className="rounded-[20px] border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pt-5 pb-5 px-5 bg-white">
        <div className="flex gap-4 items-center">
          <div className="w-[46px] h-[46px] rounded-full bg-[#fff7ed] flex items-center justify-center shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ea580c"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase mb-0.5">
              {t("pending")}
            </span>
            <span className="text-[22px] font-black text-[#1E293B] leading-none tracking-tight">
              {summary?.totalPendingOrders || 0} {t("pending")}
            </span>
          </div>
        </div>
      </Card>

      {/* Next Billing */}
      <Card className="rounded-[20px] border border-gray-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] pt-5 pb-5 px-5 bg-white">
        <div className="flex gap-4 items-center">
          <div className="w-[46px] h-[46px] rounded-full bg-[#f5f3ff] flex items-center justify-center shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="M8 14h.01" />
              <path d="M12 14h.01" />
              <path d="M16 14h.01" />
              <path d="M8 18h.01" />
              <path d="M12 18h.01" />
              <path d="M16 18h.01" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase mb-0.5">
              {t("next_billing")}
            </span>
            <span className="text-[22px] font-black text-[#1E293B] leading-none tracking-tight">
              {t("dec_01")}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
