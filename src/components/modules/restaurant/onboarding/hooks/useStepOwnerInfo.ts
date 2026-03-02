"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  ownerInfoSchema,
  OwnerInfoInput,
} from "@/lib/schemas/restaurant-onboarding";
import useLocale from "@/hooks/useLocals";
import { getProfile } from "@/app/actions/customer/userprofile";
import { useOnboarding } from "../OnboardingContext";

export const useStepOwnerInfo = () => {
  const router = useRouter();
  const { country, language } = useLocale();
  const { nextStep } = useOnboarding();
  const [email, setEmail] = useState<string>("");

  const form = useForm<OwnerInfoInput>({
    resolver: zodResolver(ownerInfoSchema),
    defaultValues: {
      ownerName: "",
      ownerPhone: "",
    },
  });

  useEffect(() => {
    async function fetchEmail() {
      const res = await getProfile();
      if (res.success && res.data?.email) {
        setEmail(res.data.email);
      }
    }
    fetchEmail();
  }, []);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("onboarding_owner_info");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
      }
    } catch (e) {
      console.error("Failed to load owner info", e);
    }
  }, [form]);

  const onSubmit = (data: OwnerInfoInput) => {
    try {
      localStorage.setItem("onboarding_owner_info", JSON.stringify(data));
      toast.success("Owner info saved");
      nextStep();
      router.push(`/restaurant/onboarding/step-restaurant-info`);
    } catch (e) {
      console.error("LocalStorage Save Error", e);
      toast.error("Failed to save owner info");
    }
  };

  const onError = (errors: any) => {
    console.error("Validation Errors:", errors);
    toast.error("Please check the form for errors");
  };

  return {
    form,
    email,
    onSubmit,
    onError,
    nextStep,
  };
};
