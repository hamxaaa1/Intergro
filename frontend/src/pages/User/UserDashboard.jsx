import React, { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useDashboardStore } from "../../store/useTaskStore";
import moment from "moment";
import { Link } from "react-router-dom";
import TaskPieChart from "../../components/charts/TaskPieChart";
import TaskPriorityBarChart from "../../components/charts/TaskPriorityBarChart";
import { Loader2 } from "lucide-react";
import SidebarLayout from "../../components/layouts/SidebarLayout";

const UserDashboard = () => {
  const { authUser } = useAuthStore();
  const { statistics, recentTasks, charts, fetchUserDashboardData, isLoading } =
    useDashboardStore();

  useEffect(() => {
    fetchUserDashboardData();
  }, []);

  const statColors = {
    totalTasks: "bg-gray-400",
    pendingTasks: "bg-yellow-400",
    inProgressTasks: "bg-purple-500",
    completedTasks: "bg-green-500",
  };

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

  return (
    <SidebarLayout>
      {!authUser ? null : (
        <>
          {isLoading ? (
            <div className="h-screen flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="p-6 max-w-6xl mx-auto space-y-6">

              {/* Welcome & Stats Card */}
              <div className="bg-base-100 border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome, {authUser.name}! 👋
                  </h1>
                  <p className="text-gray-500">
                    Today is {moment().format("dddd Do MMM YYYY")}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${statColors.totalTasks}`} />
                    <span>Total Tasks: {statistics.totalTasks}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${statColors.pendingTasks}`} />
                    <span>Pending: {statistics.pendingTasks}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${statColors.inProgressTasks}`} />
                    <span>In Progress: {statistics.inProgressTasks || 0}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${statColors.completedTasks}`} />
                    <span>Completed: {statistics.completedTasks}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Overdue: {statistics.overDueDateTasks || 0}</span>
                  </div>
                </div>

                {/* Charts */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-base-200 p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold mb-2">
                      Tasks by Status
                    </h2>
                    <TaskPieChart data={charts.taskDistribution} />
                  </div>

                  <div className="bg-base-200 p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold mb-2">
                      Tasks by Priority
                    </h2>
                    <TaskPriorityBarChart data={charts.taskPrioritiesLevels} />
                  </div>
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="bg-base-100 border border-gray-200 shadow-sm rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Recent Tasks</h2>
                  <Link to="/user/my-tasks" className="btn btn-sm btn-primary">
                    See All
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due Date</th>
                        <th>Created At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentTasks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center">
                            No recent tasks
                          </td>
                        </tr>
                      ) : (
                        recentTasks.map((task) => (
                          <tr key={task._id}>
                            <td>{task.title}</td>

                            <td>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}
                              >
                                {task.status}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}
                              >
                                {task.priority}
                              </span>
                            </td>

                            <td>
                              {moment(task.dueDate).format("DD MMM YYYY")}
                            </td>

                            <td>
                              {moment(task.createdAt).format("DD MMM YYYY")}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </SidebarLayout>
  );
};

export default UserDashboard;