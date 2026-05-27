import React, { useEffect, useState } from "react";
import { Button, Table, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import ModalGameScreenLink from "./ModalGameScreenLink";
import { useConfirmModal } from "../ManageUser/ModalDelete";

export interface GameScreenLinkRow {
  _id: string;
  gameId: string;
  gameName: string;
  screenUrl: string;
  isDefault: boolean;
}

const ListGameScreenLinks: React.FC = () => {
  const Cookie = require("js-cookie");
  const token = Cookie.get("access_token");
  const [rows, setRows] = useState<GameScreenLinkRow[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isShowCreate, setIsShowCreate] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [editRow, setEditRow] = useState<GameScreenLinkRow>();
  const { showConfirm, contextHolder } = useConfirmModal();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL_API}/game-screen-links`, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      })
      .then((res) => setRows(res.data ?? []))
      .catch(() => setRows([]));
  }, [refreshTrigger, token]);

  const handleDelete = (row: GameScreenLinkRow) => {
    showConfirm({
      title: "Xóa link màn hình",
      content: `Xóa cấu hình cho gameId "${row.gameId}"?`,
      onOk: async () => {
        await axios
          .delete(`${process.env.REACT_APP_URL_API}/game-screen-links/${row._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              accept: "*/*",
            },
          })
          .then((res) => {
            if (res.status === 200) {
              Swal.fire({
                icon: "success",
                title: "Đã xóa cấu hình",
                timer: 900,
                showConfirmButton: false,
                customClass: { popup: "custom-swal" },
              });
              setRefreshTrigger((prev) => prev + 1);
            }
          });
      },
    });
  };

  const columns: TableColumnsType<GameScreenLinkRow> = [
    {
      title: "Game ID",
      dataIndex: "gameId",
      render: (value: string) => <code>{value}</code>,
    },
    {
      title: "Tên game",
      dataIndex: "gameName",
      render: (value: string) => value || "—",
    },
    {
      title: "Link màn hình",
      dataIndex: "screenUrl",
      render: (value: string) => <span className="admin-url">{value}</span>,
    },
    {
      title: "Mặc định",
      dataIndex: "isDefault",
      align: "center",
      width: 120,
      render: (value: boolean) => (
        <span className={`admin-tag ${value ? "admin-tag--yes" : "admin-tag--no"}`}>
          {value ? "Có" : "Không"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      align: "center",
      width: 140,
      render: (row: GameScreenLinkRow) => (
        <div className="admin-action-group">
          <Tooltip title="Sửa link">
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setEditRow(row);
                setIsShowEdit(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa link">
            <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(row)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}

      <p className="admin-shell__hint">
        Cấu hình URL hiển thị trong khung game tại trang phân tích <code>/NH/table/:id</code>.
        Dùng gameId = <code>default</code> hoặc bật &quot;Mặc định&quot; cho link fallback.
      </p>

      <div className="admin-shell__toolbar">
        <div />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsShowCreate(true)}>
          Thêm link
        </Button>
      </div>

      <div className="admin-shell__card">
        <div className="admin-shell__card-head">
          <h3>Cấu hình đang lưu ({rows.length})</h3>
        </div>
        <div className="admin-shell__card-body">
          <div className="admin-shell__table-wrap">
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={rows}
              pagination={{ pageSize: 10, showSizeChanger: false }}
            />
          </div>
        </div>
      </div>

      <ModalGameScreenLink
        isShowCreate={isShowCreate}
        isShowEdit={isShowEdit}
        data={editRow}
        onCancel={() => {
          setIsShowCreate(false);
          setIsShowEdit(false);
          setEditRow(undefined);
        }}
        onCanEdit={() => setIsShowEdit(false)}
        onRefesh={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
};

export default ListGameScreenLinks;
