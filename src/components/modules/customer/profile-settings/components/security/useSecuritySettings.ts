import { changePasswordAction } from "@/app/actions/customer/userprofile";
import { useServerAction } from "@/hooks/use-server-action";
import {
  changePasswordSchema,
  ChangePasswordInput,
} from "@/lib/schemas/profile";
import { useZodForm } from "@/hooks/use-zod-form";

export function useSecuritySettings() {
  const form = useZodForm<ChangePasswordInput>(changePasswordSchema, {
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const { execute, isPending } = useServerAction(changePasswordAction, {
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = (values: ChangePasswordInput) => {
    execute(values);
  };

  return {
    form,
    isPending,
    onSubmit,
  };
}
