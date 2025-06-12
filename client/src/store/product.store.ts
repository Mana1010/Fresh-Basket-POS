import { create, type StoreApi } from "zustand";
import type { FullProductDetailsTypePos } from "../types/product.types";

type State = {
  orderProducts: FullProductDetailsTypePos[];
  productsMap: Map<string, FullProductDetailsTypePos>;
  lastScannedItem: FullProductDetailsTypePos | null;
};

type Action = {
  setOrderProducts: (data: FullProductDetailsTypePos) => void;
  removeOrderProduct: (id: number) => void;
  setLastScannedItem: (data: FullProductDetailsTypePos | null) => void;
  updateOrderProduct: (id: number, newData: FullProductDetailsTypePos) => void;
  clearOrderProducts: () => void;
};
const store = (
  set: StoreApi<State & Action>["setState"],
  get: StoreApi<State & Action>["getState"]
) => ({
  orderProducts: [],
  productsMap: new Map(),
  lastScannedItem: null,
  clearOrderProducts: () => set({ orderProducts: [] }),
  setOrderProducts: (data: FullProductDetailsTypePos) =>
    set({ orderProducts: [data, ...get().orderProducts] }),
  removeOrderProduct: (id: number) =>
    set({
      orderProducts: get().orderProducts.filter((product) => product.id !== id),
    }),
  updateOrderProduct: (id: number, newData: FullProductDetailsTypePos) =>
    set({
      orderProducts: get().orderProducts.map((product) => {
        if (id === product.id) {
          return newData;
        } else {
          return product;
        }
      }),
    }),
  setLastScannedItem: (data: FullProductDetailsTypePos | null) =>
    set({ lastScannedItem: data }),
});

export const useProductStore = create<State & Action>(store);
