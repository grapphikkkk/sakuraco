import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function HomeBeforeLogin() {
  const navigate = useNavigate();
  
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
        <div className="w-full max-w-md mb-12">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
            alt="温かい食事の雰囲気"
            className="w-full h-64 object-cover"
            style={{ borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}
          />
        </div>
        
        {/* Concept Copy */}
        <div className="text-center mb-12 max-w-md">
          <p
            className="mb-6"
            style={{
              fontSize: "var(--text-lg)",
              lineHeight: 1.8,
              color: "var(--neutral-800)",
              fontWeight: 300,
            }}
          >
            そこにあるのは、思いがけない
            <br />友情かもしれないし、
            <br />
            ときめきかもしれない
          </p>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--neutral-500)",
              fontWeight: 500,
            }}
          >
            僕と僕らのためのお食事会
          </p>
        </div>
        
        {/* CTA Button — Primary (green-600), pill shape, full-width on mobile */}
        <button
          onClick={() => navigate("/account-creation")}
          className="w-full max-w-md transition-all active:opacity-80"
          style={{
            height: "48px",
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
          はじめる
        </button>
        
        {/* Disclaimer */}
        <p
          className="mt-8 text-center px-6 max-w-md"
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
