import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Heart } from "lucide-react";
import { getConnections } from "../data/participants";

export function ConnectionResult() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Get connections from this event
    const allConnections = getConnections();
    // For demo, we'll show the first connection if any exist
    setConnections(allConnections);
  }, []);

  const handleViewSpecialSlot = () => {
    // Set flag to show special slot section on home
    localStorage.setItem("sakuraco_show_special_slot", "1");
    navigate("/home-special");
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  const hasConnection = connections.length > 0;

  // Success state - mutual connection exists
  if (hasConnection) {
    const connection = connections[0];
    const expiresDate = new Date(connection.expiresAt);

    return (
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Icon */}
          <div className="flex justify-center" style={{ marginBottom: "var(--spacing-lg)" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: connection.iconColor || "var(--green-600)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Heart
                className="w-10 h-10"
                style={{ color: "#fff" }}
                fill="#fff"
              />
            </div>
          </div>

          {/* Message */}
          <h1
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              textAlign: "center",
              marginBottom: "var(--spacing-sm)",
            }}
          >
            {connection.nickname}さんもあなたと次回２人で会いたいと思っています
          </h1>

          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--neutral-600)",
              textAlign: "center",
              marginBottom: "var(--spacing-xl)",
              lineHeight: 1.7,
            }}
          >
            次のお食事会を予約できます
          </p>

          {/* Connection Info Card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--green-100)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
              marginBottom: "var(--spacing-xl)",
            }}
          >
            <div className="flex items-center gap-3" style={{ marginBottom: "var(--spacing-md)" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: connection.iconColor || "var(--green-600)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Heart className="w-6 h-6" style={{ color: "#fff" }} fill="#fff" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: "var(--text-md)",
                    fontWeight: 500,
                    color: "var(--neutral-800)",
                  }}
                >
                  {connection.nickname}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--neutral-600)",
                  }}
                >
                  {connection.hobby}
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "var(--spacing-sm) var(--spacing-md)",
                background: "var(--green-50)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-sm)",
                color: "var(--neutral-700)",
              }}
            >
              {expiresDate.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}まで参加表明ができます
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleViewSpecialSlot}
            style={{
              width: "100%",
              minHeight: "var(--touch-comfortable)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-base)",
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
            ２人でのお食事会を見る
          </button>
        </div>
      </div>
    );
  }

  // Neutral state - no mutual connection
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="flex justify-center" style={{ marginBottom: "var(--spacing-lg)" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "var(--green-600)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart className="w-10 h-10" style={{ color: "#fff" }} />
          </div>
        </div>

        {/* Message */}
        <h1
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 500,
            color: "var(--neutral-800)",
            textAlign: "center",
            marginBottom: "var(--spacing-sm)",
          }}
        >
          ご参加ありがとうございました
        </h1>

        <p
          style={{
            fontSize: "var(--text-base)",
            color: "var(--neutral-600)",
            textAlign: "center",
            marginBottom: "var(--spacing-xl)",
            lineHeight: 1.7,
          }}
        >
          また次のお食事会でお会いしましょう
        </p>

        {/* CTA */}
        <button
          onClick={handleGoHome}
          style={{
            width: "100%",
            minHeight: "var(--touch-comfortable)",
            borderRadius: "var(--radius-full)",
            fontSize: "var(--text-base)",
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
  );
}