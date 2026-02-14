# Phase 4 Implementation Summary
## Post-Event Reflection Flow + Mutual "Next Step" Experience

## Implemented Screens

### 1. 02_04_Event_detail_03 - Event Day View
**File**: `/src/app/screens/02_04_Event_detail_03.tsx`

**Purpose**: 当日参加中の詳細確認＋会話導線

**Features**:
- Event theme and details display
- Participant count (5人)
- **Participant hints**: "あなたと同じ趣味のアイドル好きが2人います"
- Restaurant information with map link
- "当日遅れます" button for running late notifications
- Cancel button with confirmation modal (shows 100% cancellation fee warning)
- **Conversation topics** accordion:
  - "最近ハマっていることは？"
  - "休日の過ごし方は？"
  - "好きな食べ物は？"
  - "最近観た映画やドラマは？"
  - "行ってみたい場所は？"
- **Feedback CTA**: "お食事会終了後のきもち" section with button to record feelings

**Route**: `/event-day/:eventId`

---

### 2. 03_01_Feedback - Post-Event Feedback
**File**: `/src/app/screens/03_01_Feedback.tsx`

**Purpose**: 体験を内側で消化し、「また会いたい」を自然に表現できる

**Features**:

**Section 1: Overall Event Rating**
- 5-level rating system (1-5):
  - 1: とても悪かった
  - 2: 悪かった
  - 3: 普通
  - 4: 良かった
  - 5: とても良かった
- Free-form comment field (optional)

**Section 2: Experience Reflection**
- Question: "今日の時間はどうでしたか？"
- Large textarea for free-form reflection

**Section 3: Individual Participant Ratings**
- Card-based layout for each participant
- Shows:
  - Anonymous colored icon (green/blue/purple/orange)
  - Nickname
  - Single hobby
- **5 rating options** (mutually exclusive):
  1. **会を乱す行動あり** (disruptive behavior - exception)
  2. **欠席した** (was absent)
  3. **会いたくない** (don't want to meet again)
  4. **同席してもよい** (neutral - okay to be at same event)
  5. **次回は２人で会いたい** (want to meet 1-on-1)

**Important Privacy Features**:
- "評価は相手に直接通知されません" notice
- No visibility into who rated whom
- Only mutual "次回は２人で会いたい" creates a connection
- One-sided interest is NEVER revealed

**Validation**:
- Requires overall rating selection
- Requires rating for ALL participants before submission
- "次へ" button disabled until complete

**Route**: `/feedback/:eventId`

---

### 3. 03_02_Connection_Result - Mutual Interest Result
**File**: `/src/app/screens/03_02_Connection_Result.tsx`

**Purpose**: Show mutual interest results with calm, understated design

**Two States**:

#### SUCCESS STATE (Mutual Interest Exists)
**Triggered when**: Both users selected "次回は２人で会いたい"

**UI Elements**:
- Participant's colored icon (large, 80px)
- Headline: "{ニックネーム}さんもあなたと次回２人で会いたいと思っています"
- Subtext: "次のお食事会を予約できます"
- Info card showing:
  - Partner's nickname
  - Partner's hobby
  - Expiry notice: "特別枠のお食事会は{X月X日}まで予約できます"
- CTA: "２人でのお食事会を見る" → navigates to /home (shows special slot)

**Design Notes**:
- Calm and warm, NOT celebratory
- No confetti, no excessive animation
- Understated success indication
- Gentle gradient background (green-50)

#### NEUTRAL STATE (No Mutual Interest)
**Triggered when**: No mutual "次回は２人で会いたい" selections

**UI Elements**:
- Heart icon in green circle (80px)
- Headline: "ご参加ありがとうございました"
- Subtext: "また次のお食事会でお会いしましょう"
- CTA: "ホームへ戻る" → navigates to /home

**Important Constraints**:
- ❌ NEVER show one-sided interest
- ❌ NEVER use words like "成立" or "非成立"
- ❌ NEVER make users feel "rejected"
- ✅ Keep tone positive and encouraging
- ✅ Maintain privacy completely

**Route**: `/connection-result/:eventId`

---

### 4. Special Slot Integration in Home Screen
**File**: `/src/app/screens/01_01_Home_afterlogin_01.tsx` (updated)

**Conditional Top Section**:
Only appears when mutual "次回は２人で会いたい" exists.

**Section Header**:
"特別枠（{X月X日}まで参加表明ができます）"

**Special Slot Card**:
- Gradient background (green-50 to bg-card)
- 2px green-300 border
- Badge: "特別枠" (green-600)
- Title: "{ニックネーム}さんとのお食事"
- Participant count: 2人
- Expiry countdown: "あと{X}日"
- Click → navigates to special slot event detail

**Behavior**:
- Only visible to the two users involved
- Automatically expires after 3 days
- Removed from display after expiry
- Below this section, normal event categories appear unchanged

---

### 5. Special Slot Event Detail
**File**: `/src/app/screens/01_04_Event_detail_01.tsx` (updated with conditional variant)

**Detection**: Event ID starts with "special-"

**Header**:
- Badge: "特別枠"
- Title: "特別枠（{X月X日}まで参加表明ができます）"
- Subtext: "先日同席した{ニックネーム}さんもあなたと次回２人で会いたいと思っています。{ニックネーム}さんとのお食事です。"

**Details**:
- **Participants**: 2人 (fixed)
- **Price**: ¥1,000 (fixed)
- Includes: 参加費のみ。現地の飲食代は別途かかります。

**Date Selection** (multi-select):
- Shows 6 date options (Wed/Fri only, 4+ days from now)
- Grid layout (2 columns)
- Instruction: "お相手の希望を鑑みて決定されます。できるだけ多く選択してください。"
- Feedback: "{X}日を選択しました"

**Area Selection** (multi-select):
- All 6 areas available: 池袋/新宿/中野/高円寺/上野/新橋
- Grid layout (3 columns)
- Instruction: "お相手の希望を鑑みて決定されます。できるだけ多く選択してください。"
- Feedback: "{X}エリアを選択しました"

**Expiry Notice**:
"この枠は{X月X日}まで参加表明ができます。"

**Cancel Policy**: Same as regular events

**Validation**:
- "申し込む" enabled only when:
  - At least 1 date selected AND
  - At least 1 area selected

**Navigation**:
Apply → Payment screen (with special slot data)

---

## Data Structures

### Participant
```typescript
{
  id: string;
  nickname: string;
  hobby: string;
  icon: string; // "green", "blue", "purple", "orange"
}
```

### Feedback
```typescript
{
  participantId: string;
  rating: "disruptive" | "absent" | "no" | "neutral" | "yes";
}
```

### EventFeedback
```typescript
{
  eventId: string;
  overallRating: 1 | 2 | 3 | 4 | 5;
  overallComment: string;
  experienceComment: string;
  participantFeedbacks: Feedback[];
  submittedAt: string;
}
```

### Connection
```typescript
{
  participantId: string;
  participantNickname: string;
  participantHobby: string;
  mutualInterest: boolean;
  expiresAt: string; // 3 days from event
}
```

### SpecialSlotEvent
```typescript
{
  id: string; // "special-{participantId}"
  type: "special-slot";
  partnerId: string;
  partnerNickname: string;
  partnerHobby: string;
  expiresAt: string;
  selectedDates: string[];
  selectedAreas: string[];
  price: 1000;
}
```

---

## Flow Diagram

```
Event Day (02_04_Event_detail_03)
  ↓
User attends event
  ↓
Event ends → Click "きもちを記録する"
  ↓
Feedback Screen (03_01_Feedback)
  - Overall rating
  - Experience comment
  - Rate each participant
  ↓
Submit → Process feedback
  ↓
Connection Result (03_02_Connection_Result)
  ├─ Mutual interest? 
  │  ├─ YES → Success State
  │  │         "○○さんもあなたと..."
  │  │         CTA: "２人でのお食事会を見る"
  │  │         ↓
  │  │       Home (with special slot)
  │  │
  │  └─ NO  → Neutral State
  │            "ご参加ありがとうございました"
  │            CTA: "ホームへ戻る"
  │            ↓
  │          Home (normal)
  └─
Special Slot appears on Home
  ↓
Click special slot card
  ↓
Special Slot Detail (01_04_Event_detail_01 variant)
  - Multi-select dates
  - Multi-select areas
  - "申し込む"
  ↓
Payment (same as regular)
  ↓
Booking confirmed
```

---

## Privacy & Ethics

### What Users See
✅ Mutual interest when BOTH selected "次回は２人で会いたい"  
✅ Partner's nickname, hobby, icon  
✅ 3-day window to book special slot  

### What Users NEVER See
❌ Who gave them what rating  
❌ One-sided interest (if only one person said "yes")  
❌ How many people rated them positively  
❌ Negative ratings from others  
❌ Who selected "会いたくない"  

### Language Constraints
❌ Never use: マッチ, 成立, 非成立, 選ばれた/選ばれなかった  
✅ Use: また会いたい, つながり, 特別枠, ２人でのお食事  

---

## localStorage Keys

```javascript
// Feedback storage
sakuraco_feedback_{eventId}

// Connections (mutual interests)
sakuraco_connections // Array of Connection objects

// Current booking (from Phase 3)
sakuraco_current_booking
```

---

## Mock Data

### Mock Participants (4 people)
1. ヒロキ - アイドル (green icon)
2. ケンタ - 筋トレ (blue icon)
3. ユウタ - アイドル (purple icon)
4. タカシ - サウナ (orange icon)

### Participant Hints
Based on user's personality answers (assumes user likes "アイドル"):
- "あなたと同じ趣味のアイドル好きが2人います"

### Connection Processing (Prototype)
- 50% chance of mutual interest (for demo purposes)
- In production, would be server-side matching
- Creates 3-day window from event date

---

## Design System Compliance

✅ **Colors**:
- Primary: var(--green-600) for selected states
- Neutral grays for UI elements
- Pink ONLY for special moments (not used in Phase 4)
- Success states use green, not pink

✅ **Typography**:
- Design System tokens throughout
- No custom font sizes

✅ **Touch Targets**:
- All buttons ≥ 44px (--touch-min)
- Primary CTAs = 48px (--touch-comfortable)

✅ **Components**:
- Glassmorphism cards (--bg-card)
- Pill-shaped buttons (--radius-full)
- Gradient backgrounds for special slots
- Segmented controls for ratings

✅ **No Complex Animations**:
- Simple state transitions only
- No confetti, no excessive celebration
- Calm and understated design

---

## Key Features

### 1. Thoughtful Feedback Design
- Non-judgmental language
- Privacy-first approach
- Reflection-oriented questions
- Individual participant cards

### 2. Mutual Interest Detection
- Server-side processing (simulated)
- Only reveals mutual "yes" ratings
- Protects privacy completely
- Creates time-limited opportunities

### 3. Special Slot System
- 3-day expiry window
- Flexible date/area selection
- ¥1,000 fixed price
- Automatically appears on home screen

### 4. Conversation Starters
- Event day feature
- Helps break the ice
- Collapsible accordion
- Neutral, friendly topics

### 5. Event Day Management
- Running late notifications
- Cancel with policy warning
- Restaurant information
- Participant hints for connection

---

## Testing Scenarios

### Scenario 1: Mutual Interest
1. Attend event → event-day view
2. Complete feedback
3. Rate participant with "次回は２人で会いたい"
4. See success result (simulated mutual)
5. Special slot appears on home
6. Book special slot with multiple dates/areas

### Scenario 2: No Mutual Interest
1. Attend event → event-day view
2. Complete feedback
3. Rate participants with "同席してもよい"
4. See neutral result
5. Return to normal home screen

### Scenario 3: Mixed Ratings
1. Rate some participants "yes", others "neutral"
2. Only mutual "yes" creates connection
3. Neutral state shown if no mutual match

---

## Future Enhancements (Not in Scope)

- Server-side feedback processing
- Real-time connection notifications
- Special slot confirmation matching
- Participant blocking/reporting
- Feedback analytics dashboard
- Connection history tracking

---

## Notes

This phase implements the complete post-event experience with strict privacy protections and thoughtful UX. The design avoids making users feel judged or rejected while enabling meaningful connections through mutual interest.
