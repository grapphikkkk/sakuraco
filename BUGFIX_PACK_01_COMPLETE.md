# SakuraCo Prototype - Bugfix Pack 01 ✅ COMPLETE

All 7 bugfixes have been successfully implemented following Design System guidelines.

---

## ✅ Fix ① - Onboarding CTA Always Visible

**Target**: `01_02_Onboarding.tsx`

**Problem**: CTA button hidden below fold on mobile screens

**Solution**:
- Fixed bottom CTA container with `position: fixed`
- Added safe-area padding: `calc(var(--spacing-md) + env(safe-area-inset-bottom))`
- Main content has bottom padding to prevent overlap: `calc(88px + env(--safe-area-inset-bottom))`
- CTA shows "質問に答えて始める" on final screen, "スキップ" on other screens

**Files Modified**:
- `/src/app/screens/01_02_Onboarding.tsx`

---

## ✅ Fix ② - Home Card Compact Layout

**Target**: `01_01_Home_afterlogin_01.tsx`, `01_01_Home_afterlogin_02.tsx`

**Problem**: Event cards too verbose with price/description

**Solution**:
- **Removed**: `event.concept` (description text)
- **Removed**: Price display row
- **Always show**: Fixed "5人" participant count
- **Keep**: Date/time, Theme tags, "初めての方歓迎" badge

**Files Modified**:
- `/src/app/screens/01_01_Home_afterlogin_01.tsx`
- `/src/app/screens/01_01_Home_afterlogin_02.tsx`

---

## ✅ Fix ③ - Scroll Reset on Navigation

**Target**: All Phase 4 screens

**Problem**: Pages don't scroll to top when navigating

**Solution**:
Added `useEffect` hook to reset scroll position:
```typescript
useEffect(() => {
  window.scrollTo(0, 0);
}, []);
```

**Files Modified**:
- `/src/app/screens/01_04_Event_detail_01.tsx`
- `/src/app/screens/01_05_Payment.tsx`
- `/src/app/screens/02_04_Event_detail_03.tsx`
- `/src/app/screens/03_01_Feedback.tsx`
- `/src/app/screens/03_02_Connection_Result.tsx`

---

## ✅ Fix ④ - Special Slot Routing After Connection

**Target**: `03_02_Connection_Result.tsx`, `01_01_Home_afterlogin_01.tsx`

**Problem**: Cannot reach special slot detail after mutual connection

**Solution**:

### Connection Result Screen:
- `handleViewSpecialSlot()` sets localStorage flag: `sakuraco_show_special_slot = "1"`
- Navigates to: `/home?special=1`

### Home Screen (01_01_Home_afterlogin_01.tsx):
- Checks localStorage flag on mount
- If flag exists OR connections exist:
  - Loads connections via `getConnections()`
  - Displays "特別枠" section at top
  - Shows card per connection with:
    - Badge: "特別枠"
    - Title: "{ニックネーム}さんとのお食事"
    - Participants: "2人" (fixed)
    - Expiry: "あと{X}日"
  - Click navigates to: `/event/special-${participantId}`

### Event Detail Screen (01_04_Event_detail_01.tsx):
- Already supports special slot when `eventId.startsWith("special-")`
- Reuses existing logic (no duplication)

**Files Modified**:
- `/src/app/screens/03_02_Connection_Result.tsx` (recreated with proper implementation)
- `/src/app/screens/01_01_Home_afterlogin_01.tsx`

---

## ✅ Fix ⑤ - Event Day Participant Icons Only

**Target**: `02_04_Event_detail_03.tsx`

**Problem**: Need simple participant display without modal/zoom

**Solution**:
- Added "参加者" label below hints
- Display circular icons in a row:
  - Size: 40px diameter
  - Background: `var(--green-50)`
  - Border: `1px solid var(--green-100)`
  - Icon: Generic `<User>` from lucide-react in `var(--green-600)`
  - Not tappable: `cursor: default`
- Kept participant hints text as-is

**Files Modified**:
- `/src/app/screens/02_04_Event_detail_03.tsx`

---

## ✅ Fix ⑥ - Reservations Screen Actions

**Target**: `Reservations.tsx`

**Problem**: Need "詳細を見る" and "カレンダーに追加" actions

**Solution**:

### Removed:
- Price display section

### Updated:
- Participants show fixed "5人" instead of `event.participantCount`

### Added:
Two action buttons in a flex row with design tokens:

**A) 詳細を見る**:
- Navigates to: `/event-day/${eventId}`
- Style: Primary outline button (`border: 1.5px solid var(--green-600)`)
- Reuses existing event day detail route

**B) カレンダーに追加**:
- Generates `.ics` file with:
  - `DTSTART` / `DTEND` (2 hours duration)
  - `SUMMARY`: Event theme
  - `LOCATION`: Event area
  - `DESCRIPTION`: "SakuraCoのお食事会"
- Uses `Blob` + `URL.createObjectURL` + download link
- Style: Secondary outline button (`border: 1.5px solid var(--neutral-300)`)
- Icon: `<Download>` from lucide-react

**Files Modified**:
- `/src/app/screens/Reservations.tsx`

---

## ✅ Fix ⑦ - Account Creation DOB Dropdowns

**Target**: `00_02_AccountCreation.tsx`

**Problem**: Manual date input on mobile is error-prone

**Solution**:

### Replaced number inputs with 3 `<select>` dropdowns:

**Year (年)**:
- Options: Current year - 18 → Current year - 118 (100 years)
- Initial: Placeholder "年"
- Height: 48px

**Month (月)**:
- Options: 01-12 (zero-padded)
- Initial: Placeholder "月"

**Day (日)**:
- Options: Dynamic based on selected month + leap year
- Calculation: `new Date(year, month, 0).getDate()`
- Initial: Placeholder "日"

### Age Validation:
- 20歳未満の場合:
  - Display error: "20歳以上である必要があります"
  - Color: `var(--red-500)`
  - Disable "次へ" button
- 20歳以上:
  - No error
  - Enable proceed if all fields filled + agreement checked

### Design System:
- `selectStyle` inherits from `inputStyle`
- Focus states with `var(--green-400)` border + box-shadow
- Cursor: pointer
- All spacing/colors via design tokens

**Files Modified**:
- `/src/app/screens/00_02_AccountCreation.tsx`

---

## Design System Compliance ✅

All fixes strictly use:
- CSS Variables: `var(--green-600)`, `var(--neutral-800)`, `var(--radius-full)`, `var(--touch-min)`, etc.
- No arbitrary colors, fonts, or spacing
- Mobile-first responsive design
- Touch targets >= 44px (using `var(--touch-min)` and `var(--touch-comfortable)`)
- Safe area insets: `env(safe-area-inset-bottom)`

---

## Testing Checklist

### ① Onboarding
- [ ] CTA visible on all screens without scrolling
- [ ] "質問に答えて始める" appears on final screen
- [ ] "スキップ" appears on earlier screens
- [ ] Safe area padding works on iPhone notch

### ② Home Cards
- [ ] No price display
- [ ] No description/concept text
- [ ] "5人" shown for all events
- [ ] Date/time and theme visible
- [ ] "初めての方歓迎" badge when applicable

### ③ Scroll Reset
- [ ] Event detail scrolls to top
- [ ] Payment scrolls to top
- [ ] Event day scrolls to top
- [ ] Feedback scrolls to top
- [ ] Connection result scrolls to top

### ④ Special Slot Routing
- [ ] After mutual connection → navigate to home
- [ ] Home shows "特別枠" section at top
- [ ] Card shows partner nickname, "2人", expiry countdown
- [ ] Click card → navigate to `/event/special-{id}`
- [ ] Special event detail screen displays correctly
- [ ] Date/area multi-select works
- [ ] "申し込む" navigates to payment

### ⑤ Event Day Icons
- [ ] "参加者" label visible
- [ ] 4 circular icons displayed
- [ ] Icons not clickable (cursor: default)
- [ ] Icons are 40px diameter
- [ ] Green styling matches design system

### ⑥ Reservations Actions
- [ ] No price display
- [ ] "5人" shown for participants
- [ ] "詳細を見る" navigates to event day detail
- [ ] "カレンダーに追加" downloads .ics file
- [ ] .ics file opens in calendar app
- [ ] Both buttons >= 44px touch target

### ⑦ Account Creation DOB
- [ ] 3 dropdowns (year/month/day) displayed
- [ ] Year dropdown shows ~100 years
- [ ] Month dropdown shows 01-12
- [ ] Day dropdown adjusts for month/leap year
- [ ] Under 20 shows error message
- [ ] Under 20 cannot proceed (button disabled)
- [ ] 20+ can proceed if all fields filled
- [ ] All dropdowns 48px height
- [ ] Focus states work correctly

---

## File Summary

### Files Created:
- `/BUGFIX_PACK_01_COMPLETE.md` (this file)

### Files Modified:
1. `/src/app/screens/01_02_Onboarding.tsx` (Fix ①)
2. `/src/app/screens/01_01_Home_afterlogin_01.tsx` (Fix ② & ④)
3. `/src/app/screens/01_01_Home_afterlogin_02.tsx` (Fix ②)
4. `/src/app/screens/01_04_Event_detail_01.tsx` (Fix ③)
5. `/src/app/screens/01_05_Payment.tsx` (Fix ③)
6. `/src/app/screens/02_04_Event_detail_03.tsx` (Fix ③ & ⑤)
7. `/src/app/screens/03_01_Feedback.tsx` (Fix ③)
8. `/src/app/screens/03_02_Connection_Result.tsx` (Fix ③ & ④ - recreated)
9. `/src/app/screens/Reservations.tsx` (Fix ⑥)
10. `/src/app/screens/00_02_AccountCreation.tsx` (Fix ⑦)

### Routes Used:
- `/home` - HomeAfterLogin (shows special slots when flag set)
- `/event/:eventId` - EventDetail01 (handles both regular & special slots)
- `/event-day/:eventId` - EventDetailDay (post-booking detail)
- `/feedback/:eventId` - FeedbackScreen
- `/connection-result/:eventId` - ConnectionResult
- `/payment` - Payment

---

## localStorage Keys

```javascript
// Special slot flag (set after connection)
sakuraco_show_special_slot: "1"

// Existing keys (unchanged)
sakuraco_current_booking: JSON
sakuraco_connections: JSON array
sakuraco_feedback_{eventId}: JSON
sakuraco_registered: "true"
sakuraco_onboarding_complete: "true"
```

---

## Implementation Notes

### No Screen Duplication
- Special slot detail reuses `01_04_Event_detail_01.tsx`
- Checks `eventId.startsWith("special-")` for special slot variant
- No need for separate screen file

### Privacy Protection Maintained
- "マッチ" word never used
-片思い never revealed
- Only mutual connections shown in special slots
- Neutral messaging for non-connections

### Mobile-First Touch Targets
- All buttons: `minHeight: var(--touch-min)` (44px) or `var(--touch-comfortable)` (48px)
- Dropdowns: 48px height
- Checkbox: 20x20px with adequate tap area
- Safe area insets respected

### Performance
- No heavy dependencies added
- ICS generation client-side only
- Scroll reset immediate (no animation needed)
- LocalStorage for state persistence

---

## Completion Status

🎯 **All 7 Fixes Implemented Successfully**

✅ Fix ① - Onboarding CTA Always Visible  
✅ Fix ② - Home Card Compact Layout  
✅ Fix ③ - Scroll Reset on Navigation  
✅ Fix ④ - Special Slot Routing  
✅ Fix ⑤ - Event Day Participant Icons Only  
✅ Fix ⑥ - Reservations Actions  
✅ Fix ⑦ - Account Creation DOB Dropdowns  

**Ready for testing and deployment.**
