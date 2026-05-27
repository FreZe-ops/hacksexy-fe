import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssetUrl } from "../../utils/assetUrl";
import { fetchNhTableList, type NhTableListRow } from "./fetchNhTableList";
import { NH_GAME_PROVIDERS, type NhGameProvider } from "./nhMenuGameProviders";
import BackButton from "../../components/BackButton";
import "./HomeNH.css";

type JackpotSpotlightCard = {
  key: string;
  slotLink: string;
  roomKey: string;
  gameId: string;
  gameName: string;
  imageUrl: string;
  showHot: boolean;
};

function pickTwoRandomHalls(list: readonly NhGameProvider[]): NhGameProvider[] {
  if (list.length <= 2) {
    return [...list];
  }
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, 2);
}

function rowImageUrl(roomKey: string, row: NhTableListRow, indexInList: number): string {
  if (row.showIcon) return row.showIcon;
  const n = indexInList + 1;
  return `/assets/NH/${roomKey}/${roomKey}_${String(n).padStart(2, "0")}.png`;
}

function displayImgSrc(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return getAssetUrl(url);
}

async function oneRandomGameFromHall(hall: NhGameProvider): Promise<JackpotSpotlightCard | null> {
  const roomKey = hall.link.replace(/^\//, "");
  const rows = await fetchNhTableList(roomKey);
  if (!rows.length) return null;
  const idx = Math.floor(Math.random() * rows.length);
  const row = rows[idx];
  return {
    key: `${roomKey}-${row._id}-${idx}`,
    slotLink: hall.link,
    roomKey,
    gameId: row._id,
    gameName: row.name,
    imageUrl: rowImageUrl(roomKey, row, idx),
    showHot: false,
  };
}

async function loadJackpotSpotlightCards(): Promise<JackpotSpotlightCard[]> {
  const halls = pickTwoRandomHalls(NH_GAME_PROVIDERS);
  const fromHalls = await Promise.all(halls.map(oneRandomGameFromHall));
  let cards: JackpotSpotlightCard[] = fromHalls.filter(
    (c): c is JackpotSpotlightCard => c != null
  );

  if (cards.length < 2) {
    const pg = await fetchNhTableList("PG");
    const shuffled = [...pg].sort(() => Math.random() - 0.5);
    for (const row of shuffled) {
      if (cards.length >= 2) break;
      if (cards.some((c) => c.gameId === row._id && c.roomKey === "PG")) continue;
      const idx = pg.indexOf(row);
      cards.push({
        key: `PG-${row._id}-fill-${cards.length}`,
        slotLink: "/PG",
        roomKey: "PG",
        gameId: row._id,
        gameName: row.name,
        imageUrl: rowImageUrl("PG", row, Math.max(0, idx)),
        showHot: false,
      });
    }
  }

  const out = cards.slice(0, 2);
  if (out.length === 2) {
    const hotIdx = Math.random() < 0.5 ? 0 : 1;
    return out.map((c, i) => ({ ...c, showHot: i === hotIdx }));
  }
  if (out.length === 1) {
    return [{ ...out[0], showHot: Math.random() < 0.45 }];
  }
  return out;
}

const HomeNH = () => {
  const [jackpotCards, setJackpotCards] = useState<JackpotSpotlightCard[]>([]);
  const [jackpotLoading, setJackpotLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setJackpotLoading(true);
      try {
        const cards = await loadJackpotSpotlightCards();
        if (!cancelled) setJackpotCards(cards);
      } finally {
        if (!cancelled) setJackpotLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClick = (slotPath: string) => {
    navigate(`/NH/slot${slotPath}`);
  };

  return (
    <div className="nh-hub">
      <div className="container-fluid lobby-bg position-relative mx-auto mb-5 max-w-screen-xl">
        <div className="container mx-auto">
          <header className="nh-hero-banner" aria-label="Nổ hũ">
            <BackButton href="/" className="nh-hero-banner__back" />
            <div className="nh-hero-banner__center">
              <p className="nh-hero-banner__pill nh-hero-banner__pill--title">
                &gt;SẢNH NỔ HŨ&lt;
              </p>
              <p className="nh-hero-banner__pill nh-hero-banner__pill--jackpot">
                GAME JACK POT
              </p>
            </div>
            <div className="nh-hero-banner__spacer" aria-hidden />
          </header>

          <section className="nh-jackpot" aria-labelledby="nh-jackpot-title">
            <h2 id="nh-jackpot-title" className="nh-jackpot__sr-title">
              Gợi ý game jackpot
            </h2>
            <div className="nh-jackpot__games">
              {jackpotLoading ? (
                <>
                  <div className="nh-jackpot__skeleton" aria-hidden />
                  <div className="nh-jackpot__skeleton" aria-hidden />
                </>
              ) : (
                jackpotCards.map((card) => (
                  <button
                    key={card.key}
                    type="button"
                    className="nh-jackpot__game"
                    onClick={() => handleClick(card.slotLink)}
                  >
                    <div className="nh-jackpot__thumb-wrap">
                      {card.showHot ? (
                        <span className="nh-jackpot__hot" aria-hidden>
                          HOT!
                        </span>
                      ) : null}
                      <img
                        className="nh-jackpot__thumb"
                        src={displayImgSrc(card.imageUrl)}
                        alt={card.gameName}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="nh-jackpot__game-title">{card.gameName}</span>
                    <span className="nh-jackpot__game-hall">
                      SẢNH {card.roomKey}
                    </span>
                  </button>
                ))
              )}
            </div>
            {!jackpotLoading && jackpotCards.length === 0 ? (
              <p className="nh-jackpot__empty">
                Chưa tải được game gợi ý. Chọn sảnh ở danh sách bên dưới.
              </p>
            ) : null}
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 all-programs py-8 mb-10">
            {NH_GAME_PROVIDERS.map((e) => (
              <div
                key={e.link}
                data-aos="flip-left"
                data-aos-delay="100"
                className="mb-1 aos-init aos-animate cursor-pointer transition-transform transform duration-300 ease-in-out hover:scale-110"
                onClick={() => handleClick(e.link)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    handleClick(e.link);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="box-game w-[80%] mx-auto group">
                  <img
                    src={getAssetUrl(e.url)}
                    alt={e.name}
                    className="w-full transition duration-300 ease-in-out group-hover:drop-shadow-[0_0_10px_#1e943b]"
                  />
                  <label className="mt-2 font-semibold text-white text-center block transition duration-300 ease-in-out group-hover:drop-shadow-[0_0_6px_#1e943b]">
                    {e.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeNH;
