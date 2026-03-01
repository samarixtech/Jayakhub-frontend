"use client";

import { CustomerProfileData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonalInfoForm } from "./personal-info/personal-info-form";

interface PersonalInfoCardProps {
  profile: CustomerProfileData;
}

export default function PersonalInfoCard({ profile }: PersonalInfoCardProps) {
  return (
    <Card className="rounded-3xl p-8 border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="px-0 pt-0 pb-6">
        <CardTitle className="text-lg font-bold text-gray-900">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <PersonalInfoForm profile={profile} />
      </CardContent>
    </Card>
  );
}
