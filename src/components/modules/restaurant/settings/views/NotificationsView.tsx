"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function NotificationsView() {
  const [orderSound, setOrderSound] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const notifications = [
    {
      id: "order-sound",
      title: "New Order Sound",
      description: "Play a sound when a new order arrives",
      checked: orderSound,
      onChange: setOrderSound,
    },
    {
      id: "email-receipts",
      title: "Email Receipts",
      description: "Receive daily summary via email",
      checked: emailReceipts,
      onChange: setEmailReceipts,
    },
    {
      id: "sms-alerts",
      title: "SMS Alerts",
      description: "Get critical updates via SMS",
      checked: smsAlerts,
      onChange: setSmsAlerts,
    },
  ];

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Notifications</CardTitle>
        <CardDescription className="text-gray-500">
          Manage your alerts and notification preferences
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
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
