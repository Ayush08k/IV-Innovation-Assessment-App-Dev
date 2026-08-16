# VitalFit — BMI Tracker & Health Analytics 🩺

> **VitalFit** is a modern, cross-platform health and body mass index tracking application built with **React Native (Expo SDK 54)**, **TypeScript**, and **Supabase**. It provides real-time health intelligence, animated WHO-standard BMI gauges, multi-profile tracking, 7-day weight telemetry graphs, and secure authentication (Google OAuth & Email/Password).

---

## 👨‍💻 Developer Information

- **Developer:** **Ayush Kumar**
- **Company / Assignment:** IV Innovations Private Limited (Kundli – Sonipat)
- **Role:** Mobile App Developer Assessment
- **GitHub Repository:** [IV-Innovation-Assessment-App-Dev](https://github.com/Ayush08k/IV-Innovation-Assessment-App-Dev)

---

## 📲 App Download Link

- **Download Standalone Android APK:** [Download VitalFit APK (Direct Link)](https://expo.dev/artifacts/eas/564c0a93-c919-4931-93e3-0c940485d854) *(or scan via EAS QR code)*

---

## 📱 App Description & Overview

VitalFit is engineered following strict **SOLID principles** and modern clinical UI/UX design:
1. **Real-time BMI & WHO Classification**: Dynamically calculates BMI from Metric (kg/cm) or Imperial (lbs/inches) inputs with an interactive animated gauge and WHO categories (Underweight, Normal, Overweight, Obese).
2. **Telemetry & Progress History**: Interactive 7-day weight trend graph powered by `react-native-gifted-charts` with tooltip inspection and healthy weight range predictions.
3. **Multi-User Profile Management**: Switch effortlessly between family or patient profiles; all calculations, history graphs, and measurements adapt instantly.
4. **Fluid Liquid Flow UX**: Features physics-based spring diagonal transitions across navigation sections and smart Android hardware back button double-tap-to-exit prevention.
5. **Secure Cloud Sync & RLS**: Backed by PostgreSQL on Supabase with strict Row Level Security (RLS), persistent sessions, and universal Google OAuth.

---

## 🎯 Features Checklist

| # | Feature | Status | Description |
|---|---|---|---|
| 1 | Google Sign-In | ✅ Complete | Universal OAuth (in-app browser + native compatibility) |
| 2 | Email/Password Auth | ✅ Complete | Secure signup, login, and self-service password reset |
| 3 | Measurement Input Form | ✅ Complete | Weight (kg/lbs) & Height (cm/in) with real-time validation |
| 4 | BMI Gauge & Classification | ✅ Complete | WHO standard categories + healthy ideal weight range |
| 5 | Measurement Settings | ✅ Complete | Dynamic updates instantly recalculate BMI & timestamp entries |
| 6 | Weight History Graph | ✅ Complete | 7-entry weight telemetry with tooltips and trend line |
| 7 | Multi-Profile Management | ✅ Complete | Create, switch active profile, and manage profiles |

### ✨ Premium Bonus Highlights Implemented
- ✅ **Auth State Persistence**: Session persists seamlessly across app restarts via `AsyncStorage`.
- ✅ **Clinical Light Health Theme**: Curated medical emerald (`#059669`) and crisp mint background palette.
- ✅ **Liquid Spring Animations**: Custom `LiquidTransitionView` with 60fps spring transitions.
- ✅ **Smart Mobile Back Navigation**: Step-by-step navigation history + double-tap confirmation to exit.
- ✅ **Strict SOLID Architecture**: Service repository pattern (`ServiceResult<T>`), custom UI hooks, and decoupled Zustand stores.

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
- **Developer:** Ayush Kumar
- **Platform:** Android + iOS (React Native / Expo SDK 54)
