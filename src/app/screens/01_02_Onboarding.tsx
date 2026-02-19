import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const onboardingScreens = [
  {
    title: "SakuraCoとは？",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    text: "探して、選んで、誰かと会うこの時代に。\nあえて知らないまま同士で集まる。\n\n思いがけないリアルの偶然を、\n大切にするサービスです。",
  },
  {
    title: "初対面同士でみんなで会う",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    text: "少人数のお食事会に参加します\n当日まで誰が来るのかはわかりません",
  },
  {
    title: "合わない人が来るんじゃ！？",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    text: "いくつか質問の回答に基づき\nあなたと気が合いそうな人が参加します",
  },
  {
    title: "会はテーマ別でも選べる",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    text: "タメ会やワイン会など、\n年齢や趣味が合う会も選べます！",
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  
  const handleComplete = () => {
    localStorage.setItem("sakuraco_onboarding_complete", "true");
    navigate("/personality-question");
  };
  
  const isLastScreen = currentScreen === onboardingScreens.length - 1;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Content */}
      <div className="flex-1 flex flex-col" style={{ paddingBottom: "calc(120px + env(safe-area-inset-bottom))" }}>
        <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8 pb-8" style={{ minHeight: 520 }}>
          {/* Title */}
          <div className="w-full max-w-md mb-6 text-center">
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--neutral-800)", margin: 0 }}>
              {onboardingScreens[currentScreen].title}
            </h2>
          </div>

          {/* Image */}
          <div className="w-full max-w-sm mb-6">
            <ImageWithFallback
              src={onboardingScreens[currentScreen].image}
              alt={`オンボーディング ${currentScreen + 1}`}
              className="w-full h-64 object-cover"
              style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}
            />
          </div>

          {/* Text */}
          <div className="text-center max-w-md mb-6">
            <p className="whitespace-pre-line" style={{ fontSize: "var(--text-base)", lineHeight: 1.9, color: "var(--neutral-700)", fontWeight: 400 }}>
              {onboardingScreens[currentScreen].text}
            </p>
          </div>

          {/* Pagination Dots */}
          <div className="flex gap-2 mb-2">
            {onboardingScreens.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentScreen(index)}
                className="transition-all"
                style={{
                  height: "8px",
                  width: index === currentScreen ? "32px" : "8px",
                  borderRadius: "var(--radius-full)",
                  background: index === currentScreen ? "var(--green-600)" : "var(--neutral-300)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  minHeight: 0,
                }}
                aria-label={`スクリーン ${index + 1}へ移動`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed CTA Container */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          background: "var(--bg-card)",
          borderTop: "1px solid var(--green-100)",
          padding: "var(--spacing-md) var(--spacing-lg)",
          paddingBottom: "calc(var(--spacing-md) + env(safe-area-inset-bottom))",
        }}
      >
        <div className="max-w-md mx-auto">
          <button
            onClick={() => {
              if (isLastScreen) handleComplete(); else setCurrentScreen((s) => s + 1);
            }}
            className="w-full transition-all active:opacity-80"
            style={{
              minHeight: "var(--touch-comfortable)",
              background: isLastScreen ? "var(--green-600)" : "var(--green-600)",
              color: "#fff",
              borderRadius: "var(--radius-full)",
              border: "none",
              fontWeight: 500,
              fontSize: "var(--text-sm)",
              letterSpacing: "0.03em",
              boxShadow: "0 2px 8px rgba(23,117,104,0.28)",
              cursor: "pointer",
            }}
          >
            {isLastScreen ? "質問に答えて始める" : "次へ"}
          </button>

          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <button
              onClick={handleComplete}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--neutral-500)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              スキップ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}