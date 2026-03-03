"use client";

import Link from "next/link";
import { ArrowLeft, Lock, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserForm } from "../hooks/useUserForm";

const ROLES = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "Cashier", value: "CASHIER" },
  { label: "Kitchen", value: "KITCHEN" },
];

export default function UserFormView({
  mode = "add",
  userId,
}: {
  mode?: "add" | "edit";
  userId?: string;
}) {
  const { state, actions, status } = useUserForm({ mode, userId });

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/restaurant/users">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <Typography variant="h2" className="text-xl font-bold text-gray-800">
            {mode === "add" ? "Add New User" : "Edit User"}
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/restaurant/users">
            <Button variant="ghost" className="text-gray-500">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={actions.handleSave}
            disabled={status.isCreating || status.isUpdating}
            className="bg-[#1F4D36] hover:bg-[#183d2b] text-white font-medium min-w-[120px]"
          >
            {status.isCreating || status.isUpdating
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <Typography
              variant="h3"
              className="text-lg font-semibold text-gray-900"
            >
              Personal Information
            </Typography>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Typography className="text-sm font-medium text-gray-600">
              {state.isActive ? "Active" : "Inactive"}
            </Typography>
            <Switch
              checked={state.isActive}
              onCheckedChange={actions.setIsActive}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>

        <Typography className="text-sm text-gray-500 mb-6">
          Basic identification details for this user.
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="grid gap-2">
            <Label htmlFor="firstName" className="font-medium text-gray-700">
              First Name
            </Label>
            <Input
              id="firstName"
              value={state.firstName}
              onChange={(e) => actions.setFirstName(e.target.value)}
              className="bg-gray-50/50 border-gray-200"
              placeholder="e.g. John"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName" className="font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={state.lastName}
              onChange={(e) => actions.setLastName(e.target.value)}
              className="bg-gray-50/50 border-gray-200"
              placeholder="e.g. Doe"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="font-medium text-gray-700">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={state.email}
              onChange={(e) => actions.setEmail(e.target.value)}
              className="pl-9 bg-gray-50/50 border-gray-200"
              placeholder="e.g. name@restaurant.com"
            />
          </div>
        </div>
      </Card>

      {/* Access & Security */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-gray-500" />
          <Typography
            variant="h3"
            className="text-lg font-semibold text-gray-900"
          >
            Access & Security
          </Typography>
        </div>
        <Typography className="text-sm text-gray-500 mb-6">
          Manage role permissions and login credentials.
        </Typography>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label className="font-medium text-gray-700">Assigned Role</Label>
            <Select value={state.role} onValueChange={actions.setRole}>
              <SelectTrigger className="bg-gray-50/50 border-gray-200">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <span>{role.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Password{" "}
                {mode === "add" && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={state.password}
                  onChange={(e) => actions.setPassword(e.target.value)}
                  className="pl-9 bg-gray-50/50 border-gray-200"
                  placeholder={
                    mode === "add"
                      ? "Create password"
                      : "Leave blank to keep current"
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="confirmPassword"
                className="font-medium text-gray-700"
              >
                Confirm Password{" "}
                {mode === "add" && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={state.confirmPassword}
                  onChange={(e) => actions.setConfirmPassword(e.target.value)}
                  className="pl-9 bg-gray-50/50 border-gray-200"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
