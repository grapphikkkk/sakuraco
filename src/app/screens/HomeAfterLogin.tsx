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

// Unified Home screen: handles special slots, booking, and event browsing in a single component
export function HomeAfterLogin() {
  const navigate = useNavigate();
  const [hasBooking, setHasBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [specialSlots, setSpecialSlots] = useState<SpecialSlotEvent[]>([]);
  const [loadedWeeks, setLoadedWeeks] = useState(2);

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

  const handleLoadMore = () => {
    setLoadedWeeks((prev) => prev + 1);
  };

  // ===== Render =====
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header - changes based on booking status */}
        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <h1
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-xs)",
            }}
          >
            {hasBooking ? "ホーム" : "参加できるお食事会"}
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--neutral-500)",
              fontWeight: 500,
            }}
          >
            {hasBooking ? "次のお食事会と他のイベント" : "今週・来週のお食事会から選べます"}
          </p>
        </div>

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
              次の参加お食事会
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
              <h3
                style={{
                  fontSize: "var(--text-md)",
                  fontWeight: 500,
                  color: "var(--neutral-800)",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                {currentBooking.theme}
              </h3>

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

        {/* ============ EVENT CATEGORIES OR "OTHER EVENTS" SECTION ============ */}
        {hasBooking ? (
          // Show remaining events if booking exists
          <div>
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              未参加の他のお食事会一覧
            </h2>

            <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
              {otherEvents.slice(0, 6).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Show all event categories if no booking
          <>
            {/* ベーシック Section */}
            {basic.length > 0 && (
              <EventSection
                title="ベーシック"
                subtitle="初めての方も安心"
                events={basic}
                onEventClick={handleEventClick}
              />
            )}

            {/* 属性 Section */}
            {attr.length > 0 && (
              <EventSection
                title="属性"
                subtitle="共通の属性で集まる"
                events={attr}
                onEventClick={handleEventClick}
              />
            )}

            {/* ゲイ独自の興味 Section */}
            {gay.length > 0 && (
              <EventSection
                title="ゲイ独自の興味"
                subtitle="特定の興味で集まる"
                events={gay}
                onEventClick={handleEventClick}
              />
            )}

            {/* Load More */}
            <div style={{ marginTop: "var(--spacing-xl)", textAlign: "center" }}>
              <button
                onClick={handleLoadMore}
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
                さらに表示
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ===== Sub Components =====

function EventSection({
  title,
  subtitle,
  events,
  onEventClick,
}: {
  title: string;
  subtitle: string;
  events: Event[];
  onEventClick: (event: Event) => void;
}) {
  return (
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
          {title}
        </h2>
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--neutral-500)",
            fontWeight: 500,
          }}
        >
          {subtitle}
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--green-100)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--spacing-lg)",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s ease",
        cursor: "pointer",
        WebkitTapHighlightColor: "transparent",
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
      {/* Tags */}
      <div className="flex gap-1 flex-wrap" style={{ marginBottom: "var(--spacing-sm)" }}>
        <span
          style={{
            padding: "3px 10px",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            borderRadius: "var(--radius-full)",
            background: "var(--green-100)",
            color: "var(--green-800)",
          }}
        >
          {event.theme}
        </span>
        {event.firstTimer && (
          <span
            style={{
              padding: "3px 10px",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              borderRadius: "var(--radius-full)",
              background: "var(--pink-100)",
              color: "var(--pink-500)",
            }}
          >
            初めての方歓迎
          </span>
        )}
      </div>

      {/* Date/Time */}
      <div
        className="flex items-center gap-1"
        style={{
          fontSize: "var(--text-base)",
          color: "var(--neutral-800)",
          fontWeight: 500,
          marginBottom: "var(--spacing-xs)",
        }}
      >
        <Calendar className="w-4 h-4" style={{ color: "var(--green-600)" }} />
        <span>{event.fullDateTime}</span>
      </div>

      {/* Participants - Fixed 5人 */}
      <div
        className="flex items-center gap-1"
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--neutral-500)",
          fontWeight: 500,
        }}
      >
        <Users className="w-3.5 h-3.5" />
        <span>5人</span>
      </div>
    </div>
  );
}
