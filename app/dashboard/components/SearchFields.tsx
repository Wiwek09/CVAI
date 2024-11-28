'use client';
import React, { useState, useContext } from 'react';
import { Input } from '@/components/ui/input';
// import { ImLocation } from "react-icons/im";
import { FaSearch } from 'react-icons/fa';
import TagsInput from './SearchInput/TagsInput';
import { IFormInputData } from '@/interfaces/FormInputData';
import { SearchContext } from '../context/SearchContext';
import { ViewContext } from '../context/ViewContext';
import LinearTagsInput from './SearchInput/LinearTagsInput';

// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const SearchFields = () => {
  const searchContext = useContext(SearchContext);
  const viewContext = useContext(ViewContext);

  if (!searchContext) {
    throw new Error(
      'SearchContext must be used within a SearchContext.Provider'
    );
  }

  if (!viewContext) {
    throw new Error('ViewContext must be used within a ViewProvider');
  }

  const { setSearchData } = searchContext;

  // const { view } = viewContext;

  const [formData, setFormData] = useState<IFormInputData>({
    prompt: '',
    programming_language: [''],
    skill: [''],
    address: '',
    foldersToSearch: [''],
  });

  const [tagsValue, setTagsValue] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearchData(formData);
    // Clear the form fields after submission
    setFormData({
      prompt: '',
      programming_language: [''],
      skill: [''],
      address: '',
      foldersToSearch: [''],
    });
    setTagsValue(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProgrammingLanguageTagsChange = (tags: string[]) => {
    setTagsValue(true);
    setFormData({
      ...formData,
      programming_language: tags,
    });
  };

  const handleSkillTagsChange = (tags: string[]) => {
    setTagsValue(true);
    setFormData({
      ...formData,
      skill: tags,
    });
  };
  // const [isFocused, setIsFocused] = useState(false);

  // Disable Enter key for input fields to prevent submission
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className='w-full mt-8 flex flex-col justify-center space-y-6'>
      {/* Top search fields */}
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-3'>
          <div className='flex gap-3 justify-between text-center'>
            <div>
              <input
                className='placeholder:text-gray-400 border-2 py-2 px-2 rounded-md '
                type='string'
                name='prompt'
                value={formData.prompt}
                onChange={handleChange}
                placeholder='Enter Prompt (skills)'
                onKeyDown={handleKeyDown} // Prevent form submission on Enter key
              />
            </div>

            {/* <div>
            <Input
              type="text"
              name="programming_language"
              value={formData.programming_language}
              onChange={handleChange}
              placeholder="Enter Progamming Language"
            />
          </div> */}

            <div className='max-h-14'>
              {/* Inline tag input for programming languages */}
              <TagsInput
                onTagsChange={handleProgrammingLanguageTagsChange}
                tagsValue={tagsValue}
                placeholderText='Programming Language'
              />
            </div>

            {/* Tags Input for Skill */}
            <div className='max-h-12'>
              <TagsInput
                onTagsChange={handleSkillTagsChange}
                tagsValue={tagsValue}
                placeholderText='Enter Skill'
              />
            </div>

            <div className='flex flex-shrink-0 '>
              <div className='flex items-center border rounded-lg'>
                <Input
                  className='w-[12rem] border-none'
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  placeholder='Location'
                  onKeyDown={handleKeyDown}
                  // onFocus={() => setIsFocused(true)}
                  // onBlur={() => setIsFocused(false)}
                />
                {/* {!isFocused && <ImLocation className="" />} */}
              </div>
              <Button
                type='submit'
                className=' bg-white ml-2 rounded-3xl group hover:bg-inherit'
              >
                <span className='transform transition-transform duration-300 ease-in-out group-hover:translate-y-[-3px]'>
                  <FaSearch className='text-black' />
                </span>
                {/* <span>Search</span> */}
              </Button>
            </div>
          </div>

          <div>
            <LinearTagsInput />
          </div>
        </div>
      </form>

      {/* <div>
        <hr className="bg-slate-500 h-1 " />
      </div> */}

      {/* <div className="mt-4 text-center">Tags</div> */}

      {/* <div>
        <hr className='bg-slate-200 mt-3 h-[1px]' />
      </div> */}

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
