import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Calendar, Users, Clock, MapPin } from "lucide-react";
import { getEventsByCategory, getEventById, Event } from "../data/events";
import { getConnections, createSpecialSlotEvent, SpecialSlotEvent } from "../data/participants";

interface Booking {
  eventId: string;
  theme: string;
  date: string;
  area: string;
  price: number;
  bookedAt: string;
}

// ===== Utility Functions =====

// Extract month from date string like "2月19日（水）" → returns "2月"
function extractMonth(dateStr: string): string {
  const match = dateStr.match(/(\d{1,2}月)/);
  return match ? match[1] : "";
}

// Get display month from date string like "2月19日（水）" → returns "2月"
function getMonthDisplay(dateStr: string): string {
  return extractMonth(dateStr);
}

// Group events by month
function groupEventsByMonth(events: Event[]): Map<string, Event[]> {
  const grouped = new Map<string, Event[]>();
  events.forEach((event) => {
    const month = getMonthDisplay(event.date);
    if (!grouped.has(month)) {
      grouped.set(month, []);
    }
    grouped.get(month)!.push(event);
  });
  return grouped;
}

// Select up to 5 events for a month following priority rules:
// 1) ランダム
// 2) タメ会 (属性の代表)
// 3) 趣味系 (ワイン会 等)
// 4) 見た目系 (身長-体重100以下 等)
// 5) Fill up to 5 with remaining events
function selectEventsForMonth(events: Event[] = []): Event[] {
  const remaining = [...events];
  const selected: Event[] = [];

  const pickByTheme = (theme: string | string[]) => {
    if (typeof theme === "string") theme = [theme];
    const idx = remaining.findIndex((e) => theme.includes(e.theme));
    if (idx >= 0) {
      selected.push(remaining.splice(idx, 1)[0]);
    }
  };

  // 1) ランダム
  pickByTheme("ランダム");

  // 2) タメ会
  pickByTheme("タメ会");

  // 3) 趣味系 (例: ワイン会)
  pickByTheme(["ワイン会"]);

  // 4) 見た目系
  pickByTheme(["身長-体重100以下", "デブ専"]);

  // 5) Fill remaining up to 5
  while (selected.length < 5 && remaining.length > 0) {
    selected.push(remaining.shift()!);
  }

  return selected;
}

// Tag color mapping based on theme
function getTagStyle(theme: string, isWelcome?: boolean) {
  // Welcome tag takes precedence and uses exact DS tokens
  if (isWelcome) return { bg: "var(--pink-100)", color: "var(--pink-500)" };

  const t = (theme || "").toString();

  // Exact/keyword-based mapping following Design System (priority order)
  if (t.includes("ランダム") || /random/i.test(t)) {
    // ランダム: green-100 / green-800
    return { bg: "var(--green-100)", color: "var(--green-800)" };
  }

  if (t.includes("タメ") || t.includes("タメ会")) {
    // タメ会: sunset-100 / sunset-600
    return { bg: "var(--sunset-100)", color: "var(--sunset-600)" };
  }

  // 趣味系 (例: ワイン会, 趣味会): indigo-100 / indigo-600
  if (t.includes("ワイン") || t.includes("趣味") || /趣味会/.test(t) || /会$/.test(t)) {
    return { bg: "var(--indigo-100)", color: "var(--indigo-600)" };
  }

  // 見た目系: plum-100 / plum-500
  if (t.includes("身長") || t.includes("体重") || t.includes("デブ") || t.includes("見た目")) {
    return { bg: "var(--plum-100)", color: "var(--plum-500)" };
  }

  // Default fallback: green
  return { bg: "var(--green-100)", color: "var(--green-800)" };
}

// Unified Home screen: handles special slots, booking, and event browsing in a single component
export function HomeAfterLogin() {
  const navigate = useNavigate();
  const [hasBooking, setHasBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [specialSlots, setSpecialSlots] = useState<SpecialSlotEvent[]>([]);
  const [displayedMonths, setDisplayedMonths] = useState(1); // Show 1st month initially

  // ===== Load data on mount =====
  useEffect(() => {
    // Check booking
    const savedBooking = localStorage.getItem("sakuraco_current_booking");
    if (savedBooking) {
      setCurrentBooking(JSON.parse(savedBooking));
      setHasBooking(true);
    }

    // Load special slots if flag is set
    const showSpecialSlot = localStorage.getItem("sakuraco_show_special_slot");
    const saved = localStorage.getItem("sakuraco_special_slots");
    let connections: any[] = [];

    if (saved) {
      try {
        connections = JSON.parse(saved);
      } catch {
        connections = [];
      }
    } else if (showSpecialSlot === "1") {
      connections = getConnections().filter((c) => c.mutualInterest);
    }

    // Deduplicate connections
    const uniq = Array.from(
      new Map(
        connections.map((c) => {
          const key = c.participantId ?? c.participantNickname ?? c.nickname ?? JSON.stringify(c);
          return [key, c];
        })
      ).values()
    );

    const slots = uniq.map((c) =>
      createSpecialSlotEvent({
        ...c,
        partnerNickname: c.participantNickname ?? c.nickname,
        partnerHobby: c.participantHobby ?? c.hobby,
      } as any)
    );

    setSpecialSlots(slots);

    // Clean up flags after displaying once
    localStorage.removeItem("sakuraco_show_special_slot");
    localStorage.removeItem("sakuraco_special_slots");

    setIsLoading(false);
  }, []);

  if (isLoading) return null;

  const { basic, attr, gay } = getEventsByCategory();
  const allEventsForBrowse = [...basic, ...attr, ...gay];
  const otherEvents = allEventsForBrowse.filter((e) => e.id !== currentBooking?.eventId);
  const bookedEvent = currentBooking ? getEventById(currentBooking.eventId) : null;

  // Group events by month for unbooked section
  const monthGrouped = groupEventsByMonth(otherEvents);
  const monthsArray = Array.from(monthGrouped.keys());

  // ===== Event handlers =====
  const handleEventClick = (event: Event) => {
    if (event.theme === "同じ学校出身") {
      navigate("/school-selection", { state: { eventId: event.id } });
    } else {
      navigate(`/event/${event.id}`);
    }
  };

  const handleSpecialSlotClick = (slot: SpecialSlotEvent) => {
    navigate(`/event/${slot.id}`);
  };

  const handleNextMonth = () => {
    if (displayedMonths < monthsArray.length) {
      setDisplayedMonths((prev) => prev + 1);
    }
  };

  // ===== Render =====
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
            お食事会に参加しよう
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--neutral-500)",
              fontWeight: 500,
            }}
          >
            あなたが楽しめる参加枠をご用意しました。
          </p>
        </div>

        {/* ============ CURRENT BOOKING SECTION ============ (moved to top) */}

        {/* ============ CURRENT BOOKING SECTION ============ */}
        {currentBooking && bookedEvent && (
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              参加予定の会
            </h2>

            <div
              style={{
                background: "linear-gradient(135deg, var(--green-50) 0%, var(--bg-card) 100%)",
                border: "2px solid var(--green-200)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--spacing-lg)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Accent Badge */}
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
                予約済み
              </div>

              {/* Theme */}
              <div
                style={{
                  fontSize: "var(--text-md)",
                  fontWeight: 500,
                  color: "var(--neutral-800)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                {currentBooking.theme}
              </div>

              {/* Date */}
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
                <span>{currentBooking.date}</span>
              </div>

              {/* Area */}
              <div
                className="flex items-center gap-2"
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--neutral-700)",
                  fontWeight: 500,
                  marginBottom: "var(--spacing-md)",
                }}
              >
                <MapPin className="w-4 h-4" style={{ color: "var(--green-600)" }} />
                <span>{currentBooking.area}</span>
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate(`/event/${currentBooking.eventId}`)}
                style={{
                  width: "100%",
                  minHeight: "var(--touch-min)",
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
                詳細を見る
              </button>
            </div>
          </div>
        )}

        {/* ============ SPECIAL SLOTS SECTION ============ */}
        {specialSlots.length > 0 && (
          <div style={{ marginBottom: "var(--spacing-2xl)" }}>
            <div style={{ marginBottom: "var(--spacing-md)" }}>
              <h2
                style={{
                  fontSize: "var(--text-md)",
                  fontWeight: 500,
                  color: "var(--neutral-800)",
                  marginBottom: "2px",
                }}
              >
                特別枠
              </h2>
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--neutral-500)",
                  fontWeight: 500,
                }}
              >
                期限内に参加表明できる、2人のお食事会です
              </p>
            </div>

            <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
              {specialSlots.map((slot) => {
                const expiresDate = new Date(slot.expiresAt);
                const now = new Date();
                const daysLeft = Math.ceil((expiresDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={slot.id}
                    onClick={() => handleSpecialSlotClick(slot)}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--green-100)",
                      borderRadius: "var(--radius-lg)",
                      padding: "var(--spacing-lg)",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      WebkitTapHighlightColor: "transparent",
                      transition: "all 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {/* Tag */}
                    <div
                      style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        borderRadius: "var(--radius-full)",
                        background: "var(--green-100)",
                        color: "var(--green-800)",
                        marginBottom: "var(--spacing-sm)",
                      }}
                    >
                      特別枠（{expiresDate.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}まで参加表明ができます）
                    </div>

                    {/* Nickname */}
                    <div
                      style={{
                        fontSize: "var(--text-base)",
                        fontWeight: 500,
                        color: "var(--neutral-800)",
                        marginBottom: "var(--spacing-md)",
                      }}
                    >
                      {slot.partnerNickname}さんとのお食事
                    </div>

                    {/* Info Row */}
                    <div
                      className="flex items-center gap-4"
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--neutral-600)",
                        fontWeight: 500,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" style={{ color: "var(--green-600)" }} />
                        <span>2人</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" style={{ color: "var(--green-600)" }} />
                        <span>あと{daysLeft}日</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============ EVENT CATEGORIES OR "OTHER EVENTS" / "UNBOOKED SLOTS" SECTION ============ */}
        {hasBooking ? (
          // Show remaining events grouped by month
          <div>
            {/* Display months up to displayedMonths */}
            {monthsArray.slice(0, displayedMonths).map((month) => (
              <div key={month} style={{ marginBottom: "var(--spacing-2xl)" }}>
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <h2
                    style={{
                      fontSize: "var(--text-md)",
                      fontWeight: 500,
                      color: "var(--neutral-800)",
                    }}
                  >
                    {month}
                  </h2>
                </div>

                <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
                  {selectEventsForMonth(monthGrouped.get(month) ?? []).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Next Month Button - only show if there are more months to display */}
            {displayedMonths < monthsArray.length && (
              <div style={{ marginBottom: "var(--spacing-2xl)", textAlign: "center" }}>
                <button
                  onClick={handleNextMonth}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--neutral-50)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {monthsArray[displayedMonths]}を表示
                </button>
              </div>
            )}
          </div>
        ) : (
          // Show unbooked events organized by month if no booking
          <div>
            {/* Display months up to displayedMonths */}
            {monthsArray.slice(0, displayedMonths).map((month) => (
              <div key={month} style={{ marginBottom: "var(--spacing-2xl)" }}>
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <h2
                    style={{
                      fontSize: "var(--text-md)",
                      fontWeight: 500,
                      color: "var(--neutral-800)",
                    }}
                  >
                    {month}
                  </h2>
                </div>

                <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
                  {selectEventsForMonth(monthGrouped.get(month) ?? []).map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => handleEventClick(event)}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Next Month Button - only show if there are more months to display */}
            {displayedMonths < monthsArray.length && (
              <div style={{ marginBottom: "var(--spacing-2xl)", textAlign: "center" }}>
                <button
                  onClick={handleNextMonth}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--neutral-50)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {monthsArray[displayedMonths]}を表示
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== Sub Components =====

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
        transition: "all 0.25s ease",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--bg-card)",
        border: "1.5px solid var(--green-100)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-3px)";
        el.style.boxShadow = "var(--shadow-lg)";
        // Add top green line on hover
        const topLine = el.querySelector('[data-top-line]') as HTMLElement;
        if (topLine) {
          topLine.style.height = "3px";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        // Remove top green line on mouse leave
        const topLine = el.querySelector('[data-top-line]') as HTMLElement;
        if (topLine) {
          topLine.style.height = "0px";
        }
      }}
    >
      {/* Top accent line (desktop hover only) */}
      <div
        data-top-line
        style={{
          height: "0px",
          background: "var(--green-600)",
          transition: "height 0.2s ease",
        }}
      />

      {/* Image Area */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "linear-gradient(135deg, var(--green-100) 0%, var(--pink-50) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--neutral-300)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      </div>

      {/* Body */}
      <div style={{ padding: "var(--spacing-lg)" }}>
        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexWrap: "wrap",
            marginBottom: "var(--spacing-sm)",
          }}
        >
          <span
            style={{
              padding: "4px 12px",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              borderRadius: "var(--radius-full)",
              background: getTagStyle(event.theme).bg,
              color: getTagStyle(event.theme).color,
            }}
          >
            {event.theme}
          </span>
          {event.firstTimer && (
            <span
              style={{
                padding: "4px 12px",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                borderRadius: "var(--radius-full)",
                background: getTagStyle("", true).bg,
                color: getTagStyle("", true).color,
              }}
            >
              初めての方歓迎
            </span>
          )}
        </div>

        {/* Title (concept) */}
        <div
          style={{
            fontSize: "var(--text-base)",
            fontWeight: 500,
            color: "var(--neutral-800)",
            marginBottom: "var(--spacing-xs)",
            lineHeight: 1.4,
          }}
        >
          {event.concept}
        </div>

        {/* Date/Time Meta */}
        <div
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--neutral-600)",
            fontWeight: 500,
          }}
        >
          {event.fullDateTime}
        </div>
      </div>
    </div>
  );
}
