# PremedTestPortalAndroid 🩺📱

> **Production-Grade React Native Android CBT Examination Simulation & Clinical Study Portal** for Pre-Medical, MBBS, Pharmacy, BDS Dentistry, Nursing, and Health Sciences Candidates.

---

## 🌟 Overview

**PremedTestPortalAndroid** is the official accredited Android application clone of the **Premed Test Portal**. Designed from the ground up with strict clinical standards and a production mindset, this mobile portal delivers high-fidelity Prometric CBT examination simulations, self-paced practice modules, active recall study labs, squad battle duels, and offline-first data caching.

---

## 🚀 Key Modules & Capabilities

### 1. ⏱ Prometric CBT Examination Simulator (`ExamScreen`)
- **Proctored Examination Mode**: Real-time countdown timer with automated warnings at $< 5$ minutes and automatic session submission on expiry.
- **Candidate Matriculation Header**: Formal PMSEC proctored banner with candidate identity tracking.
- **5-Column Question Palette**: Color-coded states matching international Prometric/Pearson standards:
  - 🟢 **Green**: Answered
  - 🟡 **Yellow**: Flagged for Review
  - ⚪ **Gray**: Unanswered
  - 🔵 **Primary**: Current Active Question
- **Scientific Calculator Modal**: On-screen formula evaluation supporting trigonometry ($\sin, \cos, \tan$), logarithms ($\log, \ln$), radicals ($\sqrt{}$), powers ($x^y$), and constants ($\pi, e$).
- **expo-speech Read-Aloud TTS**: Audio narration of clinical question stems and options for auditory learners and accessible testing.
- **High-Resolution Diagram Zoom Modal**: Pinch/modal inspect for histology micrographs, anatomical schematics, and biochemical cycles.
- **Submit Confirmation Diagnostic**: Pre-submission dialog detailing total questions, answered, unanswered, and flagged counts.

### 2. 📝 Self-Paced Practice Lab (`PracticeScreen`)
- Instant answer evaluation with immediate color-coded feedback.
- Expandable **Clinical Rationales & High-Yield Pearls** for deep concept reinforcement.
- Dynamic question filtering by subject and individual course topics.

### 3. 📊 Official Examination Transcripts (`ResultsScreen`)
- Prometric letter grade badges (`A`, `B`, `C`, `D`, `F`) calculated using medical threshold scoring.
- Comprehensive candidate performance breakdown: total score, percentage, elapsed time, and council remark.
- **Topic Performance Diagnostic Bars**: Pinpoints mastery percentages across discrete syllabus topics.
- Interactive question review with filter chips (*All*, *Correct*, *Incorrect*, *Flagged*).
- Native system sharing of official transcripts.

### 4. ⚔️ Med Combat Arena (`CombatScreen`)
- Pre-med squad duel system: **Squad Blue (Candidate)** vs **Squad Red (Challenger)**.
- Live animated HP bars ($100$ HP per team) and score counters.
- **Combo Streaks**: Multiplier damage bonuses for consecutive correct diagnoses.
- Real-time terminal combat feed logging hits, misfires, recoil, and match conclusions.

### 5. ✨ AI Clinical Study Room (`ActiveStudyScreen`)
- **Lecture Note Ingestion**: Ingest custom slides or load pre-built pre-med high-yield notes (e.g. *Action Potential Dynamics*, *Krebs Cycle Regulation*).
- **Ask AI Tutor**: Interactive medical tutor chat explaining physiological mechanisms and formula derivations.
- **Active Recall Quiz**: Auto-generated comprehension MCQs testing notes with instant scoring.
- **High-Yield Points**: Synthesized exam pearls and clinical mnemonics.

### 6. 🛡️ System Readiness & Integrity Check (`ReadinessScreen`)
- Real-time hardware check: viewport resolution, speech synthesizer, local storage cache, and proctoring status.
- Projected board examination pass probability dynamically calculated from past attempts.

### 7. 🔍 Question Bank Vault (`QuestionSearchScreen`)
- Full-text search across thousands of questions by keyword, enzyme, formula, or organ system.
- Subject filter chips and persistent question bookmarking.

### 8. 🏆 Cohort Leaderboard (`LeaderboardScreen`)
- Pre-med cohort rankings with podium display for Top 3 candidates.
- Departmental filtering across Medicine & Surgery, Pharmacy, Dentistry, Nursing, and Medical Laboratory Science.

### 9. 👤 Candidate Profile & Clinical Settings (`ProfileScreen`)
- Matriculation number, department, and candidate registration management.
- Medical Qualifying Board Exam countdown timer.
- High-contrast clinical **Dark Mode** toggle.
- Local cache reset and secure session logout.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Expo SDK 52 (~52.0.0) / React Native 0.76.6 |
| **Language** | TypeScript 5.3 (Strict Typing) |
| **Navigation** | React Navigation v7 (Native Stack & Bottom Tabs) |
| **Local Storage** | `@react-native-async-storage/async-storage` (Offline-first) |
| **Audio / Speech** | `expo-speech` (Text-to-speech engine) |
| **Haptics** | `expo-haptics` |
| **Vector Graphics** | `react-native-svg` |
| **Design System** | Custom Clinical Medical Palette (Teal & Slate) |

---

## 📦 Project Structure

```
PremedTestPortalAndroid/
├── App.tsx                        # Root Application component & Context providers
├── app.json                       # Expo & Android package configuration
├── eas.json                       # EAS Android APK & AAB build configuration
├── package.json                   # Dependencies & build scripts
├── tsconfig.json                  # Strict TypeScript configuration
├── assets/                        # App icons, splash screens, and adaptive icons
├── scripts/
│   └── generate_assets.js         # Asset generation script
└── src/
    ├── components/                # Reusable UI components
    │   ├── CalculatorModal.tsx    # Prometric Scientific Calculator
    │   ├── CourseCard.tsx         # Subject card with difficulty & stats
    │   ├── DiagramModal.tsx       # Anatomical diagram zoom viewer
    │   ├── Header.tsx             # Candidate session top navigation
    │   ├── OptionItem.tsx         # CBT single-choice radio option
    │   ├── QuestionPaletteModal.tsx# 5-column color-coded question palette
    │   ├── StatCard.tsx           # Dashboard metric cards
    │   └── SubmitConfirmationModal.tsx # Submission verification dialog
    ├── constants/                 # Theme colors and typography
    │   ├── colors.ts
    │   └── theme.ts
    ├── context/                   # Global state management
    │   ├── AuthContext.tsx        # Candidate auth & matriculation state
    │   ├── ExamContext.tsx        # Timer engine, palette, and answers state
    │   └── ThemeContext.tsx       # Dark / Light mode context
    ├── data/                      # Accredited course & question catalogs
    │   ├── announcements.ts
    │   ├── courses.ts
    │   ├── questionBanks.ts       # Hundreds of high-yield clinical questions
    │   └── sampleNotes.ts
    ├── navigation/                # Type-safe routing
    │   ├── AppNavigator.tsx       # Root Native Stack Navigator
    │   ├── BottomTabNavigator.tsx # Bottom navigation bar
    │   └── types.ts               # Navigation route type definitions
    ├── screens/                   # Complete Application Screens
    │   ├── ActiveStudyScreen.tsx  # AI Study Room & Recall Quiz
    │   ├── CombatScreen.tsx       # Med Combat Battle Arena
    │   ├── CoursesScreen.tsx      # Subject Catalog & Syllabi
    │   ├── ExamScreen.tsx         # Prometric CBT Examination Engine
    │   ├── HistoryScreen.tsx      # Past Transcripts & Attempts
    │   ├── HomeScreen.tsx         # Candidate Dashboard
    │   ├── LeaderboardScreen.tsx  # Cohort Standings & Podium
    │   ├── LoginScreen.tsx        # Candidate Matriculation Access
    │   ├── PracticeScreen.tsx     # Untimed Practice with Rationales
    │   ├── ProfileScreen.tsx      # Candidate Details & Dark Theme
    │   ├── QuestionSearchScreen.tsx# Question Bank Search Vault
    │   ├── ReadinessScreen.tsx    # Hardware Check & Pass Probability
    │   └── ResultsScreen.tsx      # Official Transcript & Grade Review
    ├── services/
    │   ├── speechService.ts       # Text-to-speech reader service
    │   └── storageService.ts      # Offline AsyncStorage CRUD service
    └── utils/
        ├── calculator.ts          # Scientific formula evaluator
        ├── formatters.ts          # MM:SS and date formatters
        └── grading.ts             # Medical score grading engine
```

---

## 📱 Building the Android APK / Application

### 1. Prerequisites
- **Node.js**: v18 or v20 LTS
- **npm** or **yarn**
- **Android Studio** (for local emulator/device testing) OR an **Expo Application Services (EAS)** account for cloud building.

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/emmanueladejuwon2021-star/PremedTestPortalAndroid.git
cd PremedTestPortalAndroid

# Install dependencies
npm install
```

### 3. Run on Android Device or Emulator
```bash
# Start Expo development server with Android target
npx expo start --android
```

### 4. Build Standalone Android APK (EAS Cloud)
To compile a downloadable `.apk` file for physical device distribution:
```bash
# Install EAS CLI globally if not already installed
npm install -g eas-cli

# Log in to your Expo account
eas login

# Build preview APK directly in the cloud (no local Android SDK required)
eas build --platform android --profile preview
```

### 5. Build Android App Bundle (AAB for Google Play Store)
```bash
eas build --platform android --profile production
```

---

## 🔒 Offline-First Architecture
All core question banks, course syllabi, diagnostic tests, and past exam results are stored locally using `@react-native-async-storage/async-storage`. Candidates can sit for full simulated examinations even with intermittent or zero internet connectivity.

---

## 📄 License
Academic CBT Simulator - Built for Pre-Medical & Health Sciences Examination Candidates.
