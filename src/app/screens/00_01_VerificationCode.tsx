import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export function VerificationCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = localStorage.getItem("sakuraco_temp_email") || "";

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // Countdown timer for resend
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newCode.every((digit) => digit !== "") && index === 5) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...code];
    
    pastedData.split("").forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });
    
    setCode(newCode);
    setError("");

    // Focus the next empty input or last input
    const nextEmptyIndex = newCode.findIndex((d) => d === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Auto-verify if all digits are filled
    if (newCode.every((digit) => digit !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleVerify = async (codeString: string) => {
    setIsLoading(true);
    setError("");

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const storedCode = localStorage.getItem("sakuraco_verification_code");
    
    if (codeString === storedCode) {
      // Verification successful
      localStorage.removeItem("sakuraco_verification_code");
      // Keep email for account creation
      setIsLoading(false);
      navigate("/account-creation");
    } else {
      // Verification failed
      setError("確認コードが正しくありません");
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(60);
    setError("");

    // Mock resend API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate new mock code
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("sakuraco_verification_code", mockCode);
    console.log("New mock verification code:", mockCode);
  };

  const inputStyle = (hasValue: boolean): React.CSSProperties => ({
    width: "48px",
    height: "56px",
    fontSize: "var(--text-xl)",
    fontWeight: 600,
    textAlign: "center",
    border: `2px solid ${error ? "var(--red-500)" : hasValue ? "var(--green-600)" : "var(--neutral-300)"}`,
    borderRadius: "var(--radius-md)",
    background: "rgba(255,255,255,0.85)",
    color: "var(--neutral-800)",
    outline: "none",
    WebkitAppearance: "none" as const,
    transition: "all 0.2s ease",
  });

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
            確認コード入力
          </h2>
          <div style={{ width: "40px" }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Instructions */}
          <div className="mb-8">
            <p
              style={{
                fontSize: "var(--text-base)",
                lineHeight: 1.8,
                color: "var(--neutral-700)",
                fontWeight: 400,
                marginBottom: "var(--spacing-sm)",
              }}
            >
              以下のメールアドレスに確認コードを送信しました。
            </p>
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--green-700)",
                fontWeight: 500,
              }}
            >
              {email}
            </p>
          </div>

          {/* Code Input */}
          <div className="mb-6">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "var(--spacing-md)",
              }}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  style={inputStyle(!!digit)}
                  onFocus={(e) => {
                    if (!error) {
                      e.target.style.borderColor = "var(--green-600)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "none";
                  }}
                  disabled={isLoading}
                />
              ))}
            </div>

            {error && (
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--red-600)",
                  textAlign: "center",
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            )}
          </div>

          {/* Resend */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-600)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              コードが届きませんか？
            </p>
            <button
              onClick={handleResend}
              disabled={!canResend}
              style={{
                background: "none",
                border: "none",
                fontSize: "var(--text-sm)",
                color: canResend ? "var(--green-600)" : "var(--neutral-400)",
                fontWeight: 500,
                cursor: canResend ? "pointer" : "not-allowed",
                textDecoration: "underline",
              }}
            >
              {canResend ? "再送信" : `再送信 (${countdown}秒)`}
            </button>
          </div>

          {/* Helper text */}
          <div
            style={{
              marginTop: "var(--spacing-lg)",
              padding: "var(--spacing-md)",
              background: "var(--neutral-50)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--neutral-200)",
            }}
          >
            <p
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--neutral-600)",
                lineHeight: 1.6,
              }}
            >
              ※ メールが届かない場合は、迷惑メールフォルダをご確認ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
