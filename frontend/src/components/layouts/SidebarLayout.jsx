import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  PlusSquare,
  Users,
  MessageSquare,
  Bot,
  Menu,
  X,
  FileText
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const SidebarLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { authUser } = useAuthStore();

  return (
    <div className="flex h-screen bg-base-100 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-3/4 sm:w-64 
        bg-base-200 border-r border-base-300 shadow-sm flex flex-col z-50 
        transform transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Close button on mobile */}
        <div className="h-16 flex items-center justify-end border-b border-base-300 px-4 lg:hidden">
          <button
            className="text-base-content"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {authUser?.role === "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link
                to="/admin/tasks"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
              >
                <ClipboardList size={18} /> Manage Tasks
              </Link>
              <Link
                to="/admin/create-task"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
              >
                <PlusSquare size={18} /> Create Task
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
              >
                <Users size={18} /> Members
              </Link>
              
            </>
          )}

          {authUser?.role === "user" && (
            <>
              <Link
                to="/user/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link
                to="/user/my-tasks"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
              >
                <ClipboardList size={18} /> My Tasks
              </Link>
            </>
          )}

          {/* Shared */}
          <Link
            to="/chat"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
          >
            <MessageSquare size={18} /> Chat
          </Link>
          <Link
            to="/chatbot"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
          >
            <Bot size={18} /> Chatbot
          </Link>
          {/* <Link
                to="/pdf-merger"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-base-300"
              >
                <FileText size={18} /> PDF Merger
              </Link> */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Topbar (mobile only) */}
        <header className="h-16 flex items-center px-4 border-b border-base-300 lg:hidden">
          <button className="text-base-content" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
          <h2 className="ml-4 font-bold text-lg">Sidebar</h2>
        </header>

        {/* Page content (scrollable) */}
        <main className="flex-1 w-full bg-base-100 p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
