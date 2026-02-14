import { useState } from "react";
import { useNavigate } from "react-router";
import { QuestionLayout } from "../components/QuestionLayout";

/* ================================================
   DATA
   ================================================ */

const INTEREST_OPTIONS = [
  "映画", "音楽", "旅行", "お酒", "筋トレ",
  "サウナ", "スポーツ", "アート・展示", "K-POP", "ハロプロ",
  "アイドル", "マダミス", "ファッション", "ゲーム", "マンガ",
  "アウトドア", "カフェ巡り", "食べ歩き", "読書", "料理",
];

const Q2_OPTIONS = [
  "好きなので、自分から企画・主催することがある",
  "主催はしないが、好きなので前向きに参加する",
  "あまり好きではないが、誘われれば参加する",
  "好きではないので、ほとんど参加しない",
];

const Q3_OPTIONS = [
  "盛り上がって飲みゲーなどもする会",
  "ほどよく盛り上がる会",
  "落ち着いてゆっくり話せる会",
  "静かで雰囲気や場を優先する会",
];

const Q4_TOPICS = [
  "趣味・好きなこと",
  "生き方・人生観",
  "仕事やキャリア",
  "好きなタイプ・恋バナ",
  "カミングアウト",
];

const Q4_LEVELS = ["話したくない", "話してもよい", "超話したい"];

const Q5_OPTIONS = [
  "ほとんど飲まない",
  "1〜2杯くらい",
  "その日の流れで変わる",
  "しっかり飲むことが多い",
];

const Q6_OPTIONS = [
  "まずは場を楽しみたい",
  "友達ができたら嬉しい",
  "ときめきも期待したい",
  "どちらも自然に",
];

const Q7_OPTIONS = [
  "自分と似たタイプの人が集まっている方が安心する",
  "少し違うタイプが混ざっている方が楽しい",
  "バラバラな方がおもしろい",
];

const Q8_OPTIONS = [
  "話題を出すことが多い",
  "誰かの話を広げることが多い",
  "聞くことが多い",
  "特に意識せず流れに乗ることが多い",
];

const Q9_OPTIONS = [
  "5000円以下",
  "5000円-10000円",
  "10000円以上",
];

const Q10_OPTIONS = ["なし", "ある"];

/* ================================================
   COMPONENT
   ================================================ */

export function PersonalityQuestions() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Answer state
  const [interests, setInterests] = useState<string[]>([]);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState<string | null>(null);
  const [topicLevels, setTopicLevels] = useState<Record<string, number>>(
    () => {
      const init: Record<string, number> = {};
      Q4_TOPICS.forEach((t) => (init[t] = 1));
      return init;
    }
  );
  const [q5Answer, setQ5Answer] = useState<string | null>(null);
  const [q6Answer, setQ6Answer] = useState<string | null>(null);
  const [q7Answer, setQ7Answer] = useState<string | null>(null);
  const [q8Answer, setQ8Answer] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [allergyAnswer, setAllergyAnswer] = useState<string | null>(null);
  const [allergyDetail, setAllergyDetail] = useState("");

  /* ---------- helpers ---------- */

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return true;
      case 1: return interests.length === 3;
      case 2: return q2Answer !== null;
      case 3: return q3Answer !== null;
      case 4: return true;
      case 5: return q5Answer !== null;
      case 6: return q6Answer !== null;
      case 7: return q7Answer !== null;
      case 8: return q8Answer !== null;
      case 9: return priceRange.length > 0;
      case 10:
        if (allergyAnswer === "なし") return true;
        if (allergyAnswer === "ある" && allergyDetail.trim()) return true;
        return false;
      case 11: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step === 11) {
      localStorage.setItem("sakuraco_personality_complete", "true");
      navigate("/home");
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const toggleInterest = (item: string) => {
    setInterests((prev) => {
      if (prev.includes(item)) return prev.filter((i) => i !== item);
      if (prev.length >= 3) return prev;
      return [...prev, item];
    });
  };

  const togglePriceRange = (item: string) => {
    setPriceRange((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const setTopicLevel = (topic: string, level: number) => {
    setTopicLevels((prev) => ({ ...prev, [topic]: level }));
  };

  /* ---------- CTA label ---------- */

  const ctaLabel = step === 11 ? "ホームへ進む" : "次へ";

  /* ---------- progress ---------- */

  const showProgress = step >= 1 && step <= 10;
  const progressStep = step;
  const totalQuestions = 10;

  /* ---------- render question content ---------- */

  const renderContent = () => {
    switch (step) {
      case 0:
        return <IntroScreen />;
      case 1:
        return (
          <InterestsQuestion
            selected={interests}
            onToggle={toggleInterest}
          />
        );
      case 2:
        return (
          <SingleSelectCards
            question="大人数（目安：7人以上）の飲み会やお食事会について近いのはどれですか？"
            options={Q2_OPTIONS}
            selected={q2Answer}
            onSelect={setQ2Answer}
          />
        );
      case 3:
        return (
          <SingleSelectCards
            question="飲み会ではどんな雰囲気の会に参加することが多いですか？"
            options={Q3_OPTIONS}
            selected={q3Answer}
            onSelect={setQ3Answer}
          />
        );
      case 4:
        return (
          <ConversationTopicsQuestion
            levels={topicLevels}
            onSetLevel={setTopicLevel}
          />
        );
      case 5:
        return (
          <SingleSelectCards
            question="飲み会ではどのくらい飲むことが多いですか？"
            options={Q5_OPTIONS}
            selected={q5Answer}
            onSelect={setQ5Answer}
          />
        );
      case 6:
        return (
          <SingleSelectCards
            question="お食事会に期待することは？"
            options={Q6_OPTIONS}
            selected={q6Answer}
            onSelect={setQ6Answer}
          />
        );
      case 7:
        return (
          <SingleSelectCards
            question="参加者について、あてはまるものを教えてください"
            options={Q7_OPTIONS}
            selected={q7Answer}
            onSelect={setQ7Answer}
          />
        );
      case 8:
        return (
          <SingleSelectCards
            question="初対面同士の集まりではどんな動きをすることが多いですか？"
            options={Q8_OPTIONS}
            selected={q8Answer}
            onSelect={setQ8Answer}
          />
        );
      case 9:
        return (
          <PriceRangeQuestion
            selected={priceRange}
            onToggle={togglePriceRange}
          />
        );
      case 10:
        return (
          <AllergyQuestion
            selected={allergyAnswer}
            onSelect={setAllergyAnswer}
            detail={allergyDetail}
            onDetailChange={setAllergyDetail}
          />
        );
      case 11:
        return <CompletionScreen />;
      default:
        return null;
    }
  };

  return (
    <QuestionLayout
      currentStep={progressStep}
      totalSteps={totalQuestions}
      showProgress={showProgress}
      showBack={step > 0}
      onBack={handleBack}
      ctaLabel={ctaLabel}
      ctaDisabled={!canProceed()}
      onCta={handleNext}
    >
      {renderContent()}
    </QuestionLayout>
  );
}

/* ================================================
   SUB-COMPONENTS
   ================================================ */

/* ---------- Step 0: Intro ---------- */

function IntroScreen() {
  return (
    <div className="flex flex-col items-center justify-center px-2" style={{ minHeight: "60vh" }}>
      <p
        className="text-center"
        style={{
          color: "var(--neutral-700)",
          fontSize: "var(--text-base)",
          lineHeight: 1.9,
        }}
      >
        最初にいくつか質問をします。
        <br />
        お食事会の参加者を決めるうえでの参考になります。
        <br />
        質問の回答は他のユーザーに公開されません。
      </p>
    </div>
  );
}

/* ---------- Step 1: Interests (multi-select chips) ---------- */

function InterestsQuestion({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (item: string) => void;
}) {
  const maxReached = selected.length >= 3;

  return (
    <div>
      <h2
        style={{
          fontSize: "var(--text-md)",
          fontWeight: 500,
          color: "var(--neutral-800)",
          marginBottom: "var(--spacing-sm)",
        }}
      >
        あなたを特に構成するものを3つ選んでください
      </h2>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--neutral-500)",
          fontWeight: 500,
          marginBottom: "var(--spacing-lg)",
        }}
      >
        3つ選択してください
      </p>

      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((item) => {
          const isSelected = selected.includes(item);
          const isDisabled = maxReached && !isSelected;

          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              disabled={isDisabled}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: "36px",
                padding: "0 14px",
                borderRadius: "var(--radius-full)",
                fontSize: "var(--text-sm)",
                fontWeight: isSelected ? 500 : 400,
                cursor: isDisabled ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                border: isSelected
                  ? "1.5px solid var(--green-600)"
                  : "1.5px solid var(--neutral-300)",
                background: isSelected ? "var(--green-600)" : "transparent",
                color: isSelected ? "#fff" : isDisabled ? "var(--neutral-400)" : "var(--neutral-700)",
                opacity: isDisabled ? 0.5 : 1,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {item}
            </button>
          );
        })}
      </div>

      {selected.length > 0 && selected.length < 3 && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--neutral-500)",
            fontWeight: 500,
            marginTop: "var(--spacing-md)",
          }}
        >
          あと{3 - selected.length}つ選んでください
        </p>
      )}
      {selected.length === 3 && (
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--green-600)",
            fontWeight: 500,
            marginTop: "var(--spacing-md)",
          }}
        >
          3つ選択しました
        </p>
      )}
    </div>
  );
}

/* ---------- Single Select Cards (Q2, Q3, Q5, Q6, Q7, Q8) ---------- */

function SingleSelectCards({
  question,
  options,
  selected,
  onSelect,
}: {
  question: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: "var(--text-md)",
          fontWeight: 500,
          color: "var(--neutral-800)",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        {question}
      </h2>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isSelected = selected === option;

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className="w-full text-left transition-all"
              style={{
                padding: "16px",
                borderRadius: "var(--radius-md)",
                border: isSelected
                  ? "1.5px solid var(--green-600)"
                  : "1.5px solid var(--neutral-300)",
                minHeight: "var(--touch-comfortable)",
                background: isSelected
                  ? "var(--green-600)"
                  : "rgba(255,255,255,0.78)",
                color: isSelected ? "#fff" : "var(--neutral-700)",
                fontSize: "var(--text-base)",
                fontWeight: isSelected ? 500 : 400,
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 4: Conversation Topics (segmented controls) ---------- */

function ConversationTopicsQuestion({
  levels,
  onSetLevel,
}: {
  levels: Record<string, number>;
  onSetLevel: (topic: string, level: number) => void;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: "var(--text-md)",
          fontWeight: 500,
          color: "var(--neutral-800)",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        初対面で話したいテーマは？
      </h2>

      <div className="flex flex-col" style={{ gap: "20px" }}>
        {Q4_TOPICS.map((topic) => (
          <div key={topic}>
            <p
              style={{
                color: "var(--neutral-700)",
                fontSize: "var(--text-base)",
                marginBottom: "var(--spacing-sm)",
              }}
            >
              {topic}
            </p>
            <div
              className="flex overflow-hidden"
              style={{
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--neutral-300)",
              }}
            >
              {Q4_LEVELS.map((label, idx) => {
                const isActive = levels[topic] === idx;

                return (
                  <button
                    key={label}
                    onClick={() => onSetLevel(topic, idx)}
                    className="flex-1 text-center transition-all"
                    style={{
                      minHeight: "var(--touch-min)",
                      fontSize: "var(--text-sm)",
                      fontWeight: isActive ? 500 : 400,
                      background: isActive ? "var(--green-600)" : "rgba(255,255,255,0.78)",
                      color: isActive ? "#fff" : "var(--neutral-700)",
                      border: "none",
                      borderRight: idx < Q4_LEVELS.length - 1 ? "1px solid var(--neutral-300)" : "none",
                      cursor: "pointer",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Step 9: Price Range (multi-select) ---------- */

function PriceRangeQuestion({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: "var(--text-md)",
          fontWeight: 500,
          color: "var(--neutral-800)",
          marginBottom: "var(--spacing-sm)",
        }}
      >
        レストランの希望金額目安（1人あたり・複数選択可）
      </h2>
      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--neutral-500)",
          fontWeight: 500,
          marginBottom: "var(--spacing-lg)",
        }}
      >
        複数選択可
      </p>

      <div className="flex flex-col gap-3">
        {Q9_OPTIONS.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className="w-full text-left transition-all"
              style={{
                padding: "16px",
                borderRadius: "var(--radius-md)",
                border: isSelected
                  ? "1.5px solid var(--green-600)"
                  : "1.5px solid var(--neutral-300)",
                minHeight: "var(--touch-comfortable)",
                background: isSelected
                  ? "var(--green-600)"
                  : "rgba(255,255,255,0.78)",
                color: isSelected ? "#fff" : "var(--neutral-700)",
                fontSize: "var(--text-base)",
                fontWeight: isSelected ? 500 : 400,
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step 10: Allergy ---------- */

function AllergyQuestion({
  selected,
  onSelect,
  detail,
  onDetailChange,
}: {
  selected: string | null;
  onSelect: (value: string) => void;
  detail: string;
  onDetailChange: (value: string) => void;
}) {
  return (
    <div>
      <h2
        style={{
          fontSize: "var(--text-md)",
          fontWeight: 500,
          color: "var(--neutral-800)",
          marginBottom: "var(--spacing-lg)",
        }}
      >
        食事のアレルギーはありますか
      </h2>

      <div className="flex flex-col gap-3">
        {Q10_OPTIONS.map((option) => {
          const isSelected = selected === option;

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className="w-full text-left transition-all"
              style={{
                padding: "16px",
                borderRadius: "var(--radius-md)",
                border: isSelected
                  ? "1.5px solid var(--green-600)"
                  : "1.5px solid var(--neutral-300)",
                minHeight: "var(--touch-comfortable)",
                background: isSelected
                  ? "var(--green-600)"
                  : "rgba(255,255,255,0.78)",
                color: isSelected ? "#fff" : "var(--neutral-700)",
                fontSize: "var(--text-base)",
                fontWeight: isSelected ? 500 : 400,
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Conditional input for allergy detail */}
      {selected === "ある" && (
        <div style={{ marginTop: "var(--spacing-md)" }}>
          <input
            type="text"
            value={detail}
            onChange={(e) => onDetailChange(e.target.value)}
            placeholder="アレルギーの内容を入力してください"
            style={{
              width: "100%",
              minHeight: "var(--touch-comfortable)",
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
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--green-400)";
              e.target.style.boxShadow = "0 0 0 3px rgba(29,140,126,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--neutral-300)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      )}

      <p
        style={{
          fontSize: "var(--text-sm)",
          color: "var(--neutral-500)",
          fontWeight: 500,
          marginTop: "var(--spacing-md)",
          lineHeight: 1.9,
        }}
      >
        念のため、当日お店でアレルギーに該当するものがないか確認をしてください
      </p>
    </div>
  );
}

/* ---------- Step 11: Completion ---------- */

function CompletionScreen() {
  return (
    <div className="flex flex-col items-center justify-center px-2" style={{ minHeight: "60vh" }}>
      <p
        className="text-center"
        style={{
          color: "var(--neutral-700)",
          fontSize: "var(--text-base)",
          lineHeight: 1.9,
        }}
      >
        質問に答えてくれてありがとうございます！
        <br />
        さっそく、お食事会に参加しましょう。
      </p>
    </div>
  );
}
