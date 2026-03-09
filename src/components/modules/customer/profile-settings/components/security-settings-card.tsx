"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SecuritySettingsForm } from "./security/security-settings-form";
import { useTranslations } from "next-intl";

export default function SecuritySettingsCard() {
  const t = useTranslations('CustomerDashboard.ProfileSettings');

  return (
    <Card className="rounded-3xl p-8 border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="px-0 pt-0 pb-6">
        <CardTitle className="text-lg font-bold text-gray-900">
          {t('security_settings_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <SecuritySettingsForm />
      </CardContent>
    </Card>
  );
}
