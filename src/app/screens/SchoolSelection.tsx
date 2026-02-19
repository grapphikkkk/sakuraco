import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { ArrowLeft } from "lucide-react";

export function SchoolSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventId = (location.state as any)?.eventId;

  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  // ページ遷移後、最上部にスクロール
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schools = [
    "東京大学",
    "京都大学",
    "大阪大学",
    "北海道大学",
    "九州大学",
    "一橋大学",
    "東京外国語大学",
    "お茶の水女子大学",
    "早稲田大学",
    "慶應義塾大学",
    "上智大学",
    "国際基督教大学",
    "明治大学",
    "青山学院大学",
    "立教大学",
    "中央大学",
    "法政大学",
    "関西大学",
    "関西学院大学",
    "同志社大学",
    "立命館大学",
    "文化服装学院",
    "東京モード学園",
    "大阪モード学園",
    "名古屋モード学園",
    "山野美容専門学校",
    "東京美容専門学校",
  ];

  const handleSchoolSelect = () => {
    if (selectedSchool && eventId) {
      // 学校選択をlocalStorageに保存（必要に応じて）
      localStorage.setItem("sakuraco_selected_school", selectedSchool);
      // イベント詳細画面に遷移
      navigate(`/event/${eventId}`);
    }
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
          {/* Title & Description */}
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <h1
              style={{
                fontSize: "var(--text-lg)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              学校名の選択
            </h1>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-600)",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              この会に参加するためには、あなたの出身学校を選択してください（リスト以外の学校は現在は利用できませんが、今後拡大予定です）
            </p>
          </div>

          {/* School List */}
          <div className="flex flex-col" style={{ gap: "var(--spacing-xs)", marginBottom: "var(--spacing-lg)" }}>
            {schools.map((school) => {
              const isSelected = selectedSchool === school;

              return (
                <button
                  key={school}
                  onClick={() => setSelectedSchool(school)}
                  style={{
                    width: "100%",
                    padding: "var(--spacing-md) var(--spacing-lg)",
                    textAlign: "left",
                    borderRadius: "var(--radius-md)",
                    fontSize: "var(--text-base)",
                    fontWeight: isSelected ? 500 : 400,
                    color: isSelected ? "#fff" : "var(--neutral-800)",
                    border: isSelected ? "1.5px solid var(--green-600)" : "1px solid var(--neutral-200)",
                    background: isSelected ? "var(--green-600)" : "transparent",
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "var(--neutral-50)";
                      e.currentTarget.style.borderColor = "var(--neutral-300)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "var(--neutral-200)";
                    }
                  }}
                >
                  {school}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSchoolSelect}
            disabled={!selectedSchool}
            style={{
              width: "100%",
              minHeight: "var(--touch-comfortable)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-base)",
              fontWeight: 500,
              border: "none",
              background: selectedSchool ? "var(--green-600)" : "var(--neutral-300)",
              color: selectedSchool ? "#fff" : "var(--neutral-500)",
              cursor: selectedSchool ? "pointer" : "not-allowed",
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.2s",
            }}
          >
            参加申し込み
          </button>
        </div>
      </div>
    </div>
  );
}
