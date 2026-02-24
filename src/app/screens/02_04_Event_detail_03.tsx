import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar, Users, MapPin, Clock, MessageCircle, ArrowLeft, AlertCircle, User } from "lucide-react";
import { getEventById } from "../data/events";
import { getMockParticipants, getParticipantHints } from "../data/participants";

export function EventDetailDay() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = eventId ? getEventById(eventId) : undefined;

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRunningLateModal, setShowRunningLateModal] = useState(false);
  const [selectedDelay, setSelectedDelay] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p style={{ color: "var(--neutral-600)" }}>イベントが見つかりません</p>
      </div>
    );
  }

  const participants = getMockParticipants(event.id);
  const participantHints = getParticipantHints(participants);
  const lateParticipantName = participants[0]?.nickname ?? "○○";

  // Mock restaurant data
  const restaurant = {
    name: "和食ダイニング 緑々",
    address: "東京都新宿区新宿3-1-1",
    mapUrl: "https://maps.google.com",
  };

  const handleRunningLate = () => {
    setSelectedDelay(null);
    setShowRunningLateModal(true);
  };

  const handleSubmitLate = () => {
    setShowRunningLateModal(false);
    setSelectedDelay(null);
    // TODO: 実装時に通知APIを呼び出す
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    alert("キャンセルが確定しました");
    setShowCancelConfirm(false);
    navigate("/home");
  };

  const handleGoToFeedback = () => {
    navigate(`/feedback/${event.id}`);
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
          {/* Event Info */}
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <div
              style={{
                display: "inline-block",
                padding: "4px 12px",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                borderRadius: "var(--radius-full)",
                background: "var(--green-600)",
                color: "#fff",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              本日開催
            </div>

            <h1
              style={{
                fontSize: "var(--text-xl)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              {event.theme}
            </h1>

            <div
              className="flex items-center gap-2"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--neutral-700)",
                fontWeight: 500,
                marginBottom: "var(--spacing-xs)",
              }}
            >
              <Calendar className="w-4 h-4" style={{ color: "var(--green-600)" }} />
              <span>{event.fullDateTime}</span>
            </div>

            <div
              className="flex items-center gap-2"
              style={{
                fontSize: "var(--text-base)",
                color: "var(--neutral-700)",
                fontWeight: 500,
              }}
            >
              <Users className="w-4 h-4" style={{ color: "var(--green-600)" }} />
              <span>{event.participantCount}人</span>
            </div>
          </div>

          {/* Participant Hints */}
          <div
            style={{
              background: "var(--green-50)",
              border: "1px solid var(--green-200)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              参加者
            </h2>
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--neutral-700)",
                lineHeight: 1.7,
                marginBottom: "var(--spacing-md)",
              }}
            >
              {participantHints}
            </p>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-600)",
                lineHeight: 1.7,
                marginBottom: "var(--spacing-md)",
              }}
            >
              {lateParticipantName}さんは30分遅刻しそうです。
            </p>

            {/* Participant Icons */}
            <div>
              <div className="flex gap-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "var(--green-50)",
                      border: "1px solid var(--green-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "default",
                    }}
                  >
                    <User className="w-5 h-5" style={{ color: "var(--green-600)" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Restaurant Info */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--green-100)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              レストラン情報
            </h2>

            <div style={{ marginBottom: "var(--spacing-sm)" }}>
              <p
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--neutral-800)",
                  fontWeight: 500,
                  marginBottom: "4px",
                }}
              >
                {restaurant.name}
              </p>
              <div
                className="flex items-start gap-2"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--neutral-600)",
                }}
              >
                <MapPin className="w-4 h-4" style={{ marginTop: "2px", color: "var(--green-600)" }} />
                <span>{restaurant.address}</span>
              </div>
            </div>

            <a
              href={restaurant.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
                minHeight: "var(--touch-min)",
                padding: "0 var(--spacing-md)",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                border: "1.5px solid var(--green-600)",
                background: "transparent",
                color: "var(--green-700)",
                textDecoration: "none",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                transition: "all 0.2s",
              }}
            >
              地図を開く
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
            <button
              onClick={handleRunningLate}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--spacing-xs)",
                width: "100%",
                minHeight: "var(--touch-comfortable)",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-base)",
                fontWeight: 500,
                border: "1.5px solid var(--neutral-300)",
                background: "transparent",
                color: "var(--neutral-700)",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                transition: "all 0.2s",
              }}
            >
              <Clock className="w-5 h-5" />
              <span>当日遅れます</span>
            </button>

            <button
              onClick={handleCancel}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--spacing-xs)",
                width: "100%",
                minHeight: "var(--touch-comfortable)",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-base)",
                fontWeight: 500,
                border: "1.5px solid var(--neutral-300)",
                background: "transparent",
                color: "var(--destructive)",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
                transition: "all 0.2s",
              }}
            >
              <AlertCircle className="w-5 h-5" />
              <span>キャンセル</span>
            </button>
          </div>

          {/* Conversation Topics */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--green-100)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <button
              onClick={() => {
                sessionStorage.setItem("topick-return", `/event-day/${event.id}`);
                navigate("/topick");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
                width: "100%",
                minHeight: "var(--touch-min)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <MessageCircle className="w-5 h-5" style={{ color: "var(--green-600)" }} />
              <span
                style={{
                  flex: 1,
                  textAlign: "left",
                  fontSize: "var(--text-md)",
                  fontWeight: 500,
                  color: "var(--neutral-800)",
                }}
              >
                会話のお題
              </span>
              <span style={{ color: "var(--neutral-400)" }}>›</span>
            </button>
          </div>

          {/* Feedback CTA */}
          <div
            style={{
              background: "linear-gradient(135deg, var(--green-50) 0%, var(--bg-card) 100%)",
              border: "1px solid var(--green-200)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              お食事会終了後のきもち
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-600)",
                marginBottom: "var(--spacing-md)",
                lineHeight: 1.7,
              }}
            >
              お食事会が終わりましたら、ぜひ今日の体験を教えてください。
            </p>
            <button
              onClick={handleGoToFeedback}
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
              }}
            >
              きもちを記録する
            </button>
          </div>
        </div>
      </div>

      {/* Running Late Modal */}
      {showRunningLateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--overlay)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--spacing-lg)",
            zIndex: 100,
          }}
          onClick={() => setShowRunningLateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: "var(--radius-xl)",
              padding: "var(--spacing-xl)",
              maxWidth: "320px",
              width: "100%",
            }}
          >
            <h3
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-sm)",
                textAlign: "center",
              }}
            >
              どのくらい遅れそうですか？
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-600)",
                textAlign: "center",
                marginBottom: "var(--spacing-lg)",
                lineHeight: 1.6,
              }}
            >
              参加者のみなさんに事前にお知らせされます。
            </p>

            {/* Delay Options */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--spacing-sm)",
                justifyContent: "center",
                marginBottom: "var(--spacing-xl)",
              }}
            >
              {["10分", "20分", "30分", "40分", "50分以上"].map((delay) => (
                <button
                  key={delay}
                  onClick={() => setSelectedDelay(delay)}
                  style={{
                    minHeight: "var(--touch-min)",
                    padding: "0 var(--spacing-md)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    border: `1.5px solid ${
                      selectedDelay === delay ? "var(--green-600)" : "var(--neutral-400)"
                    }`,
                    background: selectedDelay === delay ? "var(--green-600)" : "transparent",
                    color: selectedDelay === delay ? "#fff" : "var(--neutral-700)",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                    transition: "all 0.15s ease",
                  }}
                >
                  {delay}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowRunningLateModal(false)}
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
                戻る
              </button>
              <button
                onClick={handleSubmitLate}
                disabled={!selectedDelay}
                style={{
                  flex: 1,
                  minHeight: "var(--touch-min)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-base)",
                  fontWeight: 500,
                  border: "none",
                  background: selectedDelay ? "var(--green-600)" : "var(--neutral-200)",
                  color: selectedDelay ? "#fff" : "var(--neutral-400)",
                  cursor: selectedDelay ? "pointer" : "not-allowed",
                  WebkitTapHighlightColor: "transparent",
                  transition: "all 0.15s ease",
                }}
              >
                送信する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--overlay)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--spacing-lg)",
            zIndex: 100,
          }}
          onClick={() => setShowCancelConfirm(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#FFFFFF",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <h3
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              キャンセルしますか？
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-600)",
                marginBottom: "var(--spacing-lg)",
                lineHeight: 1.7,
              }}
            >
              当日キャンセルの場合、参加費の100%をキャンセル料として頂戴します。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
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
                戻る
              </button>
              <button
                onClick={confirmCancel}
                style={{
                  flex: 1,
                  minHeight: "var(--touch-min)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "var(--text-base)",
                  fontWeight: 500,
                  border: "none",
                  background: "var(--destructive)",
                  color: "#fff",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                キャンセル確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}