// store/useReportStore.js
import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";

export const useReportStore = create((set) => ({
  isDownloading: false,

  downloadReport: async () => {
    try {
      set({ isDownloading: true });
      const res = await axiosInstance.get("/reports/export/tasks", {
        responseType: "blob", // important for files
      });

      // Create file link
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      set({ isDownloading: false });
    } catch (error) {
      console.error("Report download failed:", error);
      set({ isDownloading: false });
    }
  },
  downloadUsersReport: async () => {
    try {
      set({ isDownloading: true });

      const res = await axiosInstance.get("reports/export/users", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users_report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      set({ isDownloading: false });
    } catch (error) {
      console.error("Users Report download failed:", error);
      set({ isDownloading: false });
    }
  },

}));
