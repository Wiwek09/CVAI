"use client";
import React, {
  ChangeEvent,
  DragEvent,
  useState,
  useContext,
  useEffect,
} from "react";
import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { ApiDataContext } from "../context/ApiDataContext";
import { SpinnerContext } from "../context/SpinnerContext";
import { IoIosCloudUpload } from "react-icons/io";
import FolderCreation from "./FolderCreation";
import FolderList from "./FolderList";
import { IFolderData } from "@/interfaces/FolderData";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "../../../utils/axiosConfig";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import DialogueComponent from "./DialogueComponent";
import { MdFolderZip } from "react-icons/md";
const SideNavBar = () => {
  // const [uploading, setUploading] = useState<boolean>(false);

  const context = useContext(ApiDataContext);
  // const apiData = context?.apiData ?? null;
  const spinnerContext = useContext(SpinnerContext);
  const setApiData = context?.setApiData;
  const setUploading = spinnerContext?.setUploading;
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [updateFolderList, setUpdateFolderList] = useState(false);
  const [folderListData, setFolderListData] = useState<IFolderData[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [dialogOpen, setDialogueOpen] = useState(false);

  const handleFolderCreated = () => {
    setUpdateFolderList((prev) => !prev);
  };
  const handleDialogue = (state) => {
    setDialogueOpen(state);
  };

  useEffect(() => {
    const folderList = async () => {
      try {
        const response = await axiosInstance.get("/folder/getAllFolders");
        setFolderListData(response.data);
      } catch (error) {
        console.error("Error fetching Data:", error);
      }
    };
    folderList();
  }, [updateFolderList]);

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      if (!selectedFolderId) {
        toast("No files selected", {
          description: "Please select a file first and then upload files",
        });
        return;
      }
      setUploading(true);

      const response = await axiosInstance.post(
        `/document/document?folder_id=${selectedFolderId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        // const selectedFolder = folderListData.find(
        //   (folder) => folder.folder_id === selectedFolderId
        // );
        setUpdateFolderList((prev) => !prev);
        toast("Uploaded successfully", {
          description: "The file has been uploaded successfully",
        });
        // console.log("Data uploaded",)
        await fetchUpdatedApiData();
      } else {
        toast("Upload failed", {
          description: "Failed to upload files ",
        });
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast("Upload failed", {
        description: error.response.data.detail,
      });
    } finally {
      setUploading(false);
    }
  };

  const fetchUpdatedApiData = async () => {
    try {
      const response = await axiosInstance.get("/document/all_document");
      if (setApiData) {
        setApiData(response.data);
      } else {
        console.warn("setApiData is undefined. Could not update the API data.");
      }
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };

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

  // console.log("Uploading", uploading);

  return (
    <Sidebar className="h-[100vh]">
      {/* <SidebarTrigger className='absolute top-1/2 border rounded-lg bg-white right-0'></SidebarTrigger> */}
      <Card className="border  border-black h-[100vh] overflow-y-auto scrollbar-thin rounded-none flex flex-col items-center bg-black space-y-6 py-6">
        {dialogOpen && (
          <DialogueComponent
            variant="archive"
            handleDialogue={handleDialogue}
          />
        )}
        {/* {uploading && (
          <DialogueComponent
            variant="spinner"
            openSpinner={uploading}
            // handleDialogue={(open: boolean) => setUploading(open)}
            // handleDialogue={han}
          />
        )} */}
        <SidebarHeader>
          <h1 className="text-2xl text-center w-full px-4 text-white">CV_AI</h1>
        </SidebarHeader>
        <SidebarContent className="space-y-6 flex flex-col overflow-y-auto scrollbar-thinSide ">
          <div className="w-full px-4">
            <div
              onDrop={handleDrop}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              className={`relative flex flex-col gap-2 items-center justify-center h-48 border-2 border-dashed border-gray-400 p-4 rounded-md  bg-black text-white transition-all duration-300 ease-in-out ${
                isDragging ? "opacity-50 backdrop-blur-sm" : "opacity-100"
              }`}
            >
              <div className="flex flex-col items-center h-full w-full justify-center">
                <IoIosCloudUpload size={40} className="text-gray-400" />
                <p className="text-center">Drag and drop your files here</p>
                <label
                  // onClick={(e) => e.stopPropagation()}
                  className="cursor-pointer"
                >
                  <span>Choose File</span>
                  <input
                    className="hidden"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    multiple
                    // disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="w-full px-4">
            <Select onValueChange={(value) => setSelectedFolderId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Uploading to ...." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {folderListData.map((item: any, index) => (
                    <div key={index} className="">
                      <SelectItem value={item.folder_id}>
                        {item.folder_name}
                      </SelectItem>
                    </div>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full px-4">
            <FolderCreation onFolderCreated={handleFolderCreated} />
          </div>

          <div className="w-full px-4">
            <FolderList updateFolderList={updateFolderList} />
            <button
              className="bg-inherit px-0 items-center py-1 flex justify-start hover:opacity-60 w-full text-white"
              onClick={() => {
                handleDialogue(true);
              }}
            >
              <MdFolderZip className="text-gray-300 opacity-70" />
              <h1 className="ml-6 "> Archive </h1>
            </button>
          </div>
        </SidebarContent>
      </Card>
    </Sidebar>
  );
};

export default SideNavBar;
