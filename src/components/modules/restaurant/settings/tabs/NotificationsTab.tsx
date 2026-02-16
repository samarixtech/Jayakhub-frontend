import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function NotificationsTab() {
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
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your alerts.</p>
      </div>

      <div className="space-y-0">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="flex items-center justify-between py-4 border-b border-gray-50 last:border-b-0"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {notif.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
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

      <div className="mt-8 flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
