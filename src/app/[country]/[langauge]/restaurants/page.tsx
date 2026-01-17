"use client";

import React, { useEffect } from "react";
import Header from "../../../../components/restaurants/Header";
import SidebarFilters from "../../../../components/restaurants/SidebarFilters";
import Home from "../../../../components/restaurants/Home";
import { useParams } from "next/navigation";
import { getCookie } from "cookies-next";
import { CLCProvider, useCLC } from "@/app/context/CLCContext.tsx";

const IndexPageContent: React.FC = () => {
  // const router = useRouter();
  const params = useParams();
  const { setCLC } = useCLC();

  useEffect(() => {
    const fetchData = () => {
      let c = params?.country;
      if (Array.isArray(c)) c = c[0];
      if (!c) c = (getCookie("NEXT_COUNTRY") as string) || "US";

      let l = params?.language;
      if (Array.isArray(l)) l = l[0];
      if (!l) l = (getCookie("NEXT_LOCALE") as string) || "en";

      const cur = (getCookie("NEXT_CURRENCY") as string) || "$";

      setCLC({ country: c.toUpperCase(), currency: cur, language: l });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.country, params?.language]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <div className="w-full mx-auto px-4 sm:px-4 lg:px-4 py-8 md:pt-20 pt-[30px]">
        <div className="flex flex-col lg:flex-row gap-8  pt-20 ">
          <div className="w-full lg:w-1/4 sticky top-24 self-start z-30">
            <SidebarFilters />
          </div>

          <div className="w-full lg:max-w-6xl ">
            <Home />
          </div>
        </div>
      </div>
    </div>
  );
};

const IndexPage: React.FC = () => {
  return (
    <CLCProvider>
      <IndexPageContent />
    </CLCProvider>
  );
};

export default IndexPage;
