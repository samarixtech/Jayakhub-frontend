"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  useSecuritySettings,
  useSetPasswordForm,
  useChangePasswordForm,
} from "../hooks/useSecuritySettings";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function SecurityView() {
  const { loading, isGoogleOnly, email } = useSecuritySettings();

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Security</CardTitle>
        <CardDescription className="text-gray-500">
          {isGoogleOnly
            ? `You are logged in via Google (${email}). You can set a password for this account.`
            : "Update your password securely."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGoogleOnly ? <SetPasswordForm /> : <ChangePasswordForm />}
      </CardContent>
    </Card>
  );
}

function SetPasswordForm() {
  const {
    submitting,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    form: {
      register,
      handleSubmit,
      formState: { errors, isValid },
    },
    onSubmit,
  } = useSetPasswordForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            New Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary pr-10 text-base"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary pr-10 text-base"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          disabled={submitting || !isValid}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed h-12 px-8 text-base font-semibold"
        >
          {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Set Password
        </Button>
      </div>
    </form>
  );
}

function ChangePasswordForm() {
  const {
    submitting,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    form: {
      register,
      handleSubmit,
      formState: { errors, isValid },
    },
    onSubmit,
  } = useChangePasswordForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Current Password <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            type={showOldPassword ? "text" : "password"}
            placeholder="••••••••"
            className="h-14 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary pr-10 text-base"
            {...register("oldPassword")}
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showOldPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        {errors.oldPassword && (
          <p className="text-red-500 text-xs mt-1">
            {errors.oldPassword.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            New Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              className="h-14 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary pr-10 text-base"
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="h-14 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary pr-10 text-base"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          disabled={submitting || !isValid}
          className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed h-12 px-8 text-base font-semibold"
        >
          {submitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Update Password
        </Button>
      </div>
    </form>
  );
}
