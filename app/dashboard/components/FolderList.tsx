import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import MoveToFolderPopover from "./SideNavBar/MoveToFolderPopover";
import axiosInstance from "@/utils/axiosConfig";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useToast } from "@/hooks/use-toast";

const FolderList = ({ updateFolderList, setUpdateFolderList }) => {
  const [folders, setFolders] = useState([]);
  const [openFolder, setOpenFolder] = useState([]);
  const [folderContents, setFolderContents] = useState({});
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [draggedFile, setDraggedFile] = useState(null);
  const [draggedOverFolder, setDraggedOverFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [archiveType, setArchiveType] = useState("");

  const { toast } = useToast();

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

        // Merge all folder content objects into one
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

  const toggleDropdown = (folderId) => {
    setOpenFolder((prevOpenFolders) => {
      if (prevOpenFolders.includes(folderId)) {
        // If folder is already open, close it
        return prevOpenFolders.filter((id) => id !== folderId);
      }
      // Open the folder
      return [...prevOpenFolders, folderId];
    });
  };

  //Archieve Dailogue Box:
  const openArchiveDialog = (target, type) => {
    setArchiveTarget(target);
    setArchiveType(type);
    setIsDialogOpen(true);
  };

  const closeArchiveDialog = () => {
    setIsDialogOpen(false);
    setArchiveTarget(null);
    setArchiveType("");
  };

  //HandleArchieve for Folder
  const handleArchive = async () => {
    if (!archiveTarget) return;
    console.log("Archive Target:", archiveTarget);
    console.log("Folder Contents before update:", folderContents);
    console.log(
      "Target Folder Contents:",
      folderContents[archiveTarget?.folder_id]
    );
    try {
      if (archiveType === "folder") {
        await axiosInstance.post(
          `/folder/archiveFolder/${archiveTarget.folder_id}`
        );
        toast({
          title: `${archiveTarget.folder_name} archived successfully.`,
          className: "bg-green-500",
        });

        // Optionally update folder list
        setFolders((prev) =>
          prev.filter((folder) => folder.folder_id !== archiveTarget.folder_id)
        );
      } else if (archiveType === "document") {
        await axiosInstance.post(
          `/document/archive_document/${archiveTarget.doc_id}`
        );
        // console.log("Before update:", folderContents);
        // Optionally update document list
        // setFolderContents((prevContents) => {
        //   const updatedContents = { ...prevContents };
        //   const folderId = archiveTarget.folder_id;
        //   // console.log(
        //   //   "Target folder before update:",
        //   //   updatedContents[folderId]
        //   // );

        //   // Convert object to array if needed
        //   // const folderDocs = Array.isArray(updatedContents[folderId])
        //   //   ? updatedContents[folderId]
        //   //   : Object.values(updatedContents[folderId] || {});

        //   // // Safeguard: Perform filter only if folderDocs is now an array
        //   // updatedContents[folderId] = folderDocs.filter(
        //   //   (doc) => doc.doc_id !== archiveTarget.doc_id
        //   // );

        //   // return updatedContents;

        //   if (updatedContents[folderId]) {
        //     updatedContents[folderId] = updatedContents[folderId].filter(
        //       (doc) => doc.doc_id !== archiveTarget.doc_id
        //     );
        //   }

        //   // console.log("Updated folder contents:", updatedContents[folderId]);
        //   return updatedContents;
        // });
        // Trigger folder content re-fetch
        setUpdateFolderList((prev) => !prev);
        toast({
          title: `${archiveTarget.doc_name} archived successfully.`,
          className: "bg-green-500",
        });
      }

      closeArchiveDialog();
    } catch (error) {
      console.error(`Error archiving ${archiveType}:`, error);
      toast({
        title: `Failed to archive ${archiveType}.`,
        variant: "destructive",
      });
    }
  };

  const handleRename = async (folderId) => {
    try {
      await axiosInstance.put(`/folderrenameFolder/${folderId}`, {
        folder_id: folderId,
        folder_name: newFolderName,
      });

      // Update folder name in the UI
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.folder_id === folderId
            ? { ...folder, folder_name: newFolderName }
            : folder
        )
      );

      setEditingFolder(null);
      setNewFolderName("");
    } catch (error) {
      console.error("Error renaming folder:", error);
    }
  };

  const handleFolderCheckedBoxChange = (folder, isChecked) => {
    //  If folder is checkbox is checked, select all files in the folder
    if (isChecked) {
      const folderFiles = folderContents[folder.folder_id] || [];
      const newSelectedFiles = { ...selectedFile };

      folderFiles.forEach((file) => {
        newSelectedFiles[file.doc_id] = folder.folder_id;
      });

      setSelectedFile(newSelectedFiles);
    } else {
      //If unchecked, remove all files in this folder from selected files
      const folderFiles = folderContents[folder.folder_id] || [];
      const newSelectedFiles = { ...selectedFile };

      folderFiles.forEach((file) => {
        delete newSelectedFiles[file.doc_id];
      });

      setSelectedFile(newSelectedFiles);
    }
  };

  const handleFileSelect = (file, folderId) => {
    setSelectedFile((prevSelectedFiles) => {
      const isSelected = prevSelectedFiles[file.doc_id];
      const updatedSelectedFiles = { ...prevSelectedFiles };
      if (isSelected) {
        delete updatedSelectedFiles[file.doc_id];
      } else {
        updatedSelectedFiles[file.doc_id] = folderId;
      }
      return updatedSelectedFiles;
    });
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

  const handleDrop = (toFolderId) => {
    if (draggedFile) {
      handleMoveFile({
        file: draggedFile.file,
        fromFolderId: draggedFile.fromFolderId,
        toFolderId,
      });
      setDraggedFile(null);
    }
  };

  const handleMoveFile = async ({ file, fromFolderId, toFolderId }) => {
    const normalizedFile = Array.isArray(file) ? file : [file];
    if (fromFolderId === toFolderId) {
      toast({
        title: "Cannot move file to the same folder.",
        variant: "destructive",
      });
      return;
    }

    console.log("SelectedFile", selectedFile);

    try {
      const documentIds = Array.isArray(file)
        ? file.map((doc) => doc.doc_id)
        : [file.doc_id];
      await axiosInstance.post("/folder/moveFiles", {
        from_folder: fromFolderId,
        to_folder: toFolderId,
        document_id: documentIds,
      });

      // Update local state to reflect the move
      setFolderContents((prevContents) => {
        const updatedContents = { ...prevContents };

        // Remove file from source folder
        updatedContents[fromFolderId] = updatedContents[fromFolderId].filter(
          (doc) => !documentIds.includes(doc.doc_id)
        );

        // Add file to destination folder

        updatedContents[toFolderId] = [
          ...(updatedContents[toFolderId] || []),
          ...normalizedFile,
        ];

        return updatedContents;
      });

      //Reset Checkbox of file list
      setSelectedFile((prevSelectedFiles) => {
        const updatedSelectedFiles = { ...prevSelectedFiles };
        normalizedFile.forEach((f) => {
          delete updatedSelectedFiles[f.doc_id];
        });
        return updatedSelectedFiles;
      });

      toast({
        title: "Successfully moved file to another folder",
        className: "bg-[#7bf772]",
      });
    } catch (error) {
      console.error("Error moving file:", error);
      toast({
        title: "Failed to move file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-white">
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
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onBlur={() => setEditingFolder(null)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleRename(folder.folder_id)
                }
                className="bg-gray-800 w-full text-white rounded p-1"
              />
            ) : (
              <div className="flex items-center text-center gap-2 ">
                <span>
                  <Checkbox
                    className="bg-white"
                    onCheckedChange={(isChecked) =>
                      handleFolderCheckedBoxChange(folder, isChecked)
                    }
                  />
                </span>
                <span>{folder.folder_name}</span>
              </div>
            )}

            <div className="flex gap-4">
              <span
                onClick={() => toggleDropdown(folder.folder_id)}
                className={`ml-auto w-6 h-6 hover:bg-gray-700 rounded-full items-center justify-center flex transform transition-transform duration-300 ${
                  openFolder.includes(folder.folder_id)
                    ? "rotate-180"
                    : "rotate-0"
                }`}
              >
                <FaChevronDown />
              </span>

              {/* Three dot */}
              <span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button>
                      <BsThreeDotsVertical />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-32 p-1 flex flex-col gap-2 text-center ">
                    <p
                      onClick={() => {
                        setEditingFolder(folder.folder_id);
                        setNewFolderName(folder.folder_name);
                      }}
                      className="cursor-pointer hover:bg-gray-600 hover:text-white rounded-md"
                    >
                      Rename Folder
                    </p>
                    <Separator className="font-bold text-black" />
                    <MoveToFolderPopover
                      folders={folders}
                      currentFolderId={folder.folder_id}
                      selectedFile={selectedFile}
                      onSelectFolder={(toFolderId) =>
                        handleMoveFile({
                          fromFolderId: folder.folder_id,
                          toFolderId,
                          file: folderContents[folder.folder_id]?.filter((f) =>
                            Object.keys(selectedFile).includes(f.doc_id)
                          ),
                        })
                      }
                      toast={toast}
                    />
                    <Separator />
                    <p
                      className="cursor-pointer hover:bg-gray-600 hover:text-white rounded-md"
                      onClick={() => openArchiveDialog(folder, "folder")}
                    >
                      Archieve Folder
                    </p>
                  </PopoverContent>
                </Popover>
              </span>
            </div>
          </div>

          {openFolder.includes(folder.folder_id) && (
            <div className="mt-2 ml-6 border-l border-gray-600 pl-4 max-w-[12rem]">
              {folderContents[folder.folder_id]?.length ? (
                folderContents[folder.folder_id].map((file) => (
                  <div
                    key={file.doc_id}
                    className="flex items-center gap-2 p-1"
                  >
                    <div>
                      <Checkbox
                        className="bg-white"
                        checked={!!selectedFile[file.doc_id]}
                        onCheckedChange={() =>
                          handleFileSelect(file, folder.folder_id)
                        }
                      />
                    </div>
                    <Link
                      key={file.doc_id}
                      href={`/cv-detail/${file.doc_id}`}
                      target="_blank"
                      draggable
                      onDragStart={() =>
                        handleDragStart(file, folder.folder_id)
                      }
                      onDragEnd={handleDragEnd}
                      className="truncate text-gray-300 ease-in-out hover:bg-gray-700 duration-150 delay-75 rounded"
                    >
                      {file.doc_name}
                    </Link>
                    {selectedFile[file.doc_id] && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button aria-label="options" className="text-white">
                            <BsThreeDotsVertical />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-38 flex flex-col gap-3 ">
                          <MoveToFolderPopover
                            folders={folders}
                            currentFolderId={folder.folder_id}
                            selectedFile={selectedFile}
                            onSelectFolder={(toFolderId) =>
                              handleMoveFile({
                                file,
                                fromFolderId: folder.folder_id,
                                toFolderId,
                              })
                            }
                            toast={toast}
                          />
                          <Separator />
                          <button
                            className="hover:bg-gray-700 w-full h-full p-1 hover:text-white rounded-md"
                            onClick={() => openArchiveDialog(file, "document")}
                          >
                            Archive Document
                          </button>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">No PDFs uploaded.</div>
              )}
            </div>
          )}
        </div>
      ))}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Archive {archiveType === "folder" ? "Folder" : "Document"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to archive{" "}
              {archiveType === "folder" ? (
                <strong>{archiveTarget?.folder_name}</strong>
              ) : (
                <strong>{archiveTarget?.doc_name}</strong>
              )}
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
              onClick={closeArchiveDialog}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={handleArchive}
            >
              Confirm
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderList;
