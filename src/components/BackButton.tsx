import type { CSSProperties, MouseEventHandler } from "react";
import { getAssetUrl } from "../utils/assetUrl";
import "./BackButton.css";

type BackButtonProps = {
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

const BTN_BACK_SRC = "/assets/btn-back.png";

export default function BackButton({
  href,
  onClick,
  className = "",
  style,
  ariaLabel = "Quay lại",
}: BackButtonProps) {
  const img = (
    <img
      className="app-back-btn__img"
      src={getAssetUrl(BTN_BACK_SRC)}
      alt=""
      width={154}
      height={58}
      loading="lazy"
    />
  );

  const cls = ["app-back-btn", className].filter(Boolean).join(" ");

  if (href) {
    return (
      <a href={href} className={cls} style={style} aria-label={ariaLabel} onClick={onClick}>
        {img}
      </a>
    );
  }

  return (
    <button type="button" className={cls} style={style} aria-label={ariaLabel} onClick={onClick}>
      {img}
    </button>
  );
}
