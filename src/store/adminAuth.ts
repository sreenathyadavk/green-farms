// ============================================================
// Admin Auth Store
// Simple localStorage-based admin PIN session
// Password: "btw-admin-2024" (changeable via env)
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";

const ADMIN_PIN = "btw-admin-2024"; // Change this or load from env

interface AdminAuthState {
  isAuthenticated: boolean;
  login: (pin: string) => boolean;
  logout: () => void;
}

export const useAdminAuth = create<AdminAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (pin: string) => {
        if (pin === ADMIN_PIN) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
    }),
    { name: "btw-admin-session" }
  )
);
