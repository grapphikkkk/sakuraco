import { useState } from "react";
import { useNavigate } from "react-router";

export function AccountCreation() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const isAgeValid = () => {
    if (!birthYear || !birthMonth || !birthDay) return false;
    const birthDate = new Date(
      parseInt(birthYear),
      parseInt(birthMonth) - 1,
      parseInt(birthDay)
    );
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    if (age > 20) return true;
    if (age === 20 && monthDiff > 0) return true;
    if (age === 20 && monthDiff === 0 && dayDiff >= 0) return true;
    return false;
  };
  
  const canProceed = nickname.trim() && isAgeValid() && agreedToTerms;
  
  const handleSubmit = () => {
    if (canProceed) {
      localStorage.setItem("sakuraco_registered", "true");
      const hasSeenOnboarding = localStorage.getItem("sakuraco_onboarding_complete");

      if (!hasSeenOnboarding) {
        navigate("/onboarding");
      } else {
        navigate("/home");
      }
    }
  };

  

  const inputStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "48px",
    padding: "0 16px",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    border: "1.5px solid var(--neutral-300)",
    borderRadius: "var(--radius-md)",
    background: "rgba(255,255,255,0.85)",
    color: "var(--neutral-800)",
    outline: "none",
    WebkitAppearance: "none" as const,
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
  };

  // Generate year options (current year - 100 to current year - 18)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);

  // Generate month options (01-12)
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: String(month), label: String(month).padStart(2, '0') };
  });

  // Generate day options based on selected month and year
  const getDaysInMonth = () => {
    if (!birthMonth) return 31;
    const month = parseInt(birthMonth);
    const year = parseInt(birthYear) || currentYear;
    return new Date(year, month, 0).getDate();
  };

  const days = Array.from({ length: getDaysInMonth() }, (_, i) => {
    const day = i + 1;
    return { value: String(day), label: String(day).padStart(2, '0') };
  });

  // Age error message
  const showAgeError = birthYear && birthMonth && birthDay && !isAgeValid();
  
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 500,
            color: "var(--neutral-800)",
            marginBottom: "var(--spacing-xl)",
          }}
        >
          アカウント作成
        </h1>
        
        {/* SNS 認証はトップ画面に移動しました */}
        
        {/* Nickname */}
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <label
            style={{
              display: "block",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              color: "var(--neutral-700)",
              marginBottom: "6px",
            }}
          >
            ニックネーム
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="あなたの呼び名を入力"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--green-400)";
              e.target.style.boxShadow = "0 0 0 3px rgba(29,140,126,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--neutral-300)";
              e.target.style.boxShadow = "none";
            }}
          />
          <p
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--neutral-500)",
              fontWeight: 500,
              marginTop: "4px",
            }}
          >
            本名の入力は不要です
          </p>
        </div>
        
        {/* Age Verification */}
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <label
            style={{
              display: "block",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              color: "var(--neutral-700)",
              marginBottom: "6px",
            }}
          >
            生年月日（20歳以上確認）
          </label>
          <div className="flex gap-2">
            <select
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="年"
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--green-400)";
                e.target.style.boxShadow = "0 0 0 3px rgba(29,140,126,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--neutral-300)";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">年</option>
              {years.map(year => (
                <option key={year} value={String(year)}>{year}</option>
              ))}
            </select>
            <select
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              placeholder="月"
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--green-400)";
                e.target.style.boxShadow = "0 0 0 3px rgba(29,140,126,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--neutral-300)";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">月</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              placeholder="日"
              style={selectStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--green-400)";
                e.target.style.boxShadow = "0 0 0 3px rgba(29,140,126,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--neutral-300)";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">日</option>
              {days.map(day => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
          </div>
          {showAgeError && (
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--red-500)",
                fontWeight: 500,
                marginTop: "4px",
              }}
            >
              20歳以上である必要があります
            </p>
          )}
        </div>
        
        {/* Terms & Privacy */}
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <label
            className="flex items-start gap-3 cursor-pointer"
            style={{ minHeight: "var(--touch-min)" }}
          >
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1"
              style={{
                width: "20px",
                height: "20px",
                minWidth: "20px",
                minHeight: "20px",
                accentColor: "var(--green-600)",
              }}
            />
            <span
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-700)",
                lineHeight: 1.9,
              }}
            >
              本サービスは男性同士（ゲイ）の交流を目的としています。当事者以外の利用は固くお断りします。
              <a
                href="#"
                style={{
                  color: "var(--green-600)",
                  textDecoration: "underline",
                  marginLeft: "4px",
                }}
              >
                利用規約
              </a>
              ・
              <a
                href="#"
                style={{ color: "var(--green-600)", textDecoration: "underline" }}
              >
                プライバシーポリシー
              </a>
              に同意します。
            </span>
          </label>
        </div>
        
        {/* Submit — Primary CTA */}
        <button
          onClick={handleSubmit}
          disabled={!canProceed}
          className="w-full transition-all"
          style={{
            minHeight: "var(--touch-comfortable)",
            borderRadius: "var(--radius-full)",
            border: "none",
            fontWeight: 500,
            fontSize: "var(--text-sm)",
            letterSpacing: "0.03em",
            cursor: canProceed ? "pointer" : "not-allowed",
            background: canProceed ? "var(--green-600)" : "var(--neutral-200)",
            color: canProceed ? "#fff" : "var(--neutral-400)",
            boxShadow: canProceed ? "0 2px 8px rgba(23,117,104,0.28)" : "none",
          }}
        >
          次へ
        </button>
      </div>
    </div>
  );
}