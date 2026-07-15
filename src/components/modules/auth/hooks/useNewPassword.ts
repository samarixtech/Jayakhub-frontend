"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import useLocale from "@/hooks/useLocals";
import { resetPasswordAction } from "@/app/actions/auth/auth";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";
import { useZodForm } from "@/hooks/use-zod-form";
import { AUTH_KEYS } from "@/config/auth-keys.config";

export function useNewPassword() {
  const router = useRouter();
  const { country, language } = useLocale();
  const t = useTranslations("Auth.toasts");

  const form = useZodForm(resetPasswordSchema, {
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { execute, isPending } = useServerAction(resetPasswordAction, {
    onSuccess: () => {
      sessionStorage.clear();
      router.push("/login");
    },
  });

  useEffect(() => {
    const email = sessionStorage.getItem(AUTH_KEYS.PENDING_EMAIL);
    const otp = sessionStorage.getItem(AUTH_KEYS.PENDING_OTP);

    if (!email || !otp) {
      toast.error(t("sessionExpiredStartOver"));
      router.push("/forgot-password");
    }
  }, [country, language, router, t]);

  const onSubmit = (data: ResetPasswordInput) => {
    execute(data);
  };

  return {
    form,
    onSubmit,
    isPending,
  };
}
