import { create, type StoreApi } from "zustand";

type State = {
  isOpenSidebar: boolean;
};

type Action = {
  toggleSidebar: () => void;
};
const store = (
  set: StoreApi<State & Action>["setState"],
  get: StoreApi<State & Action>["getState"]
) => ({
  isOpenSidebar: true,
  toggleSidebar: () => set({ isOpenSidebar: !get().isOpenSidebar }),
});

export const useModalStore = create<State & Action>(store);
