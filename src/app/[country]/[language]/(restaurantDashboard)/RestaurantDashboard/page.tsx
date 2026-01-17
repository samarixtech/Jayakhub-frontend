"use client";

import { useState, useEffect } from "react";
import { MdRestaurant, MdPerson, MdShoppingCart, MdAttachMoney } from "react-icons/md";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function DashboardHome() {
  // Sample metrics
  const metrics = [
    { title: "Total Restaurants", value: 12, icon: MdRestaurant, bg: "bg-[#0B5D4E]", iconColor: "text-[#fff]", trend: "+5%" },
    { title: "Total Owners", value: 8, icon: MdPerson, bg: "bg-green-600", iconColor: "text-green-100", trend: "+2%" },
    { title: "Active Orders", value: 34, icon: MdShoppingCart, bg: "bg-yellow-900", iconColor: "text-yellow-100", trend: "+10%" },
    { title: "Total Revenue", value: "$12,450", icon: MdAttachMoney, bg: "bg-purple-900", iconColor: "text-purple-100", trend: "+8%" },
  ];

  // Sample data for charts
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [4500, 5800, 6000, 7200, 8100, 9000],
        borderColor: "#0B5D4E",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const ordersData = {
    labels: ["Pizza", "Burger", "Pasta", "Salad", "Dessert"],
    datasets: [
      {
        label: "Orders",
        data: [120, 90, 70, 50, 30],
        backgroundColor: ["#0B5D4E", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
      },
    ],
  };

  const topItems = [
    { name: "Margherita Pizza", category: "Pizza", sold: 120 },
    { name: "Cheeseburger", category: "Burger", sold: 90 },
    { name: "Pasta Alfredo", category: "Pasta", sold: 70 },
    { name: "Caesar Salad", category: "Salad", sold: 50 },
    { name: "Chocolate Cake", category: "Dessert", sold: 30 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="flex items-center justify-between p-4 bg-[#E8F4F1] rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
            >
              {/* Left: Icon */}
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${metric.bg}`}>
                <Icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>

              {/* Right: Info */}
              <div className="flex flex-col text-right ml-auto">
                <p className="text-gray-500 text-sm">{metric.title}</p>
                <p className="text-lg font-semibold text-gray-800">{metric.value}</p>
                <span className="text-green-500 text-xs">{metric.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#E8F4F1] p-4 rounded-lg shadow">
          <h2 className="text-gray-700 font-semibold mb-2">Revenue Over Time</h2>
          <Line data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-[#E8F4F1] p-4 rounded-lg shadow">
          <h2 className="text-gray-700 font-semibold mb-2">Top Orders</h2>
          <Bar data={ordersData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {/* Top Items Table */}
      <div className="bg-[#E8F4F1] p-4 rounded-lg shadow">
        <h2 className="text-gray-700 font-semibold mb-4">Top Selling Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-[#FFF9EE] text-gray-600 uppercase text-sm">
                <th className="px-4 py-2 text-left">Item Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Sold</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item) => (
                <tr key={item.name} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">{item.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
