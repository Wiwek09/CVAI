import { create } from "zustand";

//Folder Select
interface FolderSelectStore {
  selectFolderId: string | null;
  setSelectFolderId: (id: string | null) => void;
}

// DropDown of Public Folder
interface PublicFolderState {
  isFolderListOpen: boolean;
  toogleFolderList: () => void;
}

// Folder Select
export const folderSelectStore = create<FolderSelectStore>((set) => ({
  selectFolderId: null,
  setSelectFolderId: (id) => set({ selectFolderId: id }),
}));

// DropDown of Public Folder
export const publicFolderStore = create<PublicFolderState>((set) => ({
  isFolderListOpen: true,
  toogleFolderList: () =>
    set((state) => ({ isFolderListOpen: !state.isFolderListOpen })),
}));
