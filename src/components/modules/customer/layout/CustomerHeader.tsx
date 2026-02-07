"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@radix-ui/react-separator";
import { ChevronDown, MapPin } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { useState, useEffect } from "react";
import { getProfile } from "@/app/actions/customer/userprofile";
import { logoutAction } from "@/app/actions/auth/auth";
import { deleteCookie } from "cookies-next";
import UserProfile from "@/components/common/UserProfile";
import useLocale from "@/hooks/useLocals";
import LocationSwitcher from "@/components/common/LocationSwitcher";

function CustomerHeader() {
  const { country, language } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [currentAddress, setCurrentAddress] = useState("New York, NY");

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    };
    fetchProfile();
  }, []);

  const handleLocationChange = (lat: number, lng: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lat", lat.toString());
    params.set("lng", lng.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <header className="p-4 flex shrink-0 items-center">
      <div className="flex w-full items-center justify-between bg-[#346853] h-16 px-6 rounded-3xl shadow-lg">
        {/* Left Side Trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-white/10" />
          <Separator orientation="vertical" className="h-6 bg-white/20" />

          {/* Location Picker  */}
          <LocationSwitcher
            currentAddress={currentAddress}
            onAddressChange={setCurrentAddress}
            isLoggedIn={!!user}
            onLocationChange={handleLocationChange}
          />
        </div>

        {/* Right Side User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <Typography className="text-white font-bold text-sm leading-none">
              {user?.name || "User"}
            </Typography>
            <Typography className="text-white/70 text-[10px] uppercase tracking-widest font-medium mt-0.5">
              {user?.role?.name || "Customer"}
            </Typography>
          </div>
          <UserProfile
            user={user}
            country={country}
            language={language}
            onLogout={async () => {
              try {
                await logoutAction();
              } catch (error) {
                console.error("Logout failed", error);
              }
              deleteCookie("token");
              deleteCookie("role");
              window.location.href = `/${country}/${language}/login`;
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default CustomerHeader;
