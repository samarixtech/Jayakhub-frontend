"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLocale from "@/hooks/useLocals";
import { registerAction } from "@/app/actions/auth/auth";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";
import { useZodForm } from "@/hooks/use-zod-form";
import { AUTH_KEYS } from "@/config/auth-keys.config";

export function useCustomerRegister() {
  const router = useRouter();
  const { country, language } = useLocale();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useZodForm(registerSchema, {
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  useEffect(() => {
    const savedData = sessionStorage.getItem("customer_register_form");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset({
        ...parsed,
        password: "",
        confirmPassword: "",
      });
    }
  }, [form]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const subscription = form.watch((value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { password, confirmPassword, ...rest } = value;
        sessionStorage.setItem("customer_register_form", JSON.stringify(rest));
      }, 1000);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [form]);

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    if (confirmPassword) {
      form.trigger("confirmPassword");
    }
  }, [password, confirmPassword, form]);

  const { execute, isPending } = useServerAction(registerAction, {
    onSuccess: (data: any) => {
      const identifier = data?.email || form.getValues("email");
      sessionStorage.removeItem("customer_register_form");

      if (identifier) {
        sessionStorage.setItem(AUTH_KEYS.PENDING_EMAIL, identifier);
        router.push(
          `/${country?.toLowerCase() || "pakistan"}/${language?.toLowerCase() || "en"}/verify-otp?email=${encodeURIComponent(identifier)}`,
        );
      }
    },
  });

  function onSubmit(data: RegisterInput) {
    execute(data);
  }

  return {
    form,
    onSubmit,
    isPending,
    isGoogleLoading,
    setIsGoogleLoading,
    country,
    language,
  };
}
