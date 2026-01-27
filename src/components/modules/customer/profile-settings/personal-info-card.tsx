import { Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProfileData } from "@/types/customer.types";

interface PersonalInfoCardProps {
  profile: ProfileData;
  setProfile: (profile: ProfileData) => void;
}

export default function PersonalInfoCard({
  profile,
  setProfile,
}: PersonalInfoCardProps) {
  return (
    <Card className="rounded-3xl p-8 border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="">
        <CardTitle className="text-lg font-bold text-gray-900">
          Personal Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
              First Name
            </label>
            <Input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
              className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
              Last Name
            </label>
            <Input
              value={profile.lastName || ""}
              onChange={(e) =>
                setProfile({ ...profile, lastName: e.target.value })
              }
              placeholder="Last Name"
              className="rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
            />
          </div>

          {/* Email Address - Disabled */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <Input
                disabled
                value={profile.email}
                className="pl-12 rounded-2xl border-gray-100 bg-gray-100/50 h-12 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-3.5 text-gray-400"
                size={18}
              />
              <Input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="Phone"
                className="pl-12 rounded-2xl border-gray-100 bg-gray-50/50 h-12 focus-visible:ring-emerald-bg"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
