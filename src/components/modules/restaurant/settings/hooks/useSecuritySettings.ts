"use client";
import { useEffect, useState } from "react";
import {
  getAccountSettingsAction,
  setNewPasswordAction,
} from "@/app/actions/restaurant/settings";
import { changePasswordAction } from "@/app/actions/customer/userprofile";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  setPasswordSchema,
  changePasswordSchema,
  SetPasswordInput,
  ChangePasswordInput,
} from "@/lib/schemas/restaurant-security";

export function useSecuritySettings() {
  const t = useTranslations("RestaurantDashboard.Settings.security.toasts");
  const [loading, setLoading] = useState(true);
  const [verifiedVia, setVerifiedVia] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await getAccountSettingsAction();
        if (res.success && res.data) {
          const profile = res.data.data?.profile || res.data.profile;

          if (profile) {
            setVerifiedVia(profile.verifiedVia || "email");
            setEmail(profile.ownerEmail || "");
          }
        }
      } catch (error) {
        toast.error(t("fetchFailed"));
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const isGoogleOnly = verifiedVia === "google";

  return {
    loading,
    verifiedVia,
    email,
    isGoogleOnly,
  };
}

export function useSetPasswordForm() {
  const t = useTranslations("RestaurantDashboard.Settings.security.toasts");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SetPasswordInput>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: SetPasswordInput) => {
    setSubmitting(true);
    try {
      const res = await setNewPasswordAction(data.newPassword);
      if (res.success) {
        toast.success(res.message);
        form.reset();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      toast.error(error.message || t("somethingWrong"));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    form,
    onSubmit,
  };
}

export function useChangePasswordForm() {
  const t = useTranslations("RestaurantDashboard.Settings.security.toasts");
  const [submitting, setSubmitting] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordInput>({
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
        toast.success(res.message || t("passwordUpdated"));
        form.reset();
      } else {
        toast.error(res.message || t("somethingWrong"));
      }
    } catch (error: any) {
      toast.error(error.message || t("somethingWrong"));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    showOldPassword,
    setShowOldPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    form,
    onSubmit,
  };
}
