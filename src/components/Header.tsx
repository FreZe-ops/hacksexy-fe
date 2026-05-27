import React, { useEffect, useState } from "react";
import { getUserProfile } from "../utilities/axios.utilities";
import { getAssetUrl } from "../utils/assetUrl";
import "./AppHeaderBar.css";

interface IProps {
  setIsShowLogout: () => void;
}

function formatToken(n: number | undefined): string {
  if (n == null || Number.isNaN(n)) return "0";
  return n.toLocaleString("vi-VN");
}

const Header: React.FC<IProps> = ({ setIsShowLogout }) => {
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

  const displayName =
    userProfile?.username ?? userInfo?.userName ?? "—";
  const coins = userProfile?.coins ?? userInfo?.coins ?? 0;

  return (
    <div className="app-header-wrap">
      <header className="app-header-bar" role="banner">
        <div className="app-header-bar__user-pill">
          <img
            className="app-header-bar__logo-robot"
            src={getAssetUrl("/assets/logo-robot.png")}
            alt=""
            width={40}
            height={40}
          />
          <span className="app-header-bar__username">{displayName}</span>
        </div>

        <div className="app-header-bar__right">
          <div className="app-header-bar__token-pill">
            <span className="app-header-bar__token-label">Token:</span>{" "}
            <span className="app-header-bar__token-value">
              {formatToken(coins)}
            </span>
          </div>
          <button
            type="button"
            className="app-header-bar__logout"
            onClick={setIsShowLogout}
          >
            <svg
              className="app-header-bar__logout-icon"
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M21 12H9M18 9l3 3-3 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Đăng xuất
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
