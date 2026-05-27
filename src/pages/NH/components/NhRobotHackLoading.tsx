import { getAssetUrl } from "../../../utils/assetUrl";
import "./NhRobotHackLoading.css";

type NhRobotHackLoadingProps = {
  progress: number;
};

export default function NhRobotHackLoading({ progress }: NhRobotHackLoadingProps) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div
      className="nh-robot-hack-loading"
      style={{
        backgroundImage: `url(${getAssetUrl("/assets/frame-table-2.png")})`,
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="nh-robot-hack-loading__inner">
        <div className="nh-robot-hack-loading__title">&gt;_ĐANG QUÉT DỮ LIỆU HỆ THỐNG...</div>

        <div className="nh-robot-hack-loading__bar-track">
          <div className="nh-robot-hack-loading__bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="nh-robot-hack-loading__status">BAYPASSING FIREWALL...{pct}%</div>
      </div>
    </div>
  );
}
