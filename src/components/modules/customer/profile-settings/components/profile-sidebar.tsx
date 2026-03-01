import { Card, CardContent } from "@/components/ui/card";
import { CustomerProfileData } from "@/types";
import { SidebarContent } from "./sidebar/sidebar-content";

interface ProfileSidebarProps {
  profile: CustomerProfileData;
  onAvatarChange: (file: File | null) => void;
  onNotificationClick?: () => void;
}

export default function ProfileSidebar({
  profile,
  onAvatarChange,
  onNotificationClick,
}: ProfileSidebarProps) {
  return (
    <Card className="rounded-3xl border-none shadow-sm bg-white py-10">
      <CardContent className="flex flex-col items-center text-center px-0">
        <SidebarContent
          profile={profile}
          onAvatarChange={onAvatarChange}
          onNotificationClick={onNotificationClick}
        />
      </CardContent>
    </Card>
  );
}
