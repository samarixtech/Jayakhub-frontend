"use client";

import { useState, useEffect } from "react";
import {
  Store,
  MapPin,
  Clock,
  DollarSign,
  Bell,
  Shield,
  FileCheck,
} from "lucide-react";
import { useServerAction } from "@/hooks/use-server-action";
import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { SettingsData } from "./types";

// Import Tab Components
import { ProfileTab } from "./tabs/ProfileTab";
import { LocationTab } from "./tabs/LocationTab";
import { HoursTab } from "./tabs/HoursTab";
import { FinanceTab } from "./tabs/FinanceTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { SecurityTab } from "./tabs/SecurityTab";
import { DocumentsTab } from "./tabs/DocumentsTab";

// ==================== TAB CONFIG ====================
const tabs = [
  { id: "profile", label: "Profile", icon: Store },
  { id: "location", label: "Location", icon: MapPin },
  { id: "hours", label: "Hours", icon: Clock },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "documents", label: "Documents & Verification", icon: FileCheck },
];

// ==================== MAIN COMPONENT ====================
export default function SettingsView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState<SettingsData | null>(null);

  const { execute: fetchSettings, isPending } = useServerAction(
    getAccountSettingsAction,
    {
      suppressSuccessToast: true,
      onSuccess: (data: any) => {
        const s = data?.data || data;
        if (s) setSettings(s);
      },
    },
  );

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

  return (
    <div className="p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="w-60 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit sticky top-6">
          <h2 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Settings Menu
          </h2>
          <div className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left
                    ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <tab.icon
                    className={`w-4 h-4 ${isActive ? "text-primary" : "text-gray-400"}`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header for Content Area - Makes it look like Dashboard Pages */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your{" "}
              {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}{" "}
              settings here.
            </p>
          </div>

          {isPending ? (
            <div className="space-y-4">
              <div className="h-40 bg-gray-200 animate-pulse rounded-xl" />
              <div className="h-20 bg-gray-200 animate-pulse rounded-xl" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {activeTab === "profile" && (
                <ProfileTab settings={settings} imageBaseUrl={imageBaseUrl} />
              )}
              {activeTab === "location" && <LocationTab settings={settings} />}
              {activeTab === "hours" && <HoursTab settings={settings} />}
              {activeTab === "finance" && <FinanceTab settings={settings} />}
              {activeTab === "notifications" && <NotificationsTab />}
              {activeTab === "security" && <SecurityTab />}
              {activeTab === "documents" && (
                <DocumentsTab settings={settings} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
