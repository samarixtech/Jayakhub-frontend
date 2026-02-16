"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getProfile } from "@/app/actions/customer/userprofile";
import { logoutAction } from "@/app/actions/auth/auth";
import Image from "next/image";
import { useSelector } from "react-redux";
import { FiShoppingBag } from "react-icons/fi";
import { RootState } from "@/redux/store/store";
import CartDrawer from "@/components/CartDrawer";
import useLocale from "@/hooks/useLocals";
import LanguageSwitcher from "../common/LanguageSwitcher";
import LocationSwitcher from "../common/LocationSwitcher";
import UserProfile from "../common/UserProfile";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RestaurantsBottomNav from "../modules/discovery/restaurants/RestaurantsBottomNav";
import { useDiscoveryUI } from "@/app/context/DiscoveryUIContext";

// Assets
import engLogo from "../../../public/EngLogo (2).png";
import arabicLogo from "../../../public/ArbicLogo (2).png";

const RestaurantHeader = () => {
  const { country, language } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIsFilterOpen } = useDiscoveryUI();

  const [currentAddress, setCurrentAddress] = useState("Iraq, Baghdad");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success && response.data) {
          setIsLoggedIn(true);
          setUser(response.data);
        } else {
          // If 401 or other error, mostly means not logged in
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        // Ignore auth errors on public pages
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
    <>
      <header className="fixed top-0 left-0 w-full z-50 shrink-0">
        {/* ===== TOP BAR (Desktop Only) ===== */}
        <div className="flex items-center justify-start md:justify-center bg-[#3C8C64] px-4 md:px-6 h-12 md:h-10 overflow-x-auto scrollbar-hide">
          <div className="flex flex-row items-center gap-3 w-max md:w-auto pr-4 md:pr-0">
            <Link
              href="/home"
              className="text-[11px] font-bold text-white uppercase tracking-wide border border-white/50 rounded px-4 py-1.5 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
            >
              Our Business Website
            </Link>

            <Link
              href="/restaurant-register"
              className="text-[11px] font-bold text-white uppercase tracking-wide border border-white/50 rounded px-4 py-1.5 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
            >
              Sign for a Restaurant Account
            </Link>

            <Link
              href="/partners"
              className="text-[11px] font-bold text-white uppercase tracking-wide border border-white/50 rounded px-4 py-1.5 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
            >
              Sign up to be a business partner
            </Link>
          </div>
        </div>

        {/* ===== MAIN HEADER BAR ===== */}
        <nav className="w-full bg-[#346853] shadow-md">
          <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-14">
            {/* LEFT: Logo */}
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/restaurants">
                <Image
                  src={language === "ar" ? arabicLogo : engLogo}
                  alt="Jayak Hub"
                  width={140}
                  className="object-contain w-[120px] md:w-[140px]"
                  priority
                />
              </Link>
            </div>

            {/* CENTER: Location Switcher */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <LocationSwitcher
                currentAddress={currentAddress}
                onAddressChange={setCurrentAddress}
                isLoggedIn={isLoggedIn}
                className="md:min-w-[400px] md:max-w-sm bg-white/10 text-white border-white/10 hover:bg-white/20 [&_svg]:text-white shadow-none"
                onLocationChange={(lat, lng) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("lat", lat.toString());
                  params.set("lng", lng.toString());
                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
            </div>

            {/* RIGHT: Language, Auth, Cart */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              {/* Language */}
              <LanguageSwitcher />

              {/* Auth Section */}
              {!isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-white text-sm font-medium hover:text-white/80 transition-colors hidden md:inline"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white text-emerald-bg text-sm font-semibold border border-emerald-bg rounded-full px-4 py-1.5 hover:bg-white/90 transition-colors hidden md:inline-block"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
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
                </div>
              )}

              {/* Cart */}
              <div className="relative hidden md:block">
                <Button
                  onClick={() => setIsDrawerOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-white hover:bg-white/10 rounded-full"
                >
                  <FiShoppingBag className="w-6 h-6" />
                </Button>
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-red-500 text-white pointer-events-none border-2 border-[#346853]">
                    {totalItems > 9 ? "9+" : totalItems}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Mobile: Location + Cart Row */}
          <div className="md:hidden flex items-center gap-3 px-4 pb-3">
            <div className="flex-1 min-w-0">
              <LocationSwitcher
                currentAddress={currentAddress}
                onAddressChange={setCurrentAddress}
                isLoggedIn={isLoggedIn}
                className="w-full max-w-none bg-white/10 text-white border-white/10 hover:bg-white/20 [&_svg]:text-white shadow-none"
                onLocationChange={(lat, lng) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("lat", lat.toString());
                  params.set("lng", lng.toString());
                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
            </div>
          </div>
        </nav>

        <CartDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </header>
      {/* ===== BOTTOM NAVIGATION (Mobile) ===== */}
      <RestaurantsBottomNav
        onFilterClick={() => setIsFilterOpen(true)}
        onCartClick={() => setIsDrawerOpen(true)}
        isLoggedIn={isLoggedIn}
        user={user}
        showFilter={pathname?.endsWith("/restaurants")}
      />
    </>
  );
};

export default RestaurantHeader;
