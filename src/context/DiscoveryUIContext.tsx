"use client";

import React, { createContext, useContext, useState } from "react";

interface DiscoveryUIContextType {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

const DiscoveryUIContext = createContext<DiscoveryUIContextType | undefined>(
  undefined,
);

export const DiscoveryUIProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <DiscoveryUIContext.Provider value={{ isFilterOpen, setIsFilterOpen }}>
      {children}
    </DiscoveryUIContext.Provider>
  );
};

export const useDiscoveryUI = () => {
  const context = useContext(DiscoveryUIContext);
  if (context === undefined) {
    throw new Error("useDiscoveryUI must be used within a DiscoveryUIProvider");
  }
  return context;
};
