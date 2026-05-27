import React, { useState } from "react";
import {
  DashboardOutlined,
  LinkOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import ListUser from "./ManageUser/ListUser";
import ListGameScreenLinks from "./ManageGameScreenLink/ListGameScreenLinks";
import AdminDashboard from "./AdminDashboard";
import "./AdminShell.css";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    key: "1",
    icon: <DashboardOutlined />,
    label: "Tổng quan",
  },
  {
    key: "3",
    icon: <LinkOutlined />,
    label: "Link màn hình game",
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Quản lý User",
    children: [{ key: "11", label: "Danh sách User" }],
  },
];

const PAGE_META: Record<
  string,
  { title: string; subtitle: string; breadcrumb: string[] }
> = {
  "1": {
    title: "Tổng quan",
    subtitle: "Theo dõi nhanh số liệu hệ thống và các thao tác quản trị thường dùng.",
    breadcrumb: ["Admin", "Tổng quan"],
  },
  "3": {
    title: "Link màn hình game",
    subtitle: "Cấu hình URL iframe hiển thị tại trang phân tích /NH/table/:id.",
    breadcrumb: ["Admin", "Link game"],
  },
  "11": {
    title: "Danh sách người dùng",
    subtitle: "Quản lý tài khoản, vai trò, xu và thao tác trên user.",
    breadcrumb: ["Admin", "Users", "Danh sách"],
  },
};

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

const MenuAdmin: React.FC = () => {
  const [stateOpenKeys, setStateOpenKeys] = useState(["2"]);
  const [selectedKey, setSelectedKey] = useState("1");

  const pageMeta = PAGE_META[selectedKey] ?? {
    title: "Quản trị hệ thống",
    subtitle: "Chọn chức năng từ menu bên trái.",
    breadcrumb: ["Admin"],
  };

  const onSelect: MenuProps["onSelect"] = ({ key }) => {
    setSelectedKey(key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        return <AdminDashboard />;
      case "11":
        return <ListUser />;
      case "3":
        return <ListGameScreenLinks />;
      default:
        return (
          <div className="admin-panel">
            <h3 className="admin-panel__title">Chọn chức năng</h3>
            <p style={{ margin: 0, color: "#64748b" }}>
              Dùng menu bên trái để mở module quản trị.
            </p>
          </div>
        );
    }
  };

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          .filter((_, index) => index !== repeatIndex)
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  const hideContentHead = selectedKey === "1";

  return (
    <div className="admin-shell__layout">
      <aside className="admin-shell__sidebar">
        <div className="admin-shell__brand">
          <span className="admin-shell__brand-mark">
            <SettingOutlined />
          </span>
          <div className="admin-shell__brand-copy">
            <p className="admin-shell__brand-title">Admin Console</p>
          </div>
        </div>

        <p className="admin-shell__nav-label">Điều hướng</p>
        <Menu
          mode="inline"
          theme="dark"
          className="admin-shell__menu"
          selectedKeys={[selectedKey]}
          openKeys={stateOpenKeys}
          onOpenChange={onOpenChange}
          onSelect={onSelect}
          items={items}
        />

        <div className="admin-shell__sidebar-foot">
          Quản lý người dùng, xu và cấu hình link game cho môi trường hiện tại.
        </div>
      </aside>

      <div className="admin-shell__main">
        {!hideContentHead ? (
          <div className="admin-shell__content-head">
            <ul className="admin-shell__breadcrumb">
              {pageMeta.breadcrumb.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h1 className="admin-shell__content-title">{pageMeta.title}</h1>
            <p className="admin-shell__content-sub">{pageMeta.subtitle}</p>
          </div>
        ) : null}

        <main className="admin-shell__content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default MenuAdmin;
