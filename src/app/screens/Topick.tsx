import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const TOPICK_THEMES = [
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
    title: "好きなタイプ・恋バナ",
    description: "軽くときめきに触れる",
  },
  {
    id: "wild",
    title: "ありえないエピソード",
    description: "笑える体験で盛り上がる",
  },
  {
    id: "secret",
    title: "ちょいシークレット",
    description: "軽い秘密で距離を縮める",
  },
  {
    id: "close",
    title: "会をしめるお題",
    description: "余韻をつくる",
  },
];

export function Topick() {
  const navigate = useNavigate();
  const handleClose = () => {
    const returnPath = sessionStorage.getItem("topick-return");
    if (returnPath) {
      navigate(returnPath);
      return;
    }
    navigate(-1);
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
          onClick={() => navigate(-1)}
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
          <h1
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-sm)",
            }}
          >
            今日の会話のお題
          </h1>
          <div
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--neutral-600)",
              lineHeight: 1.8,
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <p>困ったら、ここからひとつ選んでみてください。</p>
            <p>1つのお題の目安：5〜10分（途中で変えてOK）</p>
          </div>

          <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
            {TOPICK_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => navigate(`/topick/${theme.id}`)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <Card style={{ borderColor: "var(--green-100)" }}>
                  <CardHeader>
                    <CardTitle
                      style={{
                        fontSize: "var(--text-md)",
                        fontWeight: 500,
                        color: "var(--neutral-800)",
                      }}
                    >
                      {theme.title}
                    </CardTitle>
                    <CardDescription
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--neutral-600)",
                      }}
                    >
                      {theme.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </button>
            ))}
          </div>

          <button
            onClick={handleClose}
            style={{
              width: "100%",
              minHeight: "var(--touch-min)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-base)",
              fontWeight: 500,
              border: "1.5px solid var(--neutral-400)",
              background: "transparent",
              color: "var(--neutral-700)",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              marginTop: "var(--spacing-lg)",
            }}
          >
            お題を閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
