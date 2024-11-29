import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { RxHamburgerMenu } from 'react-icons/rx';
import axiosInstance from '@/utils/axiosConfig';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FolderList = ({ updateFolderList }) => {
  const [folders, setFolders] = useState([]);
  const [openFolder, setOpenFolder] = useState(null);
  const [folderContents, setFolderContents] = useState({});
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const inputRefs = useRef({});
  useEffect(() => {
    if (editingFolder && inputRefs.current[editingFolder]) {
      inputRefs.current[editingFolder].focus();
    }
  }, [editingFolder]);

  useEffect(() => {
    const fetchFoldersAndContents = async () => {
      try {
        const foldersResponse = await axiosInstance.get(
          '/folder/getAllFolders'
        );

        const fetchedFolders = foldersResponse.data;
        console.log('Fetched folders', fetchedFolders);
        setFolders(fetchedFolders);

        const contentsPromises = fetchedFolders.map((folder) =>
          axiosInstance
            .get(`/folder/getFiles/${folder.folder_id}`)
            .then((response) => ({
              folderId: folder.folder_id,
              files: Object.entries(response.data),
            }))
            .catch((error) => {
              console.error(
                `Error fetching contents for folder ${folder.folder_id}:`,
                error
              );
              return { folderId: folder.folder_id, files: [] };
            })
        );

        const allContents = await Promise.all(contentsPromises);

        const contentsObject = allContents.reduce(
          (acc, { folderId, files }) => ({
            ...acc,
            [folderId]: files,
          }),
          {}
        );

        setFolderContents(contentsObject);
        console.log('This', contentsObject);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    };

    fetchFoldersAndContents();
  }, [updateFolderList]);

  const toggleDropdown = (folderId) => {
    setOpenFolder(openFolder === folderId ? null : folderId);
  };

  const handleRename = async (folderId) => {
    try {
      await axiosInstance.put(`/folderrenameFolder/${folderId}`, {
        folder_id: folderId,
        new_name: newFolderName,
      });

      // Update folder name in the UI
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.folder_id === folderId
            ? { ...folder, folder_name: newFolderName }
            : folder
        )
      );

      // Reset editing state
      setEditingFolder(null);
      setNewFolderName('');
      toast('Successfully edited the folder', {
        description: 'Folder has been renamed successfully',
        style: {
          color: 'white',
          background: 'black',
        },
      });
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast('Failed to edit', {
        description: error.response.data.detail,
        style: {
          background: 'black',
          color: 'white',
        },
      });
    }
  };
  useEffect(() => {
    console.log('This is folders', folders);
  }, [folders]);
  return (
    // <div>
    //   <Accordion type='multiple' className='w-full'>
    //     {folders.map((folder) => (
    //       <AccordionItem
    //         className='border-none hover:no-underline'
    //         value={folder.folder_id}
    //       >
    //         <AccordionTrigger className='text-white border-none hover:no-underline'>
    //           {folder.folder_name}
    //         </AccordionTrigger>
    //         <AccordionContent>{folder.folder_name}</AccordionContent>
    //       </AccordionItem>
    //     ))}
    //   </Accordion>
    // </div>
    <div className='text-white'>
      {folders.map((folder) => (
        <div key={folder.folder_id} className='mb-4'>
          <div className='flex gap-2 w-full justify-between items-center flex-1 rounded'>
            {editingFolder === folder.folder_id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRename(folder.folder_id);
                }}
              >
                <input
                  type='text'
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={() => setEditingFolder(null)}
                  className='bg-gray-800 w-full text-white rounded p-1'
                  ref={(el) => {
                    if (el) inputRefs.current[folder.folder_id] = el;
                  }}
                />
                <button type='submit' className='hidden'></button>
              </form>
            ) : (
              <div className='flex items-center gap-2 '>
                <span>
                  <Checkbox className='bg-white' />
                </span>
                <span>{folder.folder_name}</span>
              </div>
            )}

            <div className='flex gap-4'>
              <span
                onClick={() => toggleDropdown(folder.folder_id)}
                className={`ml-auto w-6 h-6 hover:bg-gray-700 rounded-full items-center justify-center flex transform transition-transform duration-300 ${
                  openFolder === folder.folder_id ? 'rotate-180' : 'rotate-0'
                }`}
              >
                <FaChevronDown />
              </span>

              {/* Hamburger */}
              <span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button>
                      <RxHamburgerMenu />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className='w-12 p-1 text-center cursor-pointer'>
                    <p
                      onClick={() => {
                        setEditingFolder(folder.folder_id);
                        setNewFolderName(folder.folder_name);
                      }}
                    >
                      Edit
                    </p>
                  </PopoverContent>
                </Popover>
              </span>
            </div>
          </div>

          {openFolder === folder.folder_id && (
            <div className='mt-2 ml-6 border-l border-gray-600 pl-4 max-w-[12rem]'>
              {folderContents[folder.folder_id]?.length ? (
                folderContents[folder.folder_id].map((file) => (
                  <Link
                    key={file.doc_id}
                    href={`/cv-detail/${file.doc_id}`}
                    target='_blank'
                  >
                    <div className='flex items-center gap-2 p-1 text-gray-300 ease-in-out hover:bg-gray-700 duration-150 delay-75 rounded'>
                      <span className=' text-white'>
                        {file.doc_name} {console.log(file.doc_name)}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className='text-gray-400 italic'>No PDFs uploaded.</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderList;
