"use client";

import React from "react";
import {
  Search,
  Plus,
  Utensils,
  CheckCircle,
  PauseCircle,
  Shapes,
  Edit2,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LocalizedLink from "@/components/navigation/LocalizedLink";
import { Typography } from "@/components/ui/typography";

// Mock Data matching screenshot
const STATS = [
  {
    label: "Total Items",
    value: "4",
    icon: Utensils,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    label: "Active",
    value: "3",
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    label: "Inactive",
    value: "1",
    icon: PauseCircle,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    label: "Categories",
    value: "2",
    icon: Shapes,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

const FILTERS = [
  { label: "All Items", count: 4, active: true },
  { label: "Appetizers", count: 1, active: false },
  { label: "Mains", count: 3, active: false },
  { label: "Sides", count: 0, active: false },
  { label: "Beverages", count: 0, active: false },
  { label: "Desserts", count: 0, active: false },
  { label: "cold", count: 0, active: false },
];

const ITEMS = [
  {
    id: 1,
    name: "Chicken Shawarma",
    subtitle: "undefined",
    category: "MAINS",
    categoryColor: "bg-white border-gray-200 text-gray-700", // Basic badge
    price: "$12.00",
    active: true,
    image:
      "https://images.unsplash.com/photo-1529006557810-274b9b2fc7d9?w=100&h=100&fit=crop", // Placeholder
  },
  {
    id: 2,
    name: "Mixed Kebab Plate",
    subtitle: "undefined",
    category: "MAINS",
    categoryColor: "bg-white border-gray-200 text-gray-700",
    price: "$18.00",
    active: true,
    image:
      "https://images.unsplash.com/photo-1544025162-d76690b6d012?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Hummus",
    subtitle: "undefined",
    category: "APPETIZERS",
    categoryColor: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-none", // Specific Highlight
    price: "$6.00",
    active: true,
    image:
      "https://images.unsplash.com/photo-1577906096429-f73c2c31a8a1?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Biryani Rice",
    subtitle: "undefined",
    category: "MAINS",
    categoryColor: "bg-white border-gray-200 text-gray-700",
    price: "$14.00",
    active: false,
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop",
  },
];

export default function MenuItemsView() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto p-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Custom Tabs */}
        <div className="flex p-1 bg-white rounded-lg border border-gray-100 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            className="bg-[#1F4D36] text-white hover:bg-[#183d2b] shadow-sm rounded-md"
          >
            Items
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-900"
          >
            Categories
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-900"
          >
            Variant Groups
          </Button>
        </div>

        <Button className="bg-[#1F4D36] hover:bg-[#183d2b] text-white gap-2">
          <Plus className="w-4 h-4" />
          Add New Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => (
          <Card
            key={idx}
            className="p-4 flex items-center gap-4 border-none shadow-sm"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <Typography
                variant="h3"
                className="font-bold text-gray-900 text-2xl"
              >
                {stat.value}
              </Typography>
              <Typography
                variant="p"
                className="text-gray-500 text-xs font-medium uppercase tracking-wide"
              >
                {stat.label}
              </Typography>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <div className="relative min-w-[200px] mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search items..."
              className="pl-9 bg-white border-gray-200 h-10 shadow-sm rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            {FILTERS.map((filter) => (
              <Badge
                key={filter.label}
                variant={filter.active ? "default" : "outline"}
                className={`h-9 px-4 rounded-full cursor-pointer transition-colors ${
                  filter.active
                    ? "bg-[#1F4D36] hover:bg-[#183d2b] text-white border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {filter.label}
                <span
                  className={`ml-2 text-xs opacity-80 ${filter.active ? "text-white" : "text-gray-400"}`}
                >
                  {filter.count}
                </span>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="border-gray-100 hover:bg-transparent">
              <TableHead className="font-semibold text-gray-500 text-xs uppercase w-[300px]">
                Item
              </TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase text-center">
                Category
              </TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase text-right">
                Price
              </TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase text-center">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ITEMS.map((item) => (
              <TableRow
                key={item.id}
                className="border-gray-50 hover:bg-gray-50/50 group"
              >
                {/* Item Column */}
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <Typography className="font-medium text-gray-900">
                        {item.name}
                      </Typography>
                      <Typography className="text-gray-400 text-xs">
                        {item.subtitle}
                      </Typography>
                    </div>
                  </div>
                </TableCell>

                {/* Category Column */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`font-semibold rounded-md border text-[10px] px-2 py-0.5 shadow-none uppercase ${item.categoryColor}`}
                  >
                    {item.category}
                  </Badge>
                </TableCell>

                {/* Price Column */}
                <TableCell className="text-right font-medium text-gray-700 font-mono">
                  {item.price}
                </TableCell>

                {/* Status Column */}
                <TableCell className="text-center">
                  <Switch
                    checked={item.active}
                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-200"
                  />
                </TableCell>

                {/* Actions Column */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
