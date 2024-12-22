import { create } from "zustand";

interface FolderSelectStore {
  selectFolderId: string | null;
  setSelectFolderId: (id: string | null) => void;
}

export const folderSelectStore = create<FolderSelectStore>((set) => ({
  selectFolderId: null,
  setSelectFolderId: (id) => set({ selectFolderId: id }),
}));
