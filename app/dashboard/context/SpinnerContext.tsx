"use client";
import React, { useState, createContext } from "react";

interface ISpinner {
  uploading: boolean;
  setUploading: (value: boolean) => void;
}

export const SpinnerContext = createContext<ISpinner | undefined>(undefined);

export const SpinnerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [uploading, setUploading] = useState(false);
  return (
    <SpinnerContext.Provider value={{ uploading, setUploading }}>
      {children}
    </SpinnerContext.Provider>
  );
};
