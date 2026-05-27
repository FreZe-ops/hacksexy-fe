import { useEffect, useState } from "react";
import {
  installDevToolsGuard,
  isDevToolsGuardEnabled,
} from "../utils/devToolsGuard";
import "./DevToolsGuard.css";

export default function DevToolsGuard() {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!isDevToolsGuardEnabled()) return;
    return installDevToolsGuard(() => setBlocked(true));
  }, []);

  if (!blocked || !isDevToolsGuardEnabled()) return null;

  return (
    <div className="devtools-guard-overlay" role="alert">
      <div className="devtools-guard-panel">
        <h1>Truy cập bị từ chối</h1>
        <p>Công cụ developer không được phép trên trang này.</p>
        <button type="button" onClick={() => window.location.reload()}>
          Tải lại trang
        </button>
      </div>
    </div>
  );
}
