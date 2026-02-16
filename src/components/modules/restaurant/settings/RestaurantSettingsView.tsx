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
  ImageIcon,
  X,
  CreditCard,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useServerAction } from "@/hooks/use-server-action";
import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import Image from "next/image";

// ==================== TYPES ====================
interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  type: string[];
  profileImage: string;
  bannerImage: string;
  status: string;
}

interface LocationData {
  address: string;
  latitude: string;
  longitude: string;
  country: string;
}

interface ScheduleData {
  id: string;
  restaurantId: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface BankAccountData {
  id: string;
  accountHolderName: string;
  accountType: string;
  bankName: string;
  iban: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface KycData {
  id: string;
  userId: string;
  documentType: string;
  status: string;
  documentFile: string;
  createdAt: string;
  updatedAt: string;
}

interface SettingsData {
  profile: ProfileData;
  location: LocationData;
  schedules: ScheduleData[];
  bankAccount: BankAccountData;
  kyc: KycData[];
}

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

// ==================== HELPERS ====================
function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const h = parseInt(hours, 10);
  const suffix = h >= 12 ? "pm" : "am";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(displayH).padStart(2, "0")}:${minutes} ${suffix}`;
}

// ==================== MAIN COMPONENT ====================
export default function RestaurantSettingsView() {
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
  }, []);

  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

  return (
    <div className="flex flex-col gap-2 w-full max-w-[1200px] mx-auto p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Restaurant Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile, operations, and preferences in one place.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <nav className="w-[220px] shrink-0">
          <div className="flex flex-col gap-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-[#E8F5F0] text-[#1F4D36]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {isPending ? (
            <SettingsSkeleton />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== PROFILE TAB ====================
function ProfileTab({
  settings,
  imageBaseUrl,
}: {
  settings: SettingsData | null;
  imageBaseUrl: string;
}) {
  const profile = settings?.profile;
  const [cuisines, setCuisines] = useState<string[]>(profile?.type || []);
  const [cuisineInput, setCuisineInput] = useState("");

  useEffect(() => {
    if (profile?.type) setCuisines(profile.type);
  }, [profile?.type]);

  const addCuisine = () => {
    const trimmed = cuisineInput.trim();
    if (trimmed && !cuisines.includes(trimmed)) {
      setCuisines([...cuisines, trimmed]);
      setCuisineInput("");
    }
  };

  const removeCuisine = (cuisine: string) => {
    setCuisines(cuisines.filter((c) => c !== cuisine));
  };

  return (
    <Card className="p-6 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Restaurant Profile</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Details visible to customers on your page.
        </p>
      </div>

      {/* Image Upload Areas */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Logo */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Logo
          </Label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#1F4D36]/30 transition-colors cursor-pointer bg-gray-50/50 min-h-[140px]">
            {profile?.profileImage ? (
              <Image
                src={`${imageBaseUrl}${profile.profileImage}`}
                alt="Logo"
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-2">
                  <ImageIcon className="w-5 h-5 text-[#1F4D36]" />
                </div>
                <p className="text-sm font-medium text-gray-600">Upload Logo</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG up to 2MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Cover Image
          </Label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#1F4D36]/30 transition-colors cursor-pointer bg-gray-50/50 min-h-[140px]">
            {profile?.bannerImage ? (
              <Image
                src={`${imageBaseUrl}${profile.bannerImage}`}
                alt="Cover"
                width={200}
                height={80}
                className="rounded-lg object-cover"
              />
            ) : (
              <>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-2">
                  <ImageIcon className="w-5 h-5 text-[#1F4D36]" />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Upload Cover
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  1200×400px recommended
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Name */}
      <div className="mb-5">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Restaurant Name <span className="text-red-500">*</span>
        </Label>
        <Input
          defaultValue={profile?.name || ""}
          className="h-11 border-gray-200 focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Description
        </Label>
        <Textarea
          defaultValue={profile?.description || ""}
          rows={4}
          className="border-gray-200 resize-none focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
        />
      </div>

      {/* Cuisines */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Cuisines
        </Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {cuisines.map((cuisine) => (
            <Badge
              key={cuisine}
              className="bg-emerald-50 text-[#1F4D36] border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-1.5"
            >
              {cuisine}
              <button
                onClick={() => removeCuisine(cuisine)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Add a cuisine (e.g. Kurdish, BBQ)"
          value={cuisineInput}
          onChange={(e) => setCuisineInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCuisine();
            }
          }}
          className="h-11 border-gray-200 focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
        />
      </div>
    </Card>
  );
}

// ==================== LOCATION TAB ====================
function LocationTab({ settings }: { settings: SettingsData | null }) {
  const location = settings?.location;
  const profile = settings?.profile;

  return (
    <Card className="p-6 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Location & Contact</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Where customers can find you.
        </p>
      </div>

      {/* Address */}
      <div className="mb-5">
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Address <span className="text-red-500">*</span>
        </Label>
        <Input
          defaultValue={location?.address || ""}
          className="h-11 border-gray-200 focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
        />
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            defaultValue={profile?.phone || ""}
            className="h-11 border-gray-200 focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Email Address
          </Label>
          <Input
            defaultValue={profile?.email || ""}
            className="h-11 border-gray-200 focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
          />
        </div>
      </div>

      {/* Website */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
          Website
        </Label>
        <Input
          placeholder="https://"
          className="h-11 border-gray-200 focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
        />
      </div>
    </Card>
  );
}

// ==================== HOURS TAB ====================
function HoursTab({ settings }: { settings: SettingsData | null }) {
  const schedules = settings?.schedules || [];
  const profile = settings?.profile;
  const isOnline = profile?.status === "active";

  return (
    <Card className="p-6 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Operating Hours</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Set your weekly schedule.
        </p>
      </div>

      {/* Restaurant Status Toggle */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-700">
          Restaurant Status
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              isOnline
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
          <Switch
            checked={isOnline}
            className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200"
          />
        </div>
      </div>

      {/* Schedule Table */}
      <div className="space-y-0">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="flex items-center gap-4 py-3.5 border-b border-gray-50 last:border-b-0"
          >
            {/* Day */}
            <span className="w-[120px] text-sm font-medium text-gray-700">
              {schedule.dayOfWeek}
            </span>

            {/* Open Time */}
            <div className="flex items-center gap-1.5">
              <Input
                defaultValue={formatTime(schedule.openTime)}
                className="h-9 w-[120px] text-sm text-center border-gray-200 focus-visible:ring-[#1F4D36]/20"
                readOnly
              />
              <Clock className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <span className="text-sm text-gray-400">to</span>

            {/* Close Time */}
            <div className="flex items-center gap-1.5">
              <Input
                defaultValue={formatTime(schedule.closeTime)}
                className="h-9 w-[120px] text-sm text-center border-gray-200 focus-visible:ring-[#1F4D36]/20"
                readOnly
              />
              <Clock className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Toggle */}
            <Switch
              checked={!schedule.isClosed}
              className="data-[state=checked]:bg-emerald-600 data-[state=unchecked]:bg-gray-200"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ==================== FINANCE TAB ====================
function FinanceTab({ settings }: { settings: SettingsData | null }) {
  const bank = settings?.bankAccount;

  return (
    <Card className="p-6 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Finance</h2>
        <p className="text-sm text-gray-500 mt-0.5">Banking information.</p>
      </div>

      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Bank Account Details
      </h3>

      <div className="border border-gray-100 rounded-xl p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">
              Bank Name
            </Label>
            <Input
              defaultValue={bank?.bankName || ""}
              placeholder="Bank Name"
              className="h-10 border-gray-200 text-sm focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-400 mb-1 block">
              Account Holder Name
            </Label>
            <Input
              defaultValue={bank?.accountHolderName || ""}
              placeholder="Account Holder Name"
              className="h-10 border-gray-200 text-sm focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs text-gray-400 mb-1 block">
            IBAN / Account Number
          </Label>
          <Input
            defaultValue={bank?.iban || ""}
            placeholder="IBAN / Account Number"
            className="h-10 border-gray-200 text-sm focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
          />
        </div>
      </div>
    </Card>
  );
}

// ==================== NOTIFICATIONS TAB ====================
function NotificationsTab() {
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
    <Card className="p-6 border border-gray-100 shadow-sm">
      <div className="mb-6">
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
    </Card>
  );
}

// ==================== SECURITY TAB ====================
function SecurityTab() {
  return (
    <Card className="p-6 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Update your password securely.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Current Password <span className="text-red-500">*</span>
          </Label>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-11 border-gray-200 focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              placeholder="New Password"
              className="h-11 border-gray-200 focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Confirm New Password"
              className="h-11 border-gray-200 focus-visible:ring-[#1F4D36]/20 focus-visible:border-[#1F4D36]"
            />
          </div>
        </div>
      </div>

      <Button className="w-full mt-6 h-11 bg-[#1F4D36] hover:bg-[#183d2b] text-white font-medium text-sm">
        Update Password
      </Button>
    </Card>
  );
}

// ==================== DOCUMENTS TAB ====================
function DocumentsTab({ settings }: { settings: SettingsData | null }) {
  const kyc = settings?.kyc || [];

  const getDocLabel = (type: string) => {
    switch (type) {
      case "government_id":
        return "National ID Card";
      case "food_license":
        return "Food Hygiene License";
      case "tax_certificate":
        return "Tax Certificate";
      default:
        return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  const getDocCategory = (type: string) => {
    switch (type) {
      case "government_id":
        return "Identity Proof";
      case "food_license":
        return "Restaurant Document";
      case "tax_certificate":
        return "Financial Document";
      default:
        return "Document";
    }
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case "government_id":
        return CreditCard;
      case "food_license":
        return FileText;
      default:
        return FileCheck;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "VERIFIED",
          className: "bg-emerald-50 text-emerald-600 border-emerald-200",
        };
      case "rejected":
        return {
          label: "REJECTED",
          className: "bg-red-50 text-red-600 border-red-200",
        };
      case "pending":
      default:
        return {
          label: "PENDING",
          className: "bg-amber-50 text-amber-600 border-amber-200",
        };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="p-6 border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Documents & Verification
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          View your verified business documents.
        </p>
      </div>

      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Documents on File
      </h3>

      {kyc.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FileCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {kyc.map((doc) => {
            const DocIcon = getDocIcon(doc.documentType);
            const statusBadge = getStatusBadge(doc.status);
            const verifiedDate = doc.updatedAt
              ? `Verified on ${formatDate(doc.updatedAt)}`
              : "";

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1F4D36] rounded-full flex items-center justify-center">
                    <DocIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {getDocLabel(doc.documentType)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {getDocCategory(doc.documentType)}
                      {verifiedDate && ` • ${verifiedDate}`}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold tracking-wide px-3 py-1 rounded-full ${statusBadge.className}`}
                >
                  {statusBadge.label}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ==================== SKELETON ====================
function SettingsSkeleton() {
  return (
    <Card className="p-6 border border-gray-100 shadow-sm animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-72 bg-gray-100 rounded mb-8" />

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="h-[140px] bg-gray-100 rounded-xl" />
        <div className="h-[140px] bg-gray-100 rounded-xl" />
      </div>

      <div className="space-y-5">
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-11 bg-gray-100 rounded-lg" />
        </div>
        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-24 bg-gray-100 rounded-lg" />
        </div>
        <div>
          <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-100 rounded-full" />
            <div className="h-8 w-24 bg-gray-100 rounded-full" />
            <div className="h-8 w-20 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}
