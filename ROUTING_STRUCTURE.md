# SakuraCo Routing Structure

## Auth Flow

### Not Logged In
- User lands on: `/` (00_01_HomeBeforeLogin)
- Shows brand intro and "はじめる" button
- Click "はじめる" → `/account-creation`

### Account Creation
- Path: `/account-creation` (00_02_AccountCreation)
- User selects SNS provider, enters nickname, birthdate, agrees to terms
- On completion:
  - Sets `localStorage: sakuraco_registered = true`
  - Checks if `sakuraco_onboarding_complete` exists
  - If NO → Navigate to `/onboarding`
  - If YES → Navigate to `/home`

### First-Time Onboarding (Once per user)
- Path: `/onboarding` (01_02_Onboarding)
- Shows 4-screen swipeable tutorial
- User can swipe through or skip
- On completion:
  - Sets `localStorage: sakuraco_onboarding_complete = true`
  - Navigate to `/personality-question`

### Personality Questions
- Path: `/personality-question` (01_03_PersonalityQuestion0)
- Placeholder screen for now
- On completion → Navigate to `/home`

### After Login
- Path: `/home` (HomeAfterLogin)
- Main home screen after authentication
- Bottom navigation appears

## Bottom Navigation (Fixed)

Visible on these routes only:
- `/home` - ホーム
- `/reservations` - 予約
- `/mypage` - マイページ

## Screen Priority (Phase 1 Scope)

### Must/Should Screens Included:
- 00_01_Home_beforelogin ✓
- 00_02_Account_creation ✓
- 01_02_Onbording ✓
- 01_03_Personality_Question_0 ✓ (placeholder)
- Home_afterlogin ✓ (placeholder)
- Reservations ✓ (placeholder)
- MyPage ✓ (placeholder)

### Excluded:
- 管理画面 screens (admin screens)
- Lower priority screens (Nice to have)

## Design System Compliance

All screens follow:
- Primary button: `bg-primary` (neutral dark #2D2D2D, NOT pink)
- Pink (`accent-pink`) used ONLY for special moment indicators
- Input height: 48px (min-h-[48px])
- Touch targets: minimum 44px
- Border radius: 8px default
- Mobile-first responsive layout
- Bottom navigation safe area inset
