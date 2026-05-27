import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssetUrl } from "../../utils/assetUrl";
import { mockFishingApi, FISHING_MOCK_ROOM_ORDER, type FishingMockRoomKey } from "../../services/mockFishingApi";
import BackButton from "../../components/BackButton";
import "../NH/HomeNH.css";

type FishingGameProvider = {
  url: string;
  link: string;
  name: string;
};

/** Chỉ các sảnh có mock trong `mockFishingApi`. */
const FISHING_HALL_META: Record<FishingMockRoomKey, { url: string; name: string }> = {
  JILI: { url: "/assets/NH/menuGame/JILI.png", name: "JILI ĐIỆN TỬ" },
  FC: { url: "/assets/fc.png", name: "FC ĐIỆN TỬ" },
  JDB: { url: "/assets/NH/menuGame/JDB.png", name: "JDB ĐIỆN TỬ" },
  CQ9: { url: "/assets/NH/menuGame/CQ9.png", name: "CQ9 ĐIỆN TỬ" },
  FASHPIN: { url: "/assets/NH/menuGame/FASHPIN.png", name: "FASHPIN ĐIỆN TỬ" },
  SPADEGAMING: { url: "/assets/NH/menuGame/SPADEGAMING.png", name: "SPADEGAMING ĐIỆN TỬ" },
};

const FISHING_GAME_PROVIDERS: readonly FishingGameProvider[] = FISHING_MOCK_ROOM_ORDER.map((room) => {
  const m = FISHING_HALL_META[room];
  return { url: m.url, link: `/${room}`, name: m.name };
});

type SpotlightCard = {
  key: string;
  slotLink: string;
  roomKey: string;
  gameId: string;
  gameName: string;
  imageUrl: string;
  showHot: boolean;
};

function displayImgSrc(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return getAssetUrl(url);
}

async function loadFishingSpotlightFromJili(): Promise<SpotlightCard[]> {
  const mockRes = await mockFishingApi.getTableList("JILI");
  const list = Array.isArray(mockRes.data) ? mockRes.data : [];
  if (!list.length) return [];
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  const slice = shuffled.slice(0, 2);
  const hotIdx = slice.length === 2 && Math.random() < 0.5 ? 1 : 0;
  return slice.map((it: any, i: number) => ({
    key: `JILI-${it?.id ?? i}-${i}`,
    slotLink: "/JILI",
    roomKey: "JILI",
    gameId: `JILI-${it?.id ?? i}`,
    gameName: String(it?.name ?? ""),
    imageUrl: String(it?.showIcon ?? ""),
    showHot: i === hotIdx,
  }));
}

const HomeFishing = () => {
  const [spotlightCards, setSpotlightCards] = useState<SpotlightCard[]>([]);
  const [spotlightLoading, setSpotlightLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSpotlightLoading(true);
      try {
        const cards = await loadFishingSpotlightFromJili();
        if (!cancelled) setSpotlightCards(cards);
      } finally {
        if (!cancelled) setSpotlightLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClick = (slotPath: string) => {
    navigate(`/fishing/slot${slotPath}`);
  };

  return (
    <div className="nh-hub">
      <div className="container-fluid lobby-bg position-relative mx-auto mb-5 max-w-screen-xl">
        <div className="container mx-auto">
          <header className="nh-hero-banner" aria-label="Bắn cá">
            <BackButton href="/" className="nh-hero-banner__back" />
            <div className="nh-hero-banner__center">
              <p className="nh-hero-banner__pill nh-hero-banner__pill--title">
                &gt;SẢNH BẮN CÁ&lt;
              </p>
              <p className="nh-hero-banner__pill nh-hero-banner__pill--jackpot">
                GAME BẮN CÁ
              </p>
            </div>
            <div className="nh-hero-banner__spacer" aria-hidden />
          </header>

          <section className="nh-jackpot" aria-labelledby="fishing-jackpot-title">
            <h2 id="fishing-jackpot-title" className="nh-jackpot__sr-title">
              Gợi ý game (JILI)
            </h2>
            <div className="nh-jackpot__games">
              {spotlightLoading ? (
                <>
                  <div className="nh-jackpot__skeleton" aria-hidden />
                  <div className="nh-jackpot__skeleton" aria-hidden />
                </>
              ) : (
                spotlightCards.map((card) => (
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
                    <span className="nh-jackpot__game-hall">SẢNH {card.roomKey}</span>
                  </button>
                ))
              )}
            </div>
            {!spotlightLoading && spotlightCards.length === 0 ? (
              <p className="nh-jackpot__empty">
                Chưa tải được game gợi ý. Chọn sảnh ở danh sách bên dưới.
              </p>
            ) : null}
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 all-programs py-8 mb-10">
            {FISHING_GAME_PROVIDERS.map((e) => (
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

export default HomeFishing;
