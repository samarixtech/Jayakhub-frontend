import { useTranslations } from "next-intl";

interface OrderSourcesProps {
  sources?: { walkInDineIn: number; online: number };
}

const OrderSources = ({
  sources = { walkInDineIn: 0, online: 0 },
}: OrderSourcesProps) => {
  const t = useTranslations("RestaurantDashboard.Reports.charts.sources");

  const data = [
    {
      id: "1",
      source: t("walkIn"),
      percentage: sources.walkInDineIn,
      color: "bg-[#1B4332]", // Dark Green
    },
    {
      id: "2",
      source: t("online"),
      percentage: sources.online,
      color: "bg-[#3B82F6]", // Blue
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-[16px] font-bold text-gray-900">{t("title")}</h2>
        <p className="text-[12px] text-gray-500 mt-0.5">
          {t("subtitle")}
        </p>
      </div>

      <div className="space-y-6">
        {data.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-[13px] font-bold text-gray-900 leading-none">
                {item.source}
              </span>
              <span className="text-[13px] font-bold text-gray-900 leading-none">
                {item.percentage.toFixed(2)}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSources;
