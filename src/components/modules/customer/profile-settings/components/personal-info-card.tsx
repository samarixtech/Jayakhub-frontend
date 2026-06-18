"use client";

import { CustomerProfileData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoForm } from "./personal-info/personal-info-form";
import { useTranslations } from "next-intl";

interface PersonalInfoCardProps {
  profile: CustomerProfileData;
  updateProfile: (data: Partial<CustomerProfileData>) => void;
}

export default function PersonalInfoCard({
  profile,
  updateProfile,
}: PersonalInfoCardProps) {
  const t = useTranslations("CustomerDashboard.ProfileSettings");

  return (
    <Card className="rounded-3xl p-4 border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="px-0 pt-0 pb-6">
        <CardTitle className="text-lg font-bold text-gray-900">
          {t("personal_info_title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <PersonalInfoForm profile={profile} updateProfile={updateProfile} />
      </CardContent>
    </Card>
  );
}
