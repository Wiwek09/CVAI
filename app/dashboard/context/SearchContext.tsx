"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { IFormInputData } from "@/interfaces/FormInputData";
import { folderSelectStore } from "../store";

export const SearchContext = createContext<{
  searchData: IFormInputData | null;
  setSearchData: React.Dispatch<React.SetStateAction<IFormInputData | null>>;
  // searchResults: any[];
  // setSearchResults: React.Dispatch<React.SetStateAction<any[]>>;
  resetSearch: () => void;
} | null>(null);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchData, setSearchData] = useState<IFormInputData | null>(null);
  // const [searchResults, setSearchResults] = useState<any[]>([]);
  const { selectFolderId } = folderSelectStore();

  // useEffect(() => {
  //   sessionStorage.removeItem("searchData");
  // }, [searchData]);

  // Reset search data and results when folder changes
  useEffect(() => {
    setSearchData(null);
    // setSearchResults([]);
    sessionStorage.removeItem("searchData");
  }, [selectFolderId]);

  const resetSearch = () => {
    setSearchData(null);
    // setSearchResults([]);
    sessionStorage.removeItem("searchData");
  };

  return (
    <SearchContext.Provider
      value={{
        searchData,
        setSearchData,
        resetSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
};
