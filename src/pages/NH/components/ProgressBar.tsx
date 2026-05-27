import React from 'react';
import './ProgressBar.css';
import { useNavigate } from 'react-router-dom';

type NhSlotPlayKind = 'jackpot' | 'choi' | 'cho';

const PLAY_LABEL: Record<NhSlotPlayKind, string> = {
  jackpot: 'JACKPOT',
  choi: 'CHƠI',
  cho: 'CHỜ',
};

interface ProgressBarProps {
  percentage: number;
  title: string;
  imageUrl: string;
  id: string;
  playKind: NhSlotPlayKind;
  /** Mặc định `/NH/table` — hub bắn cá dùng `/fishing/table` */
  tableBasePath?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  title,
  imageUrl,
  id,
  playKind,
  tableBasePath = "/NH/table",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem("title_img", imageUrl);
    localStorage.setItem("title_text", title);
    localStorage.setItem("win_percent", percentage.toString());
    const base = tableBasePath.replace(/\/$/, "");
    navigate(`${base}/${id}`);
  };

  const fixedPercent = Math.max(0, Math.min(100, Math.round(percentage)));

  return (
    <div onClick={handleClick} className="nh-basic-card" role="button" tabIndex={0}>
      <div className="nh-basic-card__frame" aria-hidden="true">
        <span className="nh-basic-card__accent nh-basic-card__accent--h" />
        <span className="nh-basic-card__accent nh-basic-card__accent--v" />
        <div className="nh-basic-card__head">
          <span className="nh-basic-card__dots">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
      <div className="nh-basic-card__inner">
        <img className="nh-basic-game-image" src={imageUrl} alt={title} loading="lazy" />
        <div className="nh-basic-game-title" title={title}>
          {title}
        </div>
        <div className="nh-basic-bottom">
          <button
            type="button"
            className={`nh-basic-play nh-basic-play--${playKind}`}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {PLAY_LABEL[playKind]}
          </button>

          <div className="nh-basic-bar">
            <div className="nh-basic-bar__label">{fixedPercent}%</div>
            <div className="nh-basic-bar__track">
              <div
                className="nh-basic-bar__fill nh-basic-bar__fill--fixed"
                style={{ width: `${fixedPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);