"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { ArrowLeft, Lock, User, Mail, Eye, EyeOff } from "lucide-react";
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
import { useTranslations } from "next-intl";
import { LoaderIcon } from "react-hot-toast";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character (e.g. @, #, $, %, etc.)",
  );

export default function UserFormView({
  mode = "add",
  userId,
}: {
  mode?: "add" | "edit";
  userId?: string;
}) {
  const t = useTranslations("RestaurantDashboard.Users.form");
  const { state, actions, status } = useUserForm({ mode, userId });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const handleSave = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (mode === "add" && !state.password) {
      newErrors.password = "Password is required for new users.";
    } else if (state.password) {
      const result = passwordSchema.safeParse(state.password);
      if (!result.success) {
        newErrors.password =
          result.error.issues?.[0]?.message ?? "Invalid password.";
      } else if (state.password !== state.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    actions.handleSave();
  };

  const ROLES = [
    { label: t("roles.admin"), value: "ADMIN" },
    { label: t("roles.manager"), value: "MANAGER" },
    { label: t("roles.cashier"), value: "CASHIER" },
    // { label: t("roles.kitchen"), value: "KITCHEN" },
  ];

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
            {mode === "add" ? t("titleAdd") : t("titleEdit")}
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/restaurant/users">
            <Button variant="ghost" className="text-gray-500">
              {t("cancel")}
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={status.isCreating || status.isUpdating}
            className="bg-[#1F4D36] hover:bg-[#183d2b] text-white font-medium min-w-[120px] cursor-pointer"
          >
            {status.isCreating || status.isUpdating ? (
              <LoaderIcon />
            ) : (
              t("saveChanges")
            )}
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="p-2!">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-500" />
            <Typography
              variant="h3"
              className="text-lg font-semibold text-gray-900"
            >
              {t("personalInfo")}
            </Typography>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Typography className="text-sm font-medium text-gray-600">
              {state.isActive ? t("active") : t("inactive")}
            </Typography>
            <Switch
              checked={state.isActive}
              onCheckedChange={actions.setIsActive}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>

        <Typography className="text-sm text-gray-500 mb-6">
          {t("personalDesc")}
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="grid gap-2">
            <Label htmlFor="firstName" className="font-medium text-gray-700">
              {t("firstName")}
            </Label>
            <Input
              id="firstName"
              value={state.firstName}
              onChange={(e) => actions.setFirstName(e.target.value)}
              className="bg-gray-50/50 border-gray-200"
              placeholder={t("firstNamePlaceholder")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName" className="font-medium text-gray-700">
              {t("lastName")}
            </Label>
            <Input
              id="lastName"
              value={state.lastName}
              onChange={(e) => actions.setLastName(e.target.value)}
              className="bg-gray-50/50 border-gray-200"
              placeholder={t("lastNamePlaceholder")}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="font-medium text-gray-700">
            {t("email")}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={state.email}
              onChange={(e) => actions.setEmail(e.target.value)}
              className="pl-9 bg-gray-50/50 border-gray-200"
              placeholder={t("emailPlaceholder")}
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
            {t("accessSecurity")}
          </Typography>
        </div>
        <Typography className="text-sm text-gray-500 mb-6">
          {t("accessDesc")}
        </Typography>

        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label className="font-medium text-gray-700">
              {t("assignedRole")}
            </Label>
            <Select value={state.role} onValueChange={actions.setRole}>
              <SelectTrigger className="bg-gray-50/50 border-gray-200">
                <SelectValue placeholder={t("selectRole")} />
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
                {t("password")}{" "}
                {mode === "add" && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={state.password}
                  onChange={(e) => { actions.setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: undefined })); }}
                  className={`pl-9 pr-9 bg-gray-50/50 ${errors.password ? "border-red-400" : "border-gray-200"}`}
                  placeholder={
                    mode === "add" ? t("createPassword") : t("leaveBlank")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="confirmPassword"
                className="font-medium text-gray-700"
              >
                {t("confirmPasswordLabel")}{" "}
                {mode === "add" && <span className="text-red-500">*</span>}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={state.confirmPassword}
                  onChange={(e) => { actions.setConfirmPassword(e.target.value); setErrors((prev) => ({ ...prev, confirmPassword: undefined })); }}
                  className={`pl-9 pr-9 bg-gray-50/50 ${errors.confirmPassword ? "border-red-400" : "border-gray-200"}`}
                  placeholder={t("confirmPasswordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-0.5">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
