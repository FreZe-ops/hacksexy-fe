export type NhGameProvider = {
  url: string;
  link: string;
  name: string;
};

/** Các sảnh Nổ Hũ đang có — ảnh từ `assets/NH/menuGame/` */
export const NH_GAME_PROVIDERS: readonly NhGameProvider[] = [
  { url: "/assets/NH/menuGame/PG.png", link: "/PG", name: "PG ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/BNG.png", link: "/BNG", name: "BNG ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/CQ9.png", link: "/CQ9", name: "CQ9 ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/EVO.png", link: "/EVOPLAY", name: "EVOPLAY ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/FASTSPIN.png", link: "/FASHPIN", name: "FASHPIN ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/JDB.png", link: "/JDB", name: "JDB ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/JILI.png", link: "/JILI", name: "JILI ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/PP.png", link: "/PP", name: "PP ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/SPADEGAMING.png", link: "/SPADEGAMING", name: "SPADEGAMING ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/SPRIBE.png", link: "/SPRIBE", name: "SPRIBE ĐIỆN TỬ" },
  { url: "/assets/NH/menuGame/VA.png", link: "/VA", name: "VA ĐIỆN TỬ" },
] as const;
