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
          weight: 'bold' as const
        },
      },
      border: { display: false }
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
          weight: 'bold' as const
        },
        callback: function (value: any) {
          return '$' + value;
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

const labels = [
  "Feb 1", "Feb 5", "Feb 9", "Feb 13", "Feb 17", "Feb 21", "Feb 25", "Feb 29"
];

const data = {
  labels,
  datasets: [
    {
      label: "Current Period",
      data: [1300, 1800, 1600, 1900, 1750, 1950, 1700, 1850],
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
      data: [1100, 1500, 1400, 1600, 1500, 1650, 1450, 1600],
      borderColor: "#a7f3d0", // Light emerald/mint
      backgroundColor: "transparent",
      fill: false,
      borderWidth: 2,
      borderDash: [5, 5],
    },
  ],
};

const SalesChart = () => {
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
        <Line options={options} data={data} />
      </div>
    </div>
  );
};

export default SalesChart;
