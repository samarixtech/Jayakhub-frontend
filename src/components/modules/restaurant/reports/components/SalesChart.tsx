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
  const labels = graphData.map((item) => {
    const d = new Date(item.date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const salesValues = graphData.map((item) => item.sales);
  const maxSales = Math.max(...salesValues, 2000);
  const stepSize = Math.ceil(maxSales / 4);

  const dynamicOptions = {
    ...options,
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
  };

  const chartData = {
    labels: labels.length > 0 ? labels : ["No Data"],
    datasets: [
      {
        label: "Current Period",
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
        label: "Previous Period",
        data: salesValues.map((v) => v * 0.8), // Mock comparison if not provided by API
        borderColor: "#a7f3d0", // Light emerald/mint
        backgroundColor: "transparent",
        fill: false,
        borderWidth: 2,
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-[16px] font-bold text-gray-900 leading-none">
          Sales Over Time
        </h2>
        <p className="text-[12px] text-gray-400 mt-1">
          Revenue trend with previous period comparison
        </p>
      </div>
      <div className="flex-1 min-h-[250px] w-full mt-2 relative">
        <Line options={dynamicOptions as any} data={chartData} />
      </div>
    </div>
  );
};

export default SalesChart;
