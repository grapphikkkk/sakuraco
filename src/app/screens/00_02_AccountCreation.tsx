import { useNavigate } from "react-router";
import { ProfileFormCard } from "../components/ProfileFormCard";

export function AccountCreation() {
  const navigate = useNavigate();

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
      }
      submitLabel="次へ"
      onSubmit={handleSubmit}
    />
  );
}
