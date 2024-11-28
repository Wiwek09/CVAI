'use client';
import React, {
  ChangeEvent,
  DragEvent,
  useState,
  useContext,
  useEffect,
} from 'react';
import { Card } from '@/components/ui/card';
// import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

import { ApiDataContext } from '../context/ApiDataContext';
import { IoIosCloudUpload } from 'react-icons/io';
import FolderCreation from './FolderCreation';
import FolderList from './FolderList';
import { IFolderData } from '@/interfaces/FolderData';

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import axiosInstance from '../../../utils/axiosConfig';

const SideNavBar = () => {
  const [uploading, setUploading] = useState<boolean>(false);

  const context = useContext(ApiDataContext);
  // const apiData = context?.apiData ?? null;
  const setApiData = context?.setApiData;
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [updateFolderList, setUpdateFolderList] = useState(false);
  const [folderListData, setFolderListData] = useState<IFolderData[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const handleFolderCreated = () => {
    setUpdateFolderList((prev) => !prev);
  };

  useEffect(() => {
    const folderList = async () => {
      try {
        const response = await axiosInstance.get('/folder/getAllFolders');
        setFolderListData(response.data);
      } catch (error) {
        console.error('Error fetching Data:', error);
      }
    };
    folderList();
  }, [updateFolderList]);

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });

    setUploading(true);

    try {
      if (!selectedFolderId) {
        toast('No files selected', {
          description: 'Please select a file first and then upload files',
        });
        return;
      }

      const response = await axiosInstance.post(
        `/document/document?folder_id=${selectedFolderId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      if (response.status === 200) {
        const selectedFolder = folderListData.find(
          (folder) => folder.folder_id === selectedFolderId
        );
        setUpdateFolderList((prev) => !prev);
        toast('Uploaded successfully', {
          description: 'The file has been uploaded successfully',
        });
        // console.log("Data uploaded",)
        await fetchUpdatedApiData();
      } else {
        toast('Upload failed', {
          description: 'Failed to upload files ',
        });
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast('Upload failed', {
        description: error.response.data.detail,
      });
    } finally {
      setUploading(false);
    }
  };

  const fetchUpdatedApiData = async () => {
    try {
      const response = await axiosInstance.get('/document/all_document');
      if (setApiData) {
        setApiData(response.data);
      } else {
        console.warn('setApiData is undefined. Could not update the API data.');
      }
    } catch (error) {
      console.error('Error fetching updated data:', error);
    }
  };

  // const deleteAllCV = async () => {
  //   try {
  //     const response = await axiosInstance.delete(`/document/all_document`);
  //     if (response.status === 200 && apiData && apiData?.length > 0) {
  //       setApiData([]);
  //       toast({
  //         title: "Deletion Successful",
  //         description: "All files have been deleted successfully.",
  //         className: "bg-[#7bf772]",
  //       });
  //     } else {
  //       toast({
  //         title: "No files",
  //         variant: "destructive",
  //         description: "Data is Empty",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error Deleting Data", error);
  //     toast({
  //       variant: "destructive",
  //       title: "An error occurred",
  //       description: "Could not delete files.",
  //     });
  //   }
  // };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFileUpload(event.target.files);
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      handleFileUpload(event.dataTransfer.files);
    }
  };

  return (
    <Card className='border border-black h-[100vh] rounded-none flex flex-col items-center bg-black space-y-6 py-6'>
      <h1 className='text-2xl text-center w-full px-4 text-white'>CV_AI</h1>

      <div className='w-full max-w-sm px-4'>
        <div
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          className={`relative flex flex-col gap-2 items-center justify-center h-52 border-2 border-dashed border-gray-400 p-4 rounded-md  bg-black text-white transition-all duration-300 ease-in-out ${
            isDragging ? 'opacity-50 backdrop-blur-sm' : 'opacity-100'
          }`}
        >
          {uploading ? (
            <div className='absolute inset-0 flex h-full w-full flex-col items-center justify-center pointer-events-none bg-black bg-opacity-50 '>
              {/* Loader for uploading state */}
              <svg
                className='animate-spin h-10 w-10 text-gray-300'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v8H4z'
                ></path>
              </svg>
              <p className='text-gray-400 mt-2'>Uploading...</p>
            </div>
          ) : (
            <div className='flex flex-col items-center h-full w-full justify-center'>
              <IoIosCloudUpload size={40} className='text-gray-400' />
              <p className='text-center'>Drag and drop your files here</p>
              <label
                // onClick={(e) => e.stopPropagation()}
                className='cursor-pointer'
              >
                <span>Choose File</span>
                <input
                  className='hidden'
                  type='file'
                  accept='application/pdf'
                  onChange={handleFileSelect}
                  multiple
                  disabled={uploading}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <div className='w-full px-4'>
        <Select onValueChange={(value) => setSelectedFolderId(value)}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Uploading to ....' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {folderListData.map((item: any, index) => (
                <div key={index} className=''>
                  <SelectItem value={item.folder_id}>
                    {item.folder_name}
                  </SelectItem>
                </div>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* <h1 className="text-start w-full px-4 text-xl font-medium text-white">
        Files Uploaded
      </h1> */}

      {/* <div className="flex flex-col w-full items-start px-4 overflow-y-auto scrollbar-thin h-52 gap-2 max-w-sm">
        {apiData &&
          apiData.map((item: any, index: number) => (
            <span key={index} className="text-gray-300 text-sm">
              {index + 1 + ". " + item.doc_name}
            </span>
          ))}
      </div> */}

      <div className='w-full px-4'>
        <FolderCreation onFolderCreated={handleFolderCreated} />
      </div>

      <div className='w-full px-4'>
        <FolderList updateFolderList={updateFolderList} />
      </div>

      {/* <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-800">Delete All</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                your uploaded files.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-700 hover:bg-red-500"
                onClick={deleteAllCV}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div> */}
    </Card>
  );
};

export default SideNavBar;
