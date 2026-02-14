import { useNavigate } from "react-router";
import { User, History, CreditCard, Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const MENU_ITEMS = [
  { id: "profile", label: "プロフィール編集", icon: User },
  { id: "history", label: "参加履歴", icon: History },
  { id: "connections", label: "つながり", icon: User }, // Changed from "マッチ一覧"
  { id: "subscription", label: "サブスクリプション管理", icon: CreditCard },
  { id: "notifications", label: "通知設定", icon: Bell },
  { id: "help", label: "ヘルプ・お問い合わせ", icon: HelpCircle },
];

export function MyPage() {
  const navigate = useNavigate();

  const handleMenuClick = (itemId: string) => {
    // Placeholder for future implementation
    alert(`「${MENU_ITEMS.find(i => i.id === itemId)?.label}」は次のフェーズで実装予定です`);
  };

  const handleLogout = () => {
    // Clear all data and navigate to home
    if (confirm("ログアウトしますか？")) {
      localStorage.clear();
      navigate("/");
    }
  };

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
          マイページ
        </h1>

        {/* Menu Items */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--green-100)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            marginBottom: "var(--spacing-lg)",
          }}
        >
          {MENU_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isLast = idx === MENU_ITEMS.length - 1;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-md)",
                  width: "100%",
                  minHeight: "var(--touch-comfortable)",
                  padding: "0 var(--spacing-lg)",
                  background: "transparent",
                  border: "none",
                  borderBottom: isLast ? "none" : "1px solid var(--neutral-100)",
                  cursor: "pointer",
                  WebkitTapHighlightColor: "transparent",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--green-50)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <Icon className="w-5 h-5" style={{ color: "var(--green-600)" }} />
                <span
                  style={{
                    flex: 1,
                    textAlign: "left",
                    fontSize: "var(--text-base)",
                    color: "var(--neutral-700)",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </span>
                <ChevronRight className="w-5 h-5" style={{ color: "var(--neutral-400)" }} />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--spacing-sm)",
            width: "100%",
            minHeight: "var(--touch-comfortable)",
            padding: "0 var(--spacing-lg)",
            borderRadius: "var(--radius-full)",
            fontSize: "var(--text-base)",
            fontWeight: 500,
            border: "1.5px solid var(--neutral-300)",
            background: "transparent",
            color: "var(--neutral-700)",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
            transition: "all 0.2s",
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
}