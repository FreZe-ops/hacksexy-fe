import React, { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AppSidebarLayout from "./AppSidebarLayout";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const Cookies = require("js-cookie");
  const token = Cookies.get("access_token");
  const location = useLocation();

  const userInfoString = localStorage.getItem("user_info");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const role = userInfo?.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (location.pathname.startsWith("/admin") && role === "USER") {
    return <Navigate to="/" replace />;
  }

  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return <AppSidebarLayout>{children}</AppSidebarLayout>;
};

export default PrivateRoute;
