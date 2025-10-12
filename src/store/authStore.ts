import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),
    }),
    { name: "ag-vmm-auth-storage" }
  )
);
