// store/useThemeStore.js
import { create } from "zustand";
import { toast } from "react-toastify";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "coffee", // default theme

  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // DaisyUI
    set({ theme: newTheme });

    toast.success(`Theme changed to "${newTheme}" 🎨`); // ✅ toastify
  },
}));
