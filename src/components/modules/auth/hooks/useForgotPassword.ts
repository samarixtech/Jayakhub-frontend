"use client";

import { useRouter } from "next/navigation";
import { forgotPasswordAction } from "@/app/actions/auth/auth";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";
import { useZodForm } from "@/hooks/use-zod-form";
import { AUTH_KEYS } from "@/config/auth-keys.config";

export function useForgotPassword() {
  const router = useRouter();

  const form = useZodForm(forgotPasswordSchema, {
    defaultValues: {
      email: "",
    },
  });

  const { execute, isPending } = useServerAction(forgotPasswordAction, {
    onSuccess: (data: any) => {
      if (data?.email) {
        sessionStorage.setItem(AUTH_KEYS.PENDING_EMAIL, data.email);
        sessionStorage.setItem(AUTH_KEYS.INTENT, "forgot-password");
        const verifyPath = `/verify-otp`;
        router.push(verifyPath);
      }
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    execute(data);
  };

  return {
    form,
    onSubmit,
    isPending,
  };
}
