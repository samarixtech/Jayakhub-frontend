"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocale from "@/hooks/useLocals";
import Banner from "@/app/banner/page";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { country, language, loading } = useLocale();
  const [initialized, setInitialized] = useState(false);
  const [locale, setLocale] = useState<{
    country: string;
    language: string;
  } | null>(null);

  useEffect(() => {
    if (loading) return;

    const storedLocale = sessionStorage.getItem("homepage_locale");
    if (!storedLocale && country && language) {
      // First visit → redirect to /country/language/restaurants
      sessionStorage.setItem(
        "homepage_locale",
        JSON.stringify({ country, language })
      );
      sessionStorage.setItem("homepage_redirected", "true");
      router.replace(
        `/${country.toLowerCase()}/${language.toLowerCase()}/restaurants`
      );
    } else if (storedLocale) {
      // Subsequent visits → set locale from storage
      const parsedLocale = JSON.parse(storedLocale);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocale(parsedLocale);

      // Update URL to /country/language (without triggering a full reload)
      const newPath = `/${parsedLocale.country.toLowerCase()}/${parsedLocale.language.toLowerCase()}/restaurants`;
      if (window.location.pathname === "/") {
        router.replace(newPath);
      }

      setInitialized(true);
    } else if (country && language) {
      // Fallback if storage is empty
      setLocale({ country, language });
      const newPath = `/${country.toLowerCase()}/${language.toLowerCase()}/restaurants`;
      if (window.location.pathname === "/") {
        router.replace(newPath);
      }
      setInitialized(true);
    }
  }, [loading, country, language, router]);

  if (!initialized) return null; // prevent flicker

  return (
    <div>
      {/* <Banner /> */}
      {/* <p>
        Current Country: {locale?.country}, Language: {locale?.language}
      </p> */}
    </div>
  );
};

export default HomePage;
