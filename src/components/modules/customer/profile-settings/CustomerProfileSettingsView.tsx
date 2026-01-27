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
import { ProfileData } from "@/types/customer.types";

export default function CustomerProfileSettingsView() {
  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [initialProfile, setInitialProfile] = useState<ProfileData | null>(
    null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

  // LOADER IF NO PROFILE
  if (!profile)
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-5">
      <div className="max-w-full mx-auto">
        <ProfileHeader
          isPending={isPending}
          onSave={handleSave}
          onCancel={handleCancel}
          showCancel={hasChanges}
          saveDisabled={!hasChanges}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <ProfileSidebar
              profile={profile}
              onAvatarChange={(file: SetStateAction<File | null>) =>
                setAvatarFile(file)
              }
            />
          </aside>

          <main className="lg:col-span-8 space-y-6">
            <PersonalInfoCard profile={profile} setProfile={setProfile} />
            <PaymentMethodsCard />
            <IdentityVerificationCard />
            <SecuritySettingsCard />
          </main>
        </div>
      </div>
    </div>
  );
}
