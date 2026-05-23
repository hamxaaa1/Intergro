import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify"; // ✅ import toast

export const useDashboardStore = create((set, get) => ({
  statistics: { totalTasks: 0, pendingTasks: 0, completedTasks: 0, InProgressTasks: 0, overDueDateTasks: 0 },
  charts: { taskDistribution: { All: 0, Pending: 0, "In Progress": 0, Completed: 0, Overdue: 0 }, taskPrioritiesLevels: { Low: 0, Medium: 0, High: 0 } },
  recentTasks: [],
  tasks: [],
  statusSummary: { all: 0, pendingTask: 0, inProgressTask: 0, completedTask: 0 },
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/tasks/dashboard-data");
      const taskDistribution = {
        Pending: res.data.charts.taskDistribution.Pending || 0,
        "In Progress": res.data.charts.taskDistribution.InProgress || 0,
        Completed: res.data.charts.taskDistribution.Completed || 0,
        Overdue: res.data.statistics.overDueDateTasks || 0,
        All: res.data.charts.taskDistribution.All || 0,
      };
      set({ statistics: res.data.statistics, charts: { taskDistribution, taskPrioritiesLevels: res.data.charts.taskPrioritiesLevels }, recentTasks: res.data.recentTasks });
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || err.message); // ✅ toast
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/tasks/user-dashboard-data");
      const taskDistribution = {
        Pending: res.data.charts.taskDistribution.Pending || 0,
        "In Progress": res.data.charts.taskDistribution["In Progress"] || 0,
        Completed: res.data.charts.taskDistribution.Completed || 0,
        Overdue: res.data.statistics.overDueDateTasks || 0,
        All: res.data.charts.taskDistribution.All || 0,
      };
      set({ statistics: res.data.statistics, charts: { taskDistribution, taskPrioritiesLevels: res.data.charts.taskPrioritiesLevels }, recentTasks: res.data.recentTasks });
    } catch (err) {
      console.error("User dashboard fetch failed:", err);
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || err.message); // ✅ toast
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post("/tasks", taskData);
      await get().fetchDashboardData();
      toast.success("Task created successfully!"); // ✅ toast
      return res.data;
    } catch (err) {
      console.error("Create task failed:", err);
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || err.message); // ✅ toast
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTask: async (taskId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      set((state) => ({ tasks: state.tasks.filter((task) => task._id !== taskId), recentTasks: state.recentTasks.filter((task) => task._id !== taskId) }));
      await get().fetchDashboardData();
      toast.success("Task deleted successfully!"); // ✅ toast
      return true;
    } catch (err) {
      console.error("Delete task failed:", err);
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || err.message); // ✅ toast
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/tasks/${taskId}/status`, { status });
      set((state) => ({ recentTasks: state.recentTasks.map((task) => task._id === taskId ? res.data.task : task) }));
      toast.success("Task status updated!"); // ✅ toast
      return res.data.task;
    } catch (err) {
      console.error("Update task status failed:", err);
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || err.message); // ✅ toast
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaskCheckList: async (taskId, todoCheckList) => {
    try {
      const res = await axiosInstance.put(`/tasks/${taskId}/todo`, { todoCheckList });
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? res.data.task : t)),
        recentTasks: state.recentTasks.map((t) => (t._id === taskId ? res.data.task : t)),
      }));
      toast.success("Checklist updated!"); // ✅ toast
      return res.data.task;
    } catch (err) {
      console.error("Update checklist failed:", err);
      toast.error(err.response?.data?.message || err.message); // ✅ toast
      throw err;
    }
  },

  updateTask: async (taskId, updateTask) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/tasks/${taskId}/`, updateTask);
      set((state) => ({ recentTasks: state.recentTasks.map((task) => task._id === taskId ? res.data.task : task) }));
      toast.success("Task updated successfully!"); // ✅ toast
      return res.data.task;
    } catch (err) {
      console.error("Update task failed:", err);
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || err.message); // ✅ toast
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTasks: async (status = "") => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/tasks${status ? "?status=" + status : ""}`);
      set({ tasks: res.data.tasks, statusSummary: res.data.statusSummary });
    } catch (err) {
      console.error("Fetch tasks failed:", err);
      set({ error: err.response?.data?.message || err.message });
      toast.error(err.response?.data?.message || err.message); // ✅ toast
    } finally {
      set({ isLoading: false });
    }
  },
}));
