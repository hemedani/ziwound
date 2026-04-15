import { create } from "zustand";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  level: "Ghost" | "Manager" | "Editor" | "Ordinary";
  avatar?: {
    _id: string;
    name: string;
    mimType: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  setUser: (user) =>
    set({
      user,
      isAdmin: user
        ? ["Ghost", "Manager", "Editor"].includes(user.level)
        : false,
    }),
  setToken: (token) => set({ token, isAuthenticated: !!token }),
  logout: () => set({ user: null, token: null, isAuthenticated: false, isAdmin: false }),
}));
