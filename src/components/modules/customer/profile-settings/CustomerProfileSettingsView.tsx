"use client";
import ProfileHeader from "./components/profile-header";
import ProfileSidebar from "./components/profile-sidebar";
import PersonalInfoCard from "./components/personal-info-card";
import PaymentMethodsCard from "./components/payment-methods-card";
import IdentityVerificationCard from "./components/kyc-verification-card";
import SecuritySettingsCard from "./components/security-settings-card";
import DeleteAccountCard from "./components/delete-account-card";
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
    updateProfile,
  } = useProfileSettings();

  if (!profile) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] py-4 md:p-6 transition-all">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-8">
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
            <PersonalInfoCard
              profile={profile}
              updateProfile={updateProfile}
            />
            <PaymentMethodsCard />
            <IdentityVerificationCard />
            <SecuritySettingsCard profile={profile} />
            <DeleteAccountCard />
          </main>
        </div>
      </div>
    </div>
  );
}
