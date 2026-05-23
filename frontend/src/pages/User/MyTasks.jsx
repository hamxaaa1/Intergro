import React, { useEffect, useState } from "react";
import { useDashboardStore } from "../../store/useTaskStore";
import defaultAvatar from "../../assets/avatar.png";
import { Loader2 } from "lucide-react";
import moment from "moment";
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

const MyTasks = () => {
  const { tasks, fetchTasks, updateTaskCheckList, isLoading } =
    useDashboardStore();

  const [filter, setFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLinks, setSelectedLinks] = useState([]);

  useEffect(() => {
    fetchTasks(filter === "All" ? "" : filter);
  }, [filter, fetchTasks]);

  const handleTodoToggle = async (taskId, index) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    const updatedTodos = task.todoCheckList.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );

    useDashboardStore.setState((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === taskId
          ? { ...t, todoCheckList: updatedTodos }
          : t
      ),
    }));

    try {
      await updateTaskCheckList(taskId, updatedTodos);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-4">

        <h1 className="text-2xl font-bold">My Tasks</h1>

        {/* FILTERS */}
        <div className="flex gap-2 flex-wrap">
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

        {/* LOADER FIXED HERE */}
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {tasks.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No tasks found.
              </p>
            ) : (
              tasks.map((task) => {
                const total = task.todoCheckList.length;
                const completed = task.todoCheckList.filter(t => t.completed).length;
                const progress = total ? (completed / total) * 100 : 0;

                return (
                  <div
                    key={task._id}
                    className="bg-base-100 border rounded-xl shadow-sm p-4 flex flex-col gap-3"
                  >

                    {/* STATUS + PRIORITY */}
                    <div className="flex justify-between">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* TITLE */}
                    <div>
                      <h2 className="font-semibold text-lg">{task.title}</h2>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>

                    {/* TODO LIST */}
                    <div className="space-y-1">
                      {task.todoCheckList.map((todo, i) => (
                        <label key={i} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={todo.completed}
                            onChange={() => handleTodoToggle(task._id, i)}
                          />
                          <span className={todo.completed ? "line-through text-gray-400" : ""}>
                            {todo.text}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* PROGRESS */}
                    <progress
                      className="progress progress-primary w-full"
                      value={progress}
                      max="100"
                    />

                    {/* DATES */}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{moment(task.createdAt).format("DD MMM YYYY")}</span>
                      <span>{moment(task.dueDate).format("DD MMM YYYY")}</span>
                    </div>

                    {/* USERS + ATTACHMENTS */}
                    <div className="flex justify-between items-center">

                      <div className="flex -space-x-2">
                        {task.assignedTo.map((user) => (
                          <div key={user._id} className="relative group">
                            <img
                              src={user.avatar || defaultAvatar}
                              className="w-8 h-8 rounded-full border-2 border-base-100"
                            />

                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-base-100 border rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition z-50">
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
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
                          📎 {task.attachments.length}
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* MODAL */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Attachments</h3>

              <div className="flex flex-col gap-2">
                {selectedLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline btn-primary justify-start"
                  >
                    🔗 Open Attachment {i + 1}
                  </a>
                ))}
              </div>

              <div className="modal-action">
                <button className="btn" onClick={() => setIsModalOpen(false)}>
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

export default MyTasks;