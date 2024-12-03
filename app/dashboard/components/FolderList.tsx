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

import { toast } from 'sonner';

import DialogueComponent from './DialogueComponent';
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';

const FolderList = ({ updateFolderList }) => {
  const [folders, setFolders] = useState([]);
  const [openFolder, setOpenFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [folderContents, setFolderContents] = useState({});
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [dialogOpen, setDialogueOpen] = useState(false);
  const [dialogAlert, setDialogueAlert] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [name, setName] = useState('');
  const [dialogAlertFile, setDialogueAlertFile] = useState(false);

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
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get(
          `/folder/getFiles/${openFolder}`
        );
        console.log('files', response);
        setFiles(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFiles();
  }, [openFolder]);
  // useEffect(() => {
  //   console.log('Use effect files', files);
  // }, [files]);
  const handleDialogue = (state: boolean) => {
    setDialogueOpen(state);
  };
  const handleAlert = (state: boolean) => {
    setDialogueAlert(state);
  };
  const handleAlertFile = (state: boolean) => {
    setDialogueAlertFile(state);
  };
  const toggleDropdown = (folderId: string) => {
    setOpenFolder(openFolder === folderId ? null : folderId);
  };

  const handleRename = async (folderId: string) => {
    try {
      await axiosInstance.put(`/folderrenameFolder/${folderId}`, {
        folder_id: folderId,
        new_name: newFolderName,
      });
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
      {dialogOpen && (
        <DialogueComponent
          folders={folders}
          id={selectedFile}
          variant='selectMultiple'
          handleDialogue={handleDialogue}
          name={name}
        />
      )}
      {dialogAlert && (
        <DialogueComponent
          variant='alert'
          handleDialogue={handleAlert}
          id={selectedFile}
        />
      )}
      {dialogAlertFile && (
        <DialogueComponent
          variant='alertFile'
          handleDialogue={handleAlertFile}
          id={selectedFile}
        />
      )}

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
              <div className='flex items-center justify-between  gap-2 '>
                <span>
                  <span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          onClick={() => {
                            setSelectedFile(folder.folder_id);
                          }}
                        >
                          <RxHamburgerMenu />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className='w-32 p-1 text-center cursor-pointer'>
                        <p
                          className='py-1 hover:opacity-50'
                          onClick={() => {
                            setEditingFolder(folder.folder_id);
                            setNewFolderName(folder.folder_name);
                          }}
                        >
                          Edit
                        </p>
                        <hr />
                        <button
                          onClick={() => {
                            handleDialogue(true);
                            setEditingFolder(folder.folder_id);
                            setName(folder.folder_name);
                          }}
                          className='py-1 hover:opacity-50'
                        >
                          Select
                        </button>
                        <hr />
                        <button
                          onClick={() => {
                            handleAlert(true);
                            // setEditingFolder(folder.folder_id);
                          }}
                          className='py-1 hover:opacity-50'
                        >
                          Archive
                        </button>
                      </PopoverContent>
                    </Popover>
                  </span>
                </span>
                <span className='ml-5'>{folder.folder_name}</span>
              </div>
            )}

            <div
              className='flex gap-4'
              onClick={() => toggleDropdown(folder.folder_id)}
            >
              <span
                className={`ml-auto w-6 h-6 hover:bg-gray-700 rounded-full items-center justify-center flex transform transition-transform duration-300 ${
                  openFolder === folder.folder_id ? 'rotate-180' : 'rotate-0'
                }`}
              >
                <FaChevronDown />
              </span>

              {/* Hamburger */}
            </div>
          </div>

          {openFolder === folder.folder_id && (
            <div className='mt-2 ml-6  border-l  border-gray-600 pl-4 w-52 max-w-52 truncate'>
              {files.length ? (
                files.map((file) => (
                  <div className='relative flex items-center justify-between p-1 text-gray-300 ease-in-out duration-150 delay-75 rounded truncate '>
                    <Link
                      key={file.doc_id}
                      href={`/cv-detail/${file.doc_id}`}
                      target='_blank'
                      className='truncate '
                    >
                      <span className=' px-2 py-1 w-8  hover:opacity-60 max-w-12 text-sm truncate'>
                        {file.doc_name.replace('.pdf', '')}
                      </span>
                    </Link>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button>
                          <BsThreeDots
                            className='text-white hover:opacity-60 hover:cursor-pointer'
                            size={'15px'}
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className='w-20 p-0  '>
                        <span
                          className='flex items-center p-1 hover:cursor-pointer hover:opacity-50 justify-center'
                          onClick={() => {
                            handleAlertFile(true);
                            setSelectedFile(file.doc_id);
                          }}
                        >
                          Archive
                        </span>
                        <hr />
                        {/* <span className='flex items-center p-1 hover:cursor-pointer hover:opacity-50 justify-center'>
                          Move
                        </span> */}
                      </PopoverContent>
                    </Popover>
                  </div>
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
