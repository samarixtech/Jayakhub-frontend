"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getProfile } from "@/app/actions/customer/userprofile";
import { logoutAction } from "@/app/actions/auth/auth";
import Image from "next/image";
import { useSelector } from "react-redux";
import { FiShoppingBag, FiSearch, FiSliders } from "react-icons/fi";
import { RootState } from "@/redux/store/store";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      <nav className="w-full md:bg-emerald-bg md:px-12 md:h-20 md:flex md:items-center md:justify-between shadow-lg gap-4">
        {/* ROW 1 (Mobile): Auth (Left) | Logo (Center) | Lang Only (Right) */}{" "}
        {/* Mobile: Emerald BG + Padding. Desktop: Transparent + No Padding (Flows in Nav) */}
        <div className="bg-emerald-bg px-4 py-3 md:bg-transparent md:p-0 flex items-center justify-between w-full md:w-auto md:justify-start gap-4">
          {/* LEFT: Auth (Mobile Only) */}
          <div className="md:hidden">
            {!isLoggedIn ? (
              <Button
                variant="ghost"
                className="text-white text-xs font-bold h-8 px-2 hover:bg-white/10"
                asChild
              >
                <LocalizedLink href={`/login`}>Login</LocalizedLink>
              </Button>
            ) : (
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
              />
            )}
          </div>

          {/* CENTER: Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <LocalizedLink href="/restaurants">
              <Image
                src={language === "ar" ? arabicLogo : engLogo}
                alt="Logo"
                width={150} // Slightly smaller on mobile default
                className="object-contain w-[150px] md:w-[200px]"
                priority
              />
            </LocalizedLink>
          </div>

          {/* RIGHT: Lang Only (Cart Moved to Row 2) */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
          </div>
        </div>
        {/* ROW 2 (Mobile): Location Switcher + Cart */}
        {/* Mobile: White BG + Padding. Desktop: Transparent + No Padding */}
        <div className="bg-white px-4 pt-3 pb-1 md:bg-transparent md:p-0 md:mt-0 md:flex md:items-center md:gap-3 flex gap-3">
          {/* Location Switcher */}
          <div className="flex-1 md:flex-none md:w-auto shrink-0 overflow-hidden">
            <LocationSwitcher
              currentAddress={currentAddress}
              onAddressChange={setCurrentAddress}
              isLoggedIn={isLoggedIn}
              className="w-full md:min-w-[180px] md:max-w-sm" // Full width on mobile
              onLocationChange={(lat, lng) => {
                // Update URL with lat/lng params
                const params = new URLSearchParams(searchParams.toString());
                params.set("lat", lat.toString());
                params.set("lng", lng.toString());
                router.push(`${pathname}?${params.toString()}`);
              }}
            />
          </div>

          {/* Cart Button (Mobile Only - Moved to Row 2) */}
          <div className="relative md:hidden shrink-0">
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
        {/* ROW 3 (Mobile) / Desktop Search: Search Bar + Filter */}
        {/* Mobile: White BG + Padding. Desktop: Transparent + No Padding */}
        <div className="bg-white px-4 pb-3 pt-1 md:bg-transparent md:p-0 md:mt-0 relative flex-1 w-full flex items-center justify-center gap-2">
          <div className="relative flex-1 md:max-w-xl md:mx-auto">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="w-full bg-white rounded-full border-none h-11 pl-9 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 text-sm shadow-sm"
              placeholder="Search for food..."
              type="search"
            />
          </div>
          {/* Filter Icon (Mobile Only - usually, but placed here for structure) */}
          <Button
            size="icon"
            variant="secondary"
            className="md:hidden h-9 w-9 rounded-full bg-white text-emerald-900 shadow-sm"
          >
            <FiSliders className="w-4 h-4" />
          </Button>
        </div>
        {/* Desktop Right Section: Language, Cart & Profile (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
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
