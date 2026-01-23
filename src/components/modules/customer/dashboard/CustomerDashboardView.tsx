"use client";

import React from "react";
import {
  DollarSign,
  ShoppingBag,
  Star,
  Timer,
  UtensilsCrossed,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATS = [
  {
    label: "Total Spent",
    value: "$1,248.50",
    icon: DollarSign,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Total Orders",
    value: "142",
    icon: ShoppingBag,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Average Rating",
    value: "4.8",
    icon: Star,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    label: "Active Orders",
    value: "1",
    icon: Timer,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    name: "Gourmet Garden",
    items: "2 items",
    price: "$24.50",
    status: "DELIVERED",
    time: "Today, 1:30 PM",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 2,
    name: "Pizza Republic",
    items: "3 items",
    price: "$42.00",
    status: "DELIVERED",
    time: "Yesterday",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 3,
    name: "Burger King",
    items: "1 item",
    price: "$15.50",
    status: "CANCELLED",
    time: "Dec 20",
    color: "text-red-500",
    bg: "bg-red-50",
    isCancelled: true,
  },
];

const QUICK_ACTIONS = [
  { label: "Order Food", icon: UtensilsCrossed, color: "text-emerald-600" },
  { label: "Reorder", icon: RotateCcw, color: "text-blue-500" },
  { label: "KYC Verify", icon: ShieldCheck, color: "text-amber-600" },
  { label: "Payment Methods", icon: CreditCard, color: "text-purple-600" },
];

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <Typography
          variant="h2"
          className="text-2xl font-black text-gray-900 flex items-center gap-2"
        >
          Hello, John! 👋
        </Typography>
        <Typography variant="p" className="text-gray-500 text-sm mt-1">
          Here&apos;s what&apos;s happening with your account today.
        </Typography>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card
            key={stat.label}
            className="border-none shadow-sm rounded-3xl bg-white"
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div
                className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <Typography className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {stat.label}
                </Typography>
                <Typography className="text-xl font-black text-gray-900 leading-tight">
                  {stat.value}
                </Typography>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Section */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-4xl bg-white overflow-hidden">
          <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-black text-gray-900">
              Recent Activity
            </CardTitle>
            <Button
              variant="link"
              className="text-emerald-600 font-bold text-xs p-0 h-auto"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6 mt-4">
            {RECENT_ACTIVITY.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0`}
                  >
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <Typography className="font-bold text-gray-900 text-sm">
                      {activity.name}
                    </Typography>
                    <Typography className="text-xs text-gray-400 font-medium">
                      {activity.items} • {activity.price}
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={`rounded-full px-3 py-0.5 text-[10px] font-bold border-none ${activity.bg} ${activity.color}`}
                  >
                    {activity.status}
                  </Badge>
                  <Typography className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-tighter">
                    {activity.time}
                  </Typography>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions Section */}
        <Card className="border-none shadow-sm rounded-4xl bg-white p-8 h-fit">
          <Typography className="text-lg font-black text-gray-900 mb-6">
            Quick Actions
          </Typography>
          <div className="space-y-3">
            {QUICK_ACTIONS.map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="w-full justify-between h-14 px-5 rounded-2xl border-gray-50 bg-white hover:bg-gray-50 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-sm font-bold text-gray-700">
                    {action.label}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
