import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiPlusCircleDuotone } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axiosInstance from "@/utils/axiosConfig";

function FolderCreation({ onFolderCreated }) {
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const handleFolderCreate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (folderName.trim() === "") {
      setError("Folder name cannot be empty.");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(
        `/folder/makeFolder?folder_name=${folderName}`
      );

      if (response.status === 200) {
        toast({
          title: "Folder Name Added Successfully",
          action: <ToastAction altText="OK">OK</ToastAction>,
          className: "bg-[#7bf772]",
        });
        onFolderCreated();
      } else {
        toast({
          title: "Operation failed",
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (error) {
      console.error("Error creating folder", error);
    }
    setFolderName("");
    setOpen(false);
  };

  return (
    <div className="flex justify-between items-center">
      <div className="text-lg font-semibold flex-1 text-white">Folder</div>

      <div className="flex items-center gap-4">
        {/* folder creation icon */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button aria-label="Add Folder" className="text-white">
              <PiPlusCircleDuotone size={24} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[16rem]">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold leading-none">Create Folder</h4>
              </div>
              <div>
                <form
                  onSubmit={handleFolderCreate}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center gap-4">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      className="h-8"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                    />
                  </div>
                  <div className="flex">
                    <Button type="submit" className="ml-auto">
                      Submit
                    </Button>
                  </div>
                  {error && (
                    <p className="text-red-500 flex text-sm mt-1 ml-auto">
                      {error}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* three dot icons */}
        {/* <Popover>
          <PopoverTrigger asChild>
            <button aria-label="options" className="text-white">
              <BsThreeDotsVertical />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-22 flex flex-col gap-3 ">
            <Button>Select All</Button>
            <Button>Archieve</Button>
          </PopoverContent>
        </Popover> */}
      </div>
    </div>
  );
}

export default FolderCreation;
