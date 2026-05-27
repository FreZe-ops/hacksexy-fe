import { getAssetUrl } from "../../../utils/assetUrl";
import "./NhRobotHackInput.css";

type NhRobotHackInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function NhRobotHackInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: NhRobotHackInputProps) {
  return (
    <div
      className="nh-robot-hack-input"
      style={{
        backgroundImage: `url(${getAssetUrl("/assets/frame-table-2.png")})`,
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="nh-robot-hack-input__inner">
        <div className="nh-robot-hack-input__head">
          <div className="nh-robot-hack-input__title">NHẬP SỐ DƯ HIỆN TẠI</div>
          <div className="nh-robot-hack-input__hint">GIÁ TRỊ TỐI THIỂU: 50 ĐIỂM</div>
        </div>

        <div className="nh-robot-hack-input__field">
          <input
            aria-label="Nhập số dư hiện tại"
            className="nh-robot-hack-input__input"
            inputMode="numeric"
            type="text"
            pattern="[0-9]*"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit();
                return;
              }
              if (e.ctrlKey || e.metaKey || e.altKey) return;
              const allowed = [
                "Backspace",
                "Delete",
                "Tab",
                "ArrowLeft",
                "ArrowRight",
                "Home",
                "End",
              ];
              if (allowed.includes(e.key)) return;
              if (!/^\d$/.test(e.key)) e.preventDefault();
            }}
          />
          <span className="nh-robot-hack-input__currency">ĐIỂM</span>
        </div>

        <button
          type="button"
          className="nh-robot-hack-input__submit"
          disabled={disabled}
          onClick={onSubmit}
        >
          BẮT ĐẦU QUÉT (10 TOKEN)
        </button>
      </div>
    </div>
  );
}
