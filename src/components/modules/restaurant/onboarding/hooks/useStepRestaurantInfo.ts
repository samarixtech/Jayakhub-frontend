"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  restaurantInfoSchema,
  RestaurantInfoInput,
} from "@/lib/schemas/restaurant-onboarding";
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "../OnboardingContext";

export const useStepRestaurantInfo = () => {
  const router = useRouter();
  const { country, language } = useLocale();
  const { nextStep } = useOnboarding();
  const t = useTranslations("Onboarding.restaurantInfoView");

  const form = useForm<RestaurantInfoInput>({
    resolver: zodResolver(restaurantInfoSchema),
    defaultValues: {
      restaurantName: "",
      restaurantPhone: "",
      restaurantEmail: "",
      websiteUrl: "",
      description: "",
      address: "",
      country: "",
      location: undefined,
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_restaurant_info");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        form.setValue("restaurantName", parsed.restaurantName || "");
        form.setValue("restaurantPhone", parsed.restaurantPhone || "");
        form.setValue("restaurantEmail", parsed.restaurantEmail || "");
        form.setValue("websiteUrl", parsed.websiteUrl || "");
        form.setValue("description", parsed.description || "");
        form.setValue("address", parsed.address || "");
        form.setValue("country", parsed.country || "");
        form.setValue("cuisineTypes", parsed.cuisineTypes || []);
        if (parsed.location) {
          form.setValue("location", parsed.location);
        }
      } catch (e) {
        console.error("Failed to parse saved restaurant info", e);
      }
    }
  }, [form]);

  const onSubmit = (data: RestaurantInfoInput) => {
    const dataToSave = {
      ...data,
      logo: undefined,
      banner: undefined,
    };
    localStorage.setItem(
      "onboarding_restaurant_info",
      JSON.stringify(dataToSave),
    );

    toast.success(t("toastSaved"));
    nextStep();
    router.push(`/restaurant/onboarding/step-brand-assets`);
  };

  return {
    form,
    onSubmit,
  };
};
