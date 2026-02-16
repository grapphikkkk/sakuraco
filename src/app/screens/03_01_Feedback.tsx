import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { getEventById } from "../data/events";
import { getMockParticipants, saveFeedback, processFeedback, saveConnections, EventFeedback, Feedback } from "../data/participants";

const OVERALL_RATINGS = [
  { value: 1, label: "とても悪かった" },
  { value: 2, label: "悪かった" },
  { value: 3, label: "普通" },
  { value: 4, label: "良かった" },
  { value: 5, label: "とても良かった" },
] as const;

const PARTICIPANT_RATINGS = [
  { value: "disruptive", label: "会を乱す行動あり" },
  { value: "absent", label: "欠席した" },
  { value: "no", label: "会いたくない" },
  { value: "neutral", label: "同席してもよい" },
  { value: "yes", label: "次回は２人で会いたい" },
] as const;

const ICON_COLORS: Record<string, string> = {
  green: "#177568",
  blue: "#3B82F6",
  purple: "#A855F7",
  orange: "#F97316",
  pink: "#E8507A",
};

export function FeedbackScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = eventId ? getEventById(eventId) : undefined;
  const participants = eventId ? getMockParticipants(eventId) : [];

  const [overallRating, setOverallRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [overallComment, setOverallComment] = useState("");
  const [experienceComment, setExperienceComment] = useState("");
  const [participantFeedbacks, setParticipantFeedbacks] = useState<Record<string, Feedback["rating"]>>({});

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

  const handleParticipantRating = (participantId: string, rating: Feedback["rating"]) => {
    setParticipantFeedbacks(prev => ({
      ...prev,
      [participantId]: rating,
    }));
  };

  const canSubmit = () => {
    if (!overallRating) return false;
    // Check that all participants have been rated
    return participants.every(p => participantFeedbacks[p.id]);
  };

  const handleSubmit = () => {
    if (!canSubmit() || !overallRating) return;

    const feedback: EventFeedback = {
      eventId: event.id,
      overallRating,
      overallComment,
      experienceComment,
      participantFeedbacks: participants.map(p => ({
        participantId: p.id,
        rating: participantFeedbacks[p.id],
      })),
      submittedAt: new Date().toISOString(),
    };

    // Save feedback
    saveFeedback(feedback);

    // Process for connections
    const connections = processFeedback(event.id, feedback);
    if (connections.length > 0) {
      saveConnections(connections);
    }

    // ✅ 追加：プロトタイプ用（yesを押した相手だけを保存）
    const yesPeople = participants
      .filter((p) => participantFeedbacks[p.id] === "yes")
      .map((p) => ({
        participantId: p.id,
        participantNickname: p.nickname,
        participantHobby: p.hobby,
        iconColor: ICON_COLORS[p.icon] || ICON_COLORS.green,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // とりあえず3日後
      }));

    localStorage.setItem(
      `sakuraco_yes_people_${event.id}`,
      JSON.stringify(yesPeople)
    );

    // Navigate to result screen
    navigate(`/connection-result/${event.id}`);
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
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-xs)",
            }}
          >
            お食事会のきもち
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--neutral-500)",
              fontWeight: 500,
              marginBottom: "var(--spacing-2xl)",
            }}
          >
            今日の体験を教えてください
          </p>

          {/* Overall Rating */}
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              お食事会全体の感想
            </h2>

            <div className="grid grid-cols-5 gap-2" style={{ marginBottom: "var(--spacing-md)" }}>
              {OVERALL_RATINGS.map((rating) => {
                const isSelected = overallRating === rating.value;

                return (
                  <button
                    key={rating.value}
                    onClick={() => setOverallRating(rating.value)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "var(--spacing-xs)",
                      minHeight: "var(--touch-comfortable)",
                      padding: "var(--spacing-sm)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-xs)",
                      fontWeight: isSelected ? 500 : 400,
                      border: isSelected ? "1.5px solid var(--green-600)" : "1.5px solid var(--neutral-300)",
                      background: isSelected ? "var(--green-600)" : "rgba(255,255,255,0.78)",
                      color: isSelected ? "#fff" : "var(--neutral-700)",
                      cursor: "pointer",
                      WebkitTapHighlightColor: "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "var(--text-lg)" }}>{rating.value}</span>
                    <span>{rating.label}</span>
                  </button>
                );
              })}
            </div>

            <textarea
              value={overallComment}
              onChange={(e) => setOverallComment(e.target.value)}
              placeholder="自由記述（任意）"
              rows={3}
              style={{
                width: "100%",
                padding: "var(--spacing-md)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                border: "1.5px solid var(--neutral-300)",
                borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.85)",
                color: "var(--neutral-800)",
                outline: "none",
                resize: "vertical",
                WebkitAppearance: "none" as const,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--green-400)";
                e.target.style.boxShadow = "0 0 0 3px rgba(29,140,126,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--neutral-300)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Experience Question */}
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              今日の時間はどうでしたか？
            </h2>

            <textarea
              value={experienceComment}
              onChange={(e) => setExperienceComment(e.target.value)}
              placeholder="今日感じたことを自由に書いてください"
              rows={4}
              style={{
                width: "100%",
                padding: "var(--spacing-md)",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                border: "1.5px solid var(--neutral-300)",
                borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.85)",
                color: "var(--neutral-800)",
                outline: "none",
                resize: "vertical",
                WebkitAppearance: "none" as const,
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--green-400)";
                e.target.style.boxShadow = "0 0 0 3px rgba(29,140,126,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--neutral-300)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Participant Ratings */}
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              参加者ごとの評価
            </h2>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-500)",
                fontWeight: 500,
                marginBottom: "var(--spacing-lg)",
              }}
            >
              評価は相手に直接通知されません
            </p>

            <div className="flex flex-col" style={{ gap: "var(--spacing-lg)" }}>
              {participants.map((participant) => {
                const selectedRating = participantFeedbacks[participant.id];

                return (
                  <div
                    key={participant.id}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--green-100)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-lg)",
                    }}
                  >
                    {/* Participant Info */}
                    <div
                      className="flex items-center gap-3"
                      style={{ marginBottom: "var(--spacing-md)" }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: ICON_COLORS[participant.icon] || ICON_COLORS.green,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "var(--text-lg)",
                          fontWeight: 500,
                        }}
                      >
                        {participant.nickname.charAt(0)}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "var(--text-base)",
                            fontWeight: 500,
                            color: "var(--neutral-800)",
                            marginBottom: "2px",
                          }}
                        >
                          {participant.nickname}
                        </p>
                        <p
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--neutral-500)",
                            fontWeight: 500,
                          }}
                        >
                          趣味: {participant.hobby}
                        </p>
                      </div>
                    </div>

                    {/* Rating Options */}
                    <div className="flex flex-col" style={{ gap: "var(--spacing-xs)" }}>
                      {PARTICIPANT_RATINGS.map((rating) => {
                        const isSelected = selectedRating === rating.value;

                        return (
                          <button
                            key={rating.value}
                            onClick={() => handleParticipantRating(participant.id, rating.value)}
                            style={{
                              width: "100%",
                              minHeight: "var(--touch-min)",
                              padding: "0 var(--spacing-md)",
                              borderRadius: "var(--radius-md)",
                              fontSize: "var(--text-sm)",
                              fontWeight: isSelected ? 500 : 400,
                              border: isSelected
                                ? "1.5px solid var(--green-600)"
                                : "1.5px solid var(--neutral-300)",
                              background: isSelected
                                ? "var(--green-600)"
                                : "rgba(255,255,255,0.78)",
                              color: isSelected ? "#fff" : "var(--neutral-700)",
                              cursor: "pointer",
                              textAlign: "left",
                              WebkitTapHighlightColor: "transparent",
                              transition: "all 0.2s",
                            }}
                          >
                            {rating.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            style={{
              width: "100%",
              minHeight: "var(--touch-comfortable)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-base)",
              fontWeight: 500,
              border: "none",
              background: canSubmit() ? "var(--green-600)" : "var(--disabled)",
              color: canSubmit() ? "#fff" : "var(--disabled-foreground)",
              cursor: canSubmit() ? "pointer" : "not-allowed",
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.2s",
            }}
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}