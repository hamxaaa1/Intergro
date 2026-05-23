import React, { useEffect, useState } from "react";
import { useDashboardStore } from "../../store/useTaskStore";
import defaultAvatar from "../../assets/avatar.png";
import { Loader2, FileDown } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useReportStore } from "../../store/useReportStore";
import SidebarLayout from "../../components/layouts/SidebarLayout";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800",
};

const priorityColors = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-orange-100 text-orange-800",
  High: "bg-red-100 text-red-800",
};

const ManageTasks = () => {
  const { tasks, fetchTasks, isLoading } = useDashboardStore();
  const { downloadReport, isDownloading } = useReportStore();

  const [filter, setFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks(filter === "All" ? "" : filter);
  }, [filter]);

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manage Tasks</h1>

          <button
            onClick={downloadReport}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                Download Tasks Report
              </>
            )}
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["All", "Pending", "In Progress", "Completed", "Overdue"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded ${
                  filter === status
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* ✅ LOADER FIX (ONLY CHANGE) */}
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* TASK GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.length === 0 && (
                <p className="col-span-full text-center text-gray-500">
                  No tasks found.
                </p>
              )}

              {tasks.map((task) => {
                const totalTodos = task.todoCheckList.length;
                const completedTodos = task.completeTodoCount || 0;
                const progress = totalTodos
                  ? (completedTodos / totalTodos) * 100
                  : 0;

                return (
                  <div
                    key={task._id}
                    className="bg-base-100 border rounded-xl shadow-sm p-4 flex flex-col gap-3 cursor-pointer hover:shadow-lg transition"
                    onClick={() =>
                      navigate("/admin/create-task", {
                        state: { taskId: task._id },
                      })
                    }
                  >
                    {/* Status & Priority */}
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}
                      >
                        {task.status}
                      </span>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {/* Title */}
                    <div>
                      <h2 className="font-semibold text-lg">{task.title}</h2>
                      <p className="text-gray-500 text-sm">
                        {task.description}
                      </p>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-3 rounded-full"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {completedTodos} / {totalTodos} completed
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        {moment(task.createdAt).format("DD MMM YYYY")}
                      </span>
                      <span>
                        {moment(task.dueDate).format("DD MMM YYYY")}
                      </span>
                    </div>

                    {/* Users */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex -space-x-2">
                        {task.assignedTo.map((user) => (
                          <div key={user._id} className="relative group">
                            <img
                              src={user.avatar || defaultAvatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full border-2 border-base-100 cursor-pointer"
                            />

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-base-100 border border-base-300 rounded-lg shadow-lg p-2 text-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                              <div className="flex items-center gap-2">
                                <img
                                  src={user.avatar || defaultAvatar}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className="font-semibold text-base-content">
                                    {user.name}
                                  </p>
                                  <p className="text-base-content/60 text-xs">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {task.attachments?.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLinks(task.attachments);
                            setIsModalOpen(true);
                          }}
                          className="btn btn-xs btn-outline btn-primary"
                        >
                          📎 {task.attachments.length} Attachments
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* MODAL (UNCHANGED) */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Attachments</h3>

              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {selectedLinks.map((link, idx) => {
                  const name = link.split("/").pop();

                  return (
                    <a
                      key={idx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline btn-primary justify-start"
                    >
                      🔗 {name || `Attachment ${idx + 1}`}
                    </a>
                  );
                })}
              </div>

              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div
              className="modal-backdrop"
              onClick={() => setIsModalOpen(false)}
            />
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ManageTasks;