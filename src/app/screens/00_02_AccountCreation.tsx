import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

export function AccountCreation() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Dropdown open states
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (iconPreview) URL.revokeObjectURL(iconPreview);
    };
  }, [iconPreview]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (dayRef.current && !dayRef.current.contains(event.target as Node)) {
        setIsDayOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
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
  
  const dropdownTriggerStyle = (isOpen: boolean, hasValue: boolean): React.CSSProperties => ({
    width: "100%",
    minHeight: "48px",
    padding: "0 40px 0 16px",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    border: isOpen ? "1.5px solid var(--green-600)" : "1.5px solid var(--neutral-300)",
    borderRadius: "var(--radius-md)",
    background: "rgba(255,255,255,0.85)",
    color: hasValue ? "var(--neutral-800)" : "var(--neutral-500)",
    outline: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    textAlign: "left",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: isOpen ? "0 0 0 3px rgba(29,140,126,0.12)" : "none",
  });
  
  const dropdownMenuStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    maxHeight: "280px",
    overflowY: "auto",
    background: "#fff",
    border: "1px solid var(--neutral-200)",
    borderRadius: "var(--radius-md)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    zIndex: 50,
  };
  
  const dropdownItemStyle = (isSelected: boolean): React.CSSProperties => ({
    padding: "12px 16px",
    fontSize: "var(--text-base)",
    color: "var(--neutral-800)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: isSelected ? "var(--green-50)" : "transparent",
    transition: "background 0.15s",
  });

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
        
        {/* Profile registration card (Design System) */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--green-100)", borderRadius: "var(--radius-lg)", padding: "var(--spacing-2xl) var(--spacing-lg)", textAlign: "center", marginBottom: "var(--spacing-xl)" }}>
          <div style={{ fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--neutral-700)", marginBottom: "var(--spacing-xl)" }}>アカウント情報の登録</div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--spacing-lg)", position: 'relative' }}>
            <div className={`avatar-upload avatar-upload-md`} onClick={() => fileInputRef.current?.click()} role="button" aria-label="プロフィール画像を選択">
              <div className={`avatar-upload-circle ${iconPreview ? 'has-image' : ''}`}>
                {iconPreview ? (
                  <img src={iconPreview} alt="avatar preview" />
                ) : (
                  <svg className="avatar-upload-person" width="44" height="44" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <div className="avatar-upload-badge" style={{ position: 'absolute' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (!f) return;
                const url = URL.createObjectURL(f);
                if (iconPreview) URL.revokeObjectURL(iconPreview);
                setIconPreview(url);
              }}
            />
          </div>

          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', lineHeight: 1.7 }}>
            タップして写真を選択<br />JPG, PNG｜最大 5MB
          </div>
        </div>
        
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
            {/* Year Dropdown */}
            <div ref={yearRef} style={{ flex: 1, position: "relative" }}>
              <div
                onClick={() => {
                  setIsYearOpen(!isYearOpen);
                  setIsMonthOpen(false);
                  setIsDayOpen(false);
                }}
                style={dropdownTriggerStyle(isYearOpen, !!birthYear)}
              >
                <span>{birthYear || "年"}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: "12px", transition: "transform 0.2s", transform: isYearOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {isYearOpen && (
                <div style={dropdownMenuStyle}>
                  {years.map((year) => (
                    <div
                      key={year}
                      onClick={() => {
                        setBirthYear(String(year));
                        setIsYearOpen(false);
                      }}
                      style={dropdownItemStyle(birthYear === String(year))}
                      onMouseEnter={(e) => {
                        if (birthYear !== String(year)) {
                          e.currentTarget.style.background = "var(--neutral-50)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (birthYear !== String(year)) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <span>{year}</span>
                      {birthYear === String(year) && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Month Dropdown */}
            <div ref={monthRef} style={{ flex: 1, position: "relative" }}>
              <div
                onClick={() => {
                  setIsMonthOpen(!isMonthOpen);
                  setIsYearOpen(false);
                  setIsDayOpen(false);
                }}
                style={dropdownTriggerStyle(isMonthOpen, !!birthMonth)}
              >
                <span>{birthMonth ? String(birthMonth).padStart(2, '0') : "月"}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: "12px", transition: "transform 0.2s", transform: isMonthOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {isMonthOpen && (
                <div style={dropdownMenuStyle}>
                  {months.map((month) => (
                    <div
                      key={month.value}
                      onClick={() => {
                        setBirthMonth(month.value);
                        setIsMonthOpen(false);
                      }}
                      style={dropdownItemStyle(birthMonth === month.value)}
                      onMouseEnter={(e) => {
                        if (birthMonth !== month.value) {
                          e.currentTarget.style.background = "var(--neutral-50)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (birthMonth !== month.value) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <span>{month.label}</span>
                      {birthMonth === month.value && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Day Dropdown */}
            <div ref={dayRef} style={{ flex: 1, position: "relative" }}>
              <div
                onClick={() => {
                  setIsDayOpen(!isDayOpen);
                  setIsYearOpen(false);
                  setIsMonthOpen(false);
                }}
                style={dropdownTriggerStyle(isDayOpen, !!birthDay)}
              >
                <span>{birthDay ? String(birthDay).padStart(2, '0') : "日"}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: "12px", transition: "transform 0.2s", transform: isDayOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              {isDayOpen && (
                <div style={dropdownMenuStyle}>
                  {days.map((day) => (
                    <div
                      key={day.value}
                      onClick={() => {
                        setBirthDay(day.value);
                        setIsDayOpen(false);
                      }}
                      style={dropdownItemStyle(birthDay === day.value)}
                      onMouseEnter={(e) => {
                        if (birthDay !== day.value) {
                          e.currentTarget.style.background = "var(--neutral-50)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (birthDay !== day.value) {
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      <span>{day.label}</span>
                      {birthDay === day.value && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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