import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export function OAuthMock() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const provider = params.get("provider") || "unknown";

    // Simulate an external OAuth flow and redirect back to profile setup
    const t = setTimeout(() => {
      navigate(`/profile-setup?sns=${provider}&authed=true`);
    }, 700);

    return () => clearTimeout(t);
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div style={{ fontSize: "var(--text-base)", color: "var(--neutral-700)" }}>認証画面へリダイレクト中…</div>
    </div>
  );
}

export default OAuthMock;
