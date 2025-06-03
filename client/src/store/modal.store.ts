import { create, type StoreApi } from "zustand";
import type { FullProductDetailsType } from "../types/product.types";
import type { FullUserType } from "../types/user.types";

type State = {
  isOpenSidebar: boolean;
  isOpenAddCategoryForm: boolean;
  isOpenProductDetails: boolean;
  productDetails: FullProductDetailsType | null;
  isOpenAccountDetails: boolean;
  accountDetails: FullUserType | null;
};

type Action = {
  toggleSidebar: () => void;
  toggleCategoryForm: (bool: boolean) => void;
  toggleProductDetails: () => void;
  closeProductDetails: () => void;
  setProductDetails: (data: FullProductDetailsType | null) => void;
  toggleAccountDetails: () => void;
  closeAccountDetails: () => void;
  setAccountDetails: (data: FullUserType | null) => void;
};
const store = (
  set: StoreApi<State & Action>["setState"],
  get: StoreApi<State & Action>["getState"]
) => ({
  isOpenSidebar: true,
  isOpenAddCategoryForm: false,
  isOpenProductDetails: false,
  isOpenAccountDetails: false,
  productDetails: null,
  accountDetails: null,
  toggleSidebar: () => set({ isOpenSidebar: !get().isOpenSidebar }),
  toggleCategoryForm: (bool: boolean) => set({ isOpenAddCategoryForm: bool }),
  toggleProductDetails: () =>
    set({ isOpenProductDetails: !get().isOpenProductDetails }),
  closeProductDetails: () => set({ isOpenProductDetails: false }),
  setProductDetails: (data: FullProductDetailsType | null) =>
    set({ productDetails: data }),
  toggleAccountDetails: () =>
    set({ isOpenAccountDetails: !get().isOpenAccountDetails }),
  closeAccountDetails: () => set({ isOpenAccountDetails: false }),
  setAccountDetails: (data: FullUserType | null) =>
    set({ accountDetails: data }),
});

export const useModalStore = create<State & Action>(store);
