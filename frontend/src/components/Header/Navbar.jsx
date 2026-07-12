// // components/Navbar.jsx
// import { Link, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../store/useAuthStore";
// import { LogOut, Menu, X } from "lucide-react";
// import { useState } from "react";

// const Navbar = () => {
//   const { authUser, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const toggleMenu = () => setIsOpen(!isOpen);

//   return (
//     <nav className="navbar bg-base-100 shadow-md px-4 md:px-6 sticky top-0 z-50">
//       {/* Left side brand */}
//       <div className="flex-1">
//         <Link to="/" className="text-xl font-bold text-primary">
//           TaskFlow 🚀
//         </Link>
//       </div>

//       {/* Hamburger for small screens */}
//       <div className="flex-none md:hidden">
//         <button
//           className="btn btn-square btn-ghost"
//           onClick={toggleMenu}
//           aria-label="Toggle menu"
//         >
//           {isOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Menu for medium+ screens */}
//       <div className="hidden md:flex flex-none">
//         <ul className="menu menu-horizontal px-1 gap-2 items-center">
//           <li>
//             <Link to="/settings">Settings</Link>
//           </li>

//           {!authUser && (
//             <>
//               <li>
//                 <Link to="/login" className="btn btn-sm btn-ghost">
//                   Login
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/signup"
//                   className="btn btn-sm btn-primary text-white"
//                 >
//                   Sign Up
//                 </Link>
//               </li>
//             </>
//           )}

//           {authUser?.role === "admin" && (
//             <>
//               <li><Link to="/profile">Profile</Link></li>
//               <li><Link to="/admin/dashboard">Dashboard</Link></li>
//               <li><Link to="/admin/tasks">Manage Tasks</Link></li>
//               <li><Link to="/admin/create-task">Create Task</Link></li>
//               <li><Link to="/admin/users">Members</Link></li>
//               <li><Link to="/chat">Chat</Link></li>
//               <li><Link to="/chatbot">Chatbot</Link></li>
//             </>
//           )}

//           {authUser?.role === "user" && (
//             <>
//               <li><Link to="/profile">Profile</Link></li>
//               <li><Link to="/user/dashboard">Dashboard</Link></li>
//               <li><Link to="/user/my-tasks">My Tasks</Link></li>
//               <li><Link to="/chat">Chat</Link></li>
//               <li><Link to="/chatbot">Chatbot</Link></li>
//             </>
//           )}

//           {authUser && (
//             <li>
//               <button
//                 onClick={handleLogout}
//                 className="btn btn-sm btn-ghost flex gap-2"
//               >
//                 <LogOut size={18} /> Logout
//               </button>
//             </li>
//           )}
//         </ul>
//       </div>

//       {/* Mobile dropdown menu */}
//       {isOpen && (
//         <div className="absolute top-16 right-4 bg-base-100 shadow-lg rounded-xl p-4 w-60 z-50 md:hidden">
//           <ul className="flex flex-col gap-3">
//             <li>
//               <Link to="/settings" onClick={() => setIsOpen(false)}>Settings</Link>
//             </li>

//             {!authUser && (
//               <>
//                 <li>
//                   <Link to="/login" className="btn btn-sm btn-ghost w-full" onClick={() => setIsOpen(false)}>Login</Link>
//                 </li>
//                 <li>
//                   <Link
//                     to="/signup"
//                     className="btn btn-sm btn-primary text-white w-full"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Sign Up
//                   </Link>
//                 </li>
//               </>
//             )}

//             {authUser?.role === "admin" && (
//               <>
//                 <li><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
//                 <li><Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
//                 <li><Link to="/admin/tasks" onClick={() => setIsOpen(false)}>Manage Tasks</Link></li>
//                 <li><Link to="/admin/create-task" onClick={() => setIsOpen(false)}>Create Task</Link></li>
//                 <li><Link to="/admin/users" onClick={() => setIsOpen(false)}>Members</Link></li>
//                 <li><Link to="/chat" onClick={() => setIsOpen(false)}>Chat</Link></li>
//                 <li><Link to="/chatbot" onClick={() => setIsOpen(false)}>Chatbot</Link></li>
//               </>
//             )}

//             {authUser?.role === "user" && (
//               <>
//                 <li><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
//                 <li><Link to="/user/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
//                 <li><Link to="/user/my-tasks" onClick={() => setIsOpen(false)}>My Tasks</Link></li>
//                 <li><Link to="/chat" onClick={() => setIsOpen(false)}>Chat</Link></li>
//                 <li><Link to="/chatbot" onClick={() => setIsOpen(false)}>Chatbot</Link></li>
//               </>
//             )}

//             {authUser && (
//               <li>
//                 <button
//                   onClick={() => { handleLogout(); setIsOpen(false); }}
//                   className="btn btn-sm btn-ghost flex gap-2 w-full"
//                 >
//                   <LogOut size={18} /> Logout
//                 </button>
//               </li>
//             )}
//           </ul>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut, Menu } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 md:px-6 sticky top-0 z-50">
      {/* LEFT: Mobile menu + Brand */}
      <div className="navbar-start">
        {/* 🔽 Mobile dropdown */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <Menu size={20} />
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[60] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {authUser && (
              <li>
                <Link
                  to={
                    authUser.role === "admin"
                      ? "/admin/dashboard"
                      : "/user/dashboard"
                  }
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/settings">Settings</Link>
            </li>

            {authUser && (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="flex gap-2">
                    <LogOut size={16} /> Logout
                  </button>
                </li>
              </>
            )}

            {!authUser && (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Brand */}
        <Link to="/" className="ml-2 text-3xl font-black tracking-tight group">
          <span className="text-primary transition-all duration-300 group-hover:tracking-wide">
            In
          </span>

          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            tegro
          </span>
        </Link>
      </div>

      {/* RIGHT: Desktop menu */}
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2 items-center">
          {authUser && (
            <li>
              <Link
                to={
                  authUser.role === "admin"
                    ? "/admin/dashboard"
                    : "/user/dashboard"
                }
              >
                Dashboard
              </Link>
            </li>
          )}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>

          {!authUser && (
            <>
              <li>
                <Link to="/login" className="btn btn-sm btn-ghost">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="btn btn-sm btn-primary text-white"
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}

          {authUser && (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-ghost flex gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
