import { useEffect } from "react";
import { useZodForm } from "@/hooks/use-zod-form";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/schemas/profile";
import { updateProfileAction } from "@/app/actions/customer/userprofile";
import { useServerAction } from "@/hooks/use-server-action";
import { CustomerProfileData } from "@/types";

export function usePersonalInfo(
  profile: CustomerProfileData,
  updateProfile: (data: Partial<CustomerProfileData>) => void,
) {
  const form = useZodForm(updateProfileSchema, {
    defaultValues: {
      name: profile.name || "",
      lastName: profile.lastName || "",
      phone: profile.phone
        ? profile.phone.toString().startsWith("+")
          ? profile.phone.toString()
          : `+${profile.phone.toString()}`
        : "",
    },
  });

  // REAL-TIME UPDATES FOR SIDEBAR
  const watchedName = form.watch("name");
  const watchedLastName = form.watch("lastName");

  useEffect(() => {
    updateProfile({
      name: watchedName,
      lastName: watchedLastName,
    });
  }, [watchedName, watchedLastName]);

  const { execute, isPending } = useServerAction(updateProfileAction, {
    onSuccess: () => {
      // Refresh whole page on success
      window.location.reload();
    },
  });

  function onSubmit(data: UpdateProfileInput) {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.lastName) formData.append("lastName", data.lastName);
    formData.append("phone", data.phone.replace(/\D/g, ""));
    execute(formData);
  }

  useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset({
        name: profile.name || "",
        lastName: profile.lastName || "",
        phone: profile.phone
          ? profile.phone.toString().startsWith("+")
            ? profile.phone.toString()
            : `+${profile.phone.toString()}`
          : "",
      });
    }
  }, [profile, form]);

  return {
    form,
    isPending,
    onSubmit,
  };
}
