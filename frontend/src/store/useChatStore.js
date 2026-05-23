import { create } from "zustand";
import {toast} from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const formData = new FormData();
      formData.append("text", messageData.text);
      if (messageData.image) {
        formData.append("image", messageData.image); // must match multer field name
      }
  
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
  
    const socket = useAuthStore.getState().socket;
  
    // New message listener
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
  
      set({
        messages: [...get().messages, newMessage],
      });
    });
  
    // Deleted single message
    socket.on("messageDeleted", ({ messageId }) => {
      set({
        messages: get().messages.filter((msg) => msg._id !== messageId),
      });
    });
  
    // Deleted multiple messages
    socket.on("messagesDeleted", ({ ids }) => {
      set({
        messages: get().messages.filter((msg) => !ids.includes(msg._id)),
      });
    });
  },
  

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("messagesDeleted");
  },
  

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      toast.success("Message deleted");
      // ❌ no local set() here, socket will update
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete message");
    }
  },
  
  deleteMultipleMessages: async (ids) => {
    try {
      await axiosInstance.post(`/messages/deleteMany`, { ids });
      toast.success("Messages deleted");
      // ❌ no local set() here, socket will update
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete messages");
    }
  },
  
  
}));