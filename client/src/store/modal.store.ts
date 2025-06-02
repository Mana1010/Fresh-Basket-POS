import { create, type StoreApi } from "zustand";
import type { FullProductDetailsType } from "../types/product.types";

type State = {
  isOpenSidebar: boolean;
  isOpenAddCategoryForm: boolean;
  isOpenProductDetails: boolean;
  productDetails: FullProductDetailsType | null;
};

type Action = {
  toggleSidebar: () => void;
  toggleCategoryForm: (bool: boolean) => void;
  toggleProductDetails: () => void;
  closeProductDetails: () => void;
  setProductDetails: (data: FullProductDetailsType | null) => void;
};
const store = (
  set: StoreApi<State & Action>["setState"],
  get: StoreApi<State & Action>["getState"]
) => ({
  isOpenSidebar: true,
  isOpenAddCategoryForm: false,
  isOpenProductDetails: false,
  productDetails: null,
  toggleSidebar: () => set({ isOpenSidebar: !get().isOpenSidebar }),
  toggleCategoryForm: (bool: boolean) => set({ isOpenAddCategoryForm: bool }),
  toggleProductDetails: () =>
    set({ isOpenProductDetails: !get().isOpenProductDetails }),
  closeProductDetails: () => set({ isOpenProductDetails: false }),
  setProductDetails: (data: FullProductDetailsType | null) =>
    set({ productDetails: data }),
});

export const useModalStore = create<State & Action>(store);
