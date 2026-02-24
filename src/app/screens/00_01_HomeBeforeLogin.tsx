import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

export function HomeBeforeLogin() {
  const navigate = useNavigate();
  const [snsProvider, setSnsProvider] = useState<string | null>(null);

  const snsButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    width: "100%",
    minHeight: "var(--touch-comfortable)",
    borderRadius: "var(--radius-md)",
    border: isSelected ? "1.5px solid var(--green-600)" : "1.5px solid var(--neutral-300)",
    background: isSelected ? "var(--green-600)" : "#fff",
    color: isSelected ? "#fff" : "var(--neutral-800)",
    fontWeight: 500,
    fontSize: "var(--text-base)",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Brand Logo */}
        <div className="mb-12">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-brand)",
              fontWeight: 300,
              letterSpacing: "0.1em",
              color: "var(--green-700)",
            }}
          >
            SakuraCo
          </h1>
        </div>

        {/* Hero Visual */}
        <div className="w-full max-w-md mb-8">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
            alt="温かい食事の雰囲気"
            className="w-full h-56 object-cover"
            style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}
          />
        </div>

        {/* Concept Copy */}
        <div className="text-center mb-6 max-w-md">
          <p
            className="mb-4"
            style={{
              fontSize: "var(--text-lg)",
              lineHeight: 1.8,
              color: "var(--neutral-800)",
              fontWeight: 300,
            }}
          >
            そこにあるのは、思いがけない
            <br />友情かもしれないし、ときめきかもしれない
          </p>
        </div>

        {/* SNS Auth Buttons (moved here instead of はじめる) */}
        <div className="w-full max-w-md mb-6">
          <div style={{ marginBottom: "var(--spacing-sm)", fontSize: "var(--text-sm)", color: "var(--neutral-700)", fontWeight: 500 }}>SNS認証</div>
          <div className="flex flex-col gap-3">
            {["google", "line", "facebook"].map((provider) => {
              const labels: Record<string, string> = {
                google: "Googleで続ける",
                line: "LINEで続ける",
                facebook: "Facebookで続ける",
              };
              return (
                <button
                  key={provider}
                  onClick={() => {
                    setSnsProvider(provider);
                    navigate(`/auth/mock?provider=${provider}`);
                  }}
                  style={snsButtonStyle(snsProvider === provider)}
                >
                  {labels[provider]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md mb-6 flex items-center gap-4">
          <div style={{ flex: 1, height: "1px", background: "var(--neutral-300)" }} />
          <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)", fontWeight: 400 }}>または</span>
          <div style={{ flex: 1, height: "1px", background: "var(--neutral-300)" }} />
        </div>

        {/* Email Registration Button */}
        <div className="w-full max-w-md mb-6">
          <button
            onClick={() => navigate("/email-verification")}
            style={{
              width: "100%",
              minHeight: "var(--touch-comfortable)",
              borderRadius: "var(--radius-md)",
              border: "1.5px solid var(--green-600)",
              background: "#fff",
              color: "var(--green-700)",
              fontWeight: 500,
              fontSize: "var(--text-base)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            メールアドレスで登録
          </button>
        </div>

        {/* Disclaimer */}
        <p
          className="mt-4 text-center px-6 max-w-md"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--neutral-500)",
            fontWeight: 500,
            lineHeight: 1.9,
          }}
        >
          男性同士の交流を目的としています。当事者以外の利用は固くお断りします。
        </p>
      </div>
    </div>
  );
}
