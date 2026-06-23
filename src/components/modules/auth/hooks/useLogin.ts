"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AUTH_KEYS } from "@/config/auth-keys.config";
import { loginAction } from "@/app/actions/auth/auth";
import { loginSchema, LoginInput } from "@/lib/schemas/auth";
import { useServerAction } from "@/hooks/use-server-action";
import { ROLE_REDIRECT_MAP, UserRole } from "@/config/role-map.config";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";
import { useZodForm } from "@/hooks/use-zod-form";

export function useLogin() {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, isPending } = useServerAction(loginAction, {
    onSuccess: (data: any) => {
      const identifier = data?.identifier || data?.email;
      if (identifier) {
        sessionStorage.setItem(AUTH_KEYS.PENDING_EMAIL, identifier);
        router.push(`/verify-otp?email=${encodeURIComponent(identifier)}`);
      } else if (data?.data?.user?.role || data?.user?.role) {
        const role = ((data.data?.user?.role || data.user?.role) as string).toLowerCase() as UserRole;

        if (role === "restaurant_owner") {
          getRestaurantStatusAction()
            .then((statusRes) => {
              if (statusRes.success && statusRes.data?.status === "active") {
                router.push(`/restaurant/dashboard`);
              } else {
                router.push(`/restaurant/status`);
              }
            })
            .catch(() => {
              router.push(`/restaurant/status`);
            });
          return;
        }

        const targetSubPath = ROLE_REDIRECT_MAP[role];
        router.push(targetSubPath || "/dashboard");
      }
    },
  });

  function onSubmit(data: LoginInput) {
    execute(data);
  }

  return {
    form,
    onSubmit,
    isPending,
    isGoogleLoading,
    setIsGoogleLoading,
  };
}
