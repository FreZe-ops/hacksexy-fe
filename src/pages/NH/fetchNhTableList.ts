import axios from "axios";
import Cookies from "js-cookie";
import { mockApi } from "../../services/mockApi";

/** Một dòng game trong sảnh — cùng shape tối thiểu như Slot.tsx */
export type NhTableListRow = {
  _id: string;
  name: string;
  showIcon?: string;
};

/**
 * Danh sách game theo sảnh — PG/BNG dùng mockApi (có showIcon CDN), còn lại gọi API casino.
 */
export async function fetchNhTableList(roomKey: string): Promise<NhTableListRow[]> {
  if (roomKey === "PG" || roomKey === "BNG") {
    const mockRes = await mockApi.getTableList(roomKey);
    const list = Array.isArray(mockRes.data) ? mockRes.data : [];
    return list.map((it: any, idx: number) => ({
      _id: `${roomKey}-${it?.id ?? idx}`,
      name: String(it?.name ?? ""),
      showIcon: it?.showIcon,
    }));
  }

  const base = process.env.REACT_APP_URL_API_CASINO;
  if (!base) return [];

  try {
    const token = Cookies.get("access_token");
    const response = await axios.get(`${base}/NH/tableList?typeGame=${roomKey}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const raw = Array.isArray(response.data) ? response.data : [];
    return raw.map((it: any, idx: number) => ({
      _id: String(it?._id ?? it?.id ?? `${roomKey}-${idx}`),
      name: String(it?.name ?? ""),
      showIcon: it?.showIcon,
    }));
  } catch {
    return [];
  }
}
