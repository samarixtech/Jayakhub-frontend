"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  brandAssetsSchema,
  BrandAssetsInput,
} from "@/lib/schemas/restaurant-onboarding";
import { useOnboarding } from "../OnboardingContext";
import useLocale from "@/hooks/useLocals";

export const useStepBrandAssets = () => {
  const { country, language } = useLocale();
  const {
    nextStep,
    prevStep: contextPrevStep,
    setLogoPreview: setContextLogoPreview,
    setBannerPreview: setContextBannerPreview,
    setLogoFile,
    setBannerFile,
  } = useOnboarding();
  const router = useRouter();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const form = useForm<BrandAssetsInput>({
    resolver: zodResolver(brandAssetsSchema),
    defaultValues: {
      logo: undefined,
      banner: undefined,
    },
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    const savedPreviews = localStorage.getItem(
      "onboarding_brand_assets_previews",
    );
    if (savedPreviews) {
      try {
        const { logo, banner } = JSON.parse(savedPreviews);
        if (logo) {
          setLogoPreview(logo);
          setContextLogoPreview(logo);
        }
        if (banner) {
          setBannerPreview(banner);
          setContextBannerPreview(banner);
        }
      } catch (e) {
        console.error("Failed to parse saved previews", e);
      }
    }
  }, [setContextLogoPreview, setContextBannerPreview]);

  const onSubmit = (data: BrandAssetsInput) => {
    try {
      const previewsToSave = {
        logo: logoPreview,
        banner: bannerPreview,
      };
      localStorage.setItem(
        "onboarding_brand_assets_previews",
        JSON.stringify(previewsToSave),
      );
      toast.success("Brand assets saved");
    } catch (e) {
      console.error("Failed to save previews to localStorage", e);
      toast.error("Images too large to save locally, but proceed anyway.");
    }

    nextStep();
    router.push(`/restaurant/onboarding/step-schedule`);
  };

  const handleLogoChange = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setLogoPreview(base64);
      setContextLogoPreview(base64);
      setLogoFile(file);
      form.setValue("logo", file);
    } catch (err) {
      console.error("Error converting logo", err);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setContextLogoPreview(null);
    setLogoFile(null);
    form.setValue("logo", undefined);
  };

  const handleBannerChange = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setBannerPreview(base64);
      setContextBannerPreview(base64);
      setBannerFile(file);
      form.setValue("banner", file);
    } catch (err) {
      console.error("Error converting banner", err);
    }
  };

  const handleRemoveBanner = () => {
    setBannerPreview(null);
    setContextBannerPreview(null);
    setBannerFile(null);
    form.setValue("banner", undefined);
  };

  return {
    form,
    logoPreview,
    bannerPreview,
    onSubmit,
    handleLogoChange,
    handleRemoveLogo,
    handleBannerChange,
    handleRemoveBanner,
    prevStep: () => {
      contextPrevStep();
      router.back();
    },
  };
};
