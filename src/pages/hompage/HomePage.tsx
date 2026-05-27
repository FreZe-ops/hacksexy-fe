import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAssetUrl } from "../../utils/assetUrl";
import "./HomePage.css";

const GAME_CARDS = [
  {
    id: "nohu",
    title: "Tool Nổ Hũ",
    image: "/assets/tool-nohu.png",
    to: "/NH",
  },
  {
    id: "bcr",
    title: "Tool Baccarat",
    image: "/assets/tool-bcr.png",
    to: "/casino/lobby",
  },
] as const;

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onCardClick = useCallback(
    (to: string) => {
      navigate(to);
    },
    [navigate]
  );

  return (
    <main className="x88-hub__main">
      <section className="x88-hub__hero" aria-label="Giới thiệu">
        <h1 className="x88-hub__hero-title">Chọn game để bắt đầu</h1>
      </section>

      <section className="x88-hub__cards-zone" aria-label="Chọn game">
        <div className="x88-hub__cards">
          {GAME_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              className="x88-hub__card"
              onClick={() => onCardClick(card.to)}
            >
              <img
                className="x88-hub__card-img"
                src={getAssetUrl(card.image)}
                alt={card.title}
                width={364}
                height={538}
              />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
