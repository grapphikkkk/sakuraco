import { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Download } from "lucide-react";
import { getEventById } from "../data/events";
import { useNavigate } from "react-router";

interface Booking {
  eventId: string;
  theme: string;
  date: string;
  area: string;
  price: number;
  bookedAt: string;
}

export function Reservations() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load current booking from localStorage
    const savedBooking = localStorage.getItem("sakuraco_current_booking");
    if (savedBooking) {
      setBookings([JSON.parse(savedBooking)]);
    }
  }, []);

  const handleViewDetails = (eventId: string) => {
    navigate(`/event-day/${eventId}`);
  };

  const handleAddToCalendar = (booking: Booking) => {
    // Parse date string (e.g., "12月25日（水） 19:30")
    const dateMatch = booking.date.match(/(\d+)月(\d+)日.*?(\d+):(\d+)/);
    if (!dateMatch) return;

    const [, month, day, hour, minute] = dateMatch;
    const currentYear = new Date().getFullYear();
    
    // Create start date
    const startDate = new Date(currentYear, parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
    // Event duration: 2 hours
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    // Format dates for ICS (YYYYMMDDTHHMMSS)
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SakuraCo//JP',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${booking.theme}`,
      `LOCATION:${booking.area}`,
      'DESCRIPTION:SakuraCoのお食事会',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Create and download ICS file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sakuraco-${booking.eventId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen px-4 py-6">
        <div className="max-w-md mx-auto">
          <h1
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            予約
          </h1>

          <div
            className="flex items-center justify-center"
            style={{ minHeight: "40vh" }}
          >
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--neutral-500)",
                textAlign: "center",
              }}
            >
              まだ予約がありません
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-md mx-auto">
        <h1
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 500,
            color: "var(--neutral-800)",
            marginBottom: "var(--spacing-xs)",
          }}
        >
          予約
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--neutral-500)",
            fontWeight: 500,
            marginBottom: "var(--spacing-lg)",
          }}
        >
          予約済みのお食事会
        </p>

        <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
          {bookings.map((booking, idx) => {
            const event = getEventById(booking.eventId);
            
            return (
              <div
                key={idx}
                style={{
                  background: "linear-gradient(135deg, var(--green-50) 0%, var(--bg-card) 100%)",
                  border: "2px solid var(--green-200)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--spacing-lg)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Badge */}
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
                  {booking.theme}
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
                  <span>{booking.date}</span>
                </div>

                {/* Area */}
                <div
                  className="flex items-center gap-2"
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--neutral-700)",
                    fontWeight: 500,
                    marginBottom: "var(--spacing-xs)",
                  }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "var(--green-600)" }} />
                  <span>{booking.area}</span>
                </div>

                {/* Participants (if event data available) */}
                {event && (
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
                    <span>5人</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  className="flex gap-2"
                  style={{
                    borderTop: "1px solid var(--green-200)",
                    paddingTop: "var(--spacing-md)",
                  }}
                >
                  <button
                    onClick={() => handleViewDetails(booking.eventId)}
                    style={{
                      flex: 1,
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
                  <button
                    onClick={() => handleAddToCalendar(booking)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      flex: 1,
                      minHeight: "var(--touch-min)",
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
                    <Download className="w-4 h-4" />
                    <span>カレンダーに追加</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}