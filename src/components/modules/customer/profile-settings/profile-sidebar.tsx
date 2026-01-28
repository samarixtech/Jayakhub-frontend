import { useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { ProfileData } from "@/types/customer.types";

// TYPES
interface ProfileSidebarProps {
  profile: ProfileData;
  onAvatarChange: (file: File | null) => void;
}

export default function ProfileSidebar({
  profile,
  onAvatarChange,
}: ProfileSidebarProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const avatarSrc =
    preview ||
    (profile.avatar
      ? `http://192.168.100.9:5000/${profile.avatar}`
      : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop");

  return (
    <Card className="rounded-3xl border-none shadow-sm bg-white py-10">
      <CardContent className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 relative">
            <Image
              src={avatarSrc}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 bg-emerald-bg text-white p-2 rounded-full border-4 border-white"
          >
            <Camera size={16} />
          </button>
        </div>
        <Typography variant="h3" className="text-xl font-bold">
          {profile.name} {profile.lastName}
        </Typography>
        <div className="flex gap-2 mt-4">
          {profile.isVerified && (
            <Badge className="bg-emerald-50 text-emerald-600">VERIFIED</Badge>
          )}
          <Badge className="bg-blue-50 text-blue-600 uppercase">
            {profile.role?.name}
          </Badge>
        </div>
        {/* STATS SECTION */}
        <div className="w-full mt-12 space-y-4 px-4">
          <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">
              Total Orders
            </span>
            <span className="font-bold text-emerald-bg">142</span>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Reviews</span>
            <span className="font-bold text-amber-500">4.8</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
