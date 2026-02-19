import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Users, Clock } from "lucide-react";
import { getConnections } from "../data/participants";

export function SpecialHomeAfterLogin() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if special slot flag is set
    const showSpecialSlot = localStorage.getItem("sakuraco_show_special_slot");
    
    if (showSpecialSlot === "1") {
      const allConnections = getConnections();
      setConnections(allConnections);
    }
  }, []);

  const handleSpecialSlotClick = (connection: any) => {
    navigate(`/event/special-${connection.participantId}`);
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  // Empty state - no flag or no connections
  const showSpecialSlot = localStorage.getItem("sakuraco_show_special_slot");
  if (showSpecialSlot !== "1" || connections.length === 0) {
    return (
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-sm)",
            }}
          >
            特別枠
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--neutral-500)",
              fontWeight: 500,
              marginBottom: "var(--spacing-xl)",
            }}
          >
            期限内に参加表明できる、2人のお食事会です
          </p>

          <div
            className="flex items-center justify-center"
            style={{ minHeight: "40vh" }}
          >
            <div className="text-center">
              <p
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--neutral-500)",
                  marginBottom: "var(--spacing-lg)",
                }}
              >
                現在、特別枠はありません
              </p>
              <button
                onClick={handleGoHome}
                style={{
                  minHeight: "var(--touch-comfortable)",
                  padding: "0 var(--spacing-xl)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  border: "1.5px solid var(--green-600)",
                  background: "transparent",
                  color: "var(--green-700)",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  transition: "all 0.2s",
                }}
              >
                ホームへ戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - connections exist
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <h1
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-xs)",
            }}
          >
            特別枠
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--neutral-500)",
              fontWeight: 500,
            }}
          >
            期限内に参加表明できる、2人のお食事会です
          </p>
        </div>

        {/* Special Slot Cards */}
        <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
          {connections.map((connection) => {
            const expiresDate = new Date(connection.expiresAt);
            const now = new Date();
            const daysLeft = Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={connection.participantId}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--green-100)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--spacing-lg)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Expiry Label */}
                <div
                  style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    borderRadius: "var(--radius-full)",
                    background: "var(--green-50)",
                    color: "var(--green-700)",
                    marginBottom: "var(--spacing-sm)",
                  }}
                >
                  特別枠（{expiresDate.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}まで参加表明ができます）
                </div>

                {/* Main Description */}
                <p
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--neutral-800)",
                    lineHeight: 1.7,
                    marginBottom: "var(--spacing-md)",
                  }}
                >
                  先日同席した{connection.nickname}さんもあなたと次回２人で会いたいと思っています。{connection.nickname}さんとのお食事です。
                </p>

                {/* Info Row */}
                <div
                  className="flex items-center gap-4"
                  style={{ marginBottom: "var(--spacing-md)" }}
                >
                  {/* Participants */}
                  <div
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--neutral-600)",
                      fontWeight: 500,
                    }}
                  >
                    <Users className="w-4 h-4" style={{ color: "var(--green-600)" }} />
                    <span>2人</span>
                  </div>

                  {/* Days Left */}
                  <div
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--neutral-600)",
                      fontWeight: 500,
                    }}
                  >
                    <Clock className="w-4 h-4" style={{ color: "var(--green-600)" }} />
                    <span>あと{daysLeft}日</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSpecialSlotClick(connection)}
                  style={{
                    width: "100%",
                    minHeight: "var(--touch-comfortable)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    border: "none",
                    background: "var(--green-600)",
                    color: "#fff",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                    transition: "all 0.2s",
                    boxShadow: "0 2px 8px rgba(23,117,104,0.28)",
                  }}
                >
                  詳細を見る
                </button>
              </div>
            );
          })}
        </div>

        {/* Back to Home */}
        <div style={{ marginTop: "var(--spacing-xl)", textAlign: "center" }}>
          <button
            onClick={handleGoHome}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "var(--touch-comfortable)",
              padding: "0 var(--spacing-lg)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              border: "1.5px solid var(--neutral-300)",
              background: "transparent",
              color: "var(--neutral-700)",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.2s",
            }}
          >
            通常のホームへ戻る
          </button>
        </div>
      </div>
    </div>
  );
}
