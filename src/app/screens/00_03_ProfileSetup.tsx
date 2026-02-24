import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

export function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sns = params.get("sns");

  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
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

  useEffect(() => {
    if (!params.get("authed")) {
      // if arrived here without auth, go back
      // keep it simple: navigate back to account creation
      navigate(-1);
    }
  }, [params, navigate]);
  
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 18 - i);
  const months = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1).padStart(2, "0") }));
  const getDaysInMonth = () => {
    if (!birthMonth) return 31;
    const month = parseInt(birthMonth);
    const year = parseInt(birthYear) || currentYear;
    return new Date(year, month, 0).getDate();
  };
  const days = Array.from({ length: getDaysInMonth() }, (_, i) => ({ value: String(i + 1), label: String(i + 1).padStart(2, "0") }));

  useEffect(() => {
    if (!iconFile) {
      setIconPreview(null);
      return;
    }
    const url = URL.createObjectURL(iconFile);
    setIconPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [iconFile]);

  const isAgeValid = () => {
    if (!birthYear || !birthMonth || !birthDay) return false;
    const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, parseInt(birthDay));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    const d = today.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && d < 0)) age--;
    if (age > 20) return true;
    if (age === 20 && m > 0) return true;
    if (age === 20 && m === 0 && d >= 0) return true;
    return false;
  };

  const showAgeError = birthYear && birthMonth && birthDay && !isAgeValid();
  const canSubmit = nickname.trim() && isAgeValid() && agreedToTerms;

  const handleSubmit = () => {
    if (!canSubmit) return;
    localStorage.setItem("sakuraco_registered", "true");
    if (!localStorage.getItem("sakuraco_onboarding_complete")) {
      navigate("/onboarding");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 style={{ fontSize: "var(--text-lg)", fontWeight: 500, color: "var(--neutral-800)", marginBottom: "var(--spacing-xl)" }}>
          アカウント情報の登録
        </h1>

        <p style={{ color: "var(--neutral-600)", marginBottom: "12px" }}>
          {sns ? `${sns}で認証されました。` : "SNS認証済み"} 次にアイコンとニックネーム、生年月日を設定してください。
        </p>

        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <div style={{ position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-lg)', width: '100%', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
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
                    const f = e.target.files?.[0] || null;
                    setIconFile(f);
                  }}
                />
              </div>
            </div>

            <p style={{ fontSize: "var(--text-xs)", color: "var(--neutral-500)", marginBottom: 8 }}>後で変更できます。お食事会参加まで他の人には公開されません。</p>
          </div>
        </div>

        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>ニックネーム</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="あなたの呼び名を入力（本名不要）" style={inputStyle} onFocus={(e:any)=>{e.target.style.borderColor="var(--green-400)";e.target.style.boxShadow="0 0 0 3px rgba(29,140,126,0.12)"}} onBlur={(e:any)=>{e.target.style.borderColor="var(--neutral-300)";e.target.style.boxShadow="none"}} />
        </div>

        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>生年月日（20歳以上確認）</label>
          <div style={{ display: "flex", gap: 8 }}>
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
            <p style={{ fontSize: "var(--text-xs)", color: "var(--red-500)", fontWeight: 500, marginTop: "4px" }}>
              20歳以上である必要があります
            </p>
          )}
        </div>

        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <label className="flex items-start gap-3 cursor-pointer" style={{ minHeight: "var(--touch-min)" }}>
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
            <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-700)", lineHeight: 1.9 }}>
              本サービスは男性同士（ゲイ）の交流を目的としています。当事者以外の利用は固くお断りします。
              <a href="#" style={{ color: "var(--green-600)", textDecoration: "underline", marginLeft: "6px" }}>利用規約</a>・
              <a href="#" style={{ color: "var(--green-600)", textDecoration: "underline" }}>プライバシーポリシー</a>
              に同意します。
            </span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate(-1)} style={{ flex: 1, minHeight: 44, background: "var(--neutral-100)", borderRadius: "var(--radius-md)" }}>戻る</button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full transition-all"
            style={{
              flex: 1,
              minHeight: "var(--touch-comfortable)",
              borderRadius: "var(--radius-full)",
              border: "none",
              fontWeight: 500,
              fontSize: "var(--text-sm)",
              letterSpacing: "0.03em",
              cursor: canSubmit ? "pointer" : "not-allowed",
              background: canSubmit ? "var(--green-600)" : "var(--neutral-200)",
              color: canSubmit ? "#fff" : "var(--neutral-400)",
              boxShadow: canSubmit ? "0 2px 8px rgba(23,117,104,0.28)" : "none",
            }}
          >
            登録して進む
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
