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
import { useCLC } from "@/context/CLCContext";
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

interface RevenueChartProps {
  points: number[];
  prevPoints: number[];
  labels: string[];
}

const RevenueChart = ({ points, prevPoints, labels }: RevenueChartProps) => {
  const { currency } = useCLC();
  const tTrend = useTranslations("RestaurantDashboard.Payments.revenueTrend");

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
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += currency + context.parsed.y.toLocaleString();
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "#a0a0a0",
          font: {
            size: 10,
            weight: "600" as const,
          },
        },
        border: { display: false },
      },
      y: {
        grid: {
          color: "#f0f0f0",
          drawTicks: false,
        },
        ticks: {
          color: "#a0a0a0",
          font: {
            size: 10,
            weight: "600" as const,
          },
          callback: function (value: any) {
            return currency + value;
          },
        },
        border: { display: false },
        beginAtZero: true,
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
      y: {
        from: 500,
      }
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
      },
      line: {
        tension: 0.3, // very slight curve but mostly straight between points
      },
    },
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: tTrend("currentPeriod"),
        data: points,
        borderColor: "#346853",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(52, 104, 83, 0.4)");
          gradient.addColorStop(1, "rgba(52, 104, 83, 0)");
          return gradient;
        },
        fill: true,
        borderWidth: 2,
      },
      {
        label: tTrend("previousPeriod"),
        data: prevPoints,
        borderColor: "#d0d0d0",
        backgroundColor: "transparent",
        fill: false,
        borderWidth: 1.5,
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <div className="w-full min-h-[220px] h-[220px] relative mt-4">
      <Line options={options as any} data={chartData} redraw={true} />
    </div>
  );
};

export default RevenueChart;
