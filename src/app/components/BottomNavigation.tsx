import { Link, useLocation } from "react-router";
import { Home, Calendar, User } from "lucide-react";

export function BottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    { path: "/home", label: "ホーム", icon: Home },
    { path: "/reservations", label: "予約", icon: Calendar },
    { path: "/mypage", label: "マイページ", icon: User },
  ];
  
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "var(--green-100)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex justify-around items-center" style={{ height: "56px" }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full"
              style={{ minWidth: "44px", minHeight: "44px" }}
            >
              <Icon
                className="w-6 h-6 mb-1"
                style={{
                  color: isActive ? "var(--green-600)" : "var(--neutral-400)",
                }}
              />
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "var(--green-600)" : "var(--neutral-400)",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
