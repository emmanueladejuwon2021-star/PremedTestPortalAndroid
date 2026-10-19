# PremedTestPortalAndroid 🩺📱

> **Production-Grade React Native Android CBT Examination Simulation & Clinical Study Portal** for Pre-Medical, MBBS, Pharmacy, BDS Dentistry, Nursing, and Health Sciences Candidates.

---

## 🌟 Overview

**PremedTestPortalAndroid** is the official accredited Android application clone of the **Premed Test Portal**. Designed from the ground up with strict clinical standards and a production mindset, this mobile portal delivers high-fidelity Prometric CBT examination simulations, self-paced practice modules, active recall study labs, squad battle duels, offline-first data caching, and automatic exam session recovery.

---

## 🚀 Key Modules & Capabilities

### 1. ⏱ Prometric CBT Examination Simulator (`ExamScreen`)
- **Proctored Examination Mode**: Real-time countdown timer with automated warnings at $< 5$ minutes and automatic session submission on expiry.
- **Session Auto-Recovery**: Background state persistence saves active exam progress in real-time, allowing candidates to resume seamlessly even if interrupted.
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

## 📱 How to Test This App on Your Android Phone

You can test and run **Apex PreMed CBT** on your Android mobile device using either **Method A (Live Wireless Testing via Expo Go)** or **Method B (Installing Standalone APK File)**.

---

### Method A: Live Wireless Testing via Expo Go (Fastest)

1. **Install Expo Go on your Android Phone**:
   - Open **Google Play Store** on your Android phone.
   - Search for **Expo Go** and tap **Install**.

2. **Connect Phone & Computer to Same Network**:
   - Ensure your mobile phone and development machine are connected to the same Wi-Fi network (or computer hotspot).

3. **Start the Development Server**:
   ```bash
   npm install
   npx expo start
   ```

4. **Scan QR Code**:
   - Open the **Expo Go** app on your phone.
   - Tap **Scan QR code** and scan the QR code displayed in your terminal or browser window.
   - The app will build JavaScript bundles and launch instantly on your device with live-reloading!

---

### Method B: Generating & Installing the Standalone APK (`.apk`)

If you want a standalone installable Android application (`.apk` file) that runs natively on your phone without needing a computer running Expo:

#### Step 1: Build the APK File using EAS Cloud (Recommended)

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Log into your Expo Account**:
   ```bash
   eas login
   ```
   *(If you don't have an Expo account, register for a free account at [expo.dev](https://expo.dev)).*

3. **Trigger the Android Preview APK Build**:
   ```bash
   eas build --platform android --profile preview
   ```
   - Expo Cloud Build will compile the native Android binaries.
   - Once completed (usually 3–5 minutes), terminal output will provide a **Direct Download Link (`.apk`)** and a **QR Code**.

---

#### Step 2: Alternative Local APK Build (Gradle)

If you have Android SDK and Android Studio installed locally:
```bash
# Build standalone release APK locally
npx expo run:android --variant release
```
The generated `.apk` file will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

---

#### Step 3: Installing the APK File on Your Android Phone

1. **Download / Transfer the `.apk` file to your phone**:
   - **Option 1 (Direct QR/URL)**: Scan the download QR code from the EAS build output or open the provided download link directly in Chrome on your phone.
   - **Option 2 (USB Cable)**: Connect phone to PC via USB, set to *File Transfer / MTP*, and copy `app-release.apk` to your phone's *Downloads* folder.
   - **Option 3 (Messaging/Drive)**: Upload `.apk` to Google Drive or send it via Telegram/WhatsApp to yourself and download it on your phone.

2. **Enable Unknown Sources Installation**:
   - When you tap the downloaded `.apk` file in your phone's File Manager or Chrome, Android security will display a prompt: *"For your security, your phone is not allowed to install unknown apps from this source."*
   - Tap **Settings** on the prompt.
   - Toggle **Allow from this source** to `ON`.

3. **Complete Installation**:
   - Return to the installer prompt and tap **Install**.
   - Once installed, tap **Open** to launch **Apex PreMed CBT**!

---

## 🔒 Offline-First Architecture
All core question banks, course syllabi, diagnostic tests, active recall study notes, and past exam results are cached locally using `@react-native-async-storage/async-storage`. Candidates can sit for full proctored CBT examinations even without internet connectivity.

---

## 📄 License
Academic CBT Simulator - Built for Pre-Medical & Health Sciences Examination Candidates.
