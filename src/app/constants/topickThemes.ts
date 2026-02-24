export const TOPICK_THEME_INFO = [
  {
    id: "start",
    title: "会のはじめのお題",
    description: "まずは安心して一言",
  },
  {
    id: "warm",
    title: "会をあたためるお題",
    description: "少しずつ場を広げる",
  },
  {
    id: "romance",
    title: "恋のお話し",
    description: "軽くときめきに触れる",
  },
  {
    id: "wild",
    title: "ありえないエピソード",
    description: "笑える体験で盛り上がる",
  },
  {
    id: "secret",
    title: "ちょっとシークレット",
    description: "軽い秘密で距離を縮める",
  },
  {
    id: "close",
    title: "会をしめるお題",
    description: "余韻をつくる",
  },
];

export type TopicCard = {
  question: string;
  hint: string;
};

export type TopicData = {
  title: string;
  description: string;
  cards: TopicCard[];
};

// Helper function to get theme info by ID
export function getThemeInfo(id: string) {
  return TOPICK_THEME_INFO.find((theme) => theme.id === id);
}
