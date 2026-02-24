import { useNavigate } from "react-router";
import { ArrowLeft, Flag, Bell, Users } from "lucide-react";
import { TOPICK_THEME_INFO } from "../constants/topickThemes";
import "../../styles/screens/topick.css";

// Helper function to get icon and background color based on theme
function getThemeIconStyle(themeId: string) {
  let icon: React.ReactNode;
  let iconClass: string;
  
  switch (themeId) {
    case "start":
      icon = <Flag className="w-6 h-6" />;
      iconClass = "topick-icon-start";
      break;
    case "close":
      icon = <Bell className="w-6 h-6" />;
      iconClass = "topick-icon-close";
      break;
    default: // warm, romance, wild, secret
      icon = <Users className="w-6 h-6" />;
      iconClass = "topick-icon-default";
  }
  
  return { icon, iconClass };
}

export function Topick() {
  const navigate = useNavigate();
  const handleClose = () => {
    const returnPath = sessionStorage.getItem("topick-return");
    if (returnPath) {
      navigate(returnPath);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="topick-container">
      {/* Header */}
      <div className="topick-header">
        <button
          onClick={() => navigate(-1)}
          className="topick-back-button"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>戻る</span>
        </button>
      </div>

      <div className="topick-content">
        <div className="topick-max-width">
          <h1 className="topick-title">今日の会話のお題</h1>
          <div className="topick-description">
            <p>困ったら、ここからひとつ選んでみてください。</p>
            <p>1つのお題の目安：5〜10分（途中で変えてOK）</p>
          </div>

          <div className="topick-cards">
            {TOPICK_THEME_INFO.map((theme) => {
              const { icon, iconClass } = getThemeIconStyle(theme.id);
              return (
                <button
                  key={theme.id}
                  onClick={() => navigate(`/topick/${theme.id}`)}
                  className="topick-card-button"
                >
                  <div className="topick-card">
                    {/* Icon with background */}
                    <div className={`topick-icon-container ${iconClass}`}>
                      {icon}
                    </div>

                    {/* Title and Description */}
                    <div className="topick-card-content">
                      <h2 className="topick-card-title">{theme.title}</h2>
                      <p className="topick-card-description">{theme.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleClose}
            className="topick-close-button"
          >
            お題を閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
