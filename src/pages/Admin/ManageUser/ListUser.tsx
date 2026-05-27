import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Table, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ModalUser from "./ModalUser";
import { useConfirmModal } from "./ModalDelete";
import Swal from "sweetalert2";
import ModalAppCoin from "./ModalAppCoin";

export interface DataType {
  _id: string;
  username: string;
  phone: string;
  role: string;
  coins: number;
}

function roleTagClass(role: string) {
  if (role === "SUPERADMIN") return "admin-tag admin-tag--super";
  if (role === "ADMIN") return "admin-tag admin-tag--admin";
  return "admin-tag admin-tag--user";
}

function roleLabel(role: string) {
  if (role === "SUPERADMIN") return "Super Admin";
  if (role === "ADMIN") return "Admin";
  return "User";
}

const ListUser: React.FC = () => {
  const [dataUser, setDataUser] = useState<DataType[]>([]);
  const [isShowCreate, setIsShowCreate] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const Cookie = require("js-cookie");
  const token = Cookie.get("access_token");
  const [dataEdit, setDataEdit] = useState<DataType>();
  const [isShowAppCoin, setIsShowAppCoin] = useState(false);
  const [idUser, setIdUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { showConfirm, contextHolder } = useConfirmModal();

  const handleDelete = (user: DataType) => {
    showConfirm({
      title: "Xoá người dùng",
      content: `Bạn có chắc muốn xoá người dùng ${user.username} không?`,
      onOk: async () => {
        await axios
          .delete(`${process.env.REACT_APP_URL_API}/users/${user._id}`, {
            headers: {
              Authorization: `Bearer ${token} `,
              accept: "*/*",
            },
          })
          .then((data) => {
            if (data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Xoá tài khoản thành công",
                timer: 1000,
                showConfirmButton: false,
                customClass: { popup: "custom-swal" },
              });
              setRefreshTrigger((prev) => prev + 1);
            }
          })
          .catch((err) => err);
      },
    });
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Tài khoản",
      dataIndex: "username",
      render: (value: string) => <strong>{value}</strong>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      align: "center",
      render: (value: string) => (
        <span className={roleTagClass(value)}>{roleLabel(value)}</span>
      ),
    },
    {
      title: "Số điện thoại",
      align: "center",
      render: () => "****",
    },
    {
      title: "Xu",
      dataIndex: "coins",
      align: "center",
      render: (value: number) => (
        <span className="admin-coins">{value?.toLocaleString("vi-VN") ?? 0}</span>
      ),
    },
    {
      title: "Thao tác",
      align: "center",
      width: 180,
      render: (data: DataType) => (
        <div className="admin-action-group">
          <Tooltip title="Cộng / trừ xu">
            <Button
              type="primary"
              ghost
              icon={<WalletOutlined />}
              onClick={() => {
                setIsShowAppCoin(true);
                setIdUser(data._id);
              }}
            />
          </Tooltip>
          <Tooltip title="Sửa user">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsShowEdit(true);
                setDataEdit(data);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa user">
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(data)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const userInfoRaw = localStorage.getItem("user_info");
    const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
    const uriUserList =
      userInfo?.role === "ADMIN"
        ? `${process.env.REACT_APP_URL_API}/users`
        : `${process.env.REACT_APP_URL_API}/users/all`;

    const fetchData = async () => {
      try {
        const response = await axios.get(uriUserList, {
          headers: {
            Authorization: `Bearer ${token} `,
            accept: "*/*",
          },
        });
        const sortedData = response.data.sort((a: DataType, b: DataType) =>
          b._id.localeCompare(a._id)
        );
        setDataUser(sortedData);
      } catch (err) {
        return err;
      }
    };

    fetchData();
  }, [token, refreshTrigger]);

  const filteredUsers = useMemo(() => {
    return dataUser.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, dataUser]);

  return (
    <div>
      {contextHolder}

      <div className="admin-shell__toolbar">
        <Input
          allowClear
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Tìm theo tên người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsShowCreate(true)}>
          Tạo user mới
        </Button>
      </div>

      <div className="admin-shell__card">
        <div className="admin-shell__card-head">
          <h3>Danh sách ({filteredUsers.length})</h3>
        </div>
        <div className="admin-shell__card-body">
          <div className="admin-shell__table-wrap">
            <Table<DataType>
              rowKey="_id"
              columns={columns}
              dataSource={filteredUsers}
              pagination={{ pageSize: 10, showSizeChanger: false }}
            />
          </div>
        </div>
      </div>

      <ModalUser
        isShowCreate={isShowCreate}
        isShowEdit={isShowEdit}
        onCanEdit={() => setIsShowEdit(false)}
        onCancel={() => setIsShowCreate(false)}
        onRefesh={() => setRefreshTrigger((pev) => pev + 1)}
        data={dataEdit}
      />
      <ModalAppCoin
        id={idUser}
        isShowCoin={isShowAppCoin}
        onCanCoin={() => setIsShowAppCoin(false)}
        onRefesh={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
};

export default ListUser;
