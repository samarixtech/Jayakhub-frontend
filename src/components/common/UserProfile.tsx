"use client";
import React from "react";
import Link from "next/link";
import { BarChart, ShoppingBag, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface UserNavProps {
  user: {
    email: string;
    image?: string;
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

  // Get initials for Avatar Fallback
  const initials = user?.email?.substring(0, 2).toUpperCase() || "??";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-12 w-12 rounded-full p-0 border-2 border-transparent hover:border-[#0B5D4E] transition-all"
        >
          <Avatar className="h-10 w-10 border-2 border-white/20 rounded-full">
            <AvatarImage src={user?.image} alt="Profile" />
            <AvatarFallback className="bg-[#0B5D4E] text-[#E8F4F1] font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 p-2 bg-white/95 backdrop-blur-xl border-[#E2E8F0] rounded-2xl shadow-2xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 px-2 py-1.5">
            <p className="text-sm font-bold leading-none text-gray-900">
              {user?.email || tProfile("placeholder.name")}
            </p>
            <p className="text-xs leading-none text-gray-500">
              {user?.email || tProfile("placeholder.email")}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-[#FFF9EE]" />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={`/${country}/${language}/dashboard`}
              className="cursor-pointer rounded-lg hover:bg-[#0B5D4E]/10 focus:bg-[#0B5D4E]/10"
            >
              <BarChart className="mr-3 h-4 w-4 text-[#0B5D4E]" />
              <span className="font-medium">{tProfile("link.dashboard")}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/${country}/${language}/account-settings`}
              className="cursor-pointer rounded-lg hover:bg-[#0B5D4E]/10 focus:bg-[#0B5D4E]/10"
            >
              <Settings className="mr-3 h-4 w-4 text-[#0B5D4E]" />
              <span className="font-medium">
                {tProfile("link.accountSettings")}
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/myorders`}
              className="cursor-pointer rounded-lg hover:bg-[#0B5D4E]/10 focus:bg-[#0B5D4E]/10"
            >
              <ShoppingBag className="mr-3 h-4 w-4 text-[#0B5D4E]" />
              <span className="font-medium">{tProfile("link.myOrders")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-[#FFF9EE]" />

        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer rounded-lg text-red-600 hover:bg-red-50 focus:bg-red-50 font-bold"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>{tProfile("link.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
