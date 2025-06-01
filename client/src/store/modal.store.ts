import { create, type StoreApi } from "zustand";

type State = {
  isOpenSidebar: boolean;
  isOpenAddCategoryForm: boolean;
  isOpenProductDetails: boolean;
};

type Action = {
  toggleSidebar: () => void;
  toggleCategoryForm: (bool: boolean) => void;
  toggleProductDetails: () => void;
  closeProductDetails: () => void;
};
const store = (
  set: StoreApi<State & Action>["setState"],
  get: StoreApi<State & Action>["getState"]
) => ({
  isOpenSidebar: true,
  isOpenAddCategoryForm: false,
  isOpenProductDetails: false,
  toggleSidebar: () => set({ isOpenSidebar: !get().isOpenSidebar }),
  toggleCategoryForm: (bool: boolean) => set({ isOpenAddCategoryForm: bool }),
  toggleProductDetails: () =>
    set({ isOpenProductDetails: !get().isOpenProductDetails }),
  closeProductDetails: () => set({ isOpenProductDetails: false }),
});

export const useModalStore = create<State & Action>(store);
