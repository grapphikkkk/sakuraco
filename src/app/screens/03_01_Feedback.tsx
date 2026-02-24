import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Upload, X, Star } from "lucide-react";
import { getEventById } from "../data/events";
import { getMockParticipants, saveFeedback, processFeedback, saveConnections, EventFeedback, Feedback } from "../data/participants";

// ── UI-level participant rating (internal; mapped before saving) ──────────────
type UIRating = "absent" | "no" | "neutral" | "neutral_strong" | "yes" | "disruptive";

function mapToFeedbackRating(r: UIRating): Feedback["rating"] {
  if (r === "neutral_strong") return "neutral";
  return r;
}

// ── Constants ────────────────────────────────────────────────────────────────

const OVERALL_RATINGS = [
  { value: 1 as const, label: "とても悪い" },
  { value: 2 as const, label: "悪い" },
  { value: 3 as const, label: "ふつう" },
  { value: 4 as const, label: "良い" },
  { value: 5 as const, label: "とても良い" },
];

const PARTICIPANT_RATINGS: { value: UIRating; label: string }[] = [
  { value: "absent", label: "欠席した" },
  { value: "no", label: "今回限りでOK" },
  { value: "neutral", label: "どこかの回で同席してもよい" },
  { value: "neutral_strong", label: "次の場でも同席してほしい" },
  { value: "yes", label: "次は2人で会いたい" },
  { value: "disruptive", label: "通報する" },
];

const REPORT_REASONS = [
  "不快になる言動・行動",
  "詐欺やビジネス勧誘",
  "なりすまし・当事者ではないと感じた",
  "許可なく同伴者を連れてきた",
  "その他",
];

const RESTAURANT_RATINGS = [
  { value: 1 as const, label: "とても悪い" },
  { value: 2 as const, label: "悪い" },
  { value: 3 as const, label: "ふつう" },
  { value: 4 as const, label: "良い" },
  { value: 5 as const, label: "とても良い" },
];

const VALUE_RATINGS = [
  { value: 1 as const, label: "とても不満" },
  { value: 2 as const, label: "不満" },
  { value: 3 as const, label: "ふつう" },
  { value: 4 as const, label: "満足" },
  { value: 5 as const, label: "とても満足" },
];

const ICON_COLORS: Record<string, string> = {
  green: "#177568",
  blue: "#3B82F6",
  purple: "#A855F7",
  orange: "#F97316",
  pink: "#E8507A",
};

// ── Report sub-form state per participant ────────────────────────────────────
interface ReportDetail {
  reasons: string[];
  description: string;
  contactNeeded: "yes" | "no" | null;
}

// ── Component ────────────────────────────────────────────────────────────────
export function FeedbackScreen() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const event = eventId ? getEventById(eventId) : undefined;
  const participants = eventId ? getMockParticipants(eventId) : [];

  // ── Overall ──
  const [overallRating, setOverallRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);

  // ── Experience (任意) ──
  const [goodPoints, setGoodPoints] = useState("");
  const [improvementPoints, setImprovementPoints] = useState("");

  // ── Participant ratings ──
  const [participantFeedbacks, setParticipantFeedbacks] = useState<Record<string, UIRating>>({});
  const [reportDetails, setReportDetails] = useState<Record<string, ReportDetail>>({});

  // ── Restaurant (任意) ──
  const [restaurantAtmosphere, setRestaurantAtmosphere] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [restaurantTaste, setRestaurantTaste] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [restaurantValue, setRestaurantValue] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [restaurantPrice, setRestaurantPrice] = useState("");
  const [restaurantComment, setRestaurantComment] = useState("");

  // ── Receipt photo ──
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

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

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleParticipantRating = (participantId: string, rating: UIRating) => {
    setParticipantFeedbacks((prev) => ({ ...prev, [participantId]: rating }));
    // Clear report details if switching away from disruptive
    if (rating !== "disruptive") {
      setReportDetails((prev) => {
        const next = { ...prev };
        delete next[participantId];
        return next;
      });
    }
  };

  const handleReportReason = (participantId: string, reason: string) => {
    setReportDetails((prev) => {
      const current = prev[participantId] ?? { reasons: [], description: "", contactNeeded: null };
      const reasons = current.reasons.includes(reason)
        ? current.reasons.filter((r) => r !== reason)
        : [...current.reasons, reason];
      return { ...prev, [participantId]: { ...current, reasons } };
    });
  };

  const handleReportField = (
    participantId: string,
    field: "description" | "contactNeeded",
    value: string
  ) => {
    setReportDetails((prev) => {
      const current = prev[participantId] ?? { reasons: [], description: "", contactNeeded: null };
      return { ...prev, [participantId]: { ...current, [field]: value } };
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setReceiptPreview(URL.createObjectURL(file));
    } else {
      setReceiptPreview(null);
    }
  };

  const handleRemovePhoto = () => {
    setReceiptPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Validation ───────────────────────────────────────────────────────────────

  const canSubmit = () => {
    if (!overallRating) return false;
    return participants.every((p) => !!participantFeedbacks[p.id]);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    if (!canSubmit() || !overallRating) return;

    // Build EventFeedback — maps UIRating → Feedback["rating"] before persisting
    const feedback: EventFeedback = {
      eventId: event.id,
      overallRating,
      overallComment: goodPoints,           // repurpose existing field
      experienceComment: improvementPoints, // repurpose existing field
      participantFeedbacks: participants.map((p) => ({
        participantId: p.id,
        rating: mapToFeedbackRating(participantFeedbacks[p.id]),
      })),
      submittedAt: new Date().toISOString(),
    };

    saveFeedback(feedback);

    // Process for connections (uses rating === "yes" internally)
    const connections = processFeedback(event.id, feedback);
    if (connections.length > 0) {
      saveConnections(connections);
    }

    // ✅ Save "yes" participants for ConnectionResult / special-slot display
    const yesPeople = participants
      .filter((p) => participantFeedbacks[p.id] === "yes")
      .map((p) => ({
        participantId: p.id,
        participantNickname: p.nickname,
        participantHobby: p.hobby,
        iconColor: ICON_COLORS[p.icon] || ICON_COLORS.green,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      }));

    localStorage.setItem(`sakuraco_yes_people_${event.id}`, JSON.stringify(yesPeople));

    navigate(`/connection-result/${event.id}`);
  };

  // ── Render helpers ───────────────────────────────────────────────────────────

  const RatingButtons = ({
    ratings,
    selected,
    onSelect,
    legendLabels = ["とても悪い", "ふつう", "とても良い"],
  }: {
    ratings: { value: 1 | 2 | 3 | 4 | 5; label: string }[];
    selected: number | null;
    onSelect: (v: 1 | 2 | 3 | 4 | 5) => void;
    legendLabels?: [string, string, string];
  }) => {
    const selectedNum = selected || 0;
    return (
      <div>
        {/* 5 independent star buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          {([1, 2, 3, 4, 5] as const).map((star) => {
            const isActive = star <= selectedNum;
            return (
              <button
                key={star}
                onClick={() => onSelect(star)}
                style={{
                  width: "48px",
                  height: "48px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  border: isActive ? "2px solid #A63950" : "2px solid var(--neutral-300)",
                  background: isActive ? "#A63950" : "rgba(255,255,255,0.85)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                  WebkitTapHighlightColor: "transparent",
                  padding: 0,
                }}
              >
                <Star
                  size="55%"
                  fill={isActive ? "#fff" : "var(--neutral-300)"}
                  color="transparent"
                  strokeWidth={0}
                  style={{ pointerEvents: "none" }}
                />
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "var(--spacing-sm)",
            fontSize: "var(--text-xs)",
            color: "var(--neutral-400)",
            fontWeight: 500,
            width: "280px",
          }}
        >
          <span>{legendLabels[0]}</span>
          <span>{legendLabels[1]}</span>
          <span>{legendLabels[2]}</span>
        </div>
      </div>
    );
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2
      style={{
        fontSize: "var(--text-md)",
        fontWeight: 500,
        color: "var(--neutral-800)",
        marginBottom: "var(--spacing-md)",
      }}
    >
      {children}
    </h2>
  );

  const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <p
      style={{
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        color: "var(--neutral-700)",
        marginBottom: "var(--spacing-xs)",
      }}
    >
      {required && (
        <span style={{ color: "#DC2626", marginRight: "3px", fontWeight: 600 }}>*</span>
      )}
      {children}
    </p>
  );

  const textareaStyle: React.CSSProperties = {
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
  };

  const onFocusTA = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.target.style.borderColor = "var(--green-400)";
    e.target.style.boxShadow = "0 0 0 3px rgba(29,140,126,0.12)";
  };
  const onBlurTA = (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.target.style.borderColor = "var(--neutral-300)";
    e.target.style.boxShadow = "none";
  };

  const divider = (
    <div
      style={{
        height: "1px",
        background: "var(--neutral-100)",
        margin: "var(--spacing-2xl) 0",
      }}
    />
  );

  // ── JSX ──────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
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

          {/* Page intro */}
          <h1
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-xs)",
            }}
          >
            お食事会フィードバック
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--neutral-500)",
              fontWeight: 500,
              marginBottom: "var(--spacing-md)",
              lineHeight: 1.7,
            }}
          >
            お食事会について振り返りをしましょう。
            <br />
            今回の参加者は、次回以降の素敵な出会いに繋がるかもしれません。
          </p>

          {/* Required legend */}
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--neutral-500)",
              marginBottom: "var(--spacing-2xl)",
            }}
          >
            <span style={{ color: "#DC2626", fontWeight: 600, marginRight: "3px" }}>*</span>
            は必須項目です
          </p>

          {/* ═══════════════ SECTION 1: Overall ═══════════════ */}
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <SectionTitle>お食事会全体</SectionTitle>
            <FieldLabel required>今日のお食事会はどうでしたか？</FieldLabel>
            <RatingButtons
              ratings={OVERALL_RATINGS}
              selected={overallRating}
              onSelect={setOverallRating}
            />

            {/* Good points (任意) */}
            <div style={{ marginTop: "var(--spacing-lg)" }}>
              <FieldLabel>よかった点があれば教えてください（任意）</FieldLabel>
              <textarea
                value={goodPoints}
                onChange={(e) => setGoodPoints(e.target.value)}
                placeholder="例：会話が弾んだ、お店の雰囲気がよかった…"
                rows={3}
                style={textareaStyle}
                onFocus={onFocusTA}
                onBlur={onBlurTA}
              />
            </div>

            {/* Improvement (任意) */}
            <div style={{ marginTop: "var(--spacing-md)" }}>
              <FieldLabel>改善してほしい点があれば教えてください（任意）</FieldLabel>
              <textarea
                value={improvementPoints}
                onChange={(e) => setImprovementPoints(e.target.value)}
                placeholder="例：時間配分、席の配置…"
                rows={3}
                style={textareaStyle}
                onFocus={onFocusTA}
                onBlur={onBlurTA}
              />
            </div>
          </div>

          {divider}

          {/* ═══════════════ SECTION 3: Per-participant feedback ═══════════════ */}
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <SectionTitle>参加者ごとのフィードバック</SectionTitle>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-500)",
                fontWeight: 500,
                marginTop: "-8px",
                marginBottom: "var(--spacing-lg)",
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: "#DC2626", fontWeight: 600, marginRight: "3px" }}>*</span>
              今日ご一緒したこの方との、次の場の希望は？
              <br />
              <span style={{ color: "var(--neutral-400)" }}>
                回答は参加者に直接通知されません。
              </span>
            </p>

            <div className="flex flex-col" style={{ gap: "var(--spacing-lg)" }}>
              {participants.map((participant) => {
                const selectedRating = participantFeedbacks[participant.id];
                const isReporting = selectedRating === "disruptive";
                const report = reportDetails[participant.id] ?? {
                  reasons: [],
                  description: "",
                  contactNeeded: null,
                };

                return (
                  <div
                    key={participant.id}
                    style={{
                      background: "var(--bg-card)",
                      border: `1px solid ${isReporting ? "#FDE68A" : "var(--green-100)"}`,

                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-lg)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    {/* Participant info */}
                    <div className="flex items-center gap-3" style={{ marginBottom: "var(--spacing-md)" }}>
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
                          flexShrink: 0,
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

                    {/* Rating options — normal choices */}
                    <div className="flex flex-col" style={{ gap: "var(--spacing-xs)" }}>
                      {PARTICIPANT_RATINGS.filter((r) => r.value !== "disruptive").map((rating) => {
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
                              background: isSelected ? "var(--green-600)" : "rgba(255,255,255,0.78)",
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

                    {/* Report text-link */}
                    <div style={{ textAlign: "center", marginTop: "var(--spacing-sm)" }}>
                      <button
                        onClick={() => handleParticipantRating(
                          participant.id,
                          isReporting ? "neutral" : "disruptive"
                        )}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "var(--text-sm)",
                          fontWeight: isReporting ? 600 : 400,
                          color: isReporting ? "#B45309" : "#92400E",
                          padding: "var(--spacing-xs) var(--spacing-md)",
                          WebkitTapHighlightColor: "transparent",
                          textDecoration: "none",
                          opacity: isReporting ? 1 : 0.75,
                        }}
                      >
                        通報する
                      </button>
                    </div>

                    {/* Report sub-form (only when "通報する" is selected) */}
                    {isReporting && (
                      <div
                        style={{
                          marginTop: "var(--spacing-md)",
                          padding: "var(--spacing-md)",
                          background: "#FFFBEB",
                          borderRadius: "var(--radius-md)",
                          border: "1px solid #FDE68A",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "#78350F",
                            marginBottom: "var(--spacing-md)",
                            lineHeight: 1.5,
                          }}
                        >
                          回答は参加者に直接通知されません。
                        </p>

                        {/* Report reasons */}
                        <p
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: 500,
                            color: "var(--neutral-700)",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          該当する内容を選んでください（複数可）
                        </p>
                        <div className="flex flex-col" style={{ gap: "6px", marginBottom: "var(--spacing-md)" }}>
                          {REPORT_REASONS.map((reason) => {
                            const checked = report.reasons.includes(reason);
                            return (
                              <button
                                key={reason}
                                onClick={() => handleReportReason(participant.id, reason)}
                                style={{
                                  width: "100%",
                                  minHeight: "var(--touch-min)",
                                  padding: "0 var(--spacing-md)",
                                  borderRadius: "var(--radius-md)",
                                  fontSize: "var(--text-sm)",
                                  fontWeight: checked ? 500 : 400,
                                  border: checked
                                    ? "1.5px solid #D97706"
                                    : "1.5px solid var(--neutral-300)",
                                  background: checked ? "#D97706" : "rgba(255,255,255,0.85)",
                                  color: checked ? "#fff" : "var(--neutral-700)",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  WebkitTapHighlightColor: "transparent",
                                  transition: "all 0.2s",
                                }}
                              >
                                {reason}
                              </button>
                            );
                          })}
                        </div>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: 500,
                            color: "var(--neutral-700)",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          お手数おかけしますが、運営で対処方針を検討するために状況を詳しく教えてください。
                        </p>
                        <textarea
                          value={report.description}
                          onChange={(e) =>
                            handleReportField(participant.id, "description", e.target.value)
                          }
                          placeholder="状況を詳しく記入してください"
                          rows={3}
                          style={{
                            ...textareaStyle,
                            marginBottom: "var(--spacing-md)",
                            background: "rgba(255,255,255,0.9)",
                          }}
                          onFocus={onFocusTA}
                          onBlur={onBlurTA}
                        />

                        {/* Contact needed (任意) */}
                        <p
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: 500,
                            color: "var(--neutral-700)",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          運営からの連絡は必要ですか？
                          <span
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--neutral-400)",
                              marginLeft: "4px",
                              fontWeight: 400,
                            }}
                          >
                            （任意）
                          </span>
                        </p>
                        <div className="flex flex-col" style={{ gap: "var(--spacing-xs)" }}>
                          {(["yes", "no"] as const).map((v) => {
                            const label = v === "yes" ? "連絡してほしい" : "連絡は不要（記録のみでOK）";
                            const isSelected = report.contactNeeded === v;
                            return (
                              <button
                                key={v}
                                onClick={() =>
                                  handleReportField(
                                    participant.id,
                                    "contactNeeded",
                                    isSelected ? "" : v
                                  )
                                }
                                style={{
                                  width: "100%",
                                  minHeight: "var(--touch-min)",
                                  padding: "0 var(--spacing-md)",
                                  borderRadius: "var(--radius-md)",
                                  fontSize: "var(--text-sm)",
                                  fontWeight: isSelected ? 500 : 400,
                                  border: isSelected
                                    ? "1.5px solid #D97706"
                                    : "1.5px solid var(--neutral-300)",
                                  background: isSelected ? "#D97706" : "rgba(255,255,255,0.85)",
                                  color: isSelected ? "#fff" : "var(--neutral-700)",
                                  cursor: "pointer",
                                  textAlign: "left",
                                  WebkitTapHighlightColor: "transparent",
                                  transition: "all 0.2s",
                                }}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {divider}

          {/* ═══════════════ SECTION 4: Restaurant (任意) ═══════════════ */}
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <SectionTitle>レストランについて（任意）</SectionTitle>

            {/* Atmosphere */}
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <FieldLabel>雰囲気はどうでしたか？</FieldLabel>
              <RatingButtons
                ratings={RESTAURANT_RATINGS}
                selected={restaurantAtmosphere}
                onSelect={setRestaurantAtmosphere}
              />
            </div>

            {/* Taste */}
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <FieldLabel>味はどうでしたか？</FieldLabel>
              <RatingButtons
                ratings={RESTAURANT_RATINGS}
                selected={restaurantTaste}
                onSelect={setRestaurantTaste}
              />
            </div>

            {/* Value */}
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <FieldLabel>価格帯の納得感はどうでしたか？</FieldLabel>
              <RatingButtons
                ratings={VALUE_RATINGS}
                selected={restaurantValue}
                onSelect={setRestaurantValue}
                legendLabels={["とても不満", "ふつう", "とても満足"]}
              />
            </div>

            {/* Price input */}
            <div style={{ marginBottom: "var(--spacing-md)" }}>
              <FieldLabel>レストランでの支払金額（1人あたり）</FieldLabel>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  value={restaurantPrice}
                  onChange={(e) => setRestaurantPrice(e.target.value)}
                  placeholder="例：4500"
                  min={0}
                  style={{
                    width: "100%",
                    padding: "var(--spacing-md)",
                    paddingRight: "calc(var(--spacing-md) + 20px)",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    border: "1.5px solid var(--neutral-300)",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(255,255,255,0.85)",
                    color: "var(--neutral-800)",
                    outline: "none",
                    WebkitAppearance: "none" as const,
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={onFocusTA}
                  onBlur={onBlurTA}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "var(--spacing-md)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "var(--text-sm)",
                    color: "var(--neutral-400)",
                    pointerEvents: "none",
                  }}
                >
                  円
                </span>
              </div>
            </div>

            {/* Restaurant comment */}
            <div>
              <FieldLabel>レストランについてコメントがあれば教えてください</FieldLabel>
              <textarea
                value={restaurantComment}
                onChange={(e) => setRestaurantComment(e.target.value)}
                placeholder="例：スタッフの対応がよかった、少し騒がしかった…"
                rows={3}
                style={textareaStyle}
                onFocus={onFocusTA}
                onBlur={onBlurTA}
              />
            </div>
          </div>

          {divider}

          {/* ═══════════════ SECTION 5: Receipt photo (任意) ═══════════════ */}
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <SectionTitle>伝票・レシートの写真アップロード（任意）</SectionTitle>
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--neutral-400)",
                fontWeight: 500,
                marginBottom: "var(--spacing-md)",
                lineHeight: 1.5,
              }}
            >
              個人情報は塗りつぶしてください
            </p>

            {receiptPreview ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={receiptPreview}
                  alt="レシートプレビュー"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "260px",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--neutral-200)",
                    objectFit: "contain",
                  }}
                />
                <button
                  onClick={handleRemovePhoto}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.55)",
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px dashed var(--neutral-300)",
                  background: "rgba(255,255,255,0.6)",
                  color: "var(--neutral-500)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--spacing-xs)",
                  fontSize: "var(--text-sm)",
                  WebkitTapHighlightColor: "transparent",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--neutral-50)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                }}
              >
                <Upload className="w-6 h-6" style={{ color: "var(--neutral-400)" }} />
                <span>写真を追加する</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>

          {/* ═══════════════ Submit ═══════════════ */}
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