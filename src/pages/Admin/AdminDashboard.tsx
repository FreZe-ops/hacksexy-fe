import { useEffect, useMemo, useState } from "react";
import {
  LinkOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";

type DashboardStats = {
  users: number;
  links: number;
  admins: number;
};

const AdminDashboard = () => {
  const Cookie = require("js-cookie");
  const token = Cookie.get("access_token");
  const [stats, setStats] = useState<DashboardStats>({ users: 0, links: 0, admins: 0 });

  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user_info") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "*/*",
    };

    const usersUri =
      userInfo?.role === "ADMIN"
        ? `${process.env.REACT_APP_URL_API}/users`
        : `${process.env.REACT_APP_URL_API}/users/all`;

    Promise.all([
      axios.get(usersUri, { headers }).catch(() => ({ data: [] })),
      axios
        .get(`${process.env.REACT_APP_URL_API}/game-screen-links`, { headers })
        .catch(() => ({ data: [] })),
    ]).then(([usersRes, linksRes]) => {
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const links = Array.isArray(linksRes.data) ? linksRes.data : [];
      setStats({
        users: users.length,
        links: links.length,
        admins: users.filter(
          (u: { role?: string }) => u.role === "ADMIN" || u.role === "SUPERADMIN"
        ).length,
      });
    });
  }, [token, userInfo?.role]);

  const displayName = userInfo?.username || "Admin";
  const roleLabel =
    userInfo?.role === "SUPERADMIN"
      ? "Super Admin"
      : userInfo?.role === "ADMIN"
        ? "Admin"
        : "Quản trị";

  return (
    <div className="admin-dashboard">
      <section className="admin-hero">
        <div className="admin-hero__copy">
          <p className="admin-hero__eyebrow">Bảng điều khiển</p>
          <h2 className="admin-hero__title">Xin chào, {displayName}</h2>
          <p className="admin-hero__desc">
            Quản lý người dùng, xu và cấu hình link màn hình game cho trang phân tích NH.
            Vai trò hiện tại: <strong>{roleLabel}</strong>.
          </p>
        </div>
        <div className="admin-hero__badge" aria-hidden>
          <ThunderboltOutlined />
          <span>Control Center</span>
        </div>
      </section>

      <div className="admin-stat-grid">
        <article className="admin-stat-card admin-stat-card--users">
          <div className="admin-stat-card__icon">
            <TeamOutlined />
          </div>
          <div>
            <p className="admin-stat-card__label">Tổng người dùng</p>
            <p className="admin-stat-card__value">{stats.users}</p>
          </div>
        </article>
        <article className="admin-stat-card admin-stat-card--admins">
          <div className="admin-stat-card__icon">
            <UserOutlined />
          </div>
          <div>
            <p className="admin-stat-card__label">Tài khoản quản trị</p>
            <p className="admin-stat-card__value">{stats.admins}</p>
          </div>
        </article>
        <article className="admin-stat-card admin-stat-card--links">
          <div className="admin-stat-card__icon">
            <LinkOutlined />
          </div>
          <div>
            <p className="admin-stat-card__label">Link màn hình game</p>
            <p className="admin-stat-card__value">{stats.links}</p>
          </div>
        </article>
      </div>

      <section className="admin-panel admin-panel--tips">
        <h3 className="admin-panel__title">Gợi ý nhanh</h3>
        <ul className="admin-tip-list">
          <li>
            Thêm link màn hình với <code>gameId = default</code> hoặc bật &quot;Mặc định&quot; để
            fallback cho mọi bàn NH.
          </li>
          <li>
            URL iframe phải cho phép nhúng — tránh Figma, Google, Facebook (bị chặn{" "}
            <code>X-Frame-Options</code>).
          </li>
          <li>
            Mọi Admin xem và quản lý chung tất cả tài khoản User; Superadmin xem thêm cả Admin.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
