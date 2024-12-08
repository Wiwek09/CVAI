import React, { useState, KeyboardEvent, useRef } from "react";
import { X } from "lucide-react";
import { PiPlusCircleThin } from "react-icons/pi";

const LinearTagsInput = ({ tags, setTags }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <div
        className="min-h-10 w-full p-[0.4rem] border-2 border-#CCCC rounded-lg flex flex-wrap items-center gap-2 focus-within:ring-1 focus-within:ring-gray-900 cursor-text"
        onClick={handleClick}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddTag(inputValue);
            handleClick();
          }}
          className=" hover:opacity-75 flex justify-center items-center focus:outline-none"
        >
          <PiPlusCircleThin
            size={"30px"}
            className="font-bold hover:cursor-pointer"
          />
        </button>
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-white border-2 border-#CCCC min-w-28 justify-between  text-black  pl-3 pr-1 py-1  rounded-md flex items-center gap-1 text-sm"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className=" rounded-full border-gray-400 flex text-gray-400 justify-center items-center p-[1px] border focus:outline-none"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none bg-transparent min-w-[120px]"
          placeholder={tags.length === 0 ? "Add tags..." : ""}
        />
      </div>
    </div>
  );
};

export default LinearTagsInput;
