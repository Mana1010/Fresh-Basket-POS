import { create, type StoreApi } from "zustand";

type State = {
  isOpenSidebar: boolean;
  isOpenAddCategoryForm: boolean;
};

type Action = {
  toggleSidebar: () => void;
  toggleCategoryForm: (bool: boolean) => void;
};
const store = (
  set: StoreApi<State & Action>["setState"],
  get: StoreApi<State & Action>["getState"]
) => ({
  isOpenSidebar: true,
  isOpenAddCategoryForm: false,
  toggleSidebar: () => set({ isOpenSidebar: !get().isOpenSidebar }),
  toggleCategoryForm: (bool: boolean) => set({ isOpenAddCategoryForm: bool }),
});

export const useModalStore = create<State & Action>(store);
