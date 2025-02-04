import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import authContext from "./AuthContext/AuthContext";

function PrivateRoutes() {
  const { authStatus, loading } = useContext(authContext);
  if (loading) {
    return null;
  }

  return authStatus ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoutes;
