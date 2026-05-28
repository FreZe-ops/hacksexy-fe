import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { getAssetUrl } from "../utils/assetUrl";
import "./ToolVideoBackground.css";

const VIDEO_SRC = "/assets/bg-tool.mp4";

export default function ToolVideoBackground() {
  const { pathname } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      video.classList.add("tool-video-bg__video--ready");
      void video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener("loadeddata", onReady, { once: true });
    }

    return () => video.removeEventListener("loadeddata", onReady);
  }, [isAdmin, pathname]);

  if (isAdmin) return null;

  return createPortal(
    <div className="tool-video-bg" aria-hidden>
      <video
        ref={videoRef}
        className="tool-video-bg__video"
        src={getAssetUrl(VIDEO_SRC)}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="tool-video-bg__overlay" />
      <div className="tool-video-bg__vignette" />
    </div>,
    document.body
  );
}
