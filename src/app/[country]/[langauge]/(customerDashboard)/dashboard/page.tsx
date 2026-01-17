"use client";
import {
  ShoppingBag,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  DollarSign,
  Package,
  ChevronRight,
  Calendar,
  Sparkles,
  Heart,
  Coffee,
  Pizza,
  LucideIcon,
} from "lucide-react";
import { useState, useMemo } from "react";

// Type definitions
interface StatCard {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  change: string;
  trend: "up" | "down";
}

interface RecentActivity {
  id: string;
  type: "order" | "review" | "favorite";
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface FavoriteRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  orders: number;
  icon: LucideIcon;
  color: string;
}

interface QuickAction {
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  href: string;
}

interface UpcomingOrder {
  id: string;
  restaurant: string;
  items: string;
  time: string;
  status: string;
}

interface TimeRangeOption {
  value: "week" | "month" | "year";
  label: string;
}

interface Category {
  icon: LucideIcon;
  label: string;
  count: string;
  color: string;
}

export default function DashboardOverviewPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

  const statsData: StatCard[] = [
    {
      label: "Total Orders",
      value: "42",
      icon: ShoppingBag,
      color: "text-[#0B5D4E]",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Total Spent",
      value: "$1,248",
      icon: DollarSign,
      color: "text-green-600",
      change: "+8%",
      trend: "up",
    },
    {
      label: "Favorite Spots",
      value: "8",
      icon: Heart,
      color: "text-red-600",
      change: "+2",
      trend: "up",
    },
    {
      label: "Avg Rating",
      value: "4.8",
      icon: Star,
      color: "text-amber-600",
      change: "+0.2",
      trend: "up",
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: "1",
      type: "order",
      title: "Order Placed",
      description: "Sushi Master • 2x Spicy Tuna Roll",
      time: "Just now",
      icon: ShoppingBag,
      color: "text-[#0B5D4E] bg-[#0B5D4E]",
    },
    {
      id: "2",
      type: "review",
      title: "Review Added",
      description: "5 stars for Burger & Co.",
      time: "2 hours ago",
      icon: Star,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: "3",
      type: "favorite",
      title: "Restaurant Favorited",
      description: "Added Pizza Paradiso to favorites",
      time: "1 day ago",
      icon: Heart,
      color: "text-red-600 bg-red-50",
    },
    {
      id: "4",
      type: "order",
      title: "Order Delivered",
      description: "Thai Orchid • Pad Thai & Spring Rolls",
      time: "2 days ago",
      icon: Package,
      color: "text-green-600 bg-green-50",
    },
  ];

  const favoriteRestaurants: FavoriteRestaurant[] = [
    {
      id: "1",
      name: "Burger & Co.",
      cuisine: "American • Burgers",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop",
      orders: 12,
      icon: Pizza,
      color: "text-orange-600 bg-orange-50",
    },
    {
      id: "2",
      name: "Sushi Master",
      cuisine: "Japanese • Sushi",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=300&auto=format&fit=crop",
      orders: 8,
      icon: Pizza,
      color: "text-red-600 bg-red-50",
    },
    {
      id: "3",
      name: "Pizza Paradiso",
      cuisine: "Italian • Pizza",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=300&auto=format&fit=crop",
      orders: 6,
      icon: Pizza,
      color: "text-yellow-600 bg-yellow-50",
    },
    {
      id: "4",
      name: "Ramen House",
      cuisine: "Japanese • Ramen",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=300&auto=format&fit=crop",
      orders: 5,
      icon: Coffee,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      label: "Order Food",
      description: "Get your favorite meals delivered",
      icon: ShoppingBag,
      color: "text-[#0B5D4E] bg-[#0B5D4E]",
      href: "/order",
    },
    {
      label: "Track Order",
      description: "Check your current order status",
      icon: MapPin,
      color: "text-green-600 bg-green-50",
      href: "/orders",
    },
    {
      label: "View History",
      description: "See your past orders and reviews",
      icon: Clock,
      color: "text-purple-600 bg-purple-50",
      href: "/orders",
    },
    {
      label: "Favorites",
      description: "Browse your favorite restaurants",
      icon: Heart,
      color: "text-red-600 bg-red-50",
      href: "/favorites",
    },
  ];

  const upcomingOrders: UpcomingOrder[] = [
    {
      id: "ORD-9921",
      restaurant: "Sushi Master",
      items: "2x Spicy Tuna Roll, 1x Miso Soup",
      time: "15-20 min",
      status: "On the way",
    },
    {
      id: "ORD-9922",
      restaurant: "Burger & Co.",
      items: "Double Cheeseburger, Fries",
      time: "25-30 min",
      status: "Preparing",
    },
  ];

  const timeRangeOptions: TimeRangeOption[] = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  const categories: Category[] = [
    {
      icon: Pizza,
      label: "Burgers",
      count: "24 orders",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: Pizza,
      label: "Pizza",
      count: "18 orders",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: Pizza,
      label: "Sushi",
      count: "15 orders",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Coffee,
      label: "Coffee",
      count: "12 orders",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleTimeRangeChange = (value: "week" | "month" | "year") => {
    setTimeRange(value);
  };

  const handleQuickActionClick = (href: string) => {
    // In a real app, you would use router.push(href)
    console.log(`Navigating to: ${href}`);
  };

  const handleFavoriteClick = (restaurantId: string) => {
    // In a real app, you would toggle favorite status
    console.log(`Toggling favorite for restaurant: ${restaurantId}`);
  };

  const handleCategoryClick = (categoryLabel: string) => {
    // In a real app, you would navigate to category page
    console.log(`Viewing category: ${categoryLabel}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8" aria-labelledby="page-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="space-y-2">
            <h1
              id="page-title"
              className="text-2xl font-semibold text-gray-900"
            >
              {greeting}, Alex! 👋
            </h1>
            <p className="text-gray-600">
              Here&apos;s what&apos;s happening with your food orders today
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#E8F4F1] border border-[#FFF9EE] rounded-lg p-1">
              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTimeRangeChange(option.value)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    timeRange === option.value
                      ? "bg-[#0B5D4E] text-[#E8F4F1]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <section aria-label="Overview statistics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="bg-[#E8F4F1] rounded-xl border border-[#FFF9EE] p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    <stat.icon size={24} className={stat.color} />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp
                      size={16}
                      className={
                        stat.trend === "up"
                          ? "text-green-600"
                          : "text-red-600 rotate-180"
                      }
                    />
                    {stat.change}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <section aria-labelledby="quick-actions-heading">
              <div className="bg-[#E8F4F1] rounded-xl border border-[#FFF9EE] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="quick-actions-heading"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Quick Actions
                  </h2>
                  <Sparkles size={20} className="text-[#0B5D4E]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickActionClick(action.href)}
                      className="p-4 text-left bg-gray-50 rounded-lg hover:bg-[#FFF9EE] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-[#B6932F] transition-colors">
                            {action.label}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {action.description}
                          </div>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-gray-400 group-hover:text-[#B6932F] transition-colors"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Upcoming Orders */}
            <section aria-labelledby="upcoming-orders-heading">
              <div className="bg-[#E8F4F1] rounded-xl border border-[#FFF9EE] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="upcoming-orders-heading"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Upcoming Orders
                  </h2>
                  <Clock size={20} className="text-[#0B5D4E]" />
                </div>
                <div className="space-y-4">
                  {upcomingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-[#0B5D4E] rounded-lg border border-[#0B5D4E]"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">
                          {order.restaurant}
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#0B5D4E]">
                          <Clock size={14} />
                          <span>ETA: {order.time}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-[#0B5D4E] text-[#0B5D4E] rounded-full text-sm font-medium">
                        {order.status}
                      </span>
                    </div>
                  ))}
                  {upcomingOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingBag
                        size={32}
                        className="mx-auto mb-3 text-gray-300"
                      />
                      <div>No upcoming orders</div>
                      <div className="text-sm">
                        Start your first order today!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <section aria-labelledby="recent-activity-heading">
              <div className="bg-[#E8F4F1] rounded-xl border border-[#FFF9EE] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="recent-activity-heading"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Recent Activity
                  </h2>
                  <Calendar size={20} className="text-[#0B5D4E]" />
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${activity.color} mt-1 flex-shrink-0`}
                      >
                        <activity.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">
                          {activity.title}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {activity.description}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Favorite Restaurants */}
            <section aria-labelledby="favorites-heading">
              <div className="bg-[#E8F4F1] rounded-xl border border-[#FFF9EE] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="favorites-heading"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Favorite Spots
                  </h2>
                  <Heart size={20} className="text-red-600" />
                </div>
                <div className="space-y-4">
                  {favoriteRestaurants.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {restaurant.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {restaurant.cuisine}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star
                              size={12}
                              className="text-amber-500 fill-current"
                            />
                            <span className="text-xs text-gray-600">
                              {restaurant.rating}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">
                            {restaurant.orders} orders
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleFavoriteClick(restaurant.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Heart size={16} className="fill-current" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Popular Categories */}
        <section aria-labelledby="categories-heading">
          <div className="bg-[#E8F4F1] rounded-xl border border-[#FFF9EE] p-6">
            <h2
              id="categories-heading"
              className="text-lg font-semibold text-gray-900 mb-6"
            >
              Popular Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category.label)}
                  className="p-4 border border-[#FFF9EE] rounded-lg hover:border-yellow-200 hover:bg-[#0B5D4E] transition-colors group cursor-pointer text-left w-full"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#B6932F] transition-colors">
                        {category.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {category.count}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
