const REF_STORAGE_KEY = "ref_code";

/** Chấp nhận cả "dokey" lẫn "ref=dokey" */
export const normalizeRefCode = (raw: string | null | undefined): string =>
  String(raw ?? "")
    .trim()
    .replace(/^ref=/i, "")
    .trim()
    .toLowerCase();

/** Lưu ?ref=<mã admin> từ URL trước khi PrivateRoute redirect sang /login làm mất query */
export const captureRefCode = () => {
  try {
    const ref = normalizeRefCode(new URLSearchParams(window.location.search).get("ref"));
    if (ref) localStorage.setItem(REF_STORAGE_KEY, ref);
  } catch {}
};

export const getRefCode = (): string => {
  try {
    return localStorage.getItem(REF_STORAGE_KEY) || "";
  } catch {
    return "";
  }
};
