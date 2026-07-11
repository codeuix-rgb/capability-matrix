import { create } from "zustand";

interface AppUser {
  name: string;
  email: string;
}

interface AppState {
  sidebarCollapsed: boolean;
  searchOpen: boolean;
  theme: "light" | "dark";
  user: AppUser | null;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  login: (user: AppUser) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  searchOpen: false,
  theme: "light",
  user: null,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setTheme: (theme) => set({ theme }),
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
