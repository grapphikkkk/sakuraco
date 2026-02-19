import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Calendar, Users, MapPin } from "lucide-react";
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

export function HomeAfterLogin02({ showSpecial = true }: { showSpecial?: boolean }) {
  const navigate = useNavigate();
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [specialSlots, setSpecialSlots] = useState<SpecialSlotEvent[]>([]);

  useEffect(() => {
    const savedBooking = localStorage.getItem("sakuraco_current_booking");
    if (savedBooking) {
      setCurrentBooking(JSON.parse(savedBooking));
    }
  }, []);

  useEffect(() => {
  const showSpecialSlot = localStorage.getItem("sakuraco_show_special_slot");

  // ✅ ConnectionResult から渡された“今回の相互マッチ”があればそれを優先
  const saved = localStorage.getItem("sakuraco_special_slots");
  let connections: any[] = [];

  if (saved) {
    try {
      connections = JSON.parse(saved);
    } catch {
      connections = [];
    }
  } else if (showSpecialSlot === "1") {
    // 保険：保存が無いなら mutual のみ
    connections = getConnections().filter((c) => c.mutualInterest);
  }

  // ✅ 重複排除（nickname/participantNickname などをキーに）
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

  // ✅ 1回表示したらフラグ/保存を消して増殖事故を防ぐ（必要なら残してもOK）
  localStorage.removeItem("sakuraco_show_special_slot");
  localStorage.removeItem("sakuraco_special_slots");
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

        {/* Special Slots Section */}
        {showSpecial && specialSlots.length > 0 && (
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
                    onClick={() => navigate(`/event/${slot.id}`)}
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
                  navigate(`/event/${currentBooking.eventId}`);
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