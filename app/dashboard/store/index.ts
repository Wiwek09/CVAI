import { create } from "zustand";

interface IStoreState {
  isDataChanged: boolean;
  setIsDataChanged: (value: boolean) => void;
}

const useStore = create<IStoreState>((set) => ({
  isDataChanged: false,
  setIsDataChanged: (value: boolean) => set({ isDataChanged: value }),
}));

export default useStore;
