import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import "./HackerLiveFeed.css";

type FeedSide = "left" | "right";

type LiveHackLine = {
  user: string;
  action: string;
  table: string;
  tablePath: string;
};

const LIVE_HACK_LINES: LiveHackLine[] = [
  { user: "Vortex88", action: "vừa thâm nhập thành công", table: "SEXY DESK S08", tablePath: "/casino/room/S08" },
  { user: "Kaito_R", action: "đang quét dữ liệu", table: "ROYAL M12", tablePath: "/casino/room/M12" },
  { user: "LunaTrace", action: "phân tích pattern xong", table: "VIP NODE R03", tablePath: "/casino/room/R03" },
  { user: "mr_zero", action: "đã ghép node proxy", table: "LIVE HALL V07", tablePath: "/casino/room/V07" },
  { user: "CyberNova", action: "đồng bộ mô hình AI", table: "MATRIX B09", tablePath: "/casino/room/B09" },
  { user: "PhantomV", action: "vừa giải mã phiên", table: "NEON DESK N05", tablePath: "/casino/room/N05" },
  { user: "Starling", action: "đang theo dõi luồng", table: "CORE TABLE K02", tablePath: "/casino/room/K02" },
];

type TerminalLine = {
  time: string;
  tag: "ok" | "banker" | "player";
  tagText: string;
  body: string;
  table?: string;
  tablePath?: string;
};

const TERMINAL_LINES: TerminalLine[] = [
  { time: "03:47:22", tag: "ok", tagText: "KÊNH ỔN ĐỊNH", body: "— luồng dự báo hoạt động bình thường tại", table: "BÀN VIP S08", tablePath: "/casino/room/S08" },
  { time: "03:47:09", tag: "banker", tagText: "NHẬN DIỆN CHUỖI", body: "chuỗi NHÀ CÁI tại", table: "BÀN ROYAL M12", tablePath: "/casino/room/M12" },
  { time: "03:46:51", tag: "player", tagText: "NHẬN DIỆN CHUỖI", body: "chuỗi NGƯỜI CHƠI tại", table: "BÀN NEON N05", tablePath: "/casino/room/N05" },
  { time: "03:46:38", tag: "ok", tagText: "ĐỘ TRỄ THẤP", body: "Ping EURO_V3_NODE < 95ms." },
  { time: "03:46:14", tag: "banker", tagText: "CẢNH BÁO", body: "Biến động NHÀ CÁI — đang giám sát", table: "BÀN MATRIX B09", tablePath: "/casino/room/B09" },
  { time: "03:45:57", tag: "player", tagText: "ƯU TIÊN", body: "Tín hiệu NGƯỜI CHƠI mạnh tại", table: "BÀN CORE K02", tablePath: "/casino/room/K02" },
];

function LiveHackBlock() {
  return (
    <div className="hacker-feed__block" aria-hidden>
      {LIVE_HACK_LINES.map((line, i) => (
        <div className="hacker-feed__line hacker-feed__line--live" key={`a-${i}`}>
          <span className="hacker-feed__prompt">&gt;&gt;</span>{" "}
          <span className="hacker-feed__user">{line.user}</span>{" "}
          <span className="hacker-feed__msg">{line.action}</span>{" "}
          <Link className="hacker-feed__room" to={line.tablePath}>
            {line.table}
          </Link>
        </div>
      ))}
    </div>
  );
}

function TerminalBlock() {
  return (
    <div className="hacker-feed__block" aria-hidden>
      {TERMINAL_LINES.map((line, i) => (
        <div className="hacker-feed__line hacker-feed__line--term" key={`t-${i}`}>
          <span className="hacker-feed__time">[{line.time}]</span>{" "}
          <span className={`hacker-feed__tag hacker-feed__tag--${line.tag}`}>
            {line.tagText}
          </span>{" "}
          <span className="hacker-feed__body">{line.body}</span>
          {line.table && line.tablePath ? (
            <>
              {" "}
              <Link className="hacker-feed__link-table" to={line.tablePath}>
                {line.table}
              </Link>
              .
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
}

type HackerLiveFeedProps = {
  side: FeedSide;
  variant: "live" | "terminal";
};

/**
 * Popup tin tức kiểu terminal / hacker — cuộn dọc vô hạn.
 * Đặt fixed góc dưới trái (live) hoặc phải (terminal).
 */
const HackerLiveFeed: React.FC<HackerLiveFeedProps> = ({ side, variant }) => {
  const title = variant === "live" ? "REALTIME TRACE FEED" : "NEURAL CORE LOG";
  const durationSec = variant === "live" ? 42 : 48;

  const content = useMemo(
    () =>
      variant === "live" ? (
        <>
          <LiveHackBlock />
          <LiveHackBlock />
        </>
      ) : (
        <>
          <TerminalBlock />
          <TerminalBlock />
        </>
      ),
    [variant]
  );

  return (
    <aside
      className={`hacker-feed hacker-feed--${side} hacker-feed--${variant}`}
      aria-label={variant === "live" ? "Luồng quét trực tiếp" : "Nhật ký hệ thống neural core"}
    >
      <div className="hacker-feed__chrome">
        <header className="hacker-feed__head">
          <span className="hacker-feed__corner hacker-feed__corner--tl" aria-hidden />
          <span className="hacker-feed__corner hacker-feed__corner--tr" aria-hidden />
          <h2 className="hacker-feed__title">{title}</h2>
          <span
            className="hacker-feed__live-dot"
            title="Đang phát sóng"
            aria-hidden
          />
        </header>
        <div className="hacker-feed__viewport">
          <div
            className="hacker-feed__track"
            style={{ animationDuration: `${durationSec}s` }}
          >
            {content}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default HackerLiveFeed;
