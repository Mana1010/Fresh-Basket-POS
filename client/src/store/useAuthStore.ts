import { create, type StoreApi } from "zustand";
import { type UserType } from "../types/user.types";

type State = {
  user: UserType | null;
};

type Action = {
  setUser: (user: UserType | null) => void;
};
const store = (set: StoreApi<State & Action>["setState"]) => ({
  user: null,
  setUser: (user: UserType | null) => set({ user }),
});

export const useAuthStore = create<State & Action>(store);
