"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getProfile } from "@/app/actions/customer/userprofile";
import { logoutAction } from "@/app/actions/auth/auth";
import Image from "next/image";
import { useSelector } from "react-redux";
import { FiShoppingBag } from "react-icons/fi";
import { RootState } from "@/redux/store/store";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CartDrawer from "@/components/CartDrawer";
import useLocale from "@/hooks/useLocals";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import LocationSwitcher from "@/components/common/LocationSwitcher";
import UserProfile from "@/components/common/UserProfile";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Assets
import engLogo from "../../../../../public/EngLogo (2).png";
import arabicLogo from "../../../../../public/ArbicLogo (2).png";

const CustomerHeader = () => {
  const { country, language } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentAddress, setCurrentAddress] = useState("Iraq, Baghdad");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getProfile();
      if (response.success && response.data) {
        setIsLoggedIn(true);
        setUser(response.data);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    fetchProfile();
  }, []);

  const totalItems = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  return (
    <header className="w-full z-50 shrink-0 relative">
      <nav className="w-full md:bg-emerald-bg md:px-12 md:h-20 md:flex md:items-center md:justify-between shadow-lg gap-4">
        {/* ROW 1 Auth | Logo + Location (Desktop) | Lang */}
        <div className="bg-emerald-bg px-4 py-3 md:bg-transparent md:p-0 flex items-center justify-between w-full md:w-auto md:justify-start gap-4">
          {/* MOBILE SIDEBAR TRIGGER */}
          <div className="md:hidden text-white">
            <SidebarTrigger className="text-white hover:bg-white/10" />
          </div>

          <div className="md:hidden">
            {!isLoggedIn ? (
              <Button
                variant="ghost"
                className="text-white text-xs font-bold h-8 px-2 hover:bg-white/10"
                asChild
              >
                <Link href={`/login`}>Login</Link>
              </Button>
            ) : (
              <UserProfile
                user={user}
                onLogout={async () => {
                  await logoutAction();
                  setIsLoggedIn(false);
                  setUser(null);
                  window.location.href = "/login";
                }}
              />
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link href="/restaurants">
              <Image
                src={language === "ar" ? arabicLogo : engLogo}
                alt="Logo"
                width={150}
                className="object-contain w-[150px] md:w-[200px]"
                priority
              />
            </Link>

            {/* Location Switcher */}
            <div className="hidden md:block">
              <LocationSwitcher
                currentAddress={currentAddress}
                onAddressChange={setCurrentAddress}
                isLoggedIn={isLoggedIn}
                className="md:min-w-[180px] md:max-w-sm"
                onLocationChange={(lat, lng) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("lat", lat.toString());
                  params.set("lng", lng.toString());
                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
          </div>
        </div>

        {/* ROW 2 Location Switcher (Mobile) + Cart (Mobile) */}
        <div className="bg-white px-4 py-3 md:hidden flex items-center gap-3 border-b">
          <div className="flex-1 shrink-0 overflow-hidden">
            <LocationSwitcher
              currentAddress={currentAddress}
              onAddressChange={setCurrentAddress}
              isLoggedIn={isLoggedIn}
              className="w-full"
              onLocationChange={(lat, lng) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("lat", lat.toString());
                params.set("lng", lng.toString());
                router.push(`${pathname}?${params.toString()}`);
              }}
            />
          </div>

          <div className="relative shrink-0">
            <Button
              onClick={() => setIsDrawerOpen(true)}
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white text-emerald-900 hover:bg-gray-100 shadow-sm overflow-visible"
            >
              <FiShoppingBag className="w-5 h-5" />
            </Button>
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-red-500 text-white pointer-events-none">
                {totalItems > 9 ? "9+" : totalItems}
              </Badge>
            )}
          </div>
        </div>

        {/* Desktop Right Section Language, Cart & Profile */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <div className="relative">
            <Button
              onClick={() => setIsDrawerOpen(true)}
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-white text-emerald-900 hover:bg-gray-100 shadow-sm overflow-visible"
            >
              <FiShoppingBag className="w-5 h-5" />
            </Button>
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-red-500 text-white pointer-events-none">
                {totalItems > 9 ? "9+" : totalItems}
              </Badge>
            )}
          </div>

          {!isLoggedIn ? (
            <Button
              variant="ghost"
              className="text-white text-sm font-bold h-10 px-4 hover:bg-white/10"
              asChild
            >
              <Link href={`/login`}>Login</Link>
            </Button>
          ) : (
            <div className="flex items-center pl-3 ml-1 gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white font-bold text-sm leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-white/70 text-[10px] uppercase tracking-widest font-medium mt-1">
                  {user?.role?.name || "Customer"}
                </p>
              </div>
              <UserProfile
                user={user}
                onLogout={async () => {
                  await logoutAction();
                  setIsLoggedIn(false);
                  setUser(null);
                  window.location.href = "/login";
                }}
              />
            </div>
          )}
        </div>
      </nav>

      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </header>
  );
};

export default CustomerHeader;
