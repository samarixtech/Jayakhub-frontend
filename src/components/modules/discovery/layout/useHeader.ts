import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { getProfile } from "@/app/actions/customer/userprofile";
import { logoutAction } from "@/app/actions/auth/auth";
import { useDiscoveryUI } from "@/context/DiscoveryUIContext";

export const useHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsFilterOpen } = useDiscoveryUI();

  const [currentAddress, setCurrentAddress] = useState("Iraq, Baghdad");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userLocation");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.address) {
          setCurrentAddress(parsed.address);
        }
      }
    } catch (e) {
      // Ignored
    }
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success && response.data) {
          setIsLoggedIn(true);
          setUser(response.data);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    fetchProfile();
  }, []);

  const totalItems = useSelector((state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const handleLogout = async () => {
    await logoutAction();
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/login";
  };

  const handleLocationChange = (lat: number, lng: number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("lat", lat.toString());
    searchParams.set("lng", lng.toString());
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  return {
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
  };
};
