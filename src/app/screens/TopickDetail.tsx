import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

type TopicCard = {
  question: string;
  hint: string;
};

type TopicData = {
  title: string;
  description: string;
  cards: TopicCard[];
};

const TOPICK_DATA: Record<string, TopicData> = {
  start: {
    title: "会のはじめのお題",
    description: "まずは安心して一言",
    cards: [
      {
        question: "まずは自己紹介（30秒）",
        hint: "ニックネーム／今日の気分／最近よかったこと",
      },
      {
        question: "乾杯のひとこと",
        hint: "気軽な一言でOK",
      },
      {
        question: "最近ハマっているもの",
        hint: "ジャンルはなんでもOK",
      },
      {
        question: "最近行ってよかった場所",
        hint: "思い出話を一つだけ",
      },
      {
        question: "今の気分を色で言うと？",
        hint: "理由も一言添えると楽しい",
      },
      {
        question: "今週のちょっとよかったこと",
        hint: "小さなことでOK",
      },
    ],
  },
  warm: {
    title: "会をあたためるお題",
    description: "少しずつ場を広げる",
    cards: [
      {
        question: "休日の理想の過ごし方は？",
        hint: "インドアでもOK",
      },
      {
        question: "最近ちょっと笑ったこと",
        hint: "軽いエピソードでOK",
      },
      {
        question: "最近“買ってよかったもの”",
        hint: "身近なものでもOK",
      },
      {
        question: "子どもの頃好きだったもの",
        hint: "思い出と一緒に",
      },
      {
        question: "もし1日だけ自由なら何する？",
        hint: "理想でも現実でもOK",
      },
      {
        question: "最近ちょっと挑戦したこと",
        hint: "小さな挑戦でもOK",
      },
      {
        question: "ぶっちゃけ今日はどんな気持ちで来た？",
        hint: "場を楽しみたい／友達できたら嬉しい／ときめき期待／まだわからない",
      },
    ],
  },
  romance: {
    title: "好きなタイプ・恋バナ",
    description: "軽くときめきに触れる",
    cards: [
      {
        question: "好きなタイプは？",
        hint: "性格・雰囲気どちらでも",
      },
      {
        question: "見た目と性格、どっち重視？",
        hint: "今の気分でOK",
      },
      {
        question: "惹かれるポイントを1つ",
        hint: "小さなことでもOK",
      },
      {
        question: "理想の初回デートは？",
        hint: "気軽な内容でOK",
      },
      {
        question: "ときめく瞬間ってどんな時？",
        hint: "日常の中からでもOK",
      },
      {
        question: "逆にこれはちょっと苦手…をやわらかく",
        hint: "やわらかい言い方でOK",
      },
    ],
  },
  wild: {
    title: "ありえないエピソード",
    description: "笑える体験で盛り上がる",
    cards: [
      {
        question: "こんな“ありえない人”に出会ったことある？",
        hint: "笑える範囲でOK",
      },
      {
        question: "ありえない彼氏エピソード（明るく話せる範囲で）",
        hint: "無理のない範囲でOK",
      },
      {
        question: "今思うと不思議だった出会い",
        hint: "短くてもOK",
      },
      {
        question: "言われてびっくりした一言",
        hint: "笑える内容でOK",
      },
      {
        question: "人生で一番“なんで？”と思った出来事",
        hint: "軽めの話でOK",
      },
      {
        question: "こんなデートは二度とない、と思った話",
        hint: "楽しい話でOK",
      },
    ],
  },
  secret: {
    title: "ちょいシークレット",
    description: "軽い秘密で距離を縮める",
    cards: [
      {
        question: "密かな推し",
        hint: "軽めの推しトークでOK",
      },
      {
        question: "実はちょっと憧れていること（軽め）",
        hint: "気軽に話せる内容でOK",
      },
      {
        question: "人には言わない自分ルール",
        hint: "軽いマイルールでOK",
      },
      {
        question: "最近こっそり始めたこと",
        hint: "小さなことでもOK",
      },
      {
        question: "実はこう見えて○○",
        hint: "驚きポイントがあればOK",
      },
      {
        question: "ここだけの小さな野望（重くないもの）",
        hint: "ライトな目標でOK",
      },
    ],
  },
  close: {
    title: "会をしめるお題",
    description: "余韻をつくる",
    cards: [
      {
        question: "今日いちばん印象に残った話題",
        hint: "一言だけでもOK",
      },
      {
        question: "今日の会を一言で",
        hint: "短くてもOK",
      },
      {
        question: "次に行くならどんな会？",
        hint: "妄想でもOK",
      },
      {
        question: "今日の“よかった”を1つ持ち帰ると？",
        hint: "小さなことでOK",
      },
      {
        question: "最後に、みんなへ一言",
        hint: "感謝や一言でOK",
      },
    ],
  },
};

export function TopickDetail() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const topic = useMemo(() => {
    if (!topicId) return undefined;
    return TOPICK_DATA[topicId];
  }, [topicId]);

  const totalCards = topic?.cards.length ?? 0;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!topicId || !totalCards) return;
    const saved = sessionStorage.getItem(`topick-progress-${topicId}`);
    const nextIndex = saved ? Math.max(0, Math.min(Number(saved), totalCards - 1)) : 0;
    setCurrentIndex(nextIndex);
  }, [topicId, totalCards]);

  useEffect(() => {
    if (!topicId || !totalCards) return;
    sessionStorage.setItem(`topick-progress-${topicId}`, String(currentIndex));
  }, [topicId, totalCards, currentIndex]);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p style={{ color: "var(--neutral-600)" }}>お題が見つかりません</p>
      </div>
    );
  }

  const card = topic.cards[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCards - 1;

  const handleNext = () => {
    if (isLast) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--green-100)",
          padding: "var(--spacing-md) var(--spacing-lg)",
        }}
      >
        <button
          onClick={() => navigate("/topick")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--spacing-xs)",
            minHeight: "var(--touch-min)",
            color: "var(--neutral-700)",
            fontSize: "var(--text-base)",
            fontWeight: 500,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>戻る</span>
        </button>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "var(--text-lg)",
                  fontWeight: 500,
                  color: "var(--neutral-800)",
                  marginBottom: "4px",
                }}
              >
                {topic.title}
              </h1>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--neutral-600)",
                }}
              >
                {topic.description}
              </p>
            </div>
            <div
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-600)",
                fontWeight: 500,
              }}
            >
              {currentIndex + 1}/{totalCards}
            </div>
          </div>

          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--green-100)",
              padding: "var(--spacing-xl)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              marginBottom: "var(--spacing-xl)",
            }}
          >
            <div
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 600,
                color: "var(--neutral-800)",
                lineHeight: 1.6,
                marginBottom: "var(--spacing-md)",
              }}
            >
              {card.question}
            </div>
            <div
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-600)",
                lineHeight: 1.7,
                marginBottom: "var(--spacing-lg)",
              }}
            >
              {card.hint}
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--neutral-500)",
                marginBottom: "var(--spacing-xs)",
              }}
            >
              目安：5〜10分
            </div>
            <div
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--neutral-500)",
              }}
            >
              パスして次でもOK
            </div>
          </div>

          <div className="flex gap-2" style={{ marginBottom: "var(--spacing-md)" }}>
            {isLast ? (
              <>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    minHeight: "var(--touch-min)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-base)",
                    fontWeight: 500,
                    border: "1.5px solid var(--neutral-400)",
                    background: "transparent",
                    color: "var(--neutral-700)",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  最初に戻る
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    flex: 1,
                    minHeight: "var(--touch-min)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-base)",
                    fontWeight: 500,
                    border: "none",
                    background: "var(--green-600)",
                    color: "#fff",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  次へ
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handlePrev}
                  disabled={isFirst}
                  style={{
                    flex: 1,
                    minHeight: "var(--touch-min)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-base)",
                    fontWeight: 500,
                    border: "1.5px solid var(--neutral-400)",
                    background: "transparent",
                    color: isFirst ? "var(--neutral-400)" : "var(--neutral-700)",
                    cursor: isFirst ? "not-allowed" : "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  戻る
                </button>
                <button
                  onClick={handleNext}
                  style={{
                    flex: 1,
                    minHeight: "var(--touch-min)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-base)",
                    fontWeight: 500,
                    border: "none",
                    background: "var(--green-600)",
                    color: "#fff",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  次へ
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => navigate("/topick")}
            style={{
              width: "100%",
              minHeight: "var(--touch-min)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              border: "1.5px solid var(--neutral-300)",
              background: "transparent",
              color: "var(--neutral-600)",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            テーマ一覧へ戻る
          </button>
        </div>
      </div>
    </div>
  );
}
