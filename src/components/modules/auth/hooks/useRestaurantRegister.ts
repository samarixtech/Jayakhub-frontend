"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import useLocale from "@/hooks/useLocals";
import { registerRestaurantAction } from "@/app/actions/auth/auth";
import { registerSchema, RegisterInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";
import { useZodForm } from "@/hooks/use-zod-form";
import { AUTH_KEYS } from "@/config/auth-keys.config";

export function useRestaurantRegister() {
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
    const savedData = sessionStorage.getItem("restaurant_register_form");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset({
          ...parsed,
          password: "",
          confirmPassword: "",
        });
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
  }, [form]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const subscription = form.watch((value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const { password, confirmPassword, ...rest } = value;
        sessionStorage.setItem(
          "restaurant_register_form",
          JSON.stringify(rest),
        );
      }, 1000);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [form]);

  const { execute, isPending } = useServerAction(registerRestaurantAction, {
    onSuccess: (data: any) => {
      const identifier = data?.email || form.getValues("email");
      sessionStorage.removeItem("restaurant_register_form");

      sessionStorage.setItem(AUTH_KEYS.PENDING_EMAIL, identifier);
      // toast.success("Business account created! Verify your OTP.");

      router.push(`/verify-otp?email=${encodeURIComponent(identifier)}`);
    },
  });

  const onSubmit = (data: RegisterInput) => {
    execute(data);
  };

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
