import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
function MoveToFolderPopover({
  folders,
  onSelectFolder,
  selectedFile,
  currentFolderId,
  toast,
}) {
  const [open, setOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState("");

  const handleFolderSelect = (folderId) => {
    if (folderId === currentFolderId) {
      // Display error message if attempting to move to the same folder
      toast({
        title: "Cannot move file to the same folder.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile || Object.keys(selectedFile).length === 0) {
      toast({
        title: "No files selected.",
        variant: "destructive",
      });
      return;
    }

    onSelectFolder(folderId); // Trigger the move logic in the parent
    setSelectedFolderId(folderId); // Update selected folder ID in local state
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="hover:bg-gray-700 w-full h-full p-1 hover:text-white rounded-md">
          Move file(s) to
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search folder..." />
          <CommandList>
            <CommandEmpty>No folder found.</CommandEmpty>
            <CommandGroup>
              {folders.map((folder) => (
                <CommandItem
                  key={folder.folder_id}
                  onSelect={() => handleFolderSelect(folder.folder_id)}
                >
                  {folder.folder_name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedFolderId === folder.folder_id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default MoveToFolderPopover;
