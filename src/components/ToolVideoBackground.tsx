import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { getAssetUrl } from "../utils/assetUrl";
import "./ToolVideoBackground.css";

const VIDEO_SRC = "/assets/bg-tool.mp4";
const POSTER_SRC = "/assets/bg-pc.png";

export default function ToolVideoBackground() {
  const { pathname } = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => {});
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [isAdmin, pathname]);

  if (isAdmin) return null;

  return createPortal(
    <div className="tool-video-bg" aria-hidden>
      <video
        ref={videoRef}
        className="tool-video-bg__video"
        src={getAssetUrl(VIDEO_SRC)}
        poster={getAssetUrl(POSTER_SRC)}
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
