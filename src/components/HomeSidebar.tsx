import React, { useEffect, useMemo, useState } from "react";
import { getUserProfile } from "../utilities/axios.utilities";
import { getAssetUrl } from "../utils/assetUrl";
import "./HomeSidebar.css";

const VIP_THRESHOLD = 1_000_000;

interface HomeSidebarProps {
  onLogoutClick: () => void;
}

function formatToken(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return "0";
  return n.toLocaleString("vi-VN");
}

const HomeSidebar: React.FC<HomeSidebarProps> = ({ onLogoutClick }) => {
  const userInfoString = localStorage.getItem("user_info");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUserProfile(data);
        let prev: Record<string, unknown> = {};
        try {
          prev = JSON.parse(localStorage.getItem("user_info") || "{}");
        } catch {
          prev = {};
        }
        localStorage.setItem(
          "user_info",
          JSON.stringify({
            ...prev,
            userName: data.username,
            coins: data.coins,
            role: data.role,
            id: data._id ?? prev.id,
          })
        );
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const displayName = userProfile?.username ?? userInfo?.userName ?? "—";
  const coins = Number(userProfile?.coins ?? userInfo?.coins ?? 0);
  const isVip = coins >= VIP_THRESHOLD;

  const { progressPercent, remainingPoints } = useMemo(() => {
    const clamped = Math.min(Math.max(coins, 0), VIP_THRESHOLD);
    return {
      progressPercent: (clamped / VIP_THRESHOLD) * 100,
      remainingPoints: Math.max(VIP_THRESHOLD - coins, 0),
    };
  }, [coins]);

  return (
    <aside className="hub-sidebar" aria-label="Thanh điều hướng">
      <div className="hub-sidebar__inner">
        <img
          className="hub-sidebar__logo"
          src={getAssetUrl("/assets/logo.png")}
          alt="Slot X CORE"
          width={242}
          height={91}
        />

        <div className="hub-sidebar__account">
        <div className="hub-sidebar__frame hub-sidebar__frame--user">
          <img
            className="hub-sidebar__frame-bg"
            src={getAssetUrl("/assets/frame-user.png")}
            alt=""
            width={302}
            height={70}
          />
          <span className="hub-sidebar__frame-text hub-sidebar__username">{displayName}</span>
          <img
            className="hub-sidebar__badge"
            src={getAssetUrl(isVip ? "/assets/icon-vip.png" : "/assets/icon-mem.png")}
            alt={isVip ? "VIP" : "Member"}
            width={61}
            height={61}
          />
        </div>

        <div className="hub-sidebar__vip-block">
          <div
            className="hub-sidebar__progress"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="hub-sidebar__progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="hub-sidebar__vip-text">
            {isVip ? (
              <>
                Bạn đã đạt <span className="hub-sidebar__vip-label">VIP</span>
              </>
            ) : (
              <>
                Bạn cần nạp thêm{" "}
                <span className="hub-sidebar__vip-points">{formatToken(remainingPoints)}</span>{" "}
                điểm để đạt <span className="hub-sidebar__vip-label">VIP</span>
              </>
            )}
          </p>
        </div>

        <div className="hub-sidebar__frame hub-sidebar__frame--coins">
          <img
            className="hub-sidebar__frame-bg"
            src={getAssetUrl("/assets/frame-coin.png")}
            alt=""
            width={302}
            height={70}
          />
          <span className="hub-sidebar__frame-text hub-sidebar__coins">{formatToken(coins)}</span>
        </div>

        <button
          type="button"
          className="hub-sidebar__frame hub-sidebar__frame--logout"
          onClick={onLogoutClick}
        >
          <img
            className="hub-sidebar__frame-bg"
            src={getAssetUrl("/assets/frame-logout.png")}
            alt=""
            width={302}
            height={70}
          />
          <span className="hub-sidebar__frame-text hub-sidebar__logout-text">Đăng xuất</span>
        </button>
        </div>

        <p className="hub-sidebar__version" aria-label="Phiên bản 1.09">
          <span className="hub-sidebar__version-prompt">&gt;_</span>version 1.09
        </p>
      </div>
    </aside>
  );
};

export default HomeSidebar;
