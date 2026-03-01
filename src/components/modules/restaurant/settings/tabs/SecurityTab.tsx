"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAccountSettingsAction,
  setNewPasswordAction,
} from "@/app/actions/restaurant/settings";
import { changePasswordAction } from "@/app/actions/customer/userprofile";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  setPasswordSchema,
  changePasswordSchema,
  SetPasswordInput,
  ChangePasswordInput,
} from "@/lib/schemas/restaurant-security";

export function SecurityTab() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifiedVia, setVerifiedVia] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await getAccountSettingsAction();
        console.log("security response", res || "undefined");
        if (res.success && res.data) {
          const profile = res.data.data?.profile || res.data.profile;

          if (profile) {
            setVerifiedVia(profile.verifiedVia || "email");
            setEmail(profile.ownerEmail || "");
          }
        }
      } catch (error) {
        toast.error("Failed to fetch security settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const isGoogleOnly = verifiedVia === "google";

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {isGoogleOnly
            ? `You are logged in via Google (${email}). You can set a password for this account.`
            : "Update your password securely."}
        </p>
      </div>

      {isGoogleOnly ? <SetPasswordForm /> : <ChangePasswordForm />}
    </div>
  );
}

function SetPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SetPasswordInput>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SetPasswordInput) => {
    setSubmitting(true);
    try {
      const res = await setNewPasswordAction(data.password);
      if (res.success) {
        toast.success(res.message);
        reset();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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
  const [submitting, setSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setSubmitting(true);
    try {
      const res = await changePasswordAction({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (res.success) {
        toast.success(res.message);
        reset();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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
