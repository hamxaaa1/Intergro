import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const BASE_URL =
import.meta.env.MODE === "development"
  ? "http://localhost:5000"
  : "https://intergro.onrender.com";

export const useAuthStore = create((set, get) => ({
  authUser: undefined, // ✅ IMPORTANT: undefined = loading state
  isLoggingIn: false,
  isSigningUp: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  // ✅ AUTH CHECK
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null }); // logged out
    }
  },

  // LOGIN
  login: async (formData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed!");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // REGISTER
  register: async (formData) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/register", formData);
      set({ authUser: res.data.user });
      toast.success("Account created!");
      get().connectSocket();
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed!");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      toast.success("Logged out");
      get().disconnectSocket();
    } catch (err) {
      toast.error("Logout failed!");
    } finally {
      set({ authUser: null });
    }
  },

  // SOCKET
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });

    set({ socket });

    socket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));