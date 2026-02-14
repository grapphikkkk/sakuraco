// Event data for SakuraCo
// Today: Friday, February 13, 2026

export type EventCategory = "ベーシック" | "属性" | "ゲイ独自の興味";

export type EventTheme = 
  | "ランダム"
  | "タメ会"
  | "ワイン会"
  | "同じ学校出身"
  | "English Speakers"
  | "身長-体重100以下"
  | "デブ専"
  | "アスパラベーコン";

export interface Event {
  id: string;
  category: EventCategory;
  theme: EventTheme;
  concept: string;
  date: string; // Format: 2月19日（水）
  time: string; // Format: 19:00
  weekday: "水" | "金";
  fullDateTime: string; // For display: 2月19日（水）19:00
  participantCount: 5;
  price: number; // 1000, 1500, or 3000
  areas: string[]; // Available areas
  disabledAreas?: string[]; // Disabled areas (optional)
  cancelPolicy: string;
  firstTimer?: boolean; // 初めての方歓迎
}

export const AREAS = ["池袋", "新宿", "中野", "高円寺", "上野", "新橋"];

const CANCEL_POLICY = `
＜当日・無断キャンセル＞
参加費の100%を頂戴します。

＜前日キャンセル＞
参加費の50%を頂戴します。

＜2日前までのキャンセル＞
キャンセル料はかかりません。
`.trim();

// Week 1: Feb 19 (Wed), Feb 21 (Fri)
// Week 2: Feb 26 (Wed), Feb 28 (Fri)
// Week 3: Mar 5 (Wed), Mar 7 (Fri)

export const EVENTS: Event[] = [
  // ========== ベーシック ==========
  {
    id: "basic-1",
    category: "ベーシック",
    theme: "ランダム",
    concept: "気軽に参加できる、初めての方も安心なカジュアルなお食事会です。",
    date: "2月19日（水）",
    time: "19:00",
    weekday: "水",
    fullDateTime: "2月19日（水）19:00",
    participantCount: 5,
    price: 1000,
    areas: ["新宿", "池袋", "上野"],
    disabledAreas: ["中野", "高円寺", "新橋"],
    cancelPolicy: CANCEL_POLICY,
    firstTimer: true,
  },
  {
    id: "basic-2",
    category: "ベーシック",
    theme: "ランダム",
    concept: "気軽に参加できる、初めての方も安心なカジュアルなお食事会です。",
    date: "2月21日（金）",
    time: "20:00",
    weekday: "金",
    fullDateTime: "2月21日（金）20:00",
    participantCount: 5,
    price: 1000,
    areas: ["新宿", "中野", "高円寺"],
    disabledAreas: ["池袋", "上野", "新橋"],
    cancelPolicy: CANCEL_POLICY,
  },
  {
    id: "basic-3",
    category: "ベーシック",
    theme: "ランダム",
    concept: "気軽に参加できる、初めての方も安心なカジュアルなお食事会です。",
    date: "2月26日（水）",
    time: "19:30",
    weekday: "水",
    fullDateTime: "2月26日（水）19:30",
    participantCount: 5,
    price: 1000,
    areas: ["池袋", "新宿", "上野", "新橋"],
    disabledAreas: ["中野", "高円寺"],
    cancelPolicy: CANCEL_POLICY,
    firstTimer: true,
  },
  {
    id: "basic-4",
    category: "ベーシック",
    theme: "ランダム",
    concept: "気軽に参加できる、初めての方も安心なカジュアルなお食事会です。",
    date: "2月28日（金）",
    time: "19:00",
    weekday: "金",
    fullDateTime: "2月28日（金）19:00",
    participantCount: 5,
    price: 1000,
    areas: ["新宿", "中野"],
    disabledAreas: ["池袋", "高円寺", "上野", "新橋"],
    cancelPolicy: CANCEL_POLICY,
  },

  // ========== 属性 ==========
  {
    id: "attr-1",
    category: "属性",
    theme: "ワイン会",
    concept: "ワイン好き同士が集う会です。美味しいワインとお食事を楽しみましょう。",
    date: "2月19日（水）",
    time: "19:30",
    weekday: "水",
    fullDateTime: "2月19日（水）19:30",
    participantCount: 5,
    price: 1500,
    areas: ["新宿", "新橋"],
    disabledAreas: ["池袋", "中野", "高円寺", "上野"],
    cancelPolicy: CANCEL_POLICY,
  },
  {
    id: "attr-2",
    category: "属性",
    theme: "タメ会",
    concept: "同世代同士でリラックスして話せるお食事会です。",
    date: "2月21日（金）",
    time: "19:00",
    weekday: "金",
    fullDateTime: "2月21日（金）19:00",
    participantCount: 5,
    price: 1500,
    areas: ["新宿", "池袋"],
    disabledAreas: ["中野", "高円寺", "上野", "新橋"],
    cancelPolicy: CANCEL_POLICY,
  },
  {
    id: "attr-3",
    category: "属性",
    theme: "同じ学校出身",
    concept: "同じ大学・高校出身者同士で懐かしい話に花を咲かせましょう。",
    date: "2月26日（水）",
    time: "20:00",
    weekday: "水",
    fullDateTime: "2月26日（水）20:00",
    participantCount: 5,
    price: 1500,
    areas: ["新宿", "池袋", "上野"],
    disabledAreas: ["中野", "高円寺", "新橋"],
    cancelPolicy: CANCEL_POLICY,
  },
  {
    id: "attr-4",
    category: "属性",
    theme: "English Speakers",
    concept: "Let's enjoy dinner and conversation in English!",
    date: "2月28日（金）",
    time: "19:30",
    weekday: "金",
    fullDateTime: "2月28日（金）19:30",
    participantCount: 5,
    price: 1500,
    areas: ["新宿"],
    disabledAreas: ["池袋", "中野", "高円寺", "上野", "新橋"],
    cancelPolicy: CANCEL_POLICY,
  },

  // ========== ゲイ独自の興味 ==========
  {
    id: "gay-1",
    category: "ゲイ独自の興味",
    theme: "身長-体重100以下",
    concept: "体型が近い方同士で気軽にお話しできるお食事会です。",
    date: "2月21日（金）",
    time: "20:00",
    weekday: "金",
    fullDateTime: "2月21日（金）20:00",
    participantCount: 5,
    price: 3000,
    areas: ["新宿", "中野"],
    disabledAreas: ["池袋", "高円寺", "上野", "新橋"],
    cancelPolicy: CANCEL_POLICY,
  },
  {
    id: "gay-2",
    category: "ゲイ独自の興味",
    theme: "デブ専",
    concept: "ぽっちゃり体型が好きな方・ぽっちゃり体型の方が集まるお食事会です。",
    date: "2月26日（水）",
    time: "19:00",
    weekday: "水",
    fullDateTime: "2月26日（水）19:00",
    participantCount: 5,
    price: 3000,
    areas: ["新宿", "池袋"],
    disabledAreas: ["中野", "高円寺", "上野", "新橋"],
    cancelPolicy: CANCEL_POLICY,
  },
  {
    id: "gay-3",
    category: "ゲイ独自の興味",
    theme: "アスパラベーコン",
    concept: "年の差カップルに興味がある方が集まるお食事会です。",
    date: "2月28日（金）",
    time: "20:00",
    weekday: "金",
    fullDateTime: "2月28日（金）20:00",
    participantCount: 5,
    price: 3000,
    areas: ["新宿"],
    disabledAreas: ["池袋", "中野", "高円寺", "上野", "新橋"],
    cancelPolicy: CANCEL_POLICY,
  },

  // Week 3
  {
    id: "basic-5",
    category: "ベーシック",
    theme: "ランダム",
    concept: "気軽に参加できる、初めての方も安心なカジュアルなお食事会です。",
    date: "3月5日（水）",
    time: "19:00",
    weekday: "水",
    fullDateTime: "3月5日（水）19:00",
    participantCount: 5,
    price: 1000,
    areas: ["新宿", "池袋", "上野"],
    disabledAreas: ["中野", "高円寺", "新橋"],
    cancelPolicy: CANCEL_POLICY,
  },
  {
    id: "attr-5",
    category: "属性",
    theme: "ワイン会",
    concept: "ワイン好き同士が集う会です。美味しいワインとお食事を楽しみましょう。",
    date: "3月7日（金）",
    time: "19:30",
    weekday: "金",
    fullDateTime: "3月7日（金）19:30",
    participantCount: 5,
    price: 1500,
    areas: ["新宿", "新橋"],
    disabledAreas: ["池袋", "中野", "高円寺", "上野"],
    cancelPolicy: CANCEL_POLICY,
  },
];

// Group events by category for display
export function getEventsByCategory() {
  const basic = EVENTS.filter(e => e.category === "ベーシック");
  const attr = EVENTS.filter(e => e.category === "属性");
  const gay = EVENTS.filter(e => e.category === "ゲイ独自の興味");
  
  return { basic, attr, gay };
}

export function getEventById(id: string): Event | undefined {
  return EVENTS.find(e => e.id === id);
}
