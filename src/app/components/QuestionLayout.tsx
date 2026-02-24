import { ChevronLeft } from "lucide-react";

interface QuestionLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  showProgress?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  ctaLabel: string;
  ctaDisabled?: boolean;
  onCta: () => void;
}

export function QuestionLayout({
  children,
  currentStep,
  totalSteps,
  showProgress = true,
  showBack = true,
  onBack,
  ctaLabel,
  ctaDisabled = false,
  onCta,
}: QuestionLayoutProps) {
  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="z-10 px-4 pt-4 pb-2"
        style={{ background: "var(--bg-main)", flexShrink: 0 }}
      >
        <div className="flex items-center mb-2" style={{ height: "44px" }}>
          {showBack && onBack ? (
            <button
              onClick={onBack}
              className="flex items-center justify-center -ml-2"
              style={{
                width: "44px",
                height: "44px",
                minWidth: "44px",
                minHeight: "44px",
                borderRadius: "var(--radius-md)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="戻る"
            >
              <ChevronLeft
                className="w-6 h-6"
                style={{ color: "var(--neutral-800)" }}
              />
            </button>
          ) : (
            <div style={{ width: "44px", height: "44px" }} />
          )}
          {showProgress && (
            <span
              className="ml-auto"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--neutral-500)",
                fontWeight: 500,
              }}
            >
              {currentStep}/{totalSteps}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div
            className="w-full overflow-hidden"
            style={{
              height: "6px",
              background: "var(--neutral-200)",
              borderRadius: "var(--radius-full)",
            }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: "var(--green-600)",
                borderRadius: "var(--radius-full)",
              }}
            />
          </div>
        )}
      </div>

      {/* Content - Scrollable Area */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {children}
      </div>

      {/* Fixed Bottom Button - Always Visible */}
      <div
        style={{
          padding: "16px",
          paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
          background: "var(--bg-main)",
          borderTop: "1px solid var(--green-100)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onCta}
          disabled={ctaDisabled}
          className="w-full transition-all active:opacity-80"
          style={{
            minHeight: "var(--touch-comfortable)",
            borderRadius: "var(--radius-full)",
            border: "none",
            fontWeight: 500,
            fontSize: "var(--text-sm)",
            letterSpacing: "0.03em",
            cursor: ctaDisabled ? "not-allowed" : "pointer",
            background: ctaDisabled ? "var(--neutral-200)" : "var(--green-600)",
            color: ctaDisabled ? "var(--neutral-400)" : "#fff",
            boxShadow: ctaDisabled
              ? "none"
              : "0 2px 8px rgba(23,117,104,0.28)",
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
