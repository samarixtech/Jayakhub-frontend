"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTranslations } from "next-intl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
      backgroundColor: "#1b2d22",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 10,
      displayColors: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: "#9ca3af", // gray-400
        font: {
          size: 10,
          weight: "bold" as const,
        },
      },
      border: { display: false },
    },
    y: {
      grid: {
        color: "#f3f4f6", // gray-100
        drawTicks: false,
      },
      ticks: {
        color: "#9ca3af", // gray-400
        font: {
          size: 10,
          weight: "bold" as const,
        },
        callback: function (value: any) {
          return "$" + value;
        },
        stepSize: 495,
      },
      border: { display: false },
      min: 0,
      max: 2000,
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
  animation: {
    duration: 700,
    easing: "easeOutQuart" as const,
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 6,
    },
    line: {
      tension: 0.1, // very slight curve but mostly straight between points
    },
  },
};

interface SalesChartProps {
  graphData?: { date: string; sales: number }[];
}

const SalesChart = ({ graphData = [] }: SalesChartProps) => {
  const [mounted, setMounted] = React.useState(false);
  const t = useTranslations("RestaurantDashboard.Reports.charts.sales");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Show only last 7 days
  const displayedData = graphData.slice(-7);

  const labels = displayedData.map((item) => {
    const d = new Date(item.date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const salesValues = displayedData.map((item) => item.sales);
  const maxSales = Math.max(...salesValues, 2000);
  const stepSize = Math.ceil(maxSales / 4);

  const dynamicOptions = React.useMemo(() => ({
    ...options,
    animation: {
      duration: 700,
      easing: "easeOutQuart" as const,
      y: {
        from: 500, // Starts from slightly below the baseline for a raising up effect
      }
    },
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        max: maxSales + stepSize / 2,
        ticks: {
          ...options.scales.y.ticks,
          stepSize: stepSize,
        },
      },
    },
  }), [maxSales, stepSize]);

  const chartData = React.useMemo(() => ({
    labels: labels.length > 0 ? labels : [t("noData")],
    datasets: [
      {
        label: t("currentPeriod"),
        data: salesValues.length > 0 ? salesValues : [0],
        borderColor: "#1B4332", // Dark Green
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(27, 67, 50, 0.15)");
          gradient.addColorStop(1, "rgba(27, 67, 50, 0.02)");
          return gradient;
        },
        fill: true,
        borderWidth: 2,
      },
      {
        label: t("previousPeriod"),
        data: salesValues.map((v) => v * 0.8), // Mock comparison if not provided by API
        borderColor: "#a7f3d0", // Light emerald/mint
        backgroundColor: "transparent",
        fill: false,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  }), [labels, salesValues, t]);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-[16px] font-bold text-gray-900 leading-none">
          {t("title")}
        </h2>
        <p className="text-[12px] text-gray-400 mt-1">
          {t("subtitle")}
        </p>
      </div>
      <div className="flex-1 min-h-[250px] w-full mt-2 relative">
        {mounted && (
          <Line options={dynamicOptions as any} data={chartData} redraw={true} />
        )}
      </div>
    </div>
  );
};

export default SalesChart;
