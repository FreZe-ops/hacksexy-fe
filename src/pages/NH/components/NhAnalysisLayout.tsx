import BackButton from "../../../components/BackButton";
import DraggableAnalysisRobot from "../../../components/DraggableAnalysisRobot";
import { getAssetUrl } from "../../../utils/assetUrl";
import NhRobotHackInput from "./NhRobotHackInput";
import NhRobotHackLoading from "./NhRobotHackLoading";
import NhRobotHackResults from "./NhRobotHackResults";
import "./NhAnalysisLayout.css";

type ResultValues = {
  rounds: number;
  minBet: string;
};

export type NhAnalysisLayoutProps = {
  gameTitle: string;
  gameImg: string;
  winPercent: number;
  gameScreenUrl: string;
  isScreenLoading: boolean;
  robotSpeech: string;
  robotVisible: boolean;
  autoMode: boolean;
  onAutoModeChange: (value: boolean) => void;
  onRobotVisibleChange: (value: boolean) => void;
  onBack: () => void;
  onSeeResults: () => void;
  onStopHack: () => void;
  onAddCoins: () => void;
  onVipActivate: () => void;
  vipHackActive: boolean;
  vipBusy: boolean;
  isSpinning: boolean;
  showHackInput: boolean;
  showHackLoading: boolean;
  showHackResults: boolean;
  manualValues: ResultValues;
  autoValues: ResultValues;
  timeSlotText: string;
  refreshRemainingSec: number;
  hackProgress: number;
  hackBalance: string;
  onHackBalanceChange: (value: string) => void;
  onConfirmHack: () => void;
};

export default function NhAnalysisLayout({
  gameTitle,
  gameImg,
  winPercent,
  gameScreenUrl,
  isScreenLoading,
  robotSpeech,
  robotVisible,
  autoMode,
  onAutoModeChange,
  onRobotVisibleChange,
  onBack,
  onSeeResults,
  onStopHack,
  onAddCoins,
  onVipActivate,
  vipHackActive,
  vipBusy,
  isSpinning,
  showHackInput,
  showHackLoading,
  showHackResults,
  manualValues,
  autoValues,
  timeSlotText,
  refreshRemainingSec,
  hackProgress,
  hackBalance,
  onHackBalanceChange,
  onConfirmHack,
}: NhAnalysisLayoutProps) {
  const title = gameTitle.trim() || "QUYẾT CHIẾN TIỀN THƯỞNG";
  const hackUiOpen = showHackInput || showHackLoading || showHackResults;

  return (
    <div className={`nh-analysis${hackUiOpen ? " nh-analysis--hack-open" : ""}`.trim()}>
      <div className="nh-analysis__top">
        <BackButton className="nh-analysis__back" onClick={onBack} />
        <h1 className="nh-analysis__title">GAME: {title.toUpperCase()}</h1>
      </div>

      <div className="nh-analysis__body">
        <section className="nh-analysis__screen-wrap">
          <div className="nh-analysis__screen">
            {isScreenLoading ? (
              <div className="nh-analysis__screen-placeholder">Đang tải màn hình game...</div>
            ) : gameScreenUrl ? (
              <iframe
                className="nh-analysis__iframe"
                src={gameScreenUrl}
                title={`Game ${title}`}
                allow="autoplay; fullscreen; encrypted-media"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="nh-analysis__screen-placeholder">
                Chưa cấu hình link màn hình. Admin thêm tại &quot;Link màn hình game&quot;.
              </div>
            )}
          </div>
        </section>

        <aside className="nh-analysis__panels" aria-label="Bảng điều khiển phân tích">
          <div className="nh-analysis__panel nh-analysis__panel--stats">
            <div className="nh-analysis__panel-frame" aria-hidden="true">
              <span className="nh-analysis__panel-accent nh-analysis__panel-accent--h" />
              <span className="nh-analysis__panel-accent nh-analysis__panel-accent--v" />
            </div>
            <div className="nh-analysis__panel-inner nh-analysis__panel-inner--stats">
              <div className="nh-analysis__stats-thumb-wrap">
                <img
                  className="nh-analysis__stats-thumb"
                  src={gameImg}
                  alt={title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getAssetUrl("/assets/nohu.gif");
                  }}
                />
              </div>
              <div
                className="nh-analysis__stats-percent"
                style={{
                  backgroundImage: `url(${getAssetUrl("/assets/percent-bcr.gif")})`,
                }}
              >
                <span>{winPercent}%</span>
              </div>
            </div>
          </div>

          <div className="nh-analysis__panel nh-analysis__panel--vip">
            <div className="nh-analysis__panel-inner nh-analysis__panel-inner--vip">
              <div className="nh-analysis__vip-title">VIP FEATURE</div>
              <button
                type="button"
                className="nh-analysis__vip-btn"
                disabled={vipBusy}
                onClick={() => void onVipActivate()}
              >
                {vipHackActive ? "> KÍCH HOẠT LẠI <" : "> KÍCH HOẠT NGAY <"}
              </button>
            </div>
          </div>

          <div
            className="nh-analysis__panel nh-analysis__panel--control"
            style={{
              backgroundImage: `url(${getAssetUrl("/assets/frame-table-2.png")})`,
            }}
          >
            <div className="nh-analysis__control-tab">&gt;_Bảng điều khiển</div>
            <div className="nh-analysis__panel-inner nh-analysis__panel-inner--control">
              <label className="nh-analysis__toggle-row">
                <span>CHẾ ĐỘ TỰ ĐỘNG</span>
                <input
                  type="checkbox"
                  className="nh-analysis__toggle-input"
                  checked={autoMode}
                  onChange={(e) => onAutoModeChange(e.target.checked)}
                />
                <span className="nh-analysis__toggle" aria-hidden />
              </label>

              <label className="nh-analysis__toggle-row">
                <span>TRẠNG THÁI ROBOT</span>
                <input
                  type="checkbox"
                  className="nh-analysis__toggle-input"
                  checked={robotVisible}
                  onChange={(e) => onRobotVisibleChange(e.target.checked)}
                />
                <span className="nh-analysis__toggle" aria-hidden />
              </label>

              <button
                type="button"
                className="nh-analysis__btn nh-analysis__btn--green"
                disabled={isSpinning}
                onClick={showHackResults ? onStopHack : onSeeResults}
              >
                {showHackResults ? "DỪNG HACK" : "XEM KẾT QUẢ (-2XU)"}
              </button>

              <button
                type="button"
                className="nh-analysis__btn nh-analysis__btn--red"
                onClick={onAddCoins}
              >
                +THÊM XU
              </button>
            </div>
          </div>
        </aside>
      </div>

      {robotVisible ? (
        <DraggableAnalysisRobot
          message={robotSpeech}
          className={`nh-analysis__robot${
            hackUiOpen ? " nh-analysis__robot--hack-open" : ""
          }${showHackResults ? " nh-analysis__robot--hack-results" : ""}`}
          imageSrc="/assets/robot.gif"
          hideBubble={hackUiOpen}
          topSlot={
            showHackInput ? (
              <NhRobotHackInput
                value={hackBalance}
                onChange={onHackBalanceChange}
                onSubmit={onConfirmHack}
                disabled={isSpinning}
              />
            ) : showHackLoading ? (
              <NhRobotHackLoading progress={hackProgress} />
            ) : showHackResults ? (
              <NhRobotHackResults
                manualValues={manualValues}
                autoValues={autoValues}
                timeSlotText={timeSlotText}
                refreshRemainingSec={refreshRemainingSec}
              />
            ) : null
          }
        />
      ) : null}
    </div>
  );
}
