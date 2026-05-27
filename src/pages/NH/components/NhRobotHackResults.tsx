import { getAssetUrl } from "../../../utils/assetUrl";
import "./NhRobotHackResults.css";

type ResultValues = {
  rounds: number;
  minBet: string;
};

type NhRobotHackResultsProps = {
  manualValues: ResultValues;
  autoValues: ResultValues;
  timeSlotText: string;
  refreshRemainingSec: number;
};

function formatGoldenHourDisplay(timeSlotText: string): string {
  const cleaned = timeSlotText.replace(/^>/, "").trim();
  const match = cleaned.match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (match) return `${match[1]} – ${match[2]}`;
  return cleaned.split("(")[0].trim().replace(/\s*-\s*/, " – ");
}

function formatRefreshCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = String(Math.floor(s / 60));
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function NhRobotHackResults({
  manualValues,
  autoValues,
  timeSlotText,
  refreshRemainingSec,
}: NhRobotHackResultsProps) {
  const goldenHour = formatGoldenHourDisplay(timeSlotText);
  const refreshText = formatRefreshCountdown(refreshRemainingSec);

  return (
    <div
      className="nh-robot-hack-results"
      style={{
        backgroundImage: `url(${getAssetUrl("/assets/frame-result-2.png")})`,
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="nh-robot-hack-results__inner">
        <div className="nh-robot-hack-results__title">&gt;_KẾT QUẢ PHÂN TÍCH</div>

        <div className="nh-robot-hack-results__grid">
          <div className="nh-robot-hack-results__box">
            <div className="nh-robot-hack-results__label">Quay mồi</div>
            <div className="nh-robot-hack-results__value">
              {manualValues.rounds} vòng – Mức cược {manualValues.minBet}
            </div>
          </div>

          <div className="nh-robot-hack-results__box">
            <div className="nh-robot-hack-results__label">Quay Auto</div>
            <div className="nh-robot-hack-results__value">
              {autoValues.rounds} vòng – Mức cược {autoValues.minBet}
            </div>
          </div>

          <div className="nh-robot-hack-results__box">
            <div className="nh-robot-hack-results__label">KHUNG GIỜ VÀNG</div>
            <div className="nh-robot-hack-results__value">{goldenHour}</div>
          </div>

          <div className="nh-robot-hack-results__box">
            <div className="nh-robot-hack-results__label">LÀM MỚI SAU</div>
            <div className="nh-robot-hack-results__countdown">{refreshText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
