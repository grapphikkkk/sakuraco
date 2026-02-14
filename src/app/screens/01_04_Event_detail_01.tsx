import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Calendar, Users, MapPin, ArrowLeft, Info } from "lucide-react";
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