"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Legend,
  Filler,
);
import { useTranslations } from "next-intl";

interface ReviewsChartsProps {
  summary?: {
    trend: { date: string; avgRating: string }[];
    distribution: { [key: string]: number };
    totalReviews: number;
  };
}

export default function ReviewsCharts({ summary }: ReviewsChartsProps) {
  const t = useTranslations("RestaurantDashboard.Reviews.charts");
  const safeSummary = summary || {
    trend: [],
    distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    totalReviews: 0,
  };

  // -------- Rating Trend Chart Config --------

  // Transform trend data strictly ensuring length match
  const trendLabels =
    safeSummary.trend.length > 0
      ? safeSummary.trend.map((t) =>
          new Date(t.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
        )
      : ["No Data"];

  const trendValues =
    safeSummary.trend.length > 0
      ? safeSummary.trend.map((t) => parseFloat(t.avgRating))
      : [0];

  const trendData = {
    labels: trendLabels,
    datasets: [
      {
        fill: true,
        label: t("trend.label"),
        data: trendValues,
        borderColor: "#f5a623",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, "rgba(245, 166, 35, 0.4)"); // Light orange top
          gradient.addColorStop(1, "rgba(245, 166, 35, 0.0)"); // Transparent bottom
          return gradient;
        },
        borderWidth: 2,
        tension: 0.2, // Smooth curve
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1b2d22",
        padding: 10,
        titleFont: { size: 13, family: "sans-serif" },
        bodyFont: { size: 13, family: "sans-serif", weight: "bold" as const },
        displayColors: false,
      },
    },
    scales: {
      y: {
        min: 0.0,
        max: 5.0,
        ticks: {
          stepSize: 1.0,
          color: "#8ea89a",
          font: { size: 10, weight: "bold" as const },
        },
        border: { display: false },
        grid: {
          color: "#f3f4f6",
          drawTicks: false,
          borderDash: [5, 5], // Dashed grid lines
        },
      },
      x: {
        ticks: {
          color: "#8ea89a",
          font: { size: 10, weight: "bold" as const },
          padding: 10,
          maxTicksLimit: Math.max(trendLabels.length, 6),
        },
        border: { display: false },
        grid: { display: false },
      },
    },
  };

  // -------- Distribution Doughnut Config --------
  const distRaw = [
    safeSummary.distribution["5"] || 0,
    safeSummary.distribution["4"] || 0,
    safeSummary.distribution["3"] || 0,
    safeSummary.distribution["2"] || 0,
    safeSummary.distribution["1"] || 0,
  ];

  const totalDist = distRaw.reduce((sum, val) => sum + val, 0);
  const distPercentages = distRaw.map((v) =>
    totalDist === 0 ? 0 : Math.round((v / totalDist) * 100),
  );

  // Dynamic center text for chart
  const maxPercent = totalDist === 0 ? 0 : Math.max(...distPercentages);
  const maxIndex = distPercentages.indexOf(maxPercent);
  const centerSubText =
    totalDist === 0
      ? t("distribution.noReviews")
      : [
          t("distribution.stars5"),
          t("distribution.stars4"),
          t("distribution.stars3"),
          t("distribution.stars2"),
          t("distribution.stars1"),
        ][maxIndex];

  // Dummy array if 0 so doughnut still renders a grey ring
  const hasData = totalDist > 0;

  const distData = {
    labels: [
      t("distribution.stars5"),
      t("distribution.stars4"),
      t("distribution.stars3"),
      t("distribution.stars2"),
      t("distribution.stars1"),
    ],
    datasets: [
      {
        data: hasData ? distPercentages : [100],
        backgroundColor: hasData
          ? [
              "#f5a623", // Yellow
              "#5584ff", // Blue
              "#9c59f6", // Purple
              "#f97316", // Orange
              "#ef4444", // Default red
            ]
          : ["#f3f4f6"],
        borderWidth: 2,
        borderColor: "#ffffff",
        cutout: "75%", // Thickness of doughnut ring
        hoverOffset: hasData ? 4 : 0,
      },
    ],
  };

  const distOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: hasData, // Disable if no data
      },
    },
  };

  const colors = ["#f5a623", "#5584ff", "#9c59f6", "#f97316", "#ef4444"];
  const labels = [
    t("distribution.stars5"),
    t("distribution.stars4"),
    t("distribution.stars3"),
    t("distribution.stars2"),
    t("distribution.stars1"),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Rating Trend (Line Chart) */}
      <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm col-span-2 flex flex-col min-h-[340px]">
        <div className="mb-4">
          <h2 className="text-[16px] font-bold text-[#1b2d22]">{t("trend.title")}</h2>
          <p className="text-[12px] text-[#8ea89a] font-medium mt-0.5">
            {t("trend.subtitle")}
          </p>
        </div>
        <div className="flex-1 w-full relative">
          <Line data={trendData} options={trendOptions} />
        </div>
      </div>

      {/* Rating Distribution (Doughnut Chart) */}
      <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm col-span-1 flex flex-col h-full min-h-[340px]">
        <div className="mb-2">
          <h2 className="text-[16px] font-bold text-[#1b2d22]">
            {t("distribution.title")}
          </h2>
          <p className="text-[12px] text-[#8ea89a] font-medium mt-0.5">
            {t("distribution.subtitle")}
          </p>
        </div>

        {/* Chart Container */}
        <div className="w-full flex-1 relative flex items-center justify-center mt-2 max-h-[160px]">
          <Doughnut data={distData} options={distOptions} />
          {/* Center Text absolute placed */}
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none mt-1">
            <span className="text-[26px] font-black text-[#1b2d22] leading-none">
              {hasData ? `${maxPercent}%` : "0"}
            </span>
            <span className="text-[11px] font-bold text-[#8ea89a] mt-1">
              {centerSubText}
            </span>
          </div>
        </div>

        {/* Custom Legend Layout corresponding to mock */}
        <div className="mt-6 grid grid-cols-2 gap-y-3 gap-x-2">
          {distPercentages.map((percent, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                ></span>
                <span className="text-[11px] font-bold text-[#8ea89a]">
                  {labels[index]}
                </span>
              </div>
              <span className="text-[11px] font-black text-[#1b2d22]">
                {percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
