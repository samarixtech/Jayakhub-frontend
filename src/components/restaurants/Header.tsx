"use client";

import { useState, useEffect } from "react";
import { getProfile } from "@/app/actions/customer/userprofile";
import { logoutAction } from "@/app/actions/auth/auth";
import Image from "next/image";
import { useSelector } from "react-redux";
import { FiShoppingBag, FiSearch } from "react-icons/fi";
import { RootState } from "@/redux/store/store";

// Components
import CartDrawer from "@/components/CartDrawer";
import useLocale from "@/hooks/useLocals";
import LanguageSwitcher from "../common/LanguageSwitcher";
import LocationSwitcher from "../common/LocationSwitcher";
import UserProfile from "../common/UserProfile";
import LocalizedLink from "../navigation/LocalizedLink";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Assets
import engLogo from "../../../public/EngLogo (2).png";
import arabicLogo from "../../../public/ArbicLogo (2).png";

const RestaurantHeader = () => {
  const { country, language } = useLocale();

  const [currentAddress, setCurrentAddress] = useState("New York, NY");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      // Check if token exists (optional optimization to avoid call if definitely logged out)
      // For now, we just try to fetch. getProfile handles auth internally via API client.
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
    <header className="fixed top-0 left-0 w-full z-50 shrink-0">
      <nav className="w-full flex items-center justify-between bg-emerald-bg h-20 px-6 md:px-12 shadow-lg gap-4">
        {/* 1. Logo Section */}
        <div className="flex items-center gap-4 shrink-0">
          <LocalizedLink href="/home">
            <Image
              src={language === "ar" ? arabicLogo : engLogo}
              alt="Logo"
              width={140}
              height={50}
              className="object-contain"
              priority
            />
          </LocalizedLink>
        </div>

        {/* 2. Middle Section: Location & Search */}
        <div className="flex flex-1 items-center gap-3 max-w-2xl">
          <div className="hidden md:block shrink-0">
            <LocationSwitcher
              currentAddress={currentAddress}
              onAddressChange={setCurrentAddress}
            />
          </div>

          <div className="relative flex-1 hidden lg:block">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="w-full bg-white rounded-full border-none h-10 pl-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 text-sm"
              placeholder="Search for food..."
              type="search"
            />
          </div>
        </div>

        {/* 3. Right Section: Language, Cart & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Cart Button with Shadcn styling */}
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
              <LocalizedLink href={`/login`}>Login</LocalizedLink>
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
                country={country}
                language={language}
                onLogout={async () => {
                  await logoutAction();
                  setIsLoggedIn(false);
                  setUser(null);
                  window.location.href = `/${country}/${language}/login`;
                }}
              />{" "}
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

export default RestaurantHeader;
