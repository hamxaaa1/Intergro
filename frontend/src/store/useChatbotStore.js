import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";

export const useChatbotStore = create((set, get) => ({
  messages: [],
  loading: false,
  error: null,

  // ✅ Fetch chat history
  fetchChat: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.get("/chat/me");
      set({ messages: res.data.messages || [] });
    } catch (err) {
      console.error(err.response?.data || err.message);
      set({ error: "Failed to load chat history" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Send new message
  sendMessage: async (message) => {
    try {
      set({ loading: true, error: null });
      const res = await axiosInstance.post("/chat/send", { message });

      // Optimistically update messages
      set({
        messages: [
          ...get().messages,
          { content: message, role: "user" },
          { content: res.data.reply, role: "bot" },
        ],
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      set({ error: "Failed to send message" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Clear chat (optional)
  clearChat: () => set({ messages: [] }),
}));
