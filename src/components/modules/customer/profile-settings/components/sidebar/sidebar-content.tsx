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
  const { fileInputRef, handleFile, avatarSrc } = useSidebar(
    profile,
    onAvatarChange,
  );
  const t = useTranslations("CustomerDashboard.ProfileSettings");

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
          className="absolute bottom-1 right-1 bg-emerald-bg text-white p-2 rounded-full border-4 border-white"
        >
          <Camera size={16} />
        </button>
      </div>
      <Typography variant="h3" className="text-xl font-bold">
        {profile.name} {profile.lastName}
      </Typography>
      <div className="flex gap-2 mt-4">
        {profile.isVerified && (
          <Badge className="bg-emerald-50 text-emerald-600">
            {t("verified")}
          </Badge>
        )}
        <Badge className="bg-blue-50 text-blue-600 uppercase">
          {profile.role}
        </Badge>
      </div>

      {/* STATS SECTION */}
      <div className="w-full mt-12 space-y-4 px-4">
        <h2 className="font-semibold text-slate-500 text-left">Statistics</h2>
        <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">
            {t("total_orders")}
          </span>
          <span className="font-bold text-emerald-bg">
            {profile.totalOrders}
          </span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-600">
            {t("reviews")}
          </span>
          <span className="font-bold text-amber-500">
            {profile.averageRating}
          </span>
        </div>
      </div>
    </div>
  );
}
