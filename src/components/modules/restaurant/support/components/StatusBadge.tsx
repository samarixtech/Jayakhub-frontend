import type { Ticket } from "../support.types";
import { useTranslations } from "next-intl";

const statusMap: Record<string, { bg: string; text: string; labelKey: string }> = {
  OPEN: { bg: "bg-[#fef3c7]", text: "text-[#d97706]", labelKey: "open" },
  IN_PROGRESS: {
    bg: "bg-[#dbeafe]",
    text: "text-[#2563eb]",
    labelKey: "inProgress",
  },
  RESOLVED: { bg: "bg-[#d1fae5]", text: "text-[#059669]", labelKey: "resolved" },
};

export const StatusBadge = ({ status }: { status: Ticket["status"] }) => {
  const t = useTranslations("RestaurantDashboard.Support.statusBadge");
  const s = statusMap[status] || statusMap.OPEN;
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${s.bg} ${s.text} w-fit`}
    >
      {t(s.labelKey)}
    </span>
  );
};
