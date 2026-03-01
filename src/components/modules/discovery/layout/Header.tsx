"use client";

import Image from "next/image";
import Link from "next/link";
import CartDrawer from "@/components/CartDrawer";
import RestaurantsBottomNav from "./RestaurantsBottomNav";
import TopBar from "./TopBar";

// Assets
import engLogo from "../../../../../public/EngLogo (2).png";
import arabicLogo from "../../../../../public/ArbicLogo (2).png";

// Extracted Modules
import { useHeader } from "./useHeader";
import { HeaderActions } from "./HeaderActions";
import { HeaderLocation } from "./HeaderLocation";

const RestaurantHeader = () => {
  const {
    pathname,
    currentAddress,
    setCurrentAddress,
    isLoggedIn,
    user,
    isDrawerOpen,
    setIsDrawerOpen,
    isScrolled,
    totalItems,
    handleLogout,
    handleLocationChange,
    setIsFilterOpen,
  } = useHeader();

  // Middleware handles locales now, but our assets toggle based on language if available.
  // We can default to engLogo since middleware manages the URL path routing now.
  // However, `useParams` could still be used here directly for the logo toggle.
  // We'll fallback to english logo if the pathname doesn't have arabic.
  const isArabic = pathname?.includes("/ar/");

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 shrink-0">
        {/* ===== TOP BAR ===== */}
        <TopBar isScrolled={isScrolled} />

        {/* ===== MAIN HEADER BAR ===== */}
        <nav className="w-full bg-[#346853] shadow-md">
          <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-14">
            {/* LEFT: Logo */}
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/restaurants">
                <Image
                  src={isArabic ? arabicLogo : engLogo}
                  alt="Jayak Hub"
                  width={140}
                  className="object-contain w-[120px] md:w-[140px]"
                  priority
                />
              </Link>
            </div>

            {/* CENTER: Location Switcher (Desktop) */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <HeaderLocation
                currentAddress={currentAddress}
                setCurrentAddress={setCurrentAddress}
                isLoggedIn={isLoggedIn}
                onLocationChange={handleLocationChange}
                className="md:min-w-[400px] md:max-w-sm bg-white/10 text-white border-white/10 hover:bg-white/20 [&_svg]:text-white shadow-none"
              />
            </div>

            {/* RIGHT: Language, Auth, Cart */}
            <HeaderActions
              isLoggedIn={isLoggedIn}
              user={user}
              totalItems={totalItems}
              onLogout={handleLogout}
              onCartClick={() => setIsDrawerOpen(true)}
            />
          </div>

          {/* Mobile: Location Row */}
          <div className="md:hidden flex items-center gap-3 px-4 pb-3">
            <div className="flex-1 min-w-0">
              <HeaderLocation
                currentAddress={currentAddress}
                setCurrentAddress={setCurrentAddress}
                isLoggedIn={isLoggedIn}
                onLocationChange={handleLocationChange}
                className="w-full max-w-none bg-white/10 text-white border-white/10 hover:bg-white/20 [&_svg]:text-white shadow-none"
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
