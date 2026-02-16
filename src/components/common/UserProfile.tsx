"use client";
import React from "react";

import { BarChart, ShoppingBag, LogOut, Settings } from "lucide-react";
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
    image?: string; // Keep for backward compatibility if needed
  } | null;
  onLogout?: () => void;
  country: string;
  language: string;
}

const UserProfile: React.FC<UserNavProps> = ({
  user,
  onLogout,
  country,
  language,
}) => {
  const tProfile = useTranslations("profile");
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

  // Construct Avatar URL
  // If user.avatar exists, prepend base URL. If not, check user.image.
  const avatarSrc = user?.avatar
    ? `${imageBaseUrl}${user.avatar}`
    : user?.image || undefined;

  // Get initials for Avatar Fallback from Name
  const initials = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || "??";

  const userNavigationLinks = [
    {
      href: "/customer/dashboard",
      label: tProfile("link.dashboard"),
      description: "View analytics & reports",
      icon: BarChart,
    },
    {
      href: "/customer/profile-settings",
      label: tProfile("link.accountSettings"),
      description: "Manage your preferences",
      icon: Settings,
    },
    {
      href: "/customer/order-history",
      label: tProfile("link.myOrders"),
      description: "Track current orders",
      icon: ShoppingBag,
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
        className="w-72 p-0 bg-white/95 backdrop-blur-xl border border-gray-100/50 rounded-2xl shadow-xl overflow-hidden mt-2 mr-2"
        align="end"
        forceMount
      >
        {/* Header Section with Gradient */}
        <div className="bg-linear-to-r from-[#346853] to-[#244a3b] p-6 text-white relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-4 blur-xl pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-4">
            <Avatar className="h-14 w-14 border-4 border-white/20 shadow-lg rounded-full">
              <AvatarImage
                src={avatarSrc}
                alt="Profile"
                className="object-cover"
              />
              <AvatarFallback className="bg-white/20 text-white font-bold backdrop-blur-md">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <p className="text-lg font-bold leading-tight truncate">
                {user?.email?.split("@")[0] || tProfile("placeholder.name")}
              </p>
              <p className="text-xs text-white/80 font-medium truncate">
                {user?.email || tProfile("placeholder.email")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-2 space-y-1">
          <DropdownMenuGroup>
            {userNavigationLinks.map((link) => (
              <DropdownMenuItem
                key={link.href}
                asChild
                className="p-0 focus:bg-transparent"
              >
                <Link
                  href={link.href}
                  className="flex items-center w-full p-3 rounded-xl hover:bg-gray-50 focus:bg-gray-50 transition-colors group cursor-pointer outline-none"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#346853] flex items-center justify-center mr-3 group-hover:bg-[#346853] group-hover:text-white transition-colors duration-300 shadow-sm">
                    <link.icon className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700 text-sm group-hover:text-gray-900">
                      {link.label}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {link.description}
                    </span>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-gray-100 my-2 mx-3" />

          <DropdownMenuItem
            onClick={onLogout}
            className="flex items-center w-full p-3 rounded-xl text-red-600 hover:bg-red-50 focus:bg-red-50 hover:text-red-700 focus:text-red-700 transition-colors cursor-pointer outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mr-3 group-hover:bg-red-200 transition-colors duration-300">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">{tProfile("link.logout")}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
