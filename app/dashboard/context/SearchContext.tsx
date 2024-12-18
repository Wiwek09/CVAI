"use client";
import React, { createContext, useEffect, useState } from "react";
import { IFormInputData } from "@/interfaces/FormInputData";

export const SearchContext = createContext<{
  searchData: IFormInputData | null;
  setSearchData: React.Dispatch<React.SetStateAction<IFormInputData | null>>;
} | null>(null);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchData, setSearchData] = useState<IFormInputData | null>(null);

  useEffect(() => {
    sessionStorage.removeItem("searchData");
  }, [searchData]);

  return (
    <SearchContext.Provider value={{ searchData, setSearchData }}>
      {children}
    </SearchContext.Provider>
  );
};
