import React, { useEffect } from "react";
import { useUserStore } from "../../store/useUsersStore";
import { useReportStore } from "../../store/useReportStore";
import defaultAvatar from "../../assets/avatar.png";
import { FileDown, Loader2 } from "lucide-react";
import SidebarLayout from "../../components/layouts/SidebarLayout";

const ManageUsers = () => {
  const { users, getUsers } = useUserStore();
  const { downloadUsersReport, isDownloading } = useReportStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (!users) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarLayout>
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <button
          onClick={downloadUsersReport}
          disabled={isDownloading}
          className="btn btn-primary"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Download Users Report
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex flex-col md:flex-row items-center md:items-start gap-4 p-6 border rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <img
              src={user.avatar || defaultAvatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-500">{user.email}</p>
              </div>
              <div className="flex gap-3 mt-2">
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium text-sm">
                  Pending: {user.pendingTasks}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-medium text-sm">
                  In Progress: {user.inProgressTasks}
                </span>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm">
                  Completed: {user.completedTasks}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </SidebarLayout>
  );
};

export default ManageUsers;
