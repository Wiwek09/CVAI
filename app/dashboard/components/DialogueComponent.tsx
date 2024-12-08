import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
// import * as Dialog from "@radix-ui/react-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import ClipLoader from "react-spinners/ClipLoader";
import axiosInstance from "@/utils/axiosConfig";
import { toast } from "sonner";
import { Check } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { FaTrashAlt } from "react-icons/fa";
import { BsFolderSymlink } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdOutlineFolder } from "react-icons/md";

function DialogueComponent({
  variant,
  handleDialogue,
  id,
  folders,
  name,
}: // setArchieveFiles,
{
  variant: string;
  handleDialogue?: any;
  id?: any;
  folders?: any;
  name?: any;
  openSpinner?: any;
  // setArchieveFiles?: any;
}) {
  const [files, setFiles] = useState([]);
  const [filesArchieved, setFilesArchieved] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [defaultselectedFiles, setDefaultSelectedFiles] = useState([]); // list of files in archieve folder
  const [refresh, setRefresh] = useState(true);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [folderId, setFolderId] = useState("");

  // API's Call
  useEffect(() => {
    if (variant === "selectMultiple") {
      const fetchFiles = async () => {
        try {
          const response = await axiosInstance.get(`/folder/getFiles/${id}`);
          setFiles(response.data);
        } catch (e) {
          console.error("Error fetching data", e);
        }
      };
      fetchFiles();
    } else if (variant === "selectMultipleFolders") {
      const fetchFolders = async () => {
        try {
          const response = await axiosInstance.get("/folder/getAllFolders");
          setFiles(response.data);
        } catch (error) {
          toast(error.response.data.detail);
        }
      };
      fetchFolders();
    } else if (variant === "archive") {
      const fetchArchive = async () => {
        try {
          const response = await axiosInstance.get(
            "/folder/getArchivedFolders"
          );
          setFiles(response.data);
        } catch (error) {
          console.error("Failed to fetched Archive details", error);
        }
      };
      const fetchArchiveFiles = async () => {
        try {
          const response = await axiosInstance.get(
            "/document/getArchivedDefaultDocuments"
          );
          setFilesArchieved(response.data);
        } catch (error) {
          console.error("Error occured !!", error);
        }
      };
      fetchArchiveFiles();
      fetchArchive();
    }
  }, [id, variant, refresh]);

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
      axiosInstance.post(`/folder/archiveFolder/`, {
        folder_ids: selectedFiles,
      });
      setTimeout(() => {
        location.reload();
      }, 1000);
      toast("Successfully archived folders");
      setRefresh(!refresh);
    } catch (error) {
      toast(error.response.data.detail);
      console.error("Error archieving folder", error);
    }
  };

  // Function to handle multiple selection document archieve
  const handleDocumentArchive = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No File selected !!");
      return;
    }
    try {
      const response = await axiosInstance.post("/document/archive_document", {
        document_ids: selectedFiles,
      });
      toast(response.data.message);
    } catch (error) {
      console.error("Error Archieving", error);
      toast.error(error);
    }
  };

  const handleCheckBoxUnarchieveFile = (docId, isChecked) => {
    setDefaultSelectedFiles((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, docId];
      } else {
        return prevSelected.filter((item) => item.id !== docId);
      }
    });
  };

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

  // console.log("BibekSelected", selectedFiles);

  // Unarchieve Both Files and Folders:
  const handleUnarchive = async () => {
    if (selectedFiles.length === 0 && defaultselectedFiles.length === 0) {
      toast.error("File / Folder is not selected");
      return;
    }

    try {
      if (selectedFiles.length > 0) {
        await axiosInstance.post(`/folder/unarchiveFolder/`, {
          folder_ids: selectedFiles,
        });
      }

      if (defaultselectedFiles.length > 0) {
        await axiosInstance.post(`/document/unarchive_document`, {
          document_ids: defaultselectedFiles,
        });
      }

      handleDialogue(false);
      // console.log("unarchive response", response);
      setTimeout(() => {
        location.reload();
      }, 1000);
      toast("Successfully unarchived the files", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
    } catch (error) {
      toast(error.response.data.detail, {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
      console.error("Error occured", error);
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
      console.error(error);
    }
  };
  const handleMove = async () => {
    if (selectedFiles.length > 0) {
      if (!(folderId === null)) {
        try {
          await axiosInstance.post(`/folder/moveFiles`, {
            from_folder: id,
            to_folder: folderId,
            document_id: selectedFiles,
          });
          toast("successfully moved files", {
            style: {
              backgroundColor: "black",
              color: "white",
            },
          });
          handleDialogue(false);
        } catch (error) {
          toast("Failed to move files");
          console.error(error);
        }
      } else {
        toast("Select a folder first", {
          style: {
            background: "black",
            color: "white",
          },
        });
      }
    } else {
      toast("Select a file first ", {
        style: {
          backgroundColor: "black",
          color: "white",
        },
      });
    }
  };
  const archiveFile = async () => {
    try {
      await axiosInstance.post(`/document/archive_document`, {
        document_ids: [id.file_id],
      });

      // console.log(response);
      toast.success("File Archieve Successfully");
    } catch (error) {
      console.error("Error Archieving File", error);
      toast.error("Error Archiving File  !!!");
    }
  };

  //Opening Dailog on selecting select on folder
  if (variant === "selectMultiple") {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        <DialogContent className=" py-4 max-h-[90%] overflow-y-scroll scrollbar-thin">
          <DialogHeader>
            <div className=" flex flex-col w-full space-y-6  mb-8 mt-4">
              <h1 className="text-xl">{name}</h1>
              <section className="flex  items-center justify-between ">
                <input
                  type="text"
                  className="rounded-md border border-#CCCC px-2 py-1"
                  placeholder="Search"
                />
                <article className="space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger className="p-0 mt-[1px]" asChild>
                      <button className="border px-4 py-[0.67rem] hover:backdrop-brightness-95 rounded-md">
                        <FaTrashAlt className="hover:cursor-pointer" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          The file you selected will be archived.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleDocumentArchive();
                            handleDialogue(false);
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className=" justify-between"
                      >
                        {/* {value
                          ? folders.find(
                              (folder) => folder.folder_name === value
                            )?.label
                          : ""} */}
                        <BsFolderSymlink />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search folder"
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No folders found.</CommandEmpty>
                          <CommandGroup>
                            {folders.map((folder) => (
                              <CommandItem
                                key={folder.folder_id}
                                value={folder.folder_name}
                                onSelect={(currentValue) => {
                                  setValue(
                                    currentValue === value ? "" : currentValue
                                  );
                                  setFolderId(folder.folder_id);
                                  // setOpen(false);
                                }}
                              >
                                {folder.folder_name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    value === folder.folder_name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                      <div className="w-full px-2  flex justify-end">
                        <button
                          className="text-sm bg-black text-white rounded-lg mb-5 px-4 py-1 mt-5 flex justify-end"
                          onClick={() => {
                            handleMove();
                          }}
                        >
                          Move
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </article>
              </section>
            </div>
            <div className="space-y-5 ">
              {files.length > 0 ? (
                <section className="w-full  flex-col">
                  <div className="flex flex-row-reverse justify-between border-#CCCC  pb-4">
                    <article className="flex items-center">
                      <button className="text-sm">Select All</button>
                      <Checkbox
                        onCheckedChange={() => {
                          handleSelectAllFiles();
                        }}
                        className="ml-2 cursor-pointer"
                      />
                    </article>

                    <h1 className="text-sm">Folders</h1>
                  </div>
                  <div className="">
                    {files.map((file) => (
                      <section
                        key={file.doc_id}
                        className="flex pb-4 border-b border-#CCCC mt-4 items-center "
                      >
                        <Checkbox
                          checked={selectedFiles.includes(file.doc_id)}
                          onCheckedChange={() => handleFileSelect(file.doc_id)}
                          id={`file-${file.doc_id}`}
                          className="cursor-pointer mr-4"
                        />
                        <h1 className="text-sm font-light">{file.doc_name}</h1>
                      </section>
                    ))}
                  </div>
                </section>
              ) : (
                <p className="text-center font-semibold">No PDFs is uploaded</p>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  if (variant === "selectMultipleFolders") {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        <DialogContent className=" py-4 max-h-[90%] overflow-y-scroll scrollbar-thin ">
          <DialogHeader>
            <div className=" flex w-full justify-between items-center mb-8 mt-4">
              <section className="flex-col space-y-6">
                <h1 className="text-lg">Select Folders</h1>

                <section className="flex  items-center space-x-2">
                  <input
                    type="text"
                    className="rounded-md border border-#CCCC px-2 py-1"
                    placeholder="Search"
                  />
                </section>
              </section>
            </div>
            <div className="space-y-5">
              {files ? (
                <section className="w-full  flex-col">
                  <div className="flex flex-row-reverse justify-between border-#CCCC pb-4">
                    <article className="flex  items-center">
                      <button className="text-sm">Select All</button>
                      <Checkbox
                        onCheckedChange={() => {
                          handleSelectAll();
                        }}
                        className="ml-2 cursor-pointer"
                      />
                    </article>

                    <h1 className="text-sm ">Folders</h1>
                  </div>
                  {files.map((file) => (
                    <section
                      key={file.folder_id}
                      className="flex border-b border-#CCCC pb-4  mt-4 items-center "
                    >
                      <Checkbox
                        checked={selectedFiles.includes(file.folder_id)}
                        onCheckedChange={() => handleFileSelect(file.folder_id)}
                        id={`file-${file.folder_id}`}
                        className="cursor-pointer mr-4"
                      />
                      <h1 className="text-sm">{file.folder_name}</h1>
                    </section>
                  ))}
                </section>
              ) : (
                ""
              )}
              <div className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger className="p-0 mt-[1px]" asChild>
                    <button className="px-5 py-2 border border-#CCCC bg-black text-gray-100 mt-10 rounded-lg">
                      Archive
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        The folder(s) you selected will be archieved.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleMultipleFolderArchive();
                          handleDialogue(false);
                        }}
                      >
                        Archive
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // Dialog on clicking Archieve Folder
  if (variant === "archive") {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        <DialogContent className=" py-4 max-h-[90%] overflow-y-scroll scrollbar-thin">
          <div className=" flex flex-col w-full space-y-6 mb-5 mt-4">
            <h1 className="text-xl font-semibold">Archive</h1>
            <section className="flex  items-center space-x-2">
              <input
                type="text"
                className="rounded-md border border-#CCCC px-2 py-1"
                placeholder="Search"
              />
            </section>
          </div>

          {files ? (
            <section className="w-full px-0 flex-col">
              <div className="flex flex-row-reverse justify-between border-#CCCC pb-4">
                {files.length > 0 ? (
                  <div className="flex  items-center">
                    <button className="text-sm">Select All </button>
                    <Checkbox
                      onCheckedChange={() => {
                        handleSelectAll();
                      }}
                      className="ml-2 cursor-pointer"
                    />
                  </div>
                ) : (
                  <div></div>
                )}

                <h1 className="text-sm ">Folders</h1>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="hover:no-underline flex justify-between text-gray-400 text-sm">
                    <section className="flex items-center">
                      <MdOutlineFolder size={"20px"} />
                      <h1 className="text-sm ml-3 mt-1">Archieve Folder</h1>
                    </section>
                  </AccordionTrigger>
                  <AccordionContent className="ml-5">
                    {filesArchieved.map((doc) => (
                      <div key={doc.id} className="flex space-x-3 items-center">
                        <Checkbox
                          onCheckedChange={(isChecked) =>
                            handleCheckBoxUnarchieveFile(doc.id, isChecked)
                          }
                        />
                        <div>{doc.document_name}</div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              {files.map((file) => (
                <div
                  key={file.folder_id}
                  className="flex border-b border-#CCCC  pb-4 items-center mt-5"
                >
                  <Checkbox
                    checked={selectedFiles.includes(file.folder_id)}
                    onCheckedChange={() => handleFileSelect(file.folder_id)}
                    id={`file-${file.folder_id}`}
                    className="cursor-pointer mr-4 "
                  />
                  <h1 className="text-sm">{file.folder_name}</h1>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  className="px-5 py-2 border border-#CCCC bg-black text-gray-100 mt-10 rounded-lg"
                  onClick={() => {
                    handleUnarchive();
                  }}
                >
                  Unarchive
                </button>
              </div>
            </section>
          ) : (
            <div className="w-full px-5">
              {/* <ListViewSkeleton variant='archive' /> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  } else if (variant === "alert") {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        <DialogContent>
          <div className="px-4 py-5 space-y-5 ">
            <h1 className="text-2xl font-semibold  ">
              Are you sure you want to archive?
            </h1>
            <p className="text-gray-600">
              The folder you selected will not be visible.
            </p>
            <section className="w-full   flex space-x-7  justify-end  ">
              <button
                className="hover:opacity-70"
                onClick={() => {
                  handleDialogue(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-70 "
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

  // Archieve Alert
  if (variant === "alertFile") {
    return (
      <Dialog
        defaultOpen
        onOpenChange={() => {
          handleDialogue(false);
        }}
      >
        <DialogContent>
          <div className="px-4 py-5 space-y-5 ">
            <h1 className="text-2xl font-semibold  ">
              Are you sure you want to archive?
            </h1>
            <p className="text-gray-600">
              The file you selected will not be visible.
            </p>
            <section className="w-full flex space-x-7  justify-end  ">
              <button
                className="hover:opacity-70"
                onClick={() => {
                  handleDialogue(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-70 "
                onClick={() => {
                  handleDialogue(false);
                  archiveFile();
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
