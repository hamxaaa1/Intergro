import React, { useEffect, useState } from "react";
import { useDashboardStore } from "../../store/useTaskStore";
import { useUserStore } from "../../store/useUsersStore";
import { useAuthStore } from "../../store/useAuthStore";
import defaultAvatar from "../../assets/avatar.png";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import SidebarLayout from "../../components/layouts/SidebarLayout";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.state?.taskId;

  const { createTask, updateTask, updateTaskCheckList, deleteTask, tasks } = useDashboardStore();
  const { authUser } = useAuthStore();
  const { users, getUsers } = useUserStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [todoCheckList, setTodoCheckList] = useState([{ text: "", completed: false }]);
  const [attachments, setAttachments] = useState([{ url: "" }]);
  const [status, setStatus] = useState("Pending");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false); // modal for delete
  const [deleteTarget, setDeleteTarget] = useState(null); // "task" or attachment index

  const isAdmin = authUser?.role === "admin";

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (taskId && tasks.length) {
      const task = tasks.find((t) => t._id === taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setDueDate(moment(task.dueDate).format("YYYY-MM-DD"));
        setAssignedTo(task.assignedTo.map((u) => u._id));
        setTodoCheckList(task.todoCheckList);
        setAttachments(task.attachments?.map((a) => ({ url: a })) || []);
        setStatus(task.status);
      }
    }
  }, [taskId, tasks]);

  const toggleUserSelection = (userId) => {
    setAssignedTo((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleTodoChange = (index, value) => {
    const newList = [...todoCheckList];
    newList[index].text = value;
    setTodoCheckList(newList);
  };

  const toggleTodoCompleted = async (index) => {
    const newList = [...todoCheckList];
    newList[index].completed = !newList[index].completed;
    setTodoCheckList(newList);

    if (!isAdmin && taskId) {
      await updateTaskCheckList(taskId, newList);
    }
  };

  const addTodoItem = () =>
    setTodoCheckList([...todoCheckList, { text: "", completed: false }]);

  const removeTodoItem = (index) =>
    setTodoCheckList(todoCheckList.filter((_, i) => i !== index));

  const handleAttachmentChange = (index, value) => {
    const newList = [...attachments];
    newList[index].url = value;
    setAttachments(newList);
  };

  const addAttachment = () => setAttachments([...attachments, { url: "" }]);

  const removeAttachment = (index) => {
    setDeleteTarget({ type: "attachment", index });
    setConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    if (deleteTarget?.type === "task" && taskId) {
      await deleteTask(taskId);
      navigate("/admin/dashboard");
    } else if (deleteTarget?.type === "attachment") {
      setAttachments(attachments.filter((_, i) => i !== deleteTarget.index));
    }
    setConfirmDelete(false);
    setDeleteTarget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title,
        description,
        priority,
        dueDate,
        assignedTo,
        todoCheckList,
        attachments: attachments.map((a) => a.url),
        status,
      };

      if (taskId) {
        if (isAdmin) {
          await updateTask(taskId, taskData);
        }
      } else {
        await createTask(taskData);
        setTitle("");
        setDescription("");
        setPriority("Medium");
        setDueDate("");
        setAssignedTo([]);
        setTodoCheckList([{ text: "", completed: false }]);
        setAttachments([{ url: "" }]);
        setStatus("Pending");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <SidebarLayout>
    <div className="max-w-3xl mx-auto p-6 bg-base-100 shadow-sm rounded-xl relative">
      <h1 className="text-2xl font-bold mb-4">
        {taskId ? "Update Task" : "Create New Task"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Admin-only fields */}
        {isAdmin && (
          <>
            {/* Title + Description */}
            <div>
              <label className="block mb-1 font-semibold">Title</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Description</label>
              <textarea
                className="textarea textarea-bordered w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Priority + Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold">Priority</label>
                <select
                  className="select select-bordered w-full"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Due Date</label>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 font-semibold">Status</label>
              <select
                className="select select-bordered w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>

            {/* Assign Members */}
            <div>
              <label className="block mb-1 font-semibold">Assigned To</label>
              <button
                type="button"
                className="btn btn-sm btn-outline mb-2"
                onClick={() => setIsModalOpen(true)}
              >
                Add Members
              </button>
              <div className="flex flex-wrap gap-2">
                {assignedTo.map((id) => {
                  const user = users?.find((u) => u._id === id);
                  return user ? (
                    <span
                      key={id}
                      className="px-3 py-1 rounded-full bg-blue-500 text-white"
                    >
                      {user.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </>
        )}

        {/* Todos */}
        <div>
          <label className="block mb-1 font-semibold">Todo Checklist</label>
          {todoCheckList.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              {isAdmin ? (
                <>
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    placeholder={`Todo #${index + 1}`}
                    value={item.text}
                    onChange={(e) => handleTodoChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeTodoItem(index)}
                    className="btn btn-sm btn-error"
                  >
                    X
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleTodoCompleted(index)}
                  />
                  <span className={`flex-1 ${item.completed ? "line-through" : ""}`}>
                    {item.text}
                  </span>
                </>
              )}
            </div>
          ))}
          {isAdmin && (
            <button
              type="button"
              onClick={addTodoItem}
              className="btn btn-sm btn-primary mt-2"
            >
              + Add Todo
            </button>
          )}
        </div>

        {/* Attachments */}
        {isAdmin && (
          <div>
            <label className="block mb-1 font-semibold">Attachments (URLs)</label>
            {attachments.map((att, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Attachment URL"
                  className="input input-bordered flex-1"
                  value={att.url}
                  onChange={(e) => handleAttachmentChange(index, e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-error"
                  onClick={() => removeAttachment(index)}
                >
                  X
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addAttachment}
              className="btn btn-sm btn-primary mt-2"
            >
              + Add Attachment
            </button>
          </div>
        )}

        {/* Submit + Delete Task */}
        {isAdmin && (
          <div className="flex justify-between gap-2">
            <button type="submit" className="btn btn-primary flex-1">
              {taskId ? "Update Task" : "Create Task"}
            </button>
            {taskId && (
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget({ type: "task" });
                  setConfirmDelete(true);
                }}
                className="btn btn-error flex-1"
              >
                Delete Task
              </button>
            )}
          </div>
        )}
      </form>

      {/* Assign Users Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Select Users</h2>
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {users?.map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={assignedTo.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                  />
                  <img
                    src={user.avatar || defaultAvatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </label>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-base-100 p-6 rounded-xl max-w-md w-full text-center">
            <h2 className="text-lg font-bold mb-4">
              {deleteTarget?.type === "task"
                ? "Are you sure you want to delete this task?"
                : "Are you sure you want to delete this attachment?"}
            </h2>
            <div className="flex justify-center gap-2">
              <button
                className="btn btn-sm btn-error"
                onClick={handleDeleteConfirmed}
              >
                Yes, Delete
              </button>
              <button
                className="btn btn-sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </SidebarLayout>
  );
};

export default CreateTask;
