import React, { useMemo } from "react";
import { getAssetUrl } from "../utils/assetUrl";
import { formatBaccaratResults } from "../utils/baccaratBigRoad";

type BigRoadBoardProps = {
  tableData?: any[];
};

const BigRoadBoard: React.FC<BigRoadBoardProps> = ({ tableData }) => {
  const computed = useMemo(() => {
    const rows = Array.isArray(tableData) ? tableData : [];
    return formatBaccaratResults(rows);
  }, [tableData]);

  const rows = 6;
  const cols = 20;
  const baseWidth = 855;
  const baseHeight = 203;
  const cellW = baseWidth / cols;
  const cellH = baseHeight / rows;
  const maxCol = Math.max(...computed.map((r) => r.x), 0);
  const pageSize = cols;
  const currentPage = Math.floor(maxCol / pageSize);
  const startCol = currentPage * pageSize;
  const endCol = startCol + pageSize;
  const displayData = computed
    .filter((r) => r.x >= startCol && r.x < endCol)
    .map((r) => ({ ...r, x: r.x - startCol }));

  return (
    <div
      className="room-big-road"
      style={{
        backgroundImage: `url(${getAssetUrl("/assets/caro-table.png")})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#ffffff",
      }}
    >
      <div className="room-big-road__layer">
        {displayData.map((r, idx) => {
          const left = r.x * cellW + cellW / 2;
          const top = r.y * cellH + cellH / 2;
          let img: string;

          if (r.type === "B-H" || r.type === "P-H") {
            const variant = r.tieCount >= 3 ? 3 : r.tieCount >= 2 ? 2 : 1;
            if (r.type === "B-H") {
              img =
                variant === 1
                  ? "/assets/B-H.png"
                  : variant === 2
                    ? "/assets/B-H-2.png"
                    : "/assets/B-H-3.png";
            } else {
              img =
                variant === 1
                  ? "/assets/P-H.png"
                  : variant === 2
                    ? "/assets/P-H-2.png"
                    : "/assets/P-H-3.png";
            }
          } else if (r.type === "B") {
            img = "/assets/B.png";
          } else {
            img = "/assets/P.png";
          }

          return (
            <div
              key={`${idx}-${r.x}-${r.y}`}
              className="room-big-road__dot"
              style={{
                left: `${(left / baseWidth) * 100}%`,
                top: `${(top / baseHeight) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <img src={getAssetUrl(img)} alt={r.type} className="room-big-road__icon" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BigRoadBoard;
