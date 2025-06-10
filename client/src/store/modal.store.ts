import { create, type StoreApi } from "zustand";
import type { FullProductDetailsType } from "../types/product.types";
import type { FullUserType } from "../types/user.types";
import type { FullInventoryDetails } from "../types/inventory.types";

type State = {
  isOpenSidebar: boolean;
  isOpenAddCategoryForm: boolean;
  isOpenProductDetails: boolean;
  productDetails: FullProductDetailsType | null;
  isOpenAccountDetails: boolean;
  isOpenInventoryDetails: boolean;
  accountDetails: FullUserType | null;
  categoryToRemove: string | null;
  inventoryDetails: FullInventoryDetails | null;
  currentPage: "pos_page" | "proceed_to_payment" | "rate_us";
  reasonType: "";
  invoiceId: number | null;
};

type Action = {
  toggleSidebar: () => void;
  toggleCategoryForm: (bool: boolean) => void;
  toggleProductDetails: () => void;
  closeProductDetails: () => void;
  setCurrentPage: (page: "pos_page" | "proceed_to_payment" | "rate_us") => void;
  setProductDetails: (data: FullProductDetailsType | null) => void;
  toggleAccountDetails: () => void;
  closeAccountDetails: () => void;
  toggleInventoryDetails: () => void;
  closeInventoryDetails: () => void;
  setAccountDetails: (data: FullUserType | null) => void;
  setInventoryDetails: (data: FullInventoryDetails | null) => void;
  setCategoryToRemove: (category: string | null) => void;
  setInvoiceId: (invoice_id: null | number) => void;
};
const store: (
  set: StoreApi<State & Action>["setState"],
  get: StoreApi<State & Action>["getState"]
) => State & Action = (set, get) => ({
  isOpenSidebar: true,
  isOpenAddCategoryForm: false,
  isOpenProductDetails: false,
  isOpenAccountDetails: false,
  isOpenInventoryDetails: false,
  categoryToRemove: null,
  invoiceId: null,
  productDetails: null,
  accountDetails: null,
  inventoryDetails: null,
  currentPage: "rate_us",
  reasonType: "",
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
  toggleInventoryDetails: () =>
    set({ isOpenInventoryDetails: !get().isOpenInventoryDetails }),
  closeInventoryDetails: () => set({ isOpenInventoryDetails: false }),
  setInventoryDetails: (data: FullInventoryDetails | null) =>
    set({ inventoryDetails: data }),
  setCurrentPage: (page: "pos_page" | "proceed_to_payment" | "rate_us") =>
    set({ currentPage: page }),
  setCategoryToRemove: (category: string | null) =>
    set({ categoryToRemove: category }),
  setInvoiceId: (invoice_id: null | number) => set({ invoiceId: invoice_id }),
});

export const useModalStore = create<State & Action>(store);
