import { create } from "zustand";
import { toast } from "react-toastify";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  updateUser: (user) => set((state) => ({ ...state, user })),
  logout: () => {
    toast.info("Logged out successfully");
    return { user: null, token: null };
  },
}));

export default useAuthStore;
