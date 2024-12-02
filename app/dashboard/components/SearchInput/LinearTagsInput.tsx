import React, { useState, KeyboardEvent, useRef } from "react";
import { CirclePlus, X } from "lucide-react";

const LinearTagsInput = () => {
  const [tags, setTags] = useState<string[]>([]);
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
    <div className="w-full max-w-[53rem]">
      <div
        className="min-h-12 p-2 border border-gray-300 rounded-lg flex flex-wrap items-center gap-2 focus-within:ring-2 focus-within:ring-gray-900 cursor-text"
        onClick={handleClick}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddTag(inputValue);
          }}
          className="p-1 hover:text-blue-600 focus:outline-none"
        >
          <CirclePlus size={20} />
        </button>
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-1 text-sm"
          >
            {tag}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="hover:text-blue-600 focus:outline-none"
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
          placeholder={tags.length === 0 ? "Add tags to search..." : ""}
        />
      </div>
    </div>
  );
};

export default LinearTagsInput;
