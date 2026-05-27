import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function applyGameBodyBg() {
  document.body.style.backgroundColor = "#0a0000";
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundSize = "";
  document.body.style.backgroundPosition = "";
  document.body.style.backgroundRepeat = "";
  document.body.style.backgroundAttachment = "scroll";
}

function applyAdminBodyBg() {
  document.body.style.backgroundColor = "#f0f2f5";
  document.body.style.backgroundImage = "none";
  document.body.style.backgroundSize = "";
  document.body.style.backgroundPosition = "";
  document.body.style.backgroundRepeat = "";
  document.body.style.backgroundAttachment = "scroll";
}

/** Đồng bộ nền body: admin = panel trung tính; các route khác = nền video bg-tool.mp4 (ToolVideoBackground). */
export default function BodyBackgroundSync() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdmin = pathname.startsWith("/admin");
    if (isAdmin) {
      applyAdminBodyBg();
    } else {
      applyGameBodyBg();
    }
  }, [pathname]);

  return null;
}
