"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type DashboardContextValue = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardSearch() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardSearch must be used inside DashboardProvider");
  }
  return context.searchQuery;
}

export function useDashboardSearchControls() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardSearchControls must be used inside DashboardProvider",
    );
  }
  return {
    searchQuery: context.searchQuery,
    setSearchQuery: context.setSearchQuery,
  };
}
