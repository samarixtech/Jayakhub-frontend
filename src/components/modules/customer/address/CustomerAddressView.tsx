"use client";
import {
  Home,
  Briefcase,
  Users,
  Pencil,
  Trash2,
  Plus,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Mock Data for Addresses
const ADDRESSES = [
  {
    id: 1,
    type: "Personal",
    label: "Home",
    icon: <Home className="h-5 w-5 text-emerald-600" />,
    iconBg: "bg-emerald-50",
    fullAddress: "123 Main Street, Apt 4B\nSan Francisco, CA 94102",
    isDefault: true,
  },
  {
    id: 2,
    type: "Business",
    label: "Work Office",
    icon: <Briefcase className="h-5 w-5 text-blue-600" />,
    iconBg: "bg-blue-50",
    fullAddress: "456 Market Street, Floor 12\nSan Francisco, CA 94103",
    isDefault: false,
  },
  {
    id: 3,
    type: "Family",
    label: "Parents' House",
    icon: <Users className="h-5 w-5 text-purple-600" />,
    iconBg: "bg-purple-50",
    fullAddress: "789 Oak Avenue\nPalo Alto, CA 94301",
    isDefault: false,
  },
];

export default function CustomerAddressView() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <Typography
              variant="h2"
              className="text-[#1F2937] font-bold text-2xl tracking-tight"
            >
              My Addresses
            </Typography>
            <Typography variant="p" className="text-gray-500 text-sm mt-1">
              Manage your delivery locations
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-200 bg-white"
            >
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Button className="rounded-full bg-emerald-bg hover:bg-emerald-bg text-white h-11 px-6 shadow-sm transition-all">
              <Plus className="h-5 w-5" /> Add New
            </Button>
          </div>
        </header>

        {/* Address Table Card */}
        <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Type
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Label
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Full Address
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                    <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ADDRESSES.map((address) => (
                    <tr
                      key={address.id}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Type Icon */}
                      <td className="px-8 py-6">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${address.iconBg}`}
                        >
                          {address.icon}
                        </div>
                      </td>

                      {/* Label */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">
                            {address.label}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {address.type}
                          </span>
                        </div>
                      </td>

                      {/* Full Address */}
                      <td className="px-8 py-6">
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {address.fullAddress}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-8 py-6">
                        {address.isDefault && (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                            Default
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-red-300 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
