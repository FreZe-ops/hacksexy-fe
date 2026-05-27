import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import HomeSidebar from "./HomeSidebar";
import ModalConfirmLogout from "./ModalConfirmLogout";
import HackerLiveFeed from "./HackerLiveFeed";
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
  const { pathname } = useLocation();
  const hideHackerFeeds = useMemo(() => shouldHideHackerFeeds(pathname), [pathname]);

  return (
    <div className="x88-hub">
      <HomeSidebar onLogoutClick={() => setIsShowLogout(true)} />

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
