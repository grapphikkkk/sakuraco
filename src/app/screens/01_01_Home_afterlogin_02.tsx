import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Calendar, Users, MapPin } from "lucide-react";
import { getEventsByCategory, getEventById, Event } from "../data/events";

interface Booking {
  eventId: string;
  theme: string;
  date: string;
  area: string;
  price: number;
  bookedAt: string;
}

export function HomeAfterLogin02() {
  const navigate = useNavigate();
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const savedBooking = localStorage.getItem("sakuraco_current_booking");
    if (savedBooking) {
      setCurrentBooking(JSON.parse(savedBooking));
    }
  }, []);

  const { basic, attr, gay } = getEventsByCategory();
  const otherEvents = [...basic, ...attr, ...gay].filter(
    (e) => e.id !== currentBooking?.eventId
  );

  const handleEventClick = (event: Event) => {
    navigate(`/event/${event.id}`);
  };

  const bookedEvent = currentBooking
    ? getEventById(currentBooking.eventId)
    : null;

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
            ホーム
          </h1>
          <p
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--neutral-500)",
              fontWeight: 500,
            }}
          >
            次のお食事会と他のイベント
          </p>
        </div>

        {/* Current Booking */}
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
                onClick={() => {
                  navigate(`/event-day/${currentBooking.eventId}`);
                }}
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

        {/* Other Events */}
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
      </div>
    </div>
  );
}

// Event Card component (same as in Home_afterlogin_01)
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