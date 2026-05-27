/**
 * Mock API — danh sách bắn cá theo sảnh, dùng cho `/fishing/slot/:room`.
 * `/NH/slot/...` vẫn gọi API thật (trừ PG/BNG xử lý riêng trong Slot).
 */

export type FishingMockRow = { name: string; showIcon: string; id: number; vassalage: string };

const JILI_FISHING_TABLE: FishingMockRow[] = [
  { id: 171071, name: "Jackpot Đánh Cá", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0005.avif", vassalage: "JILI" },
  { id: 171070, name: "Nhà Tư Bản Khủng Long", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0004.webp", vassalage: "JILI" },
  { id: 188833, name: "Jackpot Vua Tài Lộc", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/VI/JL0183.png", vassalage: "JILI" },
  { id: 171073, name: "Bắn Cá Vương Giả", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0007.avif", vassalage: "JILI" },
  { id: 171074, name: "Đoạt Bảo Truyền Kỳ", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0008.avif", vassalage: "JILI" },
  { id: 180386, name: "Jackpot Vua Đại Dương", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0136.avif", vassalage: "JILI" },
  { id: 171075, name: "Đánh Cá Vui Vẻ", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0009.avif", vassalage: "JILI" },
  { id: 197460, name: "Câu Cá Hũ Vàng Tốc Độ 2", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/736.avif", vassalage: "JILI" },
  { id: 197027, name: "Giải Đặc Biệt Rạp Xiếc", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/667.avif", vassalage: "JILI" },
  { id: 176834, name: "Nhà Tư Bản Khủng Long 2", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0111.webp", vassalage: "JILI" },
  { id: 172438, name: "Dàn Sao Đánh Cá", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0050.webp", vassalage: "JILI" },
  { id: 193852, name: "Thây Ma May Mắn", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0231.avif", vassalage: "JILI" },
  { id: 171068, name: "Tiền Long Đánh Cá", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0002.webp", vassalage: "JILI" },
  { id: 171072, name: "Phi Long Tàng Bảo", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0006.avif", vassalage: "JILI" },
  { id: 171069, name: "Nổ Cá Đến Rồi", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JL/EN/JL0003.avif", vassalage: "JILI" },
];

const FC_FISHING_TABLE: FishingMockRow[] = [
  { id: 171614, name: "Thợ săn ngôi sao", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/FC/EN/FC0027.avif", vassalage: "FC" },
  { id: 186755, name: "Các Vị Thần Ban Phước Lành", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/FC/EN/FC0053.avif", vassalage: "FC" },
  { id: 171145, name: "Monkey King Fishing", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/FC/EN/FC0018.avif", vassalage: "FC" },
  { id: 171148, name: "Câu cá Fa Chai", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/FC/EN/FC0021.avif", vassalage: "FC" },
  { id: 171146, name: "Bao Chuan Fishing", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/FC/EN/FC0019.avif", vassalage: "FC" },
  { id: 171147, name: "Câu cá khốc liệt", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/FC/EN/FC0020.avif", vassalage: "FC" },
];

const JDB_FISHING_TABLE: FishingMockRow[] = [
  { id: 11981, name: "Bắn Cá Thần Tài", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/EN/JDB082.avif", vassalage: "JDB" },
  { id: 11982, name: "Bắn Cá Ngũ Long", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/EN/JDB083.avif", vassalage: "JDB" },
  { id: 165532, name: "Bắn Cá Phát Tài", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/EN/JDB141.avif", vassalage: "JDB" },
  { id: 11979, name: "Bắn Cá Long Vương 1", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/EN/JDB080.avif", vassalage: "JDB" },
  { id: 167627, name: "Thợ Săn Rồng", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/EN/JDB152.avif", vassalage: "JDB" },
  { id: 181436, name: "Truyền Thuyết Thủy Triều Linh Hồn", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/VI/JDB206.png", vassalage: "JDB" },
  { id: 193447, name: "Truyền Thuyết Rồng Tà Ác", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/EN/JDB234.avif", vassalage: "JDB" },
  { id: 11980, name: "Bắn Cá Long Vương 2", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/EN/JDB081.avif", vassalage: "JDB" },
  { id: 184688, name: "Chiến Binh Lửa", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/EN/JDB213.avif", vassalage: "JDB" },
  { id: 168191, name: "Vũ trường câu cá", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/JDB/EN/JDB154.avif", vassalage: "JDB" },
];

const CQ9_FISHING_TABLE: FishingMockRow[] = [
  { id: 12049, name: "Bắn Cá Long Châu", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/CQ9/EN/CQ0232.avif", vassalage: "CQ9" },
  { id: 10294, name: "Thiên Đường", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/CQ9/EN/CQ0158.avif", vassalage: "CQ9" },
  { id: 171580, name: "Bắn Cá Anh Hùng", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/CQ9/EN/CQ0396.webp", vassalage: "CQ9" },
  { id: 193088, name: "Câu Cá Một Gậy", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/CQ9/EN/CQ0469.avif", vassalage: "CQ9" },
  { id: 194159, name: "Thiên Đường 2", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/CQ9/EN/CQ0491.avif", vassalage: "CQ9" },
  { id: 165492, name: "Bắn Cá May Mắn", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/CQ9/EN/CQ0305.avif", vassalage: "CQ9" },
];

/** Icon CDN FS; route hub `FASHPIN`. */
const FASHPIN_FISHING_TABLE: FishingMockRow[] = [
  { id: 199850, name: "Câu Cá Kho Báu", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/FS/EN/F-BF01.avif", vassalage: "FASHPIN" },
  { id: 182555, name: "Kho Báu Loài Cá", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/FS/EN/FS0045.avif", vassalage: "FASHPIN" },
  { id: 199572, name: "Lễ Hội Đại Dương", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/FS/EN/F-OC01.avif", vassalage: "FASHPIN" },
];

/** Icon CDN SG; route hub `SPADEGAMING`. */
const SPADEGAMING_FISHING_TABLE: FishingMockRow[] = [
  { id: 171395, name: "Cuộc chiến câu cá", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/SG/EN/SG0131.avif", vassalage: "SPADEGAMING" },
  { id: 171394, name: "Thần câu cá", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/SG/EN/SG0130.avif", vassalage: "SPADEGAMING" },
  { id: 171392, name: "Bữa tiệc xác sống", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/SG/EN/SG0128.avif", vassalage: "SPADEGAMING" },
  { id: 190373, name: "Huyền Thoại Câu Cá", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/SG/VI/SG0179.png", vassalage: "SPADEGAMING" },
  { id: 171393, name: "Thợ săn người ngoài hành tinh", showIcon: "https://images.7087053.com/TCG_GAME_ICONS/SG/EN/SG0129.avif", vassalage: "SPADEGAMING" },
];

/** Thứ tự hiển thị trên hub bắn cá — đồng bộ với `FISHING_MOCK_TABLES`. */
export const FISHING_MOCK_ROOM_ORDER = [
  "JILI",
  "FC",
  "JDB",
  "CQ9",
  "FASHPIN",
  "SPADEGAMING",
] as const;

export type FishingMockRoomKey = (typeof FISHING_MOCK_ROOM_ORDER)[number];

export const FISHING_MOCK_TABLES: Record<FishingMockRoomKey, FishingMockRow[]> = {
  JILI: JILI_FISHING_TABLE,
  FC: FC_FISHING_TABLE,
  JDB: JDB_FISHING_TABLE,
  CQ9: CQ9_FISHING_TABLE,
  FASHPIN: FASHPIN_FISHING_TABLE,
  SPADEGAMING: SPADEGAMING_FISHING_TABLE,
};

export function isFishingMockHall(roomKey: string): roomKey is FishingMockRoomKey {
  return (FISHING_MOCK_ROOM_ORDER as readonly string[]).includes(roomKey);
}

export const mockFishingApi = {
  tableListData: FISHING_MOCK_TABLES as Record<string, FishingMockRow[]>,

  async getTableList(typeGame: string) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const baseData = this.tableListData[typeGame] || [];
    const data = baseData.map((item) => {
      const isHighPercent = Math.random() < 0.3;
      const percent = isHighPercent
        ? Math.floor(Math.random() * 10) + 86
        : Math.floor(Math.random() * 85) + 1;
      return { ...item, percent };
    });
    return { data };
  },
};
