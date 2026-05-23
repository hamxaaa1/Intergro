import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side (Form) */}
      <div className="w-full lg:w-[45%] flex items-center justify-center bg-base-100 p-6 sm:p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side (Showcase area) */}
      <div className="hidden lg:flex w-full lg:w-[55%] bg-base-200 flex-col items-center justify-center px-6 sm:px-10 relative">
        {/* Text Header */}
        <div className="mb-8 text-center max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome to Our Platform 🚀
          </h2>
          <p className="text-sm sm:text-base text-base-content/70">
            Connect, collaborate, and share knowledge with modern tools. Create
            your account today and get started!
          </p>
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="skeleton h-20 w-20 sm:h-28 sm:w-28 rounded-xl shadow-md"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
