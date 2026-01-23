"use client";

import Image from "next/image";
import {
  Camera,
  Mail,
  Phone,
  Lock,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function CustomerProfileSettingsView() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] p-5">
      <div className="max-w-full mx-auto">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Typography
              variant="h2"
              className="text-[#111827] font-bold text-2xl"
            >
              My Profile
            </Typography>
            <Typography variant="small" className="text-gray-500">
              Manage you profile settings
            </Typography>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-full border-gray-200 bg-white text-gray-700 h-11 px-6 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button className="rounded-full bg-emerald-bg hover:bg-emerald-bg text-white h-11 px-6 shadow-sm transition-all">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: Avatar & Stats */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="rounded-4xl border-none shadow-sm overflow-hidden bg-white py-10">
              <CardContent className="flex flex-col items-center">
                {/* Profile Image with Upload Trigger */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden relative border-4 border-gray-50">
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop"
                      alt="Profile Picture"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute bottom-1 right-1 bg-emerald-bg text-white p-2 rounded-full border-4 border-white hover:bg-[#1B4332] transition-colors">
                    <Camera size={16} />
                  </button>
                </div>

                <Typography
                  variant="h3"
                  className="text-xl font-bold text-gray-900"
                >
                  John Doe
                </Typography>
                <Typography variant="p" className="text-gray-400 text-sm mb-4">
                  Product Designer
                </Typography>

                <div className="flex gap-2">
                  <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Verified
                  </Badge>
                  <Badge className="bg-blue-50 text-blue-600 border-none px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Admin
                  </Badge>
                </div>

                <div className="w-full mt-12 space-y-4 px-4">
                  <Typography
                    variant="p"
                    className="text-[11px] font-black uppercase tracking-widest text-gray-400 px-2"
                  >
                    Statistics
                  </Typography>
                  <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">
                      Total Orders
                    </span>
                    <span className="font-bold text-emerald-bg">142</span>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-600">
                      Reviews
                    </span>
                    <span className="font-bold text-orange-500">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Right Content: Forms */}
          <main className="lg:col-span-8 space-y-6">
            {/* Personal Information */}
            <Card className="rounded-4xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="pt-8 px-8">
                <CardTitle className="text-lg font-bold text-gray-900">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                      First Name
                    </label>
                    <Input
                      placeholder="John"
                      className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                      Last Name
                    </label>
                    <Input
                      placeholder="Doe"
                      className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-3.5 text-gray-400"
                        size={18}
                      />
                      <Input
                        placeholder="john@example.com"
                        className="pl-12 rounded-2xl border-gray-100 bg-gray-50/50 h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-3.5 text-gray-400"
                        size={18}
                      />
                      <Input
                        placeholder="+1 (555) 000-0000"
                        className="pl-12 rounded-2xl border-gray-100 bg-gray-50/50 h-12"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="rounded-4xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-8">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    Payment Methods
                  </CardTitle>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage your saved cards and default payment
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full px-5 border-gray-200 text-xs font-bold"
                >
                  Manage
                </Button>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-gray-100/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#1A1F71] p-2 rounded-lg">
                      <CreditCard className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Visa ending in 4242
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Expires 12/28 • Default
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="rounded-4xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-lg font-bold text-gray-900">
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-8">
                {/* 2FA Toggle */}
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl">
                      <ShieldCheck className="text-blue-600" size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Enable extra security for your account
                      </p>
                    </div>
                  </div>
                  <Checkbox className="w-6 h-6 rounded-md border-gray-300 data-[state=checked]:bg-emerald-bg data-[state=checked]:border-emerald-bg-hover" />
                </div>

                {/* Change Password Section */}
                <div className="space-y-6 pt-2">
                  <Typography
                    variant="p"
                    className="text-[11px] font-black uppercase tracking-widest text-gray-400 px-1"
                  >
                    Change Password
                  </Typography>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-3.5 text-gray-400"
                          size={18}
                        />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-12 rounded-2xl border-gray-100 bg-gray-50/50 h-12"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                          New Password
                        </label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="rounded-2xl border-gray-100 bg-gray-50/50 h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
                          Confirm Password
                        </label>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="rounded-2xl border-gray-100 bg-gray-50/50 h-12"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button className="rounded-full bg-emerald-bg hover:bg-emerald-bg-hover text-white px-8 h-12 font-bold shadow-md">
                      Update Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
