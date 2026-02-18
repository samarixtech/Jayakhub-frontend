"use client";

import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import useLocale from "@/hooks/useLocals";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Define Types based on API Response
interface OrderItem {
  name: string;
  price: string;
  quantity: number;
  image: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardType: string;
  ownerName: string;
}

interface Order {
  orderId: string;
  totalAmount: string;
  status: string;
  paymentMethod: string;
  orderDate: string;
  orderTime: string;
  paymentDetails: PaymentDetails;
  items: OrderItem[];
}

interface OrderSummary {
  totalSpend: string;
  totalOrdersCount: number;
  totalPendingOrders: number;
}

const QUICK_ACTIONS = [
  { label: "Order Food", icon: UtensilsCrossed, color: "text-emerald-600", hrefSuffix: "/restaurants" },
  { label: "Reorder", icon: RotateCcw, color: "text-blue-500", hrefSuffix: null },
  { label: "KYC Verify", icon: ShieldCheck, color: "text-amber-600", hrefSuffix: "/customer/profile-settings" },
  { label: "Payment Methods", icon: CreditCard, color: "text-purple-600", hrefSuffix: "/customer/wallet" },
];

export default function OverviewPage() {
  const { country, language } = useLocale();
  const [summary, setSummary] = useState<OrderSummary>({
    totalSpend: "0.00",
    totalOrdersCount: 0,
    totalPendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const { getAllOrders } = await import("@/app/actions/customer/order");
        const result = await getAllOrders();



        // The API returns { success: true, data: { meta: {...}, data: { summary: {...}, orders: [...] } } }
        // We need to parse this structure correctly.
        if (result.success && result.data && result.data.data) {
          const apiData = result.data.data;
          if (apiData.summary) {
            setSummary(apiData.summary);
          }
          if (apiData.orders && Array.isArray(apiData.orders)) {
            setRecentOrders(apiData.orders);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "paid" || s === "delivered") return { color: "text-emerald-600", bg: "bg-emerald-50" };
    if (s === "pending") return { color: "text-orange-600", bg: "bg-orange-50" };
    if (s === "cancelled") return { color: "text-red-600", bg: "bg-red-50" };
    return { color: "text-gray-600", bg: "bg-gray-50" };
  };

  const STATS = [
    {
      label: "Total Spent",
      value: `$${summary.totalSpend}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Orders",
      value: summary.totalOrdersCount.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Average Rating",
      value: "4.8", // Static rating
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Active Orders",
      value: summary.totalPendingOrders.toString(),
      icon: Timer,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">


      {/* Welcome Header */}
      <div>
        <Typography
          variant="h2"
          className="text-2xl font-black text-gray-900 flex items-center gap-2"
        >
          Overview
        </Typography>
        <Typography variant="p" className="text-gray-500 text-sm mt-1">
          Welcome back, here&apos;s what&apos;s happening with your account
          today.
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
              <div className="space-y-1">
                <Typography className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {stat.label}
                </Typography>
                {loading ? (
                  <Skeleton className="h-7 w-24" />
                ) : (
                  <Typography className="text-xl font-black text-gray-900 leading-tight">
                    {stat.value}
                  </Typography>
                )}
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
              asChild
            >
              <Link href={`/${country}/${language}/customer/order-history`}>
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-8 pb-8 space-y-6 mt-4">
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-2xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                // Use first item name or fallback
                const orderName = (order.items && order.items.length > 0) ? order.items[0].name : `Order #${order.orderId.substring(0, 8)}`;
                const itemCount = (order.items || []).reduce((acc, item) => acc + item.quantity, 0);

                return (
                  <div
                    key={order.orderId}
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
                          {orderName}
                        </Typography>
                        <Typography className="text-xs text-gray-400 font-medium">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'} • ${order.totalAmount}
                        </Typography>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`rounded-full px-3 py-0.5 text-[10px] font-bold border-none ${statusStyle.bg} ${statusStyle.color}`}
                      >
                        {order.status.toUpperCase()}
                      </Badge>
                      <Typography className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-tighter">
                        {order.orderDate}, {order.orderTime}
                      </Typography>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-4">No recent activity.</div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Section */}
        <Card className="border-none shadow-sm rounded-4xl bg-white p-8 h-fit">
          <Typography className="text-lg font-black text-gray-900 mb-6">
            Quick Actions
          </Typography>
          <div className="space-y-3">
            {QUICK_ACTIONS.map((action) => {
              const content = (
                <>
                  <div className="flex items-center gap-3">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-sm font-bold text-gray-700">
                      {action.label}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </>
              );

              if (action.hrefSuffix) {
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="w-full justify-between h-14 px-5 rounded-2xl border-gray-50 bg-white hover:bg-gray-50 group transition-all"
                    asChild
                  >
                    <Link href={`/${country}/${language}${action.hrefSuffix}`}>
                      {content}
                    </Link>
                  </Button>
                );
              }

              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-between h-14 px-5 rounded-2xl border-gray-50 bg-white hover:bg-gray-50 group transition-all"
                >
                  {content}
                </Button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
