"use client";

import { useRouter } from "next/navigation";
import {
  changePasswordAction,
  setNewPasswordAction,
} from "@/app/actions/customer/userprofile";
import { useServerAction } from "@/hooks/use-server-action";
import {
  changePasswordSchema,
  ChangePasswordInput,
} from "@/lib/schemas/profile";
import {
  setPasswordSchema,
  SetPasswordInput,
} from "@/lib/schemas/restaurant-security";
import { useZodForm } from "@/hooks/use-zod-form";

export function useSetPasswordForm() {
  const router = useRouter();
  const form = useZodForm<SetPasswordInput>(setPasswordSchema, {
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const { execute, isPending } = useServerAction(setNewPasswordAction, {
    onSuccess: () => {
      form.reset();
      router.refresh();
    },
  });

  const onSubmit = (values: SetPasswordInput) => {
    // Only send the password to match backend expectations
    execute(values.newPassword);
  };

  return { form, isPending, onSubmit };
}

export function useChangePasswordForm() {
  const router = useRouter();
  const form = useZodForm<ChangePasswordInput>(changePasswordSchema, {
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const { execute, isPending } = useServerAction(changePasswordAction, {
    onSuccess: () => {
      form.reset();
      router.refresh();
    },
  });

  const onSubmit = (values: ChangePasswordInput) => {
    execute(values);
  };

  return { form, isPending, onSubmit };
}
