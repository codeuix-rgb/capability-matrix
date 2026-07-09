import { create } from "zustand";

interface AppState {
  sidebarCollapsed: boolean;
  searchOpen: boolean;
  theme: "light" | "dark";
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  searchOpen: false,
  theme: "light",
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setTheme: (theme) => set({ theme }),
}));
