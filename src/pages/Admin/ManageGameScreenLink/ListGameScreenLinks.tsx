import React, { useEffect, useMemo, useState } from "react";
import { Button, Select, Table, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import { CopyOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";
import ModalGameScreenLink from "./ModalGameScreenLink";
import { useConfirmModal } from "../ManageUser/ModalDelete";

export interface LinkOwner {
  _id: string;
  username: string;
  refCode?: string;
}

export interface GameScreenLinkRow {
  _id: string;
  gameId: string;
  gameName: string;
  screenUrl: string;
  isDefault: boolean;
  ownerId?: LinkOwner | null;
}

export const OWNER_FILTER_ALL = "__all__";
export const OWNER_GLOBAL = "";

export const buildRefLink = (refCode?: string) =>
  refCode ? `${window.location.origin}/login?ref=${encodeURIComponent(refCode)}` : "";

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    Swal.fire({
      icon: "success",
      title: "Đã copy link",
      timer: 800,
      showConfirmButton: false,
      customClass: { popup: "custom-swal" },
    });
  } catch {
    window.prompt("Copy link:", text);
  }
};

const ListGameScreenLinks: React.FC = () => {
  const Cookie = require("js-cookie");
  const token = Cookie.get("access_token");
  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user_info") || "null");
    } catch {
      return null;
    }
  }, []);
  const isSuperAdmin = userInfo?.role === "SUPERADMIN";

  const [rows, setRows] = useState<GameScreenLinkRow[]>([]);
  const [admins, setAdmins] = useState<LinkOwner[]>([]);
  const [myRefCode, setMyRefCode] = useState("");
  const [ownerFilter, setOwnerFilter] = useState<string>(OWNER_FILTER_ALL);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isShowCreate, setIsShowCreate] = useState(false);
  const [isShowEdit, setIsShowEdit] = useState(false);
  const [editRow, setEditRow] = useState<GameScreenLinkRow>();
  const { showConfirm, contextHolder } = useConfirmModal();

  const authHeaders = useMemo(
    () => ({ Authorization: `Bearer ${token}`, accept: "*/*" }),
    [token]
  );

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL_API}/game-screen-links`, { headers: authHeaders })
      .then((res) => setRows(res.data ?? []))
      .catch(() => setRows([]));
  }, [refreshTrigger, authHeaders]);

  useEffect(() => {
    if (isSuperAdmin) {
      axios
        .get(`${process.env.REACT_APP_URL_API}/users/all`, { headers: authHeaders })
        .then((res) =>
          setAdmins(
            (res.data ?? [])
              .filter((u: { role: string }) => u.role === "ADMIN")
              .map((u: LinkOwner) => ({ _id: u._id, username: u.username, refCode: u.refCode }))
          )
        )
        .catch(() => setAdmins([]));
    } else {
      axios
        .get(`${process.env.REACT_APP_URL_API}/users/current`, { headers: authHeaders })
        .then((res) => setMyRefCode(String(res.data?.refCode ?? "")))
        .catch(() => setMyRefCode(""));
    }
  }, [isSuperAdmin, authHeaders]);

  const visibleRows = useMemo(() => {
    if (!isSuperAdmin || ownerFilter === OWNER_FILTER_ALL) return rows;
    return rows.filter((row) => (row.ownerId?._id ?? OWNER_GLOBAL) === ownerFilter);
  }, [rows, ownerFilter, isSuperAdmin]);

  const handleDelete = (row: GameScreenLinkRow) => {
    showConfirm({
      title: "Xóa link màn hình",
      content: `Xóa cấu hình cho gameId "${row.gameId}"?`,
      onOk: async () => {
        await axios
          .delete(`${process.env.REACT_APP_URL_API}/game-screen-links/${row._id}`, {
            headers: authHeaders,
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
    ...(isSuperAdmin
      ? [
          {
            title: "Thuộc admin",
            dataIndex: "ownerId",
            width: 160,
            render: (owner: LinkOwner | null | undefined) =>
              owner ? (
                <strong>{owner.username}</strong>
              ) : (
                <span className="admin-tag admin-tag--super">Link chung</span>
              ),
          },
        ]
      : []),
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

  const myRefLink = buildRefLink(myRefCode);

  return (
    <div>
      {contextHolder}

      <p className="admin-shell__hint">
        Cấu hình URL hiển thị trong khung game tại trang phân tích <code>/NH/table/:id</code>.
        Mỗi admin có bộ link riêng; user thuộc admin nào sẽ thấy link của admin đó. Thứ tự ưu tiên:
        link đúng game của admin → link mặc định của admin → link chung đúng game → link chung mặc định.
      </p>

      {!isSuperAdmin && myRefLink ? (
        <div className="admin-shell__card" style={{ marginBottom: 16 }}>
          <div className="admin-shell__card-head">
            <h3>Link giới thiệu của bạn</h3>
          </div>
          <div
            className="admin-shell__card-body"
            style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
          >
            <span className="admin-url" style={{ flex: 1, minWidth: 0 }}>
              {myRefLink}
            </span>
            <Button icon={<CopyOutlined />} onClick={() => void copyText(myRefLink)}>
              Copy
            </Button>
          </div>
        </div>
      ) : null}

      <div className="admin-shell__toolbar">
        {isSuperAdmin ? (
          <Select
            style={{ minWidth: 220 }}
            value={ownerFilter}
            onChange={setOwnerFilter}
            options={[
              { value: OWNER_FILTER_ALL, label: "Tất cả admin" },
              { value: OWNER_GLOBAL, label: "Link chung (superadmin)" },
              ...admins.map((a) => ({ value: a._id, label: a.username })),
            ]}
          />
        ) : (
          <div />
        )}
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsShowCreate(true)}>
          Thêm link
        </Button>
      </div>

      <div className="admin-shell__card">
        <div className="admin-shell__card-head">
          <h3>Cấu hình đang lưu ({visibleRows.length})</h3>
        </div>
        <div className="admin-shell__card-body">
          <div className="admin-shell__table-wrap">
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={visibleRows}
              pagination={{ pageSize: 10, showSizeChanger: false }}
            />
          </div>
        </div>
      </div>

      <ModalGameScreenLink
        isShowCreate={isShowCreate}
        isShowEdit={isShowEdit}
        data={editRow}
        isSuperAdmin={isSuperAdmin}
        admins={admins}
        defaultOwnerId={ownerFilter === OWNER_FILTER_ALL ? OWNER_GLOBAL : ownerFilter}
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
