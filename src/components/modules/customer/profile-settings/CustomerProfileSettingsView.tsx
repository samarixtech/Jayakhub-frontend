"use client";
import ProfileHeader from "./components/profile-header";
import ProfileSidebar from "./components/profile-sidebar";
import PersonalInfoCard from "./components/personal-info-card";
import PaymentMethodsCard from "./components/payment-methods-card";
import IdentityVerificationCard from "./components/kyc-verification-card";
import SecuritySettingsCard from "./components/security-settings-card";
import { ProfileSkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";
import { useProfileSettings } from "./useProfileSettings";

export default function CustomerProfileSettingsView() {
  const {
    isPending,
    profile,
    setAvatarFile,
    hasChanges,
    handleSave,
    handleCancel,
  } = useProfileSettings();

  if (!profile) return <ProfileSkeleton />;

  return (
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

        {/* Grid System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sidebar Area (Left) */}
          <aside className="lg:col-span-4 w-full lg:sticky lg:top-8 transition-all duration-300">
            <ProfileSidebar
              profile={profile}
              onAvatarChange={(file: File | null) => setAvatarFile(file)}
            />
          </aside>

          {/* Main Content Area (Right) */}
          <main className="lg:col-span-8 space-y-6 w-full">
            <PersonalInfoCard profile={profile} />
            <PaymentMethodsCard />
            <IdentityVerificationCard />
            <SecuritySettingsCard profile={profile} />
          </main>
        </div>
      </div>
    </div>
  );
}
