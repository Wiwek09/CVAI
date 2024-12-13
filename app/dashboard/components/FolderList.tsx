import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import axiosInstance from "@/utils/axiosConfig";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

import DialogueComponent from "./DialogueComponent";
import { BsThreeDots } from "react-icons/bs";

const FolderList = ({ updateFolderList, setUpdateFolderList }) => {
  const [folders, setFolders] = useState([]);
  const [openFolder, setOpenFolder] = useState([]);
  // const [files, setFiles] = useState([]);
  const [folderContents, setFolderContents] = useState({});
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [draggedFile, setDraggedFile] = useState(null);
  const [dialogOpen, setDialogueOpen] = useState(false);
  const [dialogAlert, setDialogueAlert] = useState(false);
  const [draggedOverFolder, setDraggedOverFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState({
    folder_id: "",
    file_id: "",
  }); //
  const [selectedFolder, setSelectedFolder] = useState("");
  const [name, setName] = useState("");
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
          "/folder/getAllFolders"
        );

        const fetchedFolders = foldersResponse.data;
        setFolders(fetchedFolders);
        const contentsPromises = fetchedFolders.map((folder) =>
          axiosInstance
            .get(`/folder/getFiles/${folder.folder_id}`)
            .then((response) => ({
              [folder.folder_id]: response.data || [],
            }))
            .catch((error) => {
              console.error(
                `Error fetching contents for folder ${folder.folder_id}:`,
                error
              );
              return { [folder.folder_id]: [] };
            })
        );

        const allContents = await Promise.all(contentsPromises);

        const contentsObject = allContents.reduce(
          (acc, content) => ({ ...acc, ...content }),
          {}
        );

        setFolderContents(contentsObject);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFoldersAndContents();
  }, [updateFolderList]);

  const handleDialogue = (state: boolean) => {
    setDialogueOpen(state);
  };
  const handleAlert = (state: boolean) => {
    setDialogueAlert(state);
  };
  const handleAlertFile = (state: boolean) => {
    setDialogueAlertFile(state);
  };
  const toggleDropDown = async (folderId: string) => {
    setOpenFolder((prevOpenFolders) => {
      if (prevOpenFolders.includes(folderId)) {
        return prevOpenFolders.filter((id) => id !== folderId);
      }
      // Open the folder
      return [...prevOpenFolders, folderId];
    });
  };

  const handleRename = async (folderId: string) => {
    if (newFolderName.trim() === "") {
      toast.error("Folder name is required");
      return;
    }
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
      setNewFolderName("");
      toast("Successfully edited the folder", {
        description: "Folder has been renamed successfully",
        style: {
          color: "white",
          background: "black",
        },
      });
    } catch (error) {
      console.error("Error renaming folder:", error);
      toast("Failed to edit", {
        description: error.response.data.detail,
        style: {
          background: "black",
          color: "white",
        },
      });
    }
  };

  const handleDragStart = (file, fromFolderId) => {
    setDraggedFile({ file, fromFolderId });
  };

  const handleDragEnd = () => {
    setDraggedFile(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = () => {
    setDraggedOverFolder(null);
  };

  const handleDrop = async (toFolderId) => {
    if (!draggedFile) return;
    const { file, fromFolderId } = draggedFile;

    if (fromFolderId === toFolderId) {
      toast.error("File already in same folder");
      return;
    }

    try {
      await axiosInstance.post(`/folder/moveFiles`, {
        from_folder: fromFolderId,
        to_folder: toFolderId,
        document_id: [file.doc_id],
      });

      // Update folderContents state
      setFolderContents((prevFolderContents) => {
        // Remove file from the source folder
        const updatedFromFolder = prevFolderContents[fromFolderId].filter(
          (f) => f.doc_id !== file.doc_id
        );

        // Add file to the target folder
        const updatedToFolder = [...prevFolderContents[toFolderId], file];

        return {
          ...prevFolderContents,
          [fromFolderId]: updatedFromFolder,
          [toFolderId]: updatedToFolder,
        };
      });
      toast.success("File moved successfully!");
    } catch (error) {
      console.error("Error moving file:", error);
      toast.error("Failed to move the file. Please try again.");
    } finally {
      setDraggedFile(null);
    }
  };

  return (
    <div className="text-white w-full">
      {/* Dailogue on clikcing Select */}
      {dialogOpen && (
        <DialogueComponent
          folders={folders}
          id={selectedFolder}
          variant="selectMultiple"
          handleDialogue={handleDialogue}
          setArchieveFiles={setFolderContents}
          name={name}
        />
      )}

      {/* Folder Dialogue */}
      {dialogAlert && (
        <DialogueComponent
          variant="alert"
          handleDialogue={handleAlert}
          id={selectedFolder}
          setFolders={setFolders}
          setUpdateFolderList={setUpdateFolderList}
        />
      )}

      {/* Daiologue on clicking three dot icon of individual file */}
      {dialogAlertFile && (
        <DialogueComponent
          variant="alertFile"
          handleDialogue={handleAlertFile}
          id={selectedFile}
          setArchieveFiles={setFolderContents}
        />
      )}

      {folders.map((folder) => (
        <div
          key={folder.folder_id}
          className={`mb-4 transition-all duration-200 ${
            draggedOverFolder === folder.folder_id
              ? "opacity-50 bg-gray-700/30"
              : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={() => handleDrop(folder.folder_id)}
        >
          <div className="flex gap-2 w-full justify-between items-center flex-1 rounded">
            {editingFolder === folder.folder_id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRename(folder.folder_id);
                }}
              >
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value.trim())}
                  onBlur={() => setEditingFolder(null)}
                  className="bg-gray-800 w-full text-white rounded p-1"
                  ref={(el) => {
                    if (el) inputRefs.current[folder.folder_id] = el;
                  }}
                />
                <button type="submit" className="hidden"></button>
              </form>
            ) : (
              <div className="flex items-center justify-between  gap-2 ">
                <div>
                  <div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          onClick={() => {
                            setSelectedFolder(folder.folder_id);
                          }}
                        >
                          <RxHamburgerMenu />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-32 p-1 text-center cursor-pointer">
                        <p
                          className="py-1 hover:opacity-50"
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
                            // setEditingFolder(folder.folder_id);
                            setName(folder.folder_name);
                          }}
                          className="py-1 hover:opacity-50"
                        >
                          Select
                        </button>
                        <hr />
                        <button
                          onClick={() => {
                            handleAlert(true);
                          }}
                          className="py-1 hover:opacity-50"
                        >
                          Archive
                        </button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <span className="ml-5">{folder.folder_name}</span>
              </div>
            )}

            <div
              className="flex gap-4"
              onClick={() => toggleDropDown(folder.folder_id)}
            >
              <span
                className={`ml-auto w-6 h-6 hover:bg-gray-700 rounded-full items-center justify-center flex transform transition-transform duration-300 ${
                  openFolder.includes(folder.folder_id)
                    ? "rotate-180"
                    : "rotate-0"
                }`}
              >
                <FaChevronDown />
              </span>

              {/* Hamburger */}
            </div>
          </div>

          {openFolder.includes(folder.folder_id) && (
            <div className="mt-2 ml-6  border-l  border-gray-600 pl-4 w-52 max-w-52 truncate">
              {folderContents[folder.folder_id]?.length ? (
                folderContents[folder.folder_id].map((file) => (
                  <div
                    key={file.doc_id}
                    className="relative flex items-center justify-between p-1 text-gray-300 ease-in-out duration-150 delay-75 rounded truncate "
                  >
                    <Link
                      key={file.doc_id}
                      href={`/cv-detail/${file.doc_id}`}
                      target="_blank"
                      className="truncate"
                      draggable
                      onDragStart={() =>
                        handleDragStart(file, folder.folder_id)
                      }
                      onDragEnd={handleDragEnd}
                    >
                      <span className=" px-2 py-1 w-8  hover:opacity-60 max-w-12 text-sm truncate">
                        {file.doc_name.replace(".pdf", "")}
                      </span>
                    </Link>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button>
                          <BsThreeDots
                            className="text-white hover:opacity-60 hover:cursor-pointer"
                            size={"15px"}
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-20 p-0  ">
                        <span
                          className="flex items-center p-1 hover:cursor-pointer hover:opacity-50 justify-center"
                          onClick={() => {
                            handleAlertFile(true);
                            setSelectedFile({
                              folder_id: folder.folder_id,
                              file_id: file.doc_id,
                            });
                          }}
                        >
                          Archive
                        </span>
                        <hr />
                      </PopoverContent>
                    </Popover>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">No PDFs uploaded.</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderList;
