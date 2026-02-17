import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar, Users, MapPin, ArrowLeft, Info, MessageCircle } from "lucide-react";
import { getEventById, AREAS } from "../data/events";
import { getConnections, createSpecialSlotEvent } from "../data/participants";

// Possible dates for special slot (4+ days from now, Wed/Fri only)
const getSpecialSlotDates = () => {
  const dates: string[] = [];
  const today = new Date("2026-02-13"); // Current date in spec
  
  for (let i = 4; i <= 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const day = date.getDay();
    
    // Only Wed (3) and Fri (5)
    if (day === 3 || day === 5) {
      const formatted = date.toLocaleDateString('ja-JP', { 
        month: 'long', 
        day: 'numeric',
        weekday: 'short'
      });
      dates.push(formatted);
    }
    
    if (dates.length >= 6) break; // Show 6 options
  }
  
  return dates;
};

export function EventDetail01() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Check if this is a special slot event
  const isSpecialSlot = eventId?.startsWith("special-");
  let event = eventId && !isSpecialSlot ? getEventById(eventId) : undefined;
  let specialSlot = null;
  
  if (isSpecialSlot) {
    const connections = getConnections();
    const connection = connections.find(c => `special-${c.participantId}` === eventId);
    if (connection) {
      specialSlot = createSpecialSlotEvent(connection);
    }
  }

  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // Date change modal state
  const [showDateSelectModal, setShowDateSelectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedNewDate, setSelectedNewDate] = useState<string | null>(null);

  // Mock alternative dates with same theme  
  const alternativeDates = [
    { fullDateTime: "2月21日（金）20:00", date: "2月21日（金）", time: "20:00" },
    { fullDateTime: "2月26日（水）19:30", date: "2月26日（水）", time: "19:30" },
    { fullDateTime: "3月5日（水）19:00", date: "3月5日（水）", time: "19:00" },
  ];

  // Determine if user has a booking for this event
  const savedBookingRaw = typeof window !== "undefined" ? localStorage.getItem("sakuraco_current_booking") : null;
  let savedBooking: any = null;
  try {
    if (savedBookingRaw) savedBooking = JSON.parse(savedBookingRaw);
  } catch {
    savedBooking = null;
  }

  const parseEventDate = (ev: any): Date | null => {
    if (!ev || !ev.date) return null;
    const m = ev.date.match(/(\d+)月(\d+)日/);
    if (!m) return null;
    const month = parseInt(m[1], 10) - 1;
    const day = parseInt(m[2], 10);
    const year = new Date().getFullYear();
    const timeParts = (ev.time || "00:00").split(":");
    const hour = parseInt(timeParts[0] || "0", 10);
    const minute = parseInt(timeParts[1] || "0", 10);
    return new Date(year, month, day, hour, minute);
  };

  const eventDate = event ? parseEventDate(event) : null;
  const today = new Date();
  const isBookedByUser = savedBooking && savedBooking.eventId === event?.id;
  const isFutureBooking = isBookedByUser && (eventDate ? eventDate > today : true);

  if (!event && !specialSlot) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p style={{ color: "var(--neutral-600)" }}>イベントが見つかりません</p>
      </div>
    );
  }

  const handleApply = () => {
    if (specialSlot) {
      if (selectedDates.length === 0 || selectedAreas.length === 0) return;
      // Save special slot booking
      navigate("/payment", { 
        state: { 
          eventId: specialSlot.id,
          areas: selectedAreas,
          dates: selectedDates,
          isSpecialSlot: true,
        } 
      });
    } else if (event) {
      if (!selectedArea) return;
      navigate("/payment", { 
        state: { 
          eventId: event.id,
          area: selectedArea 
        } 
      });
    }
  };

  const toggleArea = (area: string) => {
    if (specialSlot) {
      setSelectedAreas(prev => 
        prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
      );
    }
  };

  const toggleDate = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const canApply = specialSlot 
    ? selectedDates.length > 0 && selectedAreas.length > 0
    : selectedArea !== null;

  // Booked (before-event) page view: date selection for change
  if (!specialSlot && event && isFutureBooking && showDateSelectModal) {
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
            onClick={() => setShowDateSelectModal(false)}
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
                marginBottom: "var(--spacing-lg)",
              }}
            >
              他の日程を選択
            </h1>

            <div
              className="flex flex-col"
              style={{
                gap: "var(--spacing-md)",
              }}
            >
              {/* Current Booking Card */}
              {savedBooking && (
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--green-100)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--spacing-lg)",
                    cursor: "not-allowed",
                    opacity: 0.7,
                  }}
                >
                  <div style={{ marginBottom: "var(--spacing-xs)" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        borderRadius: "var(--radius-full)",
                        background: "var(--green-600)",
                        color: "#fff",
                        marginBottom: "8px",
                      }}
                    >
                      予約中
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--neutral-500)",
                      fontWeight: 500,
                    }}
                  >
                    <Calendar className="w-4 h-4" style={{ color: "var(--neutral-500)" }} />
                    <span>{savedBooking.date || event.fullDateTime}</span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--neutral-500)",
                      fontWeight: 500,
                      marginTop: "4px",
                    }}
                  >
                    <Users className="w-3.5 h-3.5" style={{ color: "var(--neutral-500)" }} />
                    <span>5人</span>
                  </div>
                </div>
              )}

              {alternativeDates.map((alt) => (
                <div
                  key={alt.fullDateTime}
                  onClick={() => {
                    setSelectedNewDate(alt.fullDateTime);
                    setShowConfirmModal(true);
                  }}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--green-100)",
                    borderRadius: "var(--radius-lg)",
                    padding: "var(--spacing-lg)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ marginBottom: "var(--spacing-xs)" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        borderRadius: "var(--radius-full)",
                        background: "var(--green-100)",
                        color: "var(--green-800)",
                        marginBottom: "8px",
                      }}
                    >
                      {event.theme}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--neutral-800)",
                      fontWeight: 500,
                    }}
                  >
                    <Calendar className="w-4 h-4" style={{ color: "var(--green-600)" }} />
                    <span>{alt.fullDateTime}</span>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--neutral-500)",
                      fontWeight: 500,
                      marginTop: "4px",
                    }}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>5人</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirmModal && selectedNewDate && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(19,26,24,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "var(--spacing-lg)",
              zIndex: 101,
            }}
            onClick={() => setShowConfirmModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--bg-card)",
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
                日時を変更しますか？
              </h3>
              <div
                style={{
                  background: "var(--neutral-50)",
                  border: "1px solid var(--neutral-200)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--spacing-md)",
                  marginBottom: "var(--spacing-lg)",
                }}
              >
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--neutral-500)",
                    fontWeight: 500,
                    marginBottom: "4px",
                  }}
                >
                  新しい日時
                </p>
                <p
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--neutral-800)",
                    fontWeight: 500,
                  }}
                >
                  {selectedNewDate}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    flex: 1,
                    minHeight: "var(--touch-min)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-base)",
                    fontWeight: 500,
                    border: "1.5px solid var(--neutral-300)",
                    background: "transparent",
                    color: "var(--neutral-700)",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    if (savedBooking && selectedNewDate) {
                      const updated = {
                        ...savedBooking,
                        date: selectedNewDate,
                        bookedAt: new Date().toISOString(),
                      };
                      localStorage.setItem("sakuraco_current_booking", JSON.stringify(updated));
                      setShowConfirmModal(false);
                      setShowDateSelectModal(false);
                      setSelectedNewDate(null);
                      window.location.reload();
                    }
                  }}
                  style={{
                    flex: 1,
                    minHeight: "var(--touch-min)",
                    borderRadius: "var(--radius-full)",
                    fontSize: "var(--text-base)",
                    fontWeight: 500,
                    border: "none",
                    background: "var(--green-600)",
                    color: "#fff",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  変更する
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Booked (before-event) view: when user already booked and event is in the future
  if (!specialSlot && event && isFutureBooking) {
    const restaurant = {
      name: "和食ダイニング 緑々",
      address: "東京都新宿区新宿3-1-1",
      mapUrl: "https://maps.google.com",
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
            {/* Tag / Title / Date / Participants */}
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <div className="flex gap-2 flex-wrap" style={{ marginBottom: "var(--spacing-sm)" }}>
                <span
                  style={{
                    padding: "4px 12px",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    borderRadius: "var(--radius-full)",
                    background: "var(--green-100)",
                    color: "var(--green-800)",
                  }}
                >
                  {event.category}
                </span>
                <span
                  style={{
                    padding: "4px 12px",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    borderRadius: "var(--radius-full)",
                    background: "var(--green-600)",
                    color: "#fff",
                  }}
                >
                  {event.theme}
                </span>
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
                  marginBottom: "var(--spacing-md)",
                }}
              >
                <Users className="w-4 h-4" style={{ color: "var(--green-600)" }} />
                <span>{event.participantCount}人</span>
              </div>
            </div>

            {/* Place & Restaurant Info */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--green-100)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              <p
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--neutral-800)",
                  fontWeight: 500,
                  marginBottom: "var(--spacing-md)",
                }}
              >
                会場：{(savedBooking && savedBooking.area) || "未選択"}
              </p>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--neutral-600)",
                }}
              >
                レストラン情報は48時間前までにわかります！
              </p>
            </div>

            {/* Actions: Change Date / Cancel */}
            <div className="flex flex-col" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
              <button
                onClick={() => { setShowDateSelectModal(true); setSelectedNewDate(null); }}
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
                日時を変更する
              </button>

              <button
                onClick={() => { if (confirm("キャンセルしますか？")) { localStorage.removeItem("sakuraco_current_booking"); navigate("/home"); } }}
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
                キャンセル
              </button>
            </div>

            {/* Disabled sections */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--green-100)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
                marginBottom: "var(--spacing-lg)",
                opacity: 0.6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-sm)" }}>
                <MessageCircle className="w-5 h-5" style={{ color: "var(--green-600)" }} />
                <h2 style={{ fontSize: "var(--text-md)", fontWeight: 500, color: "var(--neutral-800)" }}>会話のお題</h2>
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--neutral-600)" }}>お食事開始後にみれます</p>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, var(--green-50) 0%, var(--bg-card) 100%)",
                border: "1px solid var(--green-200)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
                marginBottom: "var(--spacing-lg)",
                opacity: 0.6,
              }}
            >
              <h2 style={{ fontSize: "var(--text-md)", fontWeight: 500, color: "var(--neutral-800)", marginBottom: "var(--spacing-sm)" }}>
                お食事会終了後のきもち
              </h2>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--neutral-600)" }}>
                終了後に記録できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Special Slot View
  if (specialSlot) {
    const expiresDate = new Date(specialSlot.expiresAt);
    const availableDates = getSpecialSlotDates();

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
            {/* Header */}
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
                特別枠
              </div>

              <h1
                style={{
                  fontSize: "var(--text-xl)",
                  fontWeight: 500,
                  color: "var(--neutral-800)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                特別枠（{expiresDate.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}まで参加表明ができます）
              </h1>

              <p
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--neutral-600)",
                  lineHeight: 1.7,
                }}
              >
                先日同席した{specialSlot.partnerNickname}さんもあなたと次回２人で会いたいと思っています。{specialSlot.partnerNickname}さんとのお食事です。
              </p>
            </div>

            {/* Details Card */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--green-100)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              <div
                className="flex items-start gap-3"
                style={{ marginBottom: "var(--spacing-md)" }}
              >
                <Users
                  className="w-5 h-5"
                  style={{ color: "var(--green-600)", marginTop: "2px" }}
                />
                <div>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--neutral-500)",
                      fontWeight: 500,
                      marginBottom: "2px",
                    }}
                  >
                    参加人数
                  </p>
                  <p
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--neutral-800)",
                      fontWeight: 500,
                    }}
                  >
                    2人
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Info
                  className="w-5 h-5"
                  style={{ color: "var(--green-600)", marginTop: "2px" }}
                />
                <div>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--neutral-500)",
                      fontWeight: 500,
                      marginBottom: "2px",
                    }}
                  >
                    参加費・含まれるもの
                  </p>
                  <p
                    style={{
                      fontSize: "var(--text-lg)",
                      color: "var(--green-700)",
                      fontWeight: 700,
                      fontFamily: "var(--font-en)",
                      marginBottom: "4px",
                    }}
                  >
                    ¥1,000
                  </p>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--neutral-600)",
                      lineHeight: 1.6,
                    }}
                  >
                    参加費のみ。現地の飲食代は別途かかります。
                  </p>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <div
                className="flex items-center gap-2"
                style={{ marginBottom: "var(--spacing-md)" }}
              >
                <Calendar className="w-5 h-5" style={{ color: "var(--green-600)" }} />
                <h2
                  style={{
                    fontSize: "var(--text-md)",
                    fontWeight: 500,
                    color: "var(--neutral-800)",
                  }}
                >
                  希望日時（複数選択可）
                </h2>
              </div>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--neutral-600)",
                  marginBottom: "var(--spacing-md)",
                  lineHeight: 1.6,
                }}
              >
                お相手の希望を鑑みて決定されます。できるだけ多く選択してください。
              </p>
              <div className="grid grid-cols-2 gap-2">
                {availableDates.map((date) => {
                  const isSelected = selectedDates.includes(date);

                  return (
                    <button
                      key={date}
                      onClick={() => toggleDate(date)}
                      style={{
                        minHeight: "var(--touch-min)",
                        padding: "var(--spacing-sm)",
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
                        WebkitTapHighlightColor: "transparent",
                        transition: "all 0.2s",
                      }}
                    >
                      {date}
                    </button>
                  );
                })}
              </div>
              {selectedDates.length > 0 && (
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--green-600)",
                    fontWeight: 500,
                    marginTop: "var(--spacing-sm)",
                  }}
                >
                  {selectedDates.length}日を選択しました
                </p>
              )}
            </div>

            {/* Area Selection */}
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <div
                className="flex items-center gap-2"
                style={{ marginBottom: "var(--spacing-md)" }}
              >
                <MapPin className="w-5 h-5" style={{ color: "var(--green-600)" }} />
                <h2
                  style={{
                    fontSize: "var(--text-md)",
                    fontWeight: 500,
                    color: "var(--neutral-800)",
                  }}
                >
                  エリアの希望（複数選択可）
                </h2>
              </div>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--neutral-600)",
                  marginBottom: "var(--spacing-md)",
                  lineHeight: 1.6,
                }}
              >
                お相手の希望を鑑みて決定されます。できるだけ多く選択してください。
              </p>
              <div className="grid grid-cols-3 gap-2">
                {AREAS.map((area) => {
                  const isSelected = selectedAreas.includes(area);

                  return (
                    <button
                      key={area}
                      onClick={() => toggleArea(area)}
                      style={{
                        minHeight: "var(--touch-min)",
                        padding: "var(--spacing-sm)",
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
                        WebkitTapHighlightColor: "transparent",
                        transition: "all 0.2s",
                      }}
                    >
                      {area}
                    </button>
                  );
                })}
              </div>
              {selectedAreas.length > 0 && (
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--green-600)",
                    fontWeight: 500,
                    marginTop: "var(--spacing-sm)",
                  }}
                >
                  {selectedAreas.length}エリアを選択しました
                </p>
              )}
            </div>

            {/* Expiry Notice */}
            <div
              style={{
                background: "var(--neutral-50)",
                border: "1px solid var(--neutral-200)",
                borderRadius: "var(--radius-md)",
                padding: "var(--spacing-md)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--neutral-700)",
                  lineHeight: 1.7,
                }}
              >
                この枠は{expiresDate.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}まで参加表明ができます。
              </p>
            </div>

            {/* Cancel Policy */}
            <div
              style={{
                background: "var(--neutral-50)",
                border: "1px solid var(--neutral-200)",
                borderRadius: "var(--radius-md)",
                padding: "var(--spacing-md)",
                marginBottom: "var(--spacing-2xl)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--neutral-800)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                キャンセルポリシー
              </h3>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--neutral-600)",
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                }}
              >
{`＜当日・無断キャンセル＞
参加費の100%を頂戴します。

＜前日キャンセル＞
参加費の50%を頂戴します。

＜2日前までのキャンセル＞
キャンセル料はかかりません。`}
              </p>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApply}
              disabled={!canApply}
              style={{
                width: "100%",
                minHeight: "var(--touch-comfortable)",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-base)",
                fontWeight: 500,
                border: "none",
                background: canApply ? "var(--green-600)" : "var(--disabled)",
                color: canApply ? "#fff" : "var(--disabled-foreground)",
                cursor: canApply ? "pointer" : "not-allowed",
                WebkitTapHighlightColor: "transparent",
                transition: "all 0.2s",
              }}
            >
              申し込む
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal Event View
  if (!event) return null;

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
          {/* Event Theme & Tags */}
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <div className="flex gap-2 flex-wrap" style={{ marginBottom: "var(--spacing-sm)" }}>
              <span
                style={{
                  padding: "4px 12px",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  borderRadius: "var(--radius-full)",
                  background: "var(--green-100)",
                  color: "var(--green-800)",
                }}
              >
                {event.category}
              </span>
              <span
                style={{
                  padding: "4px 12px",
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  borderRadius: "var(--radius-full)",
                  background: "var(--green-600)",
                  color: "#fff",
                }}
              >
                {event.theme}
              </span>
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
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--neutral-600)",
                lineHeight: 1.7,
              }}
            >
              {event.concept}
            </p>
          </div>

          {/* Details Card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--green-100)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            {/* Date/Time */}
            <div
              className="flex items-start gap-3"
              style={{ marginBottom: "var(--spacing-md)" }}
            >
              <Calendar
                className="w-5 h-5"
                style={{ color: "var(--green-600)", marginTop: "2px" }}
              />
              <div>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--neutral-500)",
                    fontWeight: 500,
                    marginBottom: "2px",
                  }}
                >
                  日時
                </p>
                <p
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--neutral-800)",
                    fontWeight: 500,
                  }}
                >
                  {event.fullDateTime}
                </p>
              </div>
            </div>

            {/* Participants */}
            <div
              className="flex items-start gap-3"
              style={{ marginBottom: "var(--spacing-md)" }}
            >
              <Users
                className="w-5 h-5"
                style={{ color: "var(--green-600)", marginTop: "2px" }}
              />
              <div>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--neutral-500)",
                    fontWeight: 500,
                    marginBottom: "2px",
                  }}
                >
                  参加人数
                </p>
                <p
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--neutral-800)",
                    fontWeight: 500,
                  }}
                >
                  {event.participantCount}人
                </p>
              </div>
            </div>

            {/* Price */}
            <div
              className="flex items-start gap-3"
            >
              <Info
                className="w-5 h-5"
                style={{ color: "var(--green-600)", marginTop: "2px" }}
              />
              <div>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--neutral-500)",
                    fontWeight: 500,
                    marginBottom: "2px",
                  }}
                >
                  参加費・含まれるもの
                </p>
                <p
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--green-700)",
                    fontWeight: 700,
                    fontFamily: "var(--font-en)",
                    marginBottom: "4px",
                  }}
                >
                  ¥{event.price.toLocaleString()}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--neutral-600)",
                    lineHeight: 1.6,
                  }}
                >
                  参加費のみ。現地の飲食代は別途かかります。
                </p>
              </div>
            </div>
          </div>

          {/* Area Selection */}
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <div
              className="flex items-center gap-2"
              style={{ marginBottom: "var(--spacing-md)" }}
            >
              <MapPin className="w-5 h-5" style={{ color: "var(--green-600)" }} />
              <h2
                style={{
                  fontSize: "var(--text-md)",
                  fontWeight: 500,
                  color: "var(--neutral-800)",
                }}
              >
                エリアの選択
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {AREAS.map((area) => {
                const isAvailable = event.areas.includes(area);
                const isSelected = selectedArea === area;

                return (
                  <button
                    key={area}
                    onClick={() => isAvailable && setSelectedArea(area)}
                    disabled={!isAvailable}
                    style={{
                      minHeight: "var(--touch-min)",
                      padding: "var(--spacing-sm)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-sm)",
                      fontWeight: isSelected ? 500 : 400,
                      border: isSelected
                        ? "1.5px solid var(--green-600)"
                        : "1.5px solid var(--neutral-300)",
                      background: isSelected
                        ? "var(--green-600)"
                        : isAvailable
                        ? "rgba(255,255,255,0.78)"
                        : "var(--neutral-100)",
                      color: isSelected
                        ? "#fff"
                        : isAvailable
                        ? "var(--neutral-700)"
                        : "var(--neutral-400)",
                      cursor: isAvailable ? "pointer" : "not-allowed",
                      opacity: isAvailable ? 1 : 0.5,
                      WebkitTapHighlightColor: "transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
            {selectedArea && (
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--green-600)",
                  fontWeight: 500,
                  marginTop: "var(--spacing-sm)",
                }}
              >
                {selectedArea}を選択しました
              </p>
            )}
          </div>

          {/* Cancel Policy */}
          <div
            style={{
              background: "var(--neutral-50)",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-md)",
              padding: "var(--spacing-md)",
              marginBottom: "var(--spacing-2xl)",
            }}
          >
            <h3
              style={{
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              キャンセルポリシー
            </h3>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-600)",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {event.cancelPolicy}
            </p>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            disabled={!canApply}
            style={{
              width: "100%",
              minHeight: "var(--touch-comfortable)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-base)",
              fontWeight: 500,
              border: "none",
              background: canApply ? "var(--green-600)" : "var(--disabled)",
              color: canApply ? "#fff" : "var(--disabled-foreground)",
              cursor: canApply ? "pointer" : "not-allowed",
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.2s",
            }}
          >
            申し込む
          </button>
        </div>
      </div>
    </div>
  );
}