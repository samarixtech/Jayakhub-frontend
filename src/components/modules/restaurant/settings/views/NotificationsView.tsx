"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function NotificationsView() {
  const t = useTranslations("RestaurantDashboard.Settings.notifications");
  const [loading, setLoading] = useState(true);
  const [orderSound, setOrderSound] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  useEffect(() => {
    // Simulate loading for UI consistency since there isn't an explicit fetch here currently.
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const notifications = [
    {
      id: "order-sound",
      title: t("soundTitle"),
      description: t("soundDesc"),
      checked: orderSound,
      onChange: setOrderSound,
    },
    {
      id: "email-receipts",
      title: t("emailTitle"),
      description: t("emailDesc"),
      checked: emailReceipts,
      onChange: setEmailReceipts,
    },
    {
      id: "sms-alerts",
      title: t("smsTitle"),
      description: t("smsDesc"),
      checked: smsAlerts,
      onChange: setSmsAlerts,
    },
  ];

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{t("title")}</CardTitle>
        <CardDescription className="text-gray-500">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="flex items-center justify-between py-4 border-b border-border last:border-b-0"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {notif.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {notif.description}
                </p>
              </div>
              <Switch
                checked={notif.checked}
                onCheckedChange={notif.onChange}
                className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200"
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-6 border-t border-border mt-2">
        <Button>{t("saveBtn")}</Button>
      </CardFooter>
    </Card>
  );
}
