"use client";
import {
  useEffect,
  useState,
  useTransition,
  useMemo,
  SetStateAction,
} from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  getProfile,
  updateProfileAction,
} from "@/app/actions/customer/userprofile";
import ProfileHeader from "./profile-header";
import ProfileSidebar from "./profile-sidebar";
import PersonalInfoCard from "./personal-info-card";
import PaymentMethodsCard from "./payment-methods-card";
import IdentityVerificationCard from "./kyc-verification-card";
import SecuritySettingsCard from "./security-settings-card";
import { CustomerProfileData } from "@/types";
import { ProfileSkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";

import NotificationPanel from "./notification-panel";

export default function CustomerProfileSettingsView() {
  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState<CustomerProfileData | null>(null);
  const [initialProfile, setInitialProfile] =
    useState<CustomerProfileData | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [activeView, setActiveView] = useState<"profile" | "notifications">(
    "profile",
  );

  useEffect(() => {
    async function loadData() {
      const result = await getProfile();
      if (result.success) {
        setProfile(result.data);
        setInitialProfile(result.data);
      }
    }
    loadData();
  }, []);

  const hasChanges = useMemo(() => {
    if (!profile || !initialProfile) return false;

    const fieldsChanged =
      profile.name !== initialProfile.name ||
      profile.lastName !== initialProfile.lastName ||
      profile.phone !== initialProfile.phone;

    return fieldsChanged || avatarFile !== null;
  }, [profile, initialProfile, avatarFile]);

  const handleCancel = () => {
    setProfile(initialProfile);
    setAvatarFile(null);
  };

  const handleSave = async () => {
    if (!profile) return;
    const formData = new FormData();
    formData.append("name", profile.name);
    formData.append("lastName", profile.lastName || "");
    formData.append("phone", profile.phone);
    if (avatarFile) formData.append("avatar", avatarFile);

    startTransition(async () => {
      const result = await updateProfileAction(formData);
      if (result.success) {
        toast.success("Profile updated!");
        setProfile(result.data.user);
        setInitialProfile(result.data.user);
        setAvatarFile(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (!profile) return <ProfileSkeleton />;

  return (
    /**
     * FIX:
     * 1. Remove 'flex-1' and 'flex-row' from the outermost wrapper.
     * 2. Ensure 'w-full' and 'mx-auto' are used on the content container.
     * 3. 'px-4 md:px-6 lg:px-8' ensures symmetrical padding that grows with screen size.
     */
    <div className="min-h-screen w-full bg-[#F9FAFB]">
      <div className="max-w-[1400px] mx-auto px-0 py-4 md:px-6 lg:px-8 md:py-10">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <ProfileHeader
            isPending={isPending}
            onSave={handleSave}
            onCancel={handleCancel}
            showCancel={hasChanges}
            saveDisabled={!hasChanges}
          />
        </div>

        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sidebar Area */}
          <aside className="lg:col-span-4 w-full">
            <ProfileSidebar
              profile={profile}
              onAvatarChange={(file: SetStateAction<File | null>) =>
                setAvatarFile(file)
              }
            />
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-8 space-y-6 w-full">
            <PersonalInfoCard profile={profile} />
            <PaymentMethodsCard />
            <IdentityVerificationCard />
            <SecuritySettingsCard />
          </main>
        </div>
      </div>
    </div>
  );
}
