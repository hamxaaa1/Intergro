import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PrivateRoute = ({ allowedRole }) => {
  const { authUser } = useAuthStore();

  // ✅ WAIT until auth check finishes
  if (authUser === undefined) return null; // or loader

  // ❌ Not logged in
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch
  if (allowedRole && !allowedRole.includes(authUser.role)) {
    return (
      <Navigate to={`/${authUser.role}/dashboard`} replace />
    );
  }

  // ✅ Allowed
  return <Outlet />;
};

export default PrivateRoute;