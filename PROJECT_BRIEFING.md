# SakuraCo プロジェクト - 実装ブリーフィング

**プロジェクト名**: Mobile Web Prototype Rebuild (SakuraCo)  
**作成日**: 2026年2月24日  
**フェーズ**: Phase 4 実装完了 + Bugfix Pack 02 適用済み

---

## 📋 プロジェクト概要

**SakuraCo** は、LGBTQコミュニティ向けのソーシャルミーティングプラットフォーム。以下の特徴を持つ：

- **コアコンセプト**: 「趣味や属性で繋がるお食事会」
- **ユーザーフロー**: アカウント作成 → オンボーディング → パーソナリティ質問 → イベント参加予約 → フィードバック → マッチング
- **テイスト**: 静謐・あたたか・信頼感を重視。派手さはなく、自然な繋がりを演出

---

## 🛠 技術スタック

### ビルド環境
- **フレームワーク**: React + TypeScript
- **ビルドツール**: Vite (`npm run dev` / `npm run build`)
- **Base Path**: `/sakuraco/` (Figma コード内の構成)
- **デプロイ**: GitHub Pages イメージ

### 依存パッケージ（主要）
```json
{
  "react": "@latest",
  "typescript": "@latest",
  "@emotion/react": "11.14.0",
  "@emotion/styled": "11.14.1",
  "@mui/material": "7.3.5",
  "@mui/icons-material": "7.3.5",
  "@radix-ui/*": "複数のコンポーネント",
  "motion": "12.23.24",
  "date-fns": "3.6.0",
  "lucide-react": "0.487.0",
  "class-variance-authority": "0.7.1",
  "clsx": "2.1.1",
  "cmdk": "1.1.1"
}
```

### 開発環境
- **ホットモジュール**: `vite`
- **Tailwind**: `tailwindcss` + Vite プラグイン
- **スタイリング**: CSS Variables + Emotion (MUI)
- **パス解決**: `@` → `./src` エイリアス

### Node.js設定
```json
{
  "type": "module",
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  }
}
```

---

## 📁 プロジェクト構造

```
sakuraco/
├── src/
│   ├── app/
│   │   ├── screens/              # 画面コンポーネント（23ファイル）
│   │   ├── components/           # 再利用可能なコンポーネント
│   │   ├── constants/            # 定数（topickThemes.ts）
│   │   ├── data/                 # ダミーデータ
│   │   │   ├── events.ts         # イベント定義
│   │   │   └── participants.ts   # 参加者データ
│   │   ├── routes.ts             # ルーティング定義
│   │   └── App.tsx               # メインアプリコンポーネント
│   ├── styles/                   # グローバルスタイル
│   └── main.tsx                  # エントリーポイント
├── guidelines/                   # デザイン仕様書
├── vite.config.ts               # Vite設定
├── postcss.config.mjs           # PostCSS (Tailwind含む)
├── package.json                 # 依存関係
└── 📄 実装ドキュメント群
    ├── PHASE_3_IMPLEMENTATION.md    # Phase 3（A+E）実装詳細
    ├── PHASE_4_IMPLEMENTATION.md    # Phase 4（F）実装詳細
    ├── BUGFIX_PACK_01_COMPLETE.md   # 7項目のバグ修正
    ├── BUGFIX_PACK_02_COMPLETE.md   # 特別枠フロー修正
    ├── ROUTING_STRUCTURE.md         # ルーティング仕様
    ├── NAVIGATION_FLOW_PHASE4.md    # ナビゲーション動作確認
    └── README.md                    # クイックスタート
```

---

## 🎯 実装済みフェーズ

### Phase 1: 認証・オンボーディング ✅
**実装ファイル**:
- `00_01_HomeBeforeLogin.tsx` - ログイン前ホーム
- `00_02_AccountCreation.tsx` - アカウント作成
- `01_02_Onboarding.tsx` - 4画面スワイプチュートリアル
- `PersonalityQuestions.tsx` - パーソナリティ質問（プレースホルダー）

**フロー**:
```
/ (ホーム前)
  ↓ "はじめる" クリック
/account-creation (アカウント作成)
  ↓ SNS選択 → ニックネーム入力 → 誕生日 → 利用規約同意
/onboarding (チュートリアル)
  ↓ 4画面スワイプ OR "スキップ"
/personality-question (質問)
  ↓ 質問回答
/home (ホーム - 予約前)
```

**LocalStorage**:
- `sakuraco_registered` = `true`
- `sakuraco_onboarding_complete` = `true`

---

### Phase 3 (A + E): イベント参加フロー ✅
**実装ファイル**:
- `01_01_Home_afterlogin_01.tsx` - イベント検索・ブラウジング
- `01_04_Event_detail_01.tsx` - イベント詳細 & エリア選択
- `01_05_Payment.tsx` - 決済フロー
- `01_01_Home_afterlogin_02.tsx` - 予約後ホーム
- `Reservations.tsx` - 予約一覧タブ
- `MyPage.tsx` - マイページタブ

**エクスペリエンス**:
1. イベント一覧表示（カテゴリ別）
   - ベーシック（¥1,000）
   - 属性（¥1,500：タメ会・ワイン会など）
   - ゲイ独自興味（¥3,000：身長-体重・デブ専など）
2. イベント詳細で日時・エリア選択
3. 決済処理（クレジットカード・Apple Pay・Google Pay・PayPay）
4. 予約完了 → 予約後ホーム表示

**LocalStorage**:
- `sakuraco_current_booking` = 予約情報（JSON）

---

### Phase 4 (F): ポスト参加フロー ✅
**実装ファイル**:
- `02_04_Event_detail_03.tsx` - イベント当日ビュー
- `03_01_Feedback.tsx` - フィードバック・評価入力
- `03_02_Connection_Result.tsx` - マッチング結果表示
- `04_01_Home_afterlogin_01.tsx` - 特別枠ホーム（新規）
- `04_02_Event_detail_01.tsx` - 特別枠詳細ラッパー（新規）

**詳細な実装内容**:

#### イベント当日ビュー (`/event-day/:eventId`)
```
テーマ・詳細表示
  ├ 参加人数（5人）
  ├ 参加メンバーヒント（例："あなたと同じ趣味のアイドル好きが2人"）
  ├ レストラン情報（地図リンク付き）
  └ アクション：
      ├ 「当日遅れます」ボタン
      ├ 「キャンセル」ボタン（100%キャンセル料警告）
      └ 「会話のお題」アコーディオン（5テーマ）
  
「お食事会終了後のきもち」ボタン
  → /feedback/:eventId へ遷移
```

#### フィードバック画面 (`/feedback/:eventId`)
**セクション1**: 全体評価（5段階）
- 1: とても悪かった ～ 5: とても良かった
- 自由コメント欄（オプション）

**セクション2**: 体験反省
- 大きなTextarea：「今日の時間はどうでしたか？」

**セクション3**: 参加者ごとの評価（4人分）
各参加者に対して相互排他的に以下から選択：
- **会を乱す行動あり**（例外）
- **欠席した**
- **会いたくない**
- **同席してもよい**（中立）
- **次回は２人で会いたい**（マッチング条件）

**バリデーション**：
- 全体評価 必須
- 全参加者評価 必須
- すべて完了で「次へ」ボタン有効化

**プライバシー**：
- 「評価は相手に直接通知されません」表示
- 一方向の好意は相手に見えない
- 相互「次回は２人で会いたい」のみ接続成立

#### 接続結果 (`/connection-result/:eventId`)

**成功パターン**（相互「次回は２人で会いたい」）:
```
相手アイコン（80px、大きめ）
↓
「{ニックネーム}さんもあなたと次回２人で会いたいと思っています」
↓
「次のお食事会を予約できます」
↓
情報カード：
  ├ 相手アイコン + ニックネーム
  ├ 相手の趣味（1件）
  ├ 期限表示（例："3月7日まで参加表明できます"）
  └ 「２人でのお食事会を見る」ボタン
```

**中立パターン**（双方向「次回は２人で会いたい」なし）:
```
ハート・アイコン（80px、緑色）
↓
「ご参加ありがとうございました」
↓
「また次のお食事会でお会いしましょう」
↓
「ホームへ戻る」ボタン
```

#### 特別枠ホーム (`/home-special` → `/home?special=1`)
**条件**: 接続が成立している場合のみ表示

```
【特別枠】セクション
├ タイトル："特別枠"
├ サブテキスト："期限内に参加表明できる、2人のお食事会です"
│
└ カード（各接続ごと）:
    ├ バッジ:"特別枠（{X月X日}まで参加表明ができます）"
    ├ 説明文:"先日同席した{ニックネーム}さんもあなたと次回２人で会いたいと思っています"
    ├ 参加人数:"2人"（アイコン付き）
    ├ 残り日数:"あと{X}日"（アイコン付き）
    └ 「詳細を見る」ボタン
      → /event/special-${participantId}

【下部】"通常のホームへ戻る" 二次ボタン
```

#### 特別枠イベント詳細 (`/event/special-{participantId}`)
**リユース**: `01_04_Event_detail_01.tsx` + special判定

```
バッジ："特別枠"
タイトル："特別枠（{X月X日}まで参加表明ができます）"
サブテキスト："先日同席した{ニックネーム}さんも..."

固定値：
  ├ 参加人数: 2人
  └ 参加費: ¥1,000

【希望日時】複数選択（グリッド2列）
  ├ 水・金のみ
  ├ 4日後以降
  └ 6オプション

【エリアの希望】複数選択（グリッド3列）
  ├ 池袋・新宿・中野・高円寺・上野・新橋
  └ 6エリア

バリデーション：
  最低1日付 AND 1エリア必須で「申し込む」有効化

「申し込む」ボタン → /payment へ遷移
```

---

## 🔄 ナビゲーション（完全フロー）

```
Phase 3: 予約フロー
/home
  ↓ イベント選択 → 「詳細を見る」
/event/:eventId
  ↓ エリア選択・「申し込む」
/payment
  ↓ 決済確定
/home（予約後ホーム = 01_01_Home_afterlogin_02.tsx）

Phase 4: ポスト参加フロー
/home（予約後）
  ↓ 「詳細を見る」
/event-day/:eventId
  ↓ 「きもちを記録する」
/feedback/:eventId
  ↓ 評価入力 + 「次へ」
/connection-result/:eventId
  ↓ 
  ├ 【成功】「２人でのお食事会を見る」
  │  → localStorage: sakuraco_show_special_slot = "1"
  │  → /home へ遷移（HomeAfterLogin01が特別枠を表示）
  │
  └ 【中立】「ホームへ戻る」
     → /home へ遷移（通常のホーム）

/home（特別枠表示時）
  ↓ 特別枠カード「詳細を見る」
/event/special-{participantId}
  ↓ 日時・エリア選択・「申し込む」
/payment
```

---

## 📊 ルーティング設定 (`routes.ts`)

```typescript
// 認証フロー
{ path: "/", element: <HomeBeforeLogin> }
{ path: "account-creation", element: <AccountCreation> }
{ path: "onboarding", element: <Onboarding> }
{ path: "personality-question", element: <PersonalityQuestions> }

// Phase 3: 予約フロー
{ path: "home", element: <HomeAfterLogin> } // 01_01_Home_afterlogin_02 + 01_01_Home_afterlogin_01
{ path: "event/:eventId", element: <EventDetail01> }
{ path: "payment", element: <Payment> }
{ path: "reservations", element: <Reservations> }

// Phase 4: ポスト参加フロー
{ path: "event-day/:eventId", element: <EventDetailDay> }
{ path: "feedback/:eventId", element: <FeedbackScreen> }
{ path: "connection-result/:eventId", element: <ConnectionResult> }

// 特別枠
{ path: "home-special", element: <SpecialHomeAfterLogin> }
```

---

## 💾 LocalStorage キー一覧

| キー | 値 | 用途 |
|------|-----|------|
| `sakuraco_registered` | `"true"` | アカウント作成完了フラグ |
| `sakuraco_onboarding_complete` | `"true"` | オンボーディング完了フラグ |
| `sakuraco_current_booking` | JSON | 現在の予約情報 |
| `sakuraco_show_special_slot` | `"1"` | 特別枠表示フラグ |
| `sakuraco_connections` | JSON array | マッチング接続情報 |

---

## 🎨 デザインシステム

### 色彩
- **プライマリ**: `#2D2D2D`（ニュートラル ダーク）
- **アクセント（ピンク）**: 特別な瞬間のみ
- **グリーン**: 接続・肯定的な状態
- テイスト：落ち着き・信頼感・自然な繋がり

### コンポーネントライブラリ
- **Radix UI**: ベースコンポーネント（Dialog, Alert等）
- **Material-UI (MUI)**: Icons等
- **Lucide React**: 追加アイコン
- **Emotion**: スタイリング
- **Tailwind CSS**: ユーティリティクラス

### タッチターゲット
- 最小サイズ: 44px × 44px
- ボタン高さ: 48px (`min-h-[48px]`)
- コンテンツ幅: モバイルファースト（max-width: 428px推奨）

### ボーダーレディアス
- デフォルト: 8px
- ラージ: 12px以上

---

## 📱 レスポンシブ設計

- **ベース**: モバイルファースト
- **Safe Area**: `env(safe-area-inset-*)`で対応（iPhone ノッチ等）
- **固定要素**: ボトムナビゲーション・CTA（位置固定）
- **底部余白**: `calc(88px + safe-area)` で重複回避

---

## 🐛 適用済みバグ修正

### Bugfix Pack 01（7項目）
✅ **①** Onboarding CTA 常時表示（position: fixed）  
✅ **②** ホームのイベントカード レイアウト簡略化  
✅ **③** ナビゲーション時スクロール位置リセット  
✅ **④** 特別枠ルーティング修正  
✅ **⑤** イベント当日参加者アイコン のみ表示  
✅ **⑥** フィードバック参加者ラベル 調整  
✅ **⑦** 接続結果画面 パターン分岐  

### Bugfix Pack 02（特別枠フロー改善）
✅ **A** ConnectionResult → `/home-special`（localStorage フラグ設定）  
✅ **B** SpecialHomeAfterLogin 新規スクリーン  
✅ **C** SpecialEventDetail ラッパー  
✅ **D** `/home-special` ルーティング追加  

---

## 🔧 開発環境セットアップ

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

**ビルドアウトプット**: `dist/` ディレクトリ  
**Base Path**: `/sakuraco/`

---

## 📝 画面一覧（全23ファイル）

### 認証・オンボーディング（5）
- `00_01_HomeBeforeLogin.tsx`
- `00_02_AccountCreation.tsx`
- `00_01_EmailVerification.tsx`
- `00_01_VerificationCode.tsx`
- `01_02_Onboarding.tsx`

### パーソナリティ（1）
- `PersonalityQuestions.tsx` ⚠️ プレースホルダー

### Phase 3: 予約フロー（6）
- `01_01_Home_afterlogin_01.tsx` - イベント検索
- `01_01_Home_afterlogin_02.tsx` - 予約後ホーム
- `01_04_Event_detail_01.tsx` - イベント詳細
- `01_05_Payment.tsx` - 決済
- `Reservations.tsx` - 予約タブ
- `MyPage.tsx` - マイページ

### Phase 4: ポスト参加フロー（5）
- `02_04_Event_detail_03.tsx` - イベント当日
- `03_01_Feedback.tsx` - フィードバック
- `03_02_Connection_Result.tsx` - 接続結果
- `04_01_Home_afterlogin_01.tsx` - 特別枠ホーム
- `04_02_Event_detail_01.tsx` - 特別枠詳細ラッパー

### その他（6）
- `HomeAfterLogin.tsx` - 基本ホームコンポーネント
- `SchoolSelection.tsx`
- `Topick.tsx`
- `TopickDetail.tsx`
- `00_03_ProfileSetup.tsx`
- `00_02_OAuthMock.tsx`

### バックアップ（1）
- `bk/` - 旧バージョン格納

---

## ⚠️ 既知の制限事項・TODO

1. **PersonalityQuestions.tsx**
   - 現在: プレースホルダー画面
   - 次フェーズ: 実際の質問フロー実装必要

2. **データ**
   - ダミーデータ使用（events.ts, participants.ts）
   - バックエンド API 未接続

3. **支払い処理**
   - UI/UX のみ（実際の決済未実装）
   - localStorage でシミュレーション

4. **マッチング結果**
   - 確定的なロジックなし
   - 仕様上は双方「次回は２人で会いたい」で成立

---

## 📚 実装ドキュメント

各フェーズの詳細仕様：

| ファイル | 内容 |
|---------|------|
| `PHASE_3_IMPLEMENTATION.md` | Phase 3 (A+E) スクリーン詳細 |
| `PHASE_4_IMPLEMENTATION.md` | Phase 4 (F) スクリーン詳細 |
| `BUGFIX_PACK_01_COMPLETE.md` | 7項目バグ修正 達成状況 |
| `BUGFIX_PACK_02_COMPLETE.md` | 特別枠フロー修正 達成状況 |
| `ROUTING_STRUCTURE.md` | ルーティング仕様書 |
| `NAVIGATION_FLOW_PHASE4.md` | ナビゲーション動作確認ガイド |

---

## 🚀 次ステップ（未実装）

1. **PersonalityQuestions 実装**
   - ユーザーの趣味嗜好を質問
   - マッチング アルゴリズムへの入力

2. **バックエンド统合**
   - API エンドポイント接続
   - 認証トークン管理
   - データベース永続化

3. **リアルマッチング**
   - 相互フィードバック処理
   - レコメンデーション ロジック

4. **管理画面**
   - イベント管理
   - ユーザー管理
   - レポート

5. **決済統合**
   - StripeAPI 等の実装
   - 取引履歴管理

---

## 📞 技術サポート連絡先

**プロジェクト情報**:
- 原本: https://www.figma.com/design/7eDzy1hKgQs9Ua98p6yeab/Mobile-Web-Prototype-Rebuild
- リポジトリ: `.git/` フォルダで管理（ローカル）

**開発環境状態**: ✅ すべて動作確認済み（npm run build）  
**最終ビルド**: 2026年2月24日 成功

