import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTasksDetails from "./pages/User/ViewTasksDetails";
import Settings from "./components/Settings";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProfileEditPage from "./pages/Profile/ProfileEditPage";
import PdfMerger from "./pages/PdfMerger/PdfMerger";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Loader2 } from "lucide-react";
import Navbar from "./components/Header/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Chat/Home";
import Chatbot from "./pages/Chatbot/Chatbot";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (authUser === undefined) {
      checkAuth();
    }
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div data-theme={theme} className="min-h-screen flex flex-col">
      <Router>
        <Navbar />

        {/* Toast container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
          style={{ marginTop: "55px" }}
        />

        {/* Main content flex-1 ensures footer sticks to bottom */}
        <div className="flex-1">
          <Routes>
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/login"
              element={
                authUser ? (
                  <Navigate to={`/${authUser.role}/dashboard`} />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/signup"
              element={
                authUser ? (
                  <Navigate to={`/${authUser.role}/dashboard`} />
                ) : (
                  <SignUp />
                )
              }
            />
            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRole={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>
            {/* User Routes */}
            <Route element={<PrivateRoute allowedRole={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/my-tasks" element={<MyTasks />} />
              <Route
                path="/user/task-details/:id"
                element={<ViewTasksDetails />}
              />
            </Route>
            <Route element={<PrivateRoute allowedRole={["admin", "user"]} />}>
              <Route path="/pdf-merger" element={<PdfMerger />} />
            </Route>
            {/* Profile Routes */}
            <Route element={<PrivateRoute allowedRole={["user", "admin"]} />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<ProfileEditPage />} />
            </Route>

            {/* Chat Route */}
            <Route element={<PrivateRoute allowedRole={["user", "admin"]} />}>
              <Route path="/chat" element={<Home />} />
            </Route>

            <Route element={<PrivateRoute allowedRole={["user", "admin"]} />}>
              <Route path="/chatbot" element={<Chatbot />} />
            </Route>
          </Routes>
        </div>

        {/* Footer always at bottom */}
        {/* <Footer /> */}
      </Router>
    </div>
  );
};

export default App;
