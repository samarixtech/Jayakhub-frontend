"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DateFilterContextType {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  clearDates: () => void;
}

const DateFilterContext = createContext<DateFilterContextType | undefined>(undefined);

export function DateFilterProvider({ children }: { children: ReactNode }) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const clearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <DateFilterContext.Provider
      value={{
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        clearDates,
      }}
    >
      {children}
    </DateFilterContext.Provider>
  );
}

export function useDateFilter() {
  const context = useContext(DateFilterContext);
  if (context === undefined) {
    throw new Error("useDateFilter must be used within a DateFilterProvider");
  }
  return context;
}
