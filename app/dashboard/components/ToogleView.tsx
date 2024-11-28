'use client';
import React, { useContext } from 'react';
import { BsFillGridFill } from 'react-icons/bs';
import { FaListUl } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ViewContext } from '../context/ViewContext';

const ToogleView = () => {
  const context = useContext(ViewContext);

  if (!context) {
    throw new Error('ToogleView must be used within a ViewProvider');
  }

  const { view, setView } = context;

  return (
    <div className='flex  justify-between items-center gap-1'>
      <div className=' w-[90%] flex justify-between items-center'>
        <h1 className=' font-bold text-xl'>Availability:</h1>

        <Select>
          <SelectTrigger className='w-[180px] border-2'>
            <SelectValue placeholder='Remote' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='Remote'>Remote</SelectItem>
              <SelectItem value='OnSite'>On Site</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className='border-2 w-[180px]'>
            <SelectValue
              placeholder='Rating'
              className='placeholder:font-bold'
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='3Stars'>3 Stars</SelectItem>
              <SelectItem value='2Stars'>2 Stars</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <form>
          <input
            type='text'
            placeholder='Expected Salary'
            className='w-[180px] border-2 py-[0.38rem] px-2 rounded-md border-gray-200'
          />
        </form>

        <Select>
          <SelectTrigger className='border-2 w-[180px]'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value='apple'>Ascending</SelectItem>
              <SelectItem value='banana'>Descending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md ${
                  view === 'list'
                    ? 'bg-gray-400 hover:bg-gray-300'
                    : 'hover:bg-gray-200'
                }`}
              >
                <FaListUl />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Grid View</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-md ${
                  view === 'grid'
                    ? 'bg-gray-400 hover:bg-gray-300'
                    : 'hover:bg-gray-200'
                }`}
              >
                <BsFillGridFill />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>List View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ToogleView;
