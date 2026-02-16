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
      backgroundColor: "#fff",
      titleColor: "#374151",
      bodyColor: "#374151",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        label: (context: any) => `Sales: $${context.parsed.y}`,
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
        color: "#9ca3af",
        font: {
          size: 10,
        },
      },
    },
    y: {
      display: false, // Hide Y axis as per screenshot minimalist look
      grid: {
        display: false,
      },
    },
  },
  interaction: {
    mode: "nearest" as const,
    axis: "x" as const,
    intersect: false,
  },
  elements: {
    point: {
      radius: 0, // Hide points by default
      hoverRadius: 6,
      backgroundColor: "#1B4332",
    },
    line: {
      tension: 0.4, // Smooth curve
      borderWidth: 2,
    },
  },
};

const labels = [
  "Feb 01",
  "Feb 05",
  "Feb 10",
  "Feb 14",
  "Feb 18",
  "Feb 21",
  "Feb 25",
  "Feb 28",
];

const data = {
  labels,
  datasets: [
    {
      label: "Sales",
      data: [1200, 1900, 1500, 2200, 2800, 2400, 3100, 2900],
      borderColor: "#1B4332", // Primary green
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, "rgba(27, 67, 50, 0.1)");
        gradient.addColorStop(1, "rgba(27, 67, 50, 0)");
        return gradient;
      },
      fill: true,
    },
  ],
};

const SalesChart = () => {
  return (
    <div className="w-full h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Total Sales Over Time
        </h2>
        <div className="flex gap-4 text-xs font-medium text-gray-400">
          <span className="text-gray-900 cursor-pointer">Daily</span>
          <span className="hover:text-gray-900 cursor-pointer transition-colors">
            Weekly
          </span>
        </div>
      </div>
      <div className="relative h-[250px] w-full">
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default SalesChart;
