import { useState } from "react";
import { useNavigate } from "react-router";

export function EmailVerification() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canProceed = isValidEmail(email);

  const handleSendCode = async () => {
    if (!canProceed) return;

    setIsLoading(true);

    // Mock API call to send verification code
    // In production, this would call your backend API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store email in localStorage for verification screen
    localStorage.setItem("sakuraco_temp_email", email);

    // Generate and store a mock verification code (for demo purposes)
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("sakuraco_verification_code", mockCode);
    console.log("Mock verification code:", mockCode); // For testing

    setIsLoading(false);
    navigate("/email-verify-code");
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

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "var(--touch-comfortable)",
    borderRadius: "var(--radius-md)",
    border: "none",
    background: canProceed ? "var(--green-600)" : "var(--neutral-300)",
    color: canProceed ? "#fff" : "var(--neutral-500)",
    fontWeight: 500,
    fontSize: "var(--text-base)",
    cursor: canProceed ? "pointer" : "not-allowed",
    transition: "all 0.2s ease",
    opacity: isLoading ? 0.6 : 1,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "#fff",
          borderBottom: "1px solid var(--neutral-200)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--spacing-md) var(--spacing-lg)",
            minHeight: "56px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              fontSize: "var(--text-lg)",
              color: "var(--neutral-700)",
              cursor: "pointer",
              padding: "8px",
              marginLeft: "-8px",
            }}
          >
            ←
          </button>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              fontWeight: 400,
              color: "var(--neutral-800)",
            }}
          >
            メールアドレスで登録
          </h2>
          <div style={{ width: "40px" }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Instructions */}
          <div className="mb-6">
            <p
              style={{
                fontSize: "var(--text-base)",
                lineHeight: 1.8,
                color: "var(--neutral-700)",
                fontWeight: 400,
              }}
            >
              メールアドレスを入力してください。
              <br />
              確認コードを送信します。
            </p>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label
              style={{
                display: "block",
                fontSize: "var(--text-sm)",
                color: "var(--neutral-700)",
                fontWeight: 500,
                marginBottom: "var(--spacing-xs)",
              }}
            >
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--green-600)";
                e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--neutral-300)";
                e.target.style.boxShadow = "none";
              }}
            />
            {email && !isValidEmail(email) && (
              <p
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--red-600)",
                  marginTop: "var(--spacing-xs)",
                }}
              >
                有効なメールアドレスを入力してください
              </p>
            )}
          </div>

          {/* Send Code Button */}
          <button
            onClick={handleSendCode}
            disabled={!canProceed || isLoading}
            style={buttonStyle}
          >
            {isLoading ? "送信中..." : "確認コードを送信"}
          </button>
        </div>
      </div>
    </div>
  );
}
