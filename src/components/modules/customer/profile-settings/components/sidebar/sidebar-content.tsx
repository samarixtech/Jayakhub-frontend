"use client";

import Image from "next/image";
import { Camera, Bell } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { CustomerProfileData } from "@/types";
import { useSidebar } from "./useSidebar";
import { useTranslations } from "next-intl";

interface SidebarContentProps {
  profile: CustomerProfileData;
  onAvatarChange: (file: File | null) => void;
  onNotificationClick?: () => void;
}

export function SidebarContent({
  profile,
  onAvatarChange,
  onNotificationClick,
}: SidebarContentProps) {
  const { fileInputRef, handleFile, avatarSrc, kycSubmitted, hasRejectedKyc } =
    useSidebar(profile, onAvatarChange);
  const t = useTranslations("CustomerDashboard.ProfileSettings");

  const kycStatusLabel = profile.kycVerified
    ? t("verified")
    : hasRejectedKyc
      ? t("rejected")
      : kycSubmitted
        ? t("pending")
        : t("not_verified");

  const kycStatusClass = profile.kycVerified
    ? "bg-forest-green/10 text-forest-green"
    : hasRejectedKyc
      ? "bg-red-50 text-red-600"
      : kycSubmitted
        ? "bg-secondary/15 text-gold-deep"
        : "bg-red-50 text-red-600";

  return (
    <div className="flex flex-col items-center text-center w-full">
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 relative">
          <Image src={avatarSrc} alt="Profile" fill className="object-cover" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFile}
          className="hidden"
          accept="image/*"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full border-4 border-white"
        >
          <Camera size={16} />
        </button>
      </div>
      <Typography variant="h3" className="text-xl font-bold">
        {profile.name} {profile.lastName}
      </Typography>
      <div className="flex gap-2 mt-4">
        <Badge className={`uppercase ${kycStatusClass}`}>
          {kycStatusLabel}
        </Badge>
        <Badge className="bg-navy/10 text-navy uppercase">
          {typeof profile.role === "string"
            ? profile.role
            : typeof profile.role === "object"
              ? profile.role?.name || t("customer_fallback")
              : t("customer_fallback")}
        </Badge>
      </div>

      {/* STATS SECTION */}
      <div className="w-full mt-12 space-y-4 px-4">
        <h2 className="font-semibold text-slate-500 text-left">{t("statistics")}</h2>
        <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">
            {t("total_orders")}
          </span>
          <span className="font-bold text-primary">
            {profile.totalOrders}
          </span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">
            {t("reviews")}
          </span>
          <span className="font-bold text-gold-deep">
            {profile.averageRating}
          </span>
        </div>
      </div>
    </div>
  );
}
