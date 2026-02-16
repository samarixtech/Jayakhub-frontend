"use client";
import React from "react";
import {
  LayoutDashboard,
  Settings,
  ShoppingBag,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface UserNavProps {
  user: {
    name?: string;
    email: string;
    avatar?: string;
    image?: string;
  } | null;
  onLogout?: () => void;
  country: string;
  language: string;
}

const UserProfile: React.FC<UserNavProps> = ({ user, onLogout }) => {
  const tProfile = useTranslations("profile");
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

  // Construct Avatar URL
  const avatarSrc = user?.avatar
    ? `${imageBaseUrl}${user.avatar}`
    : user?.image || undefined;

  // Get initials for Avatar Fallback
  const initials = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "??";

  const menuItems = [
    {
      href: "/customer/dashboard",
      label: "Dashboard", // Using hardcoded English as per request logic, or fallback to tProfile key if exists? User said "dashboard, account settings..." in prompt. I'll use keys where possible or just text if minimal.
      // Actually, existing code used tProfile keys. I should stick to that where possible, but for new items I might need new keys.
      // Existing keys: link.dashboard, link.profileSettings, link.myOrders, link.logout.
      // New: Subscription, Help Center.
      // I'll use English text for new items to be safe if keys don't exist, or just use the English text for all to be consistent if keys are missing.
      // Given the user specifically listed the items in English, I will use English labels for the new items and keep existing logic if keys exist or just use strings.
      // Using tProfile for existing, string for new is safest.
      icon: LayoutDashboard,
    },
    // {
    //   href: "/customer/Profile",
    //   label: "Profile",
    //   icon: User,
    // },
    {
      href: "/customer/profile-settings",
      label: tProfile("link.profileSettings"),
      icon: Settings,
    },
    {
      href: "/customer/order-history",
      label: tProfile("link.myOrders"),
      icon: ShoppingBag,
    },

    {
      href: "/help",
      label: "Help Center",
      icon: HelpCircle,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-12 rounded-full p-0 ring-2 ring-transparent hover:ring-[#346853]/20 transition-all duration-300"
        >
          <Avatar className="h-10 w-10 border-2 border-white shadow-md rounded-full cursor-pointer">
            <AvatarImage
              src={avatarSrc}
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-linear-to-br from-[#346853] to-[#2a5443] text-white font-bold shadow-inner">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 p-2 bg-white backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl mt-2 mr-2"
        align="end"
        forceMount
      >
        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 mb-2 bg-gray-50/50 rounded-xl border border-gray-100">
          <Avatar className="h-10 w-10 border border-white shadow-sm rounded-full">
            <AvatarImage
              src={avatarSrc}
              alt="Profile"
              className="object-cover"
            />
            <AvatarFallback className="bg-[#346853] text-white font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-xs text-gray-500 font-medium truncate">
              {user?.email || "email@example.com"}
            </p>
          </div>
        </div>

        <DropdownMenuGroup className="space-y-1">
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.href}
              asChild
              className="p-0 focus:bg-transparent outline-none"
            >
              <Link
                href={item.href}
                className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors group cursor-pointer"
              >
                <item.icon className="h-4 w-4 mr-3 text-gray-500 group-hover:text-[#346853] transition-colors" />
                <span className="font-medium text-sm group-hover:text-gray-900 transition-colors">
                  {item.label === "Dashboard" ? tProfile("link.dashboard") : item.label}
                </span>
                {item.label === "Subscription" && (
                  <span className="ml-auto text-[10px] bg-[#346853]/10 text-[#346853] px-1.5 py-0.5 rounded font-semibold">
                    PRO
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-100 my-2" />

        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors cursor-pointer outline-none group"
        >
          <LogOut className="h-4 w-4 mr-3 text-gray-500 group-hover:text-red-600 transition-colors" />
          <span className="font-medium text-sm">{tProfile("link.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
