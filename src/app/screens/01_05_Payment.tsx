import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { CreditCard, Lock } from "lucide-react";
import { getEventById } from "../data/events";

type PaymentMethod = "credit" | "apple" | "google" | "paypay";

const PAYMENT_METHODS = [
  { id: "credit" as PaymentMethod, label: "クレジットカード", icon: CreditCard },
  { id: "apple" as PaymentMethod, label: "Apple Pay", icon: CreditCard },
  { id: "google" as PaymentMethod, label: "Google Pay", icon: CreditCard },
  { id: "paypay" as PaymentMethod, label: "PayPay", icon: CreditCard },
];

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId, area } = (location.state || {}) as { eventId?: string; area?: string };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const event = eventId ? getEventById(eventId) : undefined;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!event || !area) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p style={{ color: "var(--neutral-600)" }}>予約情報が見つかりません</p>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!selectedMethod || !confirmChecked) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Save booking info to localStorage
    const booking = {
      eventId: event.id,
      theme: event.theme,
      date: event.fullDateTime,
      area,
      price: event.price,
      bookedAt: new Date().toISOString(),
    };

    localStorage.setItem("sakuraco_current_booking", JSON.stringify(booking));

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  const canConfirm = selectedMethod !== null && confirmChecked && !isProcessing;

  // Success screen
  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "var(--green-100)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <CheckCircle2
              className="w-12 h-12"
              style={{ color: "var(--green-600)" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-sm)",
            }}
          >
            予約が完了しました
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: "var(--text-base)",
              color: "var(--neutral-600)",
              marginBottom: "var(--spacing-xl)",
              lineHeight: 1.7,
            }}
          >
            当日を楽しみにお待ちください
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleGoHome}
            style={{
              width: "100%",
              minHeight: "var(--touch-comfortable)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-base)",
              fontWeight: 500,
              border: "none",
              background: "var(--green-600)",
              color: "#fff",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.2s",
            }}
          >
            ホームへ
          </motion.button>
        </div>
      </div>
    );
  }

  // Payment form
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
          <h1
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            お支払い
          </h1>

          {/* Order Summary */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--green-100)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--spacing-lg)",
              marginBottom: "var(--spacing-lg)",
            }}
          >
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              申し込み内容確認
            </h2>

            <div
              className="flex justify-between items-start"
              style={{ marginBottom: "var(--spacing-sm)" }}
            >
              <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)", fontWeight: 500 }}>
                テーマ
              </span>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-800)", fontWeight: 500 }}>
                {event.theme}
              </span>
            </div>

            <div
              className="flex justify-between items-start"
              style={{ marginBottom: "var(--spacing-sm)" }}
            >
              <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)", fontWeight: 500 }}>
                日時
              </span>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-800)", fontWeight: 500 }}>
                {event.fullDateTime}
              </span>
            </div>

            <div
              className="flex justify-between items-start"
              style={{ marginBottom: "var(--spacing-md)" }}
            >
              <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-500)", fontWeight: 500 }}>
                エリア
              </span>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--neutral-800)", fontWeight: 500 }}>
                {area}
              </span>
            </div>

            <div
              style={{
                borderTop: "1px solid var(--neutral-200)",
                paddingTop: "var(--spacing-md)",
              }}
            >
              <div className="flex justify-between items-center">
                <span style={{ fontSize: "var(--text-base)", color: "var(--neutral-800)", fontWeight: 500 }}>
                  合計金額
                </span>
                <span
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--green-700)",
                    fontWeight: 700,
                    fontFamily: "var(--font-en)",
                  }}
                >
                  ¥{event.price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <h2
              style={{
                fontSize: "var(--text-md)",
                fontWeight: 500,
                color: "var(--neutral-800)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              決済方法選択
            </h2>

            <div className="flex flex-col" style={{ gap: "var(--spacing-sm)" }}>
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedMethod === method.id;
                const Icon = method.icon;

                return (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-sm)",
                      width: "100%",
                      minHeight: "var(--touch-comfortable)",
                      padding: "0 var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-base)",
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
                    <Icon className="w-5 h-5" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cancel Policy Confirmation */}
          <div
            style={{
              background: "var(--neutral-50)",
              border: "1px solid var(--neutral-200)",
              borderRadius: "var(--radius-md)",
              padding: "var(--spacing-md)",
              marginBottom: "var(--spacing-lg)",
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
              キャンセル規定の再確認
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

          {/* Confirmation Checkbox */}
          <label
            style={{
              display: "flex",
              alignItems: "start",
              gap: "var(--spacing-sm)",
              marginBottom: "var(--spacing-xl)",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <input
              type="checkbox"
              checked={confirmChecked}
              onChange={(e) => setConfirmChecked(e.target.checked)}
              style={{
                width: "20px",
                height: "20px",
                marginTop: "2px",
                cursor: "pointer",
                accentColor: "var(--green-600)",
              }}
            />
            <span
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-700)",
                lineHeight: 1.6,
              }}
            >
              キャンセル規定を確認し、内容に同意します
            </span>
          </label>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            style={{
              width: "100%",
              minHeight: "var(--touch-comfortable)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-base)",
              fontWeight: 500,
              border: "none",
              background: canConfirm ? "var(--green-600)" : "var(--disabled)",
              color: canConfirm ? "#fff" : "var(--disabled-foreground)",
              cursor: canConfirm ? "pointer" : "not-allowed",
              WebkitTapHighlightColor: "transparent",
              transition: "all 0.2s",
            }}
          >
            {isProcessing ? "処理中..." : "確定"}
          </button>
        </div>
      </div>
    </div>
  );
}