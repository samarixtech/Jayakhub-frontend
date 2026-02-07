"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Store,
  Clock,
  FileText,
  CreditCard,
  Image as ImageIcon,
  Edit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "@/components/modules/restaurant/onboarding/OnboardingContext";

import { registerRestaurantOnboardingAction } from "@/app/actions/restaurant/onboarding";
import { useServerAction } from "@/hooks/use-server-action";

export default function StepReviewView() {
  const { country, language } = useLocale();
  const router = useRouter();
  const { prevStep } = useOnboarding();

  const [data, setData] = useState<any>({
    owner: null,
    restaurant: null,
    assets: null,
    schedule: null,
    kyc: null,
    bank: null,
  });

  const [loading, setLoading] = useState(false);

  // Server Action Hook
  const { execute, isPending } = useServerAction(
    registerRestaurantOnboardingAction,
    {
      onSuccess: () => {
        // Clear onboarding data from local storage
        localStorage.removeItem("onboarding_owner_info");
        localStorage.removeItem("onboarding_restaurant_info");
        localStorage.removeItem("onboarding_schedule_info");
        localStorage.removeItem("onboarding_bank_details");
        localStorage.removeItem("onboarding_kyc_name");
        localStorage.removeItem("onboarding_doc_name");
        localStorage.removeItem("onboarding_brand_assets_previews");
        localStorage.removeItem("onboarding_kyc_type");
        localStorage.removeItem("onboarding_doc_type");

        router.push(`/${country}/${language}/restaurant/status?new=true`);
      },
      onError: (err) => {
        console.error("Submission Error:", err);
        setLoading(false);
      },
    },
  );

  useEffect(() => {
    // Load all data from localStorage
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

    // KYC Metadata (filenames and types)
    const kycName = localStorage.getItem("onboarding_kyc_name");
    const docName = localStorage.getItem("onboarding_doc_name");
    const kycType = localStorage.getItem("onboarding_kyc_type");
    const docType = localStorage.getItem("onboarding_doc_type");

    // Brand Assets Previews
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

  const handleSubmit = async () => {
    setLoading(true);
    console.log("Preparing Payload from Data:", data);

    // Schedules Mapping
    const schedules = Object.entries(data.schedule || {}).map(
      ([day, val]: [string, any]) => ({
        dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1), // Capitalize
        openTime: val.isOpen ? `${val.openTime}:00` : "00:00:00", // Append seconds ideally
        closeTime: val.isOpen ? `${val.closeTime}:00` : "00:00:00",
        isClosed: !val.isOpen,
      }),
    );

    // Backend Enum Mapping
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

    // KYC Mapping
    const kycDocuments = [];
    if (data.kyc?.kycName) {
      kycDocuments.push({
        documentType: mapDocTypeToBackend(data.kyc.kycType || "id_card"),
        documentFile: data.kyc.kycName,
      });
    }
    if (data.kyc?.docName) {
      kycDocuments.push({
        documentType: mapDocTypeToBackend(data.kyc.docType || "food_license"),
        documentFile: data.kyc.docName,
      });
    }

    // Construct Payload
    const payload = {
      name: data.restaurant?.restaurantName || "",
      email: data.restaurant?.restaurantEmail || "",
      phone: data.restaurant?.restaurantPhone || "",
      address: data.restaurant?.address || "",
      country: data.restaurant?.country || "",
      latitude: data.restaurant?.location?.lat || 0,
      longitude: data.restaurant?.location?.lng || 0,
      type: (data.restaurant?.cuisineTypes || []).join(","),
      schedules: JSON.stringify(schedules),
      kycDocuments: JSON.stringify(kycDocuments),
      Ownerphone: data.owner?.ownerPhone || "",
      ownerName: data.owner?.ownerName || "",
      accountHolderName: data.bank?.accountTitle || "",
      accountType: data.bank?.accountType || "",
      bankName: data.bank?.bankName || "",
      iban: data.bank?.iban || "",
      profileImage: data.assets?.logo || "",
      bannerImage: data.assets?.banner || "",
    };

    console.log("Final Payload:", payload);
    await execute(payload);
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    step,
  }: {
    icon: any;
    title: string;
    step: string;
  }) => (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
      <div className="flex items-center gap-2 text-[#346853]">
        <Icon className="w-5 h-5" />
        <Typography className="font-bold text-lg">{title}</Typography>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-gray-400 hover:text-[#346853]"
        onClick={() => router.push(step)}
      >
        <Edit className="w-3 h-3 mr-1" />
        Edit
      </Button>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="grid grid-cols-3 gap-2 py-1">
      <Typography className="text-xs font-bold text-gray-400 uppercase">
        {label}
      </Typography>
      <Typography className="text-sm font-medium text-gray-800 col-span-2 break-all">
        {value || "-"}
      </Typography>
    </div>
  );

  if (!data.owner) return <div>Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <Typography variant="h3" className="text-xl font-bold text-[#111827]">
          Review Application
        </Typography>
        <Typography className="text-gray-500 mt-1">
          Please review your information before final submission.
        </Typography>
      </div>

      <div className="space-y-6">
        {/* Owner Info */}
        <Card className="p-6 border-none shadow-sm bg-gray-50/50">
          <SectionHeader
            icon={User}
            title="Owner Information"
            step={`/${country}/${language}/restaurant/onboarding/step-owner-info`}
          />
          <InfoRow label="Full Name" value={data.owner.ownerName} />
          <InfoRow label="Phone" value={data.owner.ownerPhone} />
        </Card>

        {/* Restaurant Info */}
        <Card className="p-6 border-none shadow-sm bg-gray-50/50">
          <SectionHeader
            icon={Store}
            title="Restaurant Details"
            step={`/${country}/${language}/restaurant/onboarding/step-restaurant-info`}
          />
          <InfoRow label="Name" value={data.restaurant.restaurantName} />
          <InfoRow label="Email" value={data.restaurant.restaurantEmail} />
          <InfoRow label="Phone" value={data.restaurant.restaurantPhone} />
          <InfoRow label="Address" value={data.restaurant.address} />
          <InfoRow label="Website" value={data.restaurant.websiteUrl} />
          <InfoRow label="Description" value={data.restaurant.description} />
          <InfoRow
            label="Cuisines"
            value={data.restaurant.cuisineTypes?.join(", ")}
          />
        </Card>

        {/* Brand Assets */}
        <Card className="p-6 border-none shadow-sm bg-gray-50/50">
          <SectionHeader
            icon={ImageIcon}
            title="Brand Assets"
            step={`/${country}/${language}/restaurant/onboarding/step-brand-assets`}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography className="text-xs font-bold text-gray-400 uppercase mb-2">
                Logo
              </Typography>
              {data.assets?.logo ? (
                <img
                  src={data.assets.logo}
                  alt="Logo"
                  className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-500">
                  No Logo
                </div>
              )}
            </div>
            <div>
              <Typography className="text-xs font-bold text-gray-400 uppercase mb-2">
                Banner
              </Typography>
              {data.assets?.banner ? (
                <img
                  src={data.assets.banner}
                  alt="Banner"
                  className="w-full h-24 object-cover rounded-xl border border-gray-200"
                />
              ) : (
                <div className="w-full h-24 bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-500">
                  No Banner
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Schedule */}
        <Card className="p-6 border-none shadow-sm bg-gray-50/50">
          <SectionHeader
            icon={Clock}
            title="Operating Hours"
            step={`/${country}/${language}/restaurant/onboarding/step-schedule`}
          />
          <div className="space-y-2">
            {Object.entries(data.schedule || {}).map(
              ([day, hours]: [string, any]) => (
                <div
                  key={day}
                  className="flex justify-between text-sm border-b border-gray-100 last:border-0 pb-1 last:pb-0"
                >
                  <span className="capitalize text-gray-600 font-medium">
                    {day}
                  </span>
                  <span className="text-gray-900 font-bold">
                    {hours.isOpen
                      ? `${hours.openTime} - ${hours.closeTime}`
                      : "Closed"}
                  </span>
                </div>
              ),
            )}
          </div>
        </Card>

        {/* KYC */}
        <Card className="p-6 border-none shadow-sm bg-gray-50/50">
          <SectionHeader
            icon={FileText}
            title="KYC Documents"
            step={`/${country}/${language}/restaurant/onboarding/step-kyc`}
          />
          <InfoRow label="Identity Doc" value={data.kyc?.kycName} />
          <InfoRow label="Business Doc" value={data.kyc?.docName} />
        </Card>

        {/* Bank Details */}
        <Card className="p-6 border-none shadow-sm bg-gray-50/50">
          <SectionHeader
            icon={CreditCard}
            title="Bank Details"
            step={`/${country}/${language}/restaurant/onboarding/step-bank-details`}
          />
          <InfoRow label="Account Title" value={data.bank.accountTitle} />
          <InfoRow label="Bank Name" value={data.bank.bankName} />
          <InfoRow label="Account Type" value={data.bank.accountType} />
          <InfoRow label="IBAN" value={data.bank.iban} />
        </Card>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-gray-100">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            prevStep();
            router.back();
          }}
          className="text-gray-400 font-bold hover:bg-transparent"
        >
          Back
        </Button>

        <div className="flex items-center gap-4">
          <Typography className="text-sm font-medium text-gray-500">
            Step 07 of 07
          </Typography>
          <Button
            onClick={handleSubmit}
            disabled={isPending || loading}
            className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10 min-w-[200px]"
          >
            {isPending || loading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
}
