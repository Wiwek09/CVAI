import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axiosInstance from '@/utils/axiosConfig';
import { toast } from 'sonner';
import { IoCopy } from 'react-icons/io5';

import axios from 'axios';
import { Checkbox } from '@/components/ui/checkbox';
import { FaCopy, FaTrashAlt } from 'react-icons/fa';

function DialogueComponent({ variant, handleDialogue, id, folders, name }) {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    console.log('selected files', selectedFiles);
  }, [selectedFiles]);
  useEffect(() => {
    if (variant === 'selectMultiple') {
      const fetchFiles = async () => {
        try {
          const response = await axiosInstance.get(`/folder/getFiles/${id}`);
          console.log('response from the div', response);
          setFiles(response.data);
        } catch (e) {
          console.log(e);
        }
      };
      fetchFiles();
    } else if (variant === 'selectMultipleFolders') {
      const fetchFolders = async () => {
        try {
          const response = await axiosInstance.get('/folder/getAllFolders');
          console.log('Response from selectmultiple folder', response);
          setFiles(response.data);
        } catch (error) {
          toast(error.response.data.detail);
        }
      };
      fetchFolders();
    } else if (variant === 'archive') {
      const fetchArchive = async () => {
        try {
          const response = await axiosInstance.get(
            '/folder/getArchivedFolders'
          );
          console.log(response);
          setFiles(response.data);
        } catch (e) {
          toast.error('Failed to fetched Archive details');
        }
      };
      fetchArchive();
    }
  }, [id, variant, refresh]);
  const unarchive = async (id: string) => {
    try {
      const response = await axiosInstance.post(
        `/folder/unarchiveFolder/${id}`
      );
      console.log(response);
      toast.success('Successfully unarchived the folder');
    } catch (error) {
      toast.error('Failed to unarchive');
    }
  };
  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(fileId)) {
        return prevSelectedFiles.filter((id) => id !== fileId);
      } else {
        return [...prevSelectedFiles, fileId];
      }
    });
  };
  const handleMultipleFolderArchive = async () => {
    try {
      const response = axiosInstance.post(`/folder/archiveFolder/`, {
        folder_ids: selectedFiles,
      });
      console.log('response from multiplefolders archive', response);
      setTimeout(() => {
        location.reload();
      }, 1000);
      toast('Successfully archived folders');
      setRefresh(!refresh);
    } catch (error) {
      toast(error.response.data.detail);
      console.log(error);
    }
  };
  const handleDocumentArchive = async () => {
    try {
      const response = await axiosInstance.post('/document/archive_document', {
        document_ids: selectedFiles,
      });
      console.log('Document archive', response);
      toast(response.data.message);
    } catch (error) {}
  };
  // const archiveFiles = async () => {
  //   try {
  //     const response = await axiosInstance.post();
  //     console.log(response);
  //     toast('Successfully archieved the selected folders');
  //   } catch (error) {}
  // };
  console.log('Folders', folders);
  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((file) => file.folder_id));
    }
  };
  const handleSelectAllFiles = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((file) => file.doc_id));
    }
  };
  const handleUnarchive = async () => {
    try {
      const response = await axiosInstance.post(`/folder/unarchiveFolder/`, {
        folder_ids: selectedFiles,
      });
      console.log('unarchive response', response);
      setTimeout(() => {
        location.reload();
      }, 1000);
      toast('Successfully unarchived the files', {
        style: {
          backgroundColor: 'black',
          color: 'white',
        },
      });
    } catch (error) {
      toast(error.response.data.detail, {
        style: {
          backgroundColor: 'black',
          color: 'white',
        },
      });
      console.log(error);
    }
  };
  const archiveFolder = async () => {
    try {
      const response = await axiosInstance.post(`/folder/archiveFolder/`, {
        folder_ids: [id],
      });
      toast(response.data.message);
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      toast(error.response.data.detail);
      console.log(error);
    }
  };
  console.log('This is the id', id);
  if (variant === 'selectMultiple') {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        <DialogContent className=' py-10 '>
          <DialogHeader>
            <div className=' flex flex-col w-full space-y-6  mb-8 mt-4'>
              <h1 className='text-xl'>{name}</h1>
              <section className='flex  items-center justify-between '>
                <input
                  type='text'
                  className='rounded-md border border-#CCCC px-2 py-1'
                  placeholder='Search'
                />
                <article className='space-x-2'>
                  <button className='border px-3 py-2 rounded-md'>
                    <FaTrashAlt
                      onClick={() => {
                        handleDocumentArchive();
                        handleDialogue(false);
                      }}
                      className='hover:cursor-pointer'
                    />
                  </button>
                  <button className='border px-3 py-2 rounded-md'>
                    <FaCopy />
                  </button>
                </article>
              </section>
            </div>
            <div className='space-y-5 '>
              {/* <div className='flex justify-start'>
                <button className='px-3 py-1 bg-black text-white rounded-md'>
                  Select All
                </button>
              </div> */}

              {files ? (
                <section className='w-full  flex-col'>
                  <div className='flex flex-row-reverse justify-between border-#CCCC  pb-4'>
                    <article className='flex   items-center'>
                      <button className='text-sm'>Select All</button>
                      <Checkbox
                        onCheckedChange={() => {
                          handleSelectAllFiles();
                        }}
                        className='ml-2 cursor-pointer'
                      />
                    </article>

                    <h1 className='text-sm'>Folders</h1>
                  </div>
                  {files.map((file) => (
                    <section className='flex pb-4 border-b border-#CCCC mt-4 items-center '>
                      <Checkbox
                        checked={selectedFiles.includes(file.doc_id)}
                        onCheckedChange={() => handleFileSelect(file.doc_id)}
                        id={`file-${file.doc_id}`}
                        className='cursor-pointer mr-4'
                      />
                      <h1 className='text-sm font-light'>{file.doc_name}</h1>
                    </section>
                  ))}
                </section>
              ) : (
                ''
              )}
            </div>
          </DialogHeader>
          {/* <div className='flex justify-center items-center mt-20'>
            <button className='bg-black text-white px-4 py-1 rounded-md mr-5'>
              Move
            </button>
            <button className='bg-black text-white px-4 py-1 rounded-md'>
              Archive
            </button>
          </div> */}
        </DialogContent>
      </Dialog>
    );
  }
  if (variant === 'selectMultipleFolders') {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        <DialogContent className=' py-10 '>
          <DialogHeader>
            <div className=' flex w-full justify-between items-center mb-8 mt-4'>
              <section className='flex-col space-y-6'>
                <h1 className='text-lg'>Select Folders</h1>

                <section className='flex  items-center space-x-2'>
                  <input
                    type='text'
                    className='rounded-md border border-#CCCC px-2 py-1'
                    placeholder='Search'
                  />
                  {/* <button className='border px-3 py-2 rounded-md'>
                  <FaTrashAlt className='hover:cursor-pointer' />
                </button> */}
                </section>
              </section>
            </div>
            <div className='space-y-5'>
              {/* <div className='flex justify-start'>
                <button className='px-3 py-1 bg-black text-white rounded-md'>
                  Select All
                </button>
              </div> */}

              {files ? (
                <section className='w-full  flex-col'>
                  <div className='flex flex-row-reverse justify-between border-#CCCC pb-4'>
                    <article className='flex  items-center'>
                      <button className='text-sm'>Select All</button>
                      <Checkbox
                        onCheckedChange={() => {
                          handleSelectAll();
                        }}
                        className='ml-2 cursor-pointer'
                      />
                    </article>

                    <h1 className='text-sm '>Folders</h1>
                  </div>
                  {files.map((file) => (
                    <section className='flex border-b border-#CCCC pb-4  mt-5 items-center '>
                      <Checkbox
                        checked={selectedFiles.includes(file.folder_id)}
                        onCheckedChange={() => handleFileSelect(file.folder_id)}
                        id={`file-${file.folder_id}`}
                        className='cursor-pointer mr-4'
                      />
                      <h1 className='text-sm'>{file.folder_name}</h1>
                    </section>
                  ))}
                </section>
              ) : (
                ''
              )}
              <div className='flex justify-end'>
                <button
                  className='px-5 py-2 border border-#CCCC bg-black text-gray-100 mt-10 rounded-lg'
                  onClick={() => {
                    handleMultipleFolderArchive();
                    handleDialogue(false);
                  }}
                >
                  Archive
                </button>
              </div>
            </div>
          </DialogHeader>
          {/* <div className='flex justify-center items-center mt-20'>
            <button className='bg-black text-white px-4 py-1 rounded-md mr-5'>
              Move
            </button>
            <button className='bg-black text-white px-4 py-1 rounded-md'>
              Archive
            </button>
          </div> */}
        </DialogContent>
      </Dialog>
    );
  }
  if (variant === 'archive') {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        <DialogContent className=' py-10 '>
          <div className=' flex flex-col w-full space-y-6 mb-5 mt-4'>
            <h1 className='text-xl font-semibold'>Archive</h1>
            <section className='flex  items-center space-x-2'>
              <input
                type='text'
                className='rounded-md border border-#CCCC px-2 py-1'
                placeholder='Search'
              />
              {/* <button className='border px-3 py-2 rounded-md'>
                <FaTrashAlt
                  onClick={() => {}}
                  className='hover:cursor-pointer'
                />
              </button> */}
            </section>
          </div>

          {files ? (
            <section className='w-full px-0 flex-col'>
              <div className='flex flex-row-reverse justify-between border-#CCCC  pb-4'>
                <article className='flex  items-center'>
                  <button className='text-sm'>Select All</button>
                  <Checkbox
                    onCheckedChange={() => {
                      handleSelectAll();
                    }}
                    className='ml-2 cursor-pointer'
                  />
                </article>

                <h1 className='text-sm '>Folders</h1>
              </div>

              {files.map((file) => (
                <div className='flex border-b border-#CCCC  pb-4 items-center mt-5'>
                  <Checkbox
                    checked={selectedFiles.includes(file.folder_id)}
                    onCheckedChange={() => handleFileSelect(file.folder_id)}
                    id={`file-${file.folder_id}`}
                    className='cursor-pointer mr-4 '
                  />
                  <h1 className='text-sm'>{file.folder_name}</h1>
                  {/* <button
                    className='underline text-gray-400 hover:text-gray-500'
                    onClick={() => {
                      unarchive(file.folder_id);
                    }}
                  >
                    Unarchive
                  </button> */}
                </div>
              ))}
              <div className='flex justify-end'>
                <button
                  className='px-5 py-2 border border-#CCCC bg-black text-gray-100 mt-10 rounded-lg'
                  onClick={() => {
                    handleUnarchive();
                    handleDialogue(false);
                  }}
                >
                  Unarchive
                </button>
              </div>
            </section>
          ) : (
            <div className='w-full px-5'>
              {/* <ListViewSkeleton variant='archive' /> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  } else if (variant === 'alert') {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        <DialogContent>
          <div className='px-4 py-5 space-y-5 '>
            <h1 className='text-2xl font-semibold  '>
              Are you sure you want to archive?
            </h1>
            <p className='text-gray-600'>
              The file you selected will not be visible and you will need to go
              the "Archive" file if you want to access it again
            </p>
            <section className='w-full   flex space-x-7  justify-end  '>
              <button
                className='hover:opacity-70'
                onClick={() => {
                  handleDialogue(false);
                }}
              >
                Cancel
              </button>
              <button
                className='bg-black text-white px-5 py-2 rounded-lg hover:opacity-70 '
                onClick={() => {
                  handleDialogue(false);
                  archiveFolder();
                }}
              >
                Okay
              </button>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

export default DialogueComponent;
