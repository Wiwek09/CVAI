"use client";
import React, { createContext, ReactNode, useState } from "react";

type ViewType = "grid" | "list";

// Define the type for the context value
interface ViewContextType {
  view: string;
  setView: (value: ViewType) => void;
}

// Create the context
export const ViewContext = createContext<ViewContextType | null>(null);

// Create a provider component to wrap around the layout
export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState<ViewType>("grid");
  return (
    <ViewContext.Provider value={{ view, setView }}>
      {children}
    </ViewContext.Provider>
  );
};
