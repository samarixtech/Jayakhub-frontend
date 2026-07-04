"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../OnboardingContext";
import {
  registerRestaurantOnboardingAction,
  OnboardingPayload,
} from "@/app/actions/restaurant/onboarding";
import { useServerAction } from "@/hooks/use-server-action";

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const idx = result.indexOf(",");
      resolve(idx !== -1 ? result.slice(idx + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const useStepReview = () => {
  const router = useRouter();
  const {
    prevStep: contextPrevStep,
    logoFile,
    bannerFile,
    kycFile,
    docFile,
  } = useOnboarding();

  const [data, setData] = useState<any>({
    owner: null,
    restaurant: null,
    assets: null,
    schedule: null,
    timezone: "",
    kyc: null,
    bank: null,
  });

  const [loading, setLoading] = useState(false);

  const { execute, isPending } = useServerAction(
    registerRestaurantOnboardingAction,
    {
      onSuccess: (data: any) => {
        const apiMessage = data?.meta?.message || "";
        if (apiMessage) {
          sessionStorage.setItem("onboarding_success_message", apiMessage);
        }
        const keys = [
          "onboarding_owner_info",
          "onboarding_restaurant_info",
          "onboarding_schedule_info",
          "onboarding_bank_details",
          "onboarding_kyc_name",
          "onboarding_doc_name",
          "onboarding_brand_assets_previews",
          "onboarding_kyc_type",
          "onboarding_doc_type",
        ];
        keys.forEach((key) => localStorage.removeItem(key));
        router.push(`/restaurant/purchase-plan`);
      },
      onError: (err) => {
        console.error("Submission Error:", err);
        setLoading(false);
      },
    },
  );

  useEffect(() => {
    const owner = JSON.parse(
      localStorage.getItem("onboarding_owner_info") || "{}",
    );
    const restaurant = JSON.parse(
      localStorage.getItem("onboarding_restaurant_info") || "{}",
    );
    const schedule = JSON.parse(
      localStorage.getItem("onboarding_schedule_info") || "{}",
    );
    const bank = JSON.parse(
      localStorage.getItem("onboarding_bank_details") || "{}",
    );
    const kycName = localStorage.getItem("onboarding_kyc_name");
    const docName = localStorage.getItem("onboarding_doc_name");
    const kycType = localStorage.getItem("onboarding_kyc_type");
    const docType = localStorage.getItem("onboarding_doc_type");
    const assetsPreviews = JSON.parse(
      localStorage.getItem("onboarding_brand_assets_previews") || "{}",
    );

    setData({
      owner,
      restaurant,
      assets: assetsPreviews,
      schedule,
      timezone: schedule?.timezone || "",
      kyc: { kycName, docName, kycType, docType },
      bank,
    });
  }, []);

  const mapDocTypeToBackend = (frontendType: string) => {
    switch (frontendType) {
      case "id_card":
        return "government_id";
      case "passport":
        return "passport";
      case "driving_license":
        return "driving_license";
      case "food_license":
        return "food_license";
      case "tax_certificate":
        return "food_license";
      default:
        return "government_id";
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const schedules = Object.entries(data.schedule || {})
      .filter(([key]) => key !== "timezone")
      .map(([day, val]: [string, any]) => ({
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        openTime: val.isOpen ? Number(val.openTime) || 0 : 0,
        closeTime: val.isOpen ? Number(val.closeTime) || 0 : 0,
        isClosed: !val.isOpen,
      }));

    // Convert files to base64 in parallel
    const [
      profileImageBase64,
      bannerImageBase64,
      kycDocumentBase64,
      docDocumentBase64,
    ] = await Promise.all([
      logoFile ? fileToBase64(logoFile) : Promise.resolve(""),
      bannerFile ? fileToBase64(bannerFile) : Promise.resolve(""),
      kycFile ? fileToBase64(kycFile) : Promise.resolve(""),
      docFile ? fileToBase64(docFile) : Promise.resolve(""),
    ]);

    const payload: OnboardingPayload = {
      name: data.restaurant?.restaurantName || "",
      email: data.restaurant?.restaurantEmail || "",
      phone: data.restaurant?.restaurantPhone || "",
      address: data.restaurant?.address || "",
      country: data.restaurant?.country || "",
      latitude: String(data.restaurant?.location?.lat || 0),
      longitude: String(data.restaurant?.location?.lng || 0),
      type: (data.restaurant?.cuisineTypes || []).join(","),
      description: data.restaurant?.description || "",
      websiteUrl: data.restaurant?.websiteUrl || "",
      timezone: data.timezone || "",
      schedules: JSON.stringify(schedules),
      ownerPhone: data.owner?.ownerPhone || "",
      ownerName: data.owner?.ownerName || "",
      accountHolderName: data.bank?.accountTitle || "",
      accountType: data.bank?.accountType || "",
      bankName: data.bank?.bankName || "",
      iban: data.bank?.iban || "",
      // Profile image
      ...(profileImageBase64 && {
        profileImageBase64,
        profileImageName: logoFile?.name || "profile.jpg",
        profileImageType: logoFile?.type || "image/jpeg",
      }),
      // Banner image
      ...(bannerImageBase64 && {
        bannerImageBase64,
        bannerImageName: bannerFile?.name || "banner.jpg",
        bannerImageType: bannerFile?.type || "image/jpeg",
      }),
      // KYC document
      ...(kycDocumentBase64 && data.kyc?.kycType && {
        kycDocumentType: mapDocTypeToBackend(data.kyc.kycType),
        kycDocumentBase64,
        kycDocumentName: kycFile?.name || "kyc_document",
        kycDocumentFileType: kycFile?.type || "application/octet-stream",
      }),
      // Business document
      ...(docDocumentBase64 && data.kyc?.docType && {
        docDocumentType: mapDocTypeToBackend(data.kyc.docType),
        docDocumentBase64,
        docDocumentName: docFile?.name || "business_document",
        docDocumentFileType: docFile?.type || "application/octet-stream",
      }),
    };

    await execute(payload);
  };

  return {
    data,
    loading,
    isPending,
    handleSubmit,
    onBack: () => {
      contextPrevStep();
      router.back();
    },
    pathPrefix: "/restaurant/onboarding",
  };
};
