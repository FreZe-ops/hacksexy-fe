import React, { useMemo } from "react";
import { LogoutOutlined, HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./HeaderAdmin.css";

const HeaderAdmin = () => {
  const Cookies = require("js-cookie");

  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user_info") || "null");
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    window.location.href = "/login";
  };

  const username = userInfo?.username || "Admin";
  const role = userInfo?.role || "ADMIN";
  const initial = username.charAt(0).toUpperCase();
  const roleLabel =
    role === "SUPERADMIN" ? "Super Admin" : role === "ADMIN" ? "Admin" : role;

  return (
    <header className="admin-topbar" role="banner">
      <div className="admin-topbar__left">
        <Link to="/" className="admin-topbar__home" title="Về trang chủ">
          <HomeOutlined />
          <span>Trang game</span>
        </Link>
      </div>

      <div className="admin-topbar__right">
        <div className="admin-topbar__user">
          <span className="admin-topbar__avatar" aria-hidden>
            {initial}
          </span>
          <div className="admin-topbar__meta">
            <span className="admin-topbar__name">{username}</span>
            <span className="admin-topbar__role">{roleLabel}</span>
          </div>
        </div>
        <button type="button" className="admin-topbar__logout" onClick={handleLogout}>
          <LogoutOutlined />
          <span>Đăng xuất</span>
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;
