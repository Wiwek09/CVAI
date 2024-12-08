"use client";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { IFormInputData } from "@/interfaces/FormInputData";
import { SearchContext } from "../context/SearchContext";
import { ViewContext } from "../context/ViewContext";
import LinearTagsInput from "./SearchInput/LinearTagsInput";
import { RxCrossCircled } from "react-icons/rx";
import { PiPlusCircleThin } from "react-icons/pi";
import { Button } from "@/components/ui/button";

const SearchFields = () => {
  const searchContext = useContext(SearchContext);
  const viewContext = useContext(ViewContext);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const inputRefs = useRef(null);
  const [formData, setFormData] = useState<IFormInputData>({
    prompt: "",
    programming_language: [""],
    skill: [""],
    address: "",
    foldersToSearch: [""],
  });
  if (!searchContext) {
    throw new Error(
      "SearchContext must be used within a SearchContext.Provider"
    );
  }

  if (!viewContext) {
    throw new Error("ViewContext must be used within a ViewProvider");
  }

  const { setSearchData } = searchContext;

  useEffect(() => {
    if (tagsOpen && inputRefs.current) {
      inputRefs.current.focus();
    }
  }, [tagsOpen]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      programming_language: tags,
    }));
  }, [tags]);

  const handleClear = () => {
    setFormData({
      prompt: "",
      programming_language: [""],
      skill: [""],
      address: "",
      foldersToSearch: [""],
    });
    setTags([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("SUbbmited");
    setSearchData(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Disable Enter key for input fields to prevent submission
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full mt-3 flex flex-col justify-center">
      {/* Top search fields */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full">
          <div className=" justify-start flex py-2 mb-5">
            {tagsOpen ? (
              <div className="flex w-full max-w-full justify-start">
                <LinearTagsInput
                  // handleClear={handleClear}
                  tags={tags}
                  setTags={setTags}
                />
              </div>
            ) : (
              <section
                onClick={() => {
                  setTagsOpen(true);
                }}
                className="flex items-center "
              >
                <h1 className="font-medium text-2xl">Suggested tagsOpen:</h1>
                <PiPlusCircleThin className="h-10 mt-1 hover:cursor-pointer ml-2 w-10" />
              </section>
            )}
          </div>
          <div className="flex  justify-between items-center  text-center">
            <div className="w-[60%] flex justify-start">
              <input
                className="placeholder:text-gray-400 border-2 w-[85%] py-2 px-2  rounded-md "
                type="string"
                name="prompt"
                value={formData.prompt}
                onChange={handleChange}
                placeholder="Enter Prompt (skills)"
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="flex items-center w-[35%]  justify-around flex-shrink-0 ">
              <div className="flex items-center border-2 rounded-lg">
                <Input
                  className="w-[12rem] border-none"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Location"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <RxCrossCircled
                color="red"
                size="30px"
                className="hover:cursor-pointer hover:opacity-50"
                onClick={() => handleClear()}
              />
              <Button
                type="submit"
                className=" bg-white ml-2 rounded-3xl group hover:bg-inherit"
              >
                <span className="transform transition-transform duration-300 ease-in-out group-hover:translate-y-[-3px]">
                  <FaSearch size="22px" className="text-black" />
                </span>
                {/* <span>Search</span> */}
              </Button>
            </div>
          </div>
        </div>
      </form>
      {/* sorting search */}
      {/* <div className="flex items-center ">
        <div className="font-semibold">
          <p>Availability : &nbsp;</p>
        </div>

        <div className="">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent className="w-[180px]">
              <SelectGroup>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="random">Random</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div> */}
    </div>
  );
};

export default SearchFields;
