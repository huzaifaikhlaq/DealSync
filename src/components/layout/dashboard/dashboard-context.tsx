"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type DashboardContextValue = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  registerNewAction: (action: () => void) => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newAction, setNewAction] = useState<() => void>(() => () => undefined);

  const registerNewAction = useCallback((action: () => void) => {
    setNewAction(() => action);
  }, []);

  return (
    <DashboardContext.Provider
      value={{ searchQuery, setSearchQuery, registerNewAction }}
    >
      <DashboardActionContext.Provider value={newAction}>
        {children}
      </DashboardActionContext.Provider>
    </DashboardContext.Provider>
  );
}

const DashboardActionContext = createContext<() => void>(() => undefined);

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

export function useDashboardNewAction(action: () => void) {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardNewAction must be used inside DashboardProvider",
    );
  }
  const registerNewAction = context.registerNewAction;

  useEffect(() => {
    registerNewAction(action);
    return () => registerNewAction(() => undefined);
  }, [action, registerNewAction]);
}

export function useDashboardAction() {
  return useContext(DashboardActionContext);
}
