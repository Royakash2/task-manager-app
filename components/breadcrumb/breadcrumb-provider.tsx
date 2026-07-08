"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface BreadcrumbContextType {
  projectName: string | null;
  taskName: string | null;
  setProjectName: (name: string | null) => void;
  setTaskName: (name: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export function BreadcrumbProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [projectName, setProjectName] = useState<string | null>(null);
  const [taskName, setTaskName] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider
      value={{
        projectName,
        taskName,
        setProjectName,
        setTaskName,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
}
