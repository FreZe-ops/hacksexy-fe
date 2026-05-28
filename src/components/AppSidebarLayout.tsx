import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeSidebar from "./HomeSidebar";
import ModalConfirmLogout from "./ModalConfirmLogout";
import HackerLiveFeed from "./HackerLiveFeed";
import { getAssetUrl } from "../utils/assetUrl";
import "./AppSidebarLayout.css";

type AppSidebarLayoutProps = {
  children: React.ReactNode;
};

function shouldHideHackerFeeds(pathname: string) {
  return pathname.startsWith("/NH/table/");
}

/** Shell app — navbar trái + vùng nội dung + feeds 2 góc (mọi trang game sau login). */
export default function AppSidebarLayout({ children }: AppSidebarLayoutProps) {
  const [isShowLogout, setIsShowLogout] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const hideHackerFeeds = useMemo(() => shouldHideHackerFeeds(pathname), [pathname]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={`x88-hub ${isMobileSidebarOpen ? "is-sidebar-open" : ""}`}>
      <header
        className={`x88-hub__mobile-header ${isMobileSidebarOpen ? "is-hidden" : ""}`}
        aria-label="Thanh menu mobile"
      >
        <button
          type="button"
          className="x88-hub__hamburger"
          aria-label="Mở menu"
          aria-expanded={isMobileSidebarOpen}
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <span className="x88-hub__hamburger-lines" aria-hidden>
            <span />
            <span />
            <span />
          </span>
        </button>

        <img
          className="x88-hub__mobile-logo"
          src={getAssetUrl("/assets/logo.png")}
          alt="Slot X CORE"
          width={180}
          height={68}
          loading="eager"
          decoding="async"
        />
      </header>

      {isMobileSidebarOpen ? (
        <button
          type="button"
          className="x88-hub__drawer-backdrop"
          aria-label="Đóng menu"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      ) : null}

      <div className={`x88-hub__sidebar ${isMobileSidebarOpen ? "is-open" : ""}`}>
        <HomeSidebar
          onLogoutClick={() => {
            setIsMobileSidebarOpen(false);
            setIsShowLogout(true);
          }}
        />
      </div>

      <div className="x88-hub__body">
        {children}
        {!hideHackerFeeds ? (
          <>
            <HackerLiveFeed side="left" variant="live" />
            <HackerLiveFeed side="right" variant="terminal" />
          </>
        ) : null}
      </div>

      <ModalConfirmLogout
        isShowLogout={isShowLogout}
        setIsShowLogout={() => setIsShowLogout(false)}
      />
    </div>
  );
}
