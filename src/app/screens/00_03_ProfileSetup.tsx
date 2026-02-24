import { useNavigate, useLocation } from "react-router";
import { ProfileFormCard } from "../components/ProfileFormCard";

export function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sns = params.get("sns");

  if (!params.get("authed")) {
    navigate(-1);
    return null;
  }

  const handleSubmit = () => {
    localStorage.setItem("sakuraco_registered", "true");
    if (!localStorage.getItem("sakuraco_onboarding_complete")) {
      navigate("/onboarding");
    } else {
      navigate("/home");
    }
  };

  return (
    <ProfileFormCard
      header={
        <>
          <h1
            style={{
              fontSize: "var(--text-lg)",
              fontWeight: 500,
              color: "var(--neutral-800)",
              marginBottom: "var(--spacing-xl)",
            }}
          >
            アカウント情報の登録
          </h1>
          <p style={{ color: "var(--neutral-600)", marginBottom: "12px" }}>
            {sns ? `${sns}で認証されました。` : "SNS認証済み"}
            {" "}次にアイコンとニックネーム、生年月日を設定してください。
          </p>
        </>
      }
      submitLabel="登録して進む"
      showBack
      onBack={() => navigate(-1)}
      onSubmit={handleSubmit}
    />
  );
}

export default ProfileSetup;
