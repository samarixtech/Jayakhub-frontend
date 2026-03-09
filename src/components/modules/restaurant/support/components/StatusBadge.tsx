import type { Ticket } from "../support.types";

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  OPEN: { bg: "bg-[#fef3c7]", text: "text-[#d97706]", label: "OPEN" },
  IN_PROGRESS: {
    bg: "bg-[#dbeafe]",
    text: "text-[#2563eb]",
    label: "IN PROGRESS",
  },
  RESOLVED: { bg: "bg-[#d1fae5]", text: "text-[#059669]", label: "RESOLVED" },
};

export const StatusBadge = ({ status }: { status: Ticket["status"] }) => {
  const s = statusMap[status] || statusMap.OPEN;
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${s.bg} ${s.text} w-fit`}
    >
      {s.label}
    </span>
  );
};
