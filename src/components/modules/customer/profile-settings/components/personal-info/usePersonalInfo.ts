import { useEffect } from "react";
import { useZodForm } from "@/hooks/use-zod-form";
import { updateProfileSchema, UpdateProfileInput } from "@/lib/schemas/profile";
import { updateProfileAction } from "@/app/actions/customer/userprofile";
import { useServerAction } from "@/hooks/use-server-action";
import { CustomerProfileData } from "@/types";

export function usePersonalInfo(profile: CustomerProfileData) {
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

  const { execute, isPending } = useServerAction(updateProfileAction);

  function onSubmit(data: UpdateProfileInput) {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.lastName) formData.append("lastName", data.lastName);
    // Strip non-digits for backend numeric validation
    formData.append("phone", data.phone.replace(/\D/g, ""));
    // EMAIL IS READONLY NOT SENT IN PAYLOAD
    execute(formData);
  }

  // UPDATE FORM VALUES IF PROFILE PROPS CHANGES
  useEffect(() => {
    form.reset({
      name: profile.name || "",
      lastName: profile.lastName || "",
      phone: profile.phone
        ? profile.phone.toString().startsWith("+")
          ? profile.phone.toString()
          : `+${profile.phone.toString()}`
        : "",
    });
  }, [profile, form]);

  return {
    form,
    isPending,
    onSubmit,
  };
}
