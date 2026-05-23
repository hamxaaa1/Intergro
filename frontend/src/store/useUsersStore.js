import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";

export const useUserStore = create((set)=>({
  users: null,

  getUsers: async () => {
    try {
      const res = await axiosInstance.get("/users")
      set({users: res.data.userWithTasksCount})
    } catch (error) {
      console.error(" Usersfetch failed:", error);
    }
  },
}))