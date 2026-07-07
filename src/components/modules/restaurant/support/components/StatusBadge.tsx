import { useTranslations } from "next-intl";

const statusMap: Record<string, { bg: string; text: string; labelKey: string; defaultLabel: string }> = {
  OPEN: { bg: "bg-[#fef3c7]", text: "text-[#d97706]", labelKey: "open", defaultLabel: "OPEN" },
  IN_PROGRESS: {
    bg: "bg-[#dbeafe]",
    text: "text-[#2563eb]",
    labelKey: "inProgress",
    defaultLabel: "IN PROGRESS",
  },
  RESOLVED: { bg: "bg-[#d1fae5]", text: "text-[#059669]", labelKey: "resolved", defaultLabel: "RESOLVED" },
  CLOSED: { bg: "bg-gray-100", text: "text-gray-600", labelKey: "closed", defaultLabel: "CLOSED" },
};

export const StatusBadge = ({ status }: { status: string }) => {
  const t = useTranslations("RestaurantDashboard.Support.statusBadge");
  const key = status ? status.toUpperCase() : "OPEN";
  const s = statusMap[key] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
    labelKey: status ? status.toLowerCase() : "open",
    defaultLabel: status ? status.toUpperCase() : "OPEN",
  };

  let label = s.defaultLabel;
  try {
    const translated = t(s.labelKey);
    if (translated && !translated.includes(s.labelKey)) {
      label = translated;
    }
  } catch {
    // Fallback to default
  }

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${s.bg} ${s.text} w-fit`}
    >
      {label}
    </span>
  );
};
