"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../OnboardingContext";
import { registerRestaurantOnboardingAction } from "@/app/actions/restaurant/onboarding";
import { useServerAction } from "@/hooks/use-server-action";

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
    kyc: null,
    bank: null,
  });

  const [loading, setLoading] = useState(false);

  const { execute, isPending } = useServerAction(
    registerRestaurantOnboardingAction,
    {
      onSuccess: () => {
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
        router.push(`/restaurant/status?new=true`);
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

    const schedules = Object.entries(data.schedule || {}).map(
      ([day, val]: [string, any]) => ({
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
        openTime: val.isOpen ? `${val.openTime}:00` : "00:00:00",
        closeTime: val.isOpen ? `${val.closeTime}:00` : "00:00:00",
        isClosed: !val.isOpen,
      }),
    );

    const formData = new FormData();
    formData.append("name", data.restaurant?.restaurantName || "");
    formData.append("email", data.restaurant?.restaurantEmail || "");
    formData.append("phone", data.restaurant?.restaurantPhone || "");
    formData.append("address", data.restaurant?.address || "");
    formData.append("country", data.restaurant?.country || "");
    formData.append("latitude", String(data.restaurant?.location?.lat || 0));
    formData.append("longitude", String(data.restaurant?.location?.lng || 0));
    formData.append("type", (data.restaurant?.cuisineTypes || []).join(","));
    formData.append("description", data.restaurant?.description || "");
    if (data.restaurant?.websiteUrl)
      formData.append("websiteUrl", data.restaurant.websiteUrl);

    if (kycFile && data.kyc?.kycType) {
      formData.append("documentType", mapDocTypeToBackend(data.kyc.kycType));
      formData.append("documentFile", kycFile);
    }

    if (docFile && data.kyc?.docType) {
      formData.append("documentType", mapDocTypeToBackend(data.kyc.docType));
      formData.append("documentFile", docFile);
    }

    formData.append("schedules", JSON.stringify(schedules));
    formData.append("Ownerphone", data.owner?.ownerPhone || "");
    formData.append("ownerName", data.owner?.ownerName || "");
    formData.append("accountHolderName", data.bank?.accountTitle || "");
    formData.append("accountType", data.bank?.accountType || "");
    formData.append("bankName", data.bank?.bankName || "");
    formData.append("iban", data.bank?.iban || "");

    if (logoFile) formData.append("profileImage", logoFile);
    if (bannerFile) formData.append("bannerImage", bannerFile);

    await execute(formData);
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
