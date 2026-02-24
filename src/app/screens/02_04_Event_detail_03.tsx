import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar, Users, MapPin, Clock, MessageCircle, ArrowLeft, AlertCircle, User } from "lucide-react";
import { getEventById } from "../data/events";
import { getMockParticipants, getParticipantHints } from "../data/participants";
import "../../styles/screens/event-detail-day.css";

const CONVERSATION_TOPICS = [
  "最近ハマっていることは？",
  "休日の過ごし方は？",
  "好きな食べ物は？",
  "最近観た映画やドラマは？",
  "行ってみたい場所は？",
];

const DELAY_OPTIONS = ["10分", "20分", "30分", "40分", "50分以上"];

export function EventDetailDay() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = eventId ? getEventById(eventId) : undefined;

  const [showRunningLateModal, setShowRunningLateModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedDelay, setSelectedDelay] = useState("30分");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-neutral-600">イベントが見つかりません</p>
      </div>
    );
  }

  const participants = getMockParticipants(event.id);
  const participantHints = getParticipantHints(participants);

  // Mock restaurant data
  const restaurant = {
    name: "和食ダイニング 緑々",
    address: "東京都新宿区新宿3-1-1",
    mapUrl: "https://maps.google.com",
  };

  const handleRunningLate = () => {
    setShowRunningLateModal(true);
  };

  const confirmRunningLate = () => {
    alert(`遅刻連絡を送信しました（予定到着時刻: ${selectedDelay}遅れ）`);
    setShowRunningLateModal(false);
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
    <div className="event-detail-container">
      {/* Header */}
      <div className="event-detail-header">
        <button
          onClick={() => navigate(-1)}
          className="event-detail-back-button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>戻る</span>
        </button>
      </div>

      <div className="event-detail-content">
        <div className="event-detail-max-width">
          {/* Event Info */}
          <div className="event-info-section">
            <div className="event-badge">本日開催</div>
            <h1 className="event-title">{event.theme}</h1>
            <div className="event-info-row">
              <Calendar className="event-info-icon" />
              <span>{event.fullDateTime}</span>
            </div>
            <div className="event-info-row">
              <Users className="event-info-icon" />
              <span>{event.participantCount}人</span>
            </div>
          </div>

          {/* Participant Hints */}
          <div className="card-section participant-section">
            <h2 className="card-title">参加者</h2>
            <p className="participant-hints-text">{participantHints}</p>

            {/* Participant Icons */}
            <div>
              <p className="participant-late-text">
                山田太郎さんは30分遅れます
              </p>
              <div className="participant-icons">
                {participants.map((participant) => (
                  <div key={participant.id} className="participant-icon">
                    <User className="w-5 h-5" style={{ color: "var(--green-600)" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="card-section">
            <h2 className="card-title">レストラン情報</h2>
            <div className="restaurant-info-item">
              <p className="restaurant-name">{restaurant.name}</p>
              <div className="restaurant-address">
                <MapPin className="restaurant-address-icon" />
                <span>{restaurant.address}</span>
              </div>
            </div>

            <a
              href={restaurant.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="map-button"
            >
              地図を開く
            </a>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={handleRunningLate}
              className="button-base button-secondary"
            >
              <Clock className="w-5 h-5" />
              <span>当日遅れます</span>
            </button>

            <button
              onClick={handleCancel}
              className="button-base button-danger"
            >
              <AlertCircle className="w-5 h-5" />
              <span>キャンセル</span>
            </button>
          </div>

          {/* Conversation Topics - Card Click Navigation */}
          <button
            onClick={() => navigate("/topick", { state: { fromEventDetail: true, eventId } })}
            className="card-section conversation-card"
            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
          >
            <div className="card-section" style={{ borderColor: "var(--green-100)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                <MessageCircle className="w-6 h-6" style={{ color: "var(--green-600)", flexShrink: 0 }} />
                <div>
                  <h2 className="card-title" style={{ marginBottom: 0 }}>会話のお題</h2>
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--neutral-600)", marginTop: "var(--spacing-xs)" }}>
                    困ったらここからひとつ選んでみてください
                  </p>
                </div>
              </div>
            </div>
          </button>

          {/* Feedback CTA */}
          <div className="card-section feedback-section">
            <h2 className="card-title">お食事会終了後のきもち</h2>
            <p className="feedback-description">
              お食事会が終わりましたら、ぜひ今日の体験を教えてください。
            </p>
            <button
              onClick={handleGoToFeedback}
              className="button-primary"
            >
              きもちを記録する
            </button>
          </div>
        </div>
      </div>

      {/* Running Late Modal */}
      {showRunningLateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowRunningLateModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">予定到着時刻を選択</h3>
            <p className="modal-description">
              どれくらい遅れそうですか？
            </p>
            <div className="delay-options">
              {DELAY_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedDelay(option)}
                  className={`delay-button ${selectedDelay === option ? "selected" : ""}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowRunningLateModal(false)}
                className="modal-button modal-button-secondary"
              >
                キャンセル
              </button>
              <button
                onClick={confirmRunningLate}
                className="modal-button modal-button-primary"
              >
                連絡する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowCancelConfirm(false)}
        >
          <div
            className="modal-content modal-content-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-title">キャンセルしますか？</h3>
            <p className="modal-description">
              当日キャンセルの場合、参加費の100%をキャンセル料として頂戴します。
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="modal-button modal-button-secondary"
              >
                戻る
              </button>
              <button
                onClick={confirmCancel}
                className="modal-button modal-button-danger"
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
