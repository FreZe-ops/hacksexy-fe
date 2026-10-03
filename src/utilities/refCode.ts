const REF_STORAGE_KEY = "ref_code";

/** Lưu ?ref=<mã admin> từ URL trước khi PrivateRoute redirect sang /login làm mất query */
export const captureRefCode = () => {
  try {
    const ref = new URLSearchParams(window.location.search).get("ref")?.trim().toLowerCase();
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
