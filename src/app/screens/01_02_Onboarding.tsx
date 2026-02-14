import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const onboardingScreens = [
  {
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    text: "探して、選んで、誰かと会うこの時代に。\nあえて知らないまま同士で集まる。\n思いがけないリアルの偶然を、\n大切にするサービスです。",
  },
  {
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    text: "お食事会のテーマや日程・場所を選び、\nその日を待つだけです。",
  },
  {
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    text: "誰が来るのかは当日のお楽しみです。\n顔や体型の公開、事前のやりとりはありません。",
  },
  {
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    text: "少人数での開催です。\n大勢が苦手な人でも、気軽に参加できます。",
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
    if (isRightSwipe && currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
    }
  };
  
  const handleComplete = () => {
    localStorage.setItem("sakuraco_onboarding_complete", "true");
    navigate("/personality-question");
  };
  
  const isLastScreen = currentScreen === onboardingScreens.length - 1;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Swipeable Content */}
      <div
        className="flex-1 flex flex-col"
        style={{
          paddingBottom: "calc(88px + env(safe-area-inset-bottom))",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          {/* Image */}
          <div className="w-full max-w-sm mb-12">
            <ImageWithFallback
              src={onboardingScreens[currentScreen].image}
              alt={`オンボーディング ${currentScreen + 1}`}
              className="w-full h-72 object-cover"
              style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}
            />
          </div>
          
          {/* Text */}
          <div className="text-center max-w-md mb-12">
            <p
              className="whitespace-pre-line"
              style={{
                fontSize: "var(--text-base)",
                lineHeight: 1.9,
                color: "var(--neutral-700)",
                fontWeight: 400,
              }}
            >
              {onboardingScreens[currentScreen].text}
            </p>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex gap-2">
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
          {/* CTA - Only enabled on last screen */}
          {isLastScreen ? (
            <button
              onClick={handleComplete}
              className="w-full transition-all active:opacity-80"
              style={{
                minHeight: "var(--touch-comfortable)",
                background: "var(--green-600)",
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
              質問に答えて始める
            </button>
          ) : (
            <button
              onClick={handleComplete}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                color: "var(--neutral-500)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                minHeight: "var(--touch-min)",
                cursor: "pointer",
              }}
            >
              スキップ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}