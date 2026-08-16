# BMI Tracker — IV Innovations Private Limited

> A cross-platform BMI tracking app built with React Native (Expo), TypeScript, and Supabase.

---

## Features

| # | Feature | Status |
|---|---|---|
| 1 | Google Sign-In | ✅ Mandatory |
| 2 | Email/Password + Password Reset | ✅ Mandatory |
| 3 | User Details Form (weight, height, gender + validation) | ✅ Mandatory |
| 4 | BMI Calculation + Category Display | ✅ Mandatory |
| 5 | User Settings (update measurements) | ✅ Bonus |
| 6 | Weight History Graph (last 7 entries) | ✅ Bonus |
| 7 | Multi-User Profile Management | ✅ Bonus |

### Bonus Items Implemented
- ✅ Auth state persistence (session survives app restart)
- ✅ Customized animated chart with gradient fill and tooltips
- ✅ Comprehensive error handling via `ServiceResult<T>` pattern
- ✅ SOLID Principles throughout the entire codebase

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo SDK 52 |
| Language | TypeScript (strict mode) |
| Backend / Auth | Supabase (PostgreSQL + Row Level Security) |
| Navigation | React Navigation v7 |
| Charts | react-native-gifted-charts |
| Form Validation | react-hook-form + zod |
| State Management | zustand |
| Date Utilities | date-fns |
| Google Sign-In | @react-native-google-signin/google-signin |

---

## SOLID Principles Applied

| Principle | How Applied |
|---|---|
| **S** — Single Responsibility | Each file has one job: `bmi.ts` = math only, services = DB only, screens = UI only |
| **O** — Open/Closed | `BMI_CATEGORIES` array extends without modifying consumers |
| **L** — Liskov Substitution | `ServiceResult<T>` type allows mock services to substitute real ones |
| **I** — Interface Segregation | Each custom hook exposes only what its screen needs |
| **D** — Dependency Inversion | Screens → Hooks → Services → Supabase (not direct) |

---

## Project Structure

```
bmi-tracker/
├── App.tsx                      # Root: fonts + Google Sign-In config
├── app.json                     # Expo config
├── .env.example                 # Environment variable template
├── supabase/
│   └── migration.sql            # Run this in Supabase SQL Editor
└── src/
    ├── lib/supabase.ts          # Supabase client (single instance)
    ├── types/index.ts           # All shared TypeScript types
    ├── theme/                   # Design tokens (colors, typography, spacing)
    ├── services/                # D (DIP) abstraction layer over Supabase
    │   ├── authService.ts
    │   ├── profileService.ts
    │   └── weightService.ts
    ├── store/                   # Zustand state (auth, profiles)
    │   ├── authStore.ts
    │   └── profileStore.ts
    ├── hooks/                   # I (ISP) — one hook per screen
    │   ├── useHome.ts
    │   ├── useHistory.ts
    │   ├── useProfiles.ts
    │   └── useSettings.ts
    ├── utils/                   # S (SRP) pure functions
    │   ├── bmi.ts
    │   └── validation.ts
    ├── components/              # Reusable UI components
    │   ├── BMIGauge.tsx
    │   ├── CategoryBadge.tsx
    │   ├── WeightChart.tsx
    │   ├── ProfileCard.tsx
    │   └── UserDetailsForm.tsx
    ├── navigation/              # Navigator definitions
    │   ├── RootNavigator.tsx
    │   ├── AuthNavigator.tsx
    │   └── AppNavigator.tsx
    └── screens/
        ├── auth/
        │   ├── LoginScreen.tsx
        │   ├── RegisterScreen.tsx
        │   └── ForgotPasswordScreen.tsx
        └── app/
            ├── HomeScreen.tsx
            ├── HistoryScreen.tsx
            ├── ProfilesScreen.tsx
            └── SettingsScreen.tsx
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android emulator) or physical Android device
- A [Supabase](https://supabase.com) account (free tier works)
- A [Google Cloud Console](https://console.cloud.google.com) project

---

### Step 1 — Clone & Install

```bash
cd "IV Innovation Assessment/bmi-tracker"
npm install
```

---

### Step 2 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the Supabase Dashboard, go to **SQL Editor** and run the full contents of `supabase/migration.sql`.
3. Go to **Authentication > Providers**, enable **Google**, and paste in your Google credentials (see Step 3).
4. Copy your **Project URL** and **Anon Key** from **Project Settings > API**.

---

### Step 3 — Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com) > **APIs & Services > Credentials**.
2. Configure the **OAuth Consent Screen** (add yourself as a test user).
3. Create two OAuth 2.0 Client IDs:
   - **Web Application** → add your Supabase callback URL to Authorized Redirect URIs
   - **Android** → provide your app's SHA-1 fingerprint (get it with `cd android && ./gradlew signingReport`)
4. Copy the **Web Client ID**.
5. Paste the Web Client ID into Supabase's Google provider settings.

---

### Step 4 — Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:
```
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.apps.googleusercontent.com
```

Also update `app.json`:
- Replace `YOUR_IOS_CLIENT_ID_SUFFIX` in `iosUrlScheme` with your iOS client ID suffix.

---

### Step 5 — Build & Run

**Android (recommended for development):**
```bash
# Create a development build (required for Google Sign-In native module)
npx expo run:android
```

**iOS (requires macOS):**
```bash
npx expo run:ios
```

**Expo Go (limited — Google Sign-In won't work, email auth only):**
```bash
npx expo start
```

---

## BMI Calculation

```
BMI = weight(kg) / (height(m) × height(m))
```

| Unit Input | Conversion Applied |
|---|---|
| Weight in LBS | × 0.453592 → kg |
| Height in Inches | × 2.54 → cm |

| BMI Range | Category |
|---|---|
| < 18.5 | Underweight |
| 18.5 – 24.9 | Normal Weight |
| 25.0 – 29.9 | Overweight |
| ≥ 30.0 | Obese |

---

## Libraries Used

| Package | Purpose |
|---|---|
| `@supabase/supabase-js` | Database, auth, real-time |
| `@react-native-google-signin/google-signin` | Native Google OAuth |
| `@react-native-async-storage/async-storage` | Session persistence |
| `react-native-gifted-charts` | Animated line/area charts |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` + `zod` | Schema-based validation |
| `zustand` | Global state management |
| `date-fns` | Date formatting |
| `@react-navigation/native` | Navigation container |
| `@react-navigation/native-stack` | Stack navigator |
| `@react-navigation/bottom-tabs` | Tab bar navigator |
| `expo-linear-gradient` | Gradient backgrounds |
| `@expo-google-fonts/inter` | Inter font family |
| `react-native-url-polyfill` | URL API polyfill for Supabase |

---

## Submission Info

- **Company:** IV Innovations Private Limited (Kundli – Sonipat)
- **Deadline:** 20 August 2026
- **Developer:** [Your Name]
- **Platform:** Android + iOS (React Native / Expo)
