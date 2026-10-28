# AuditTrace — Enterprise Field Audit & Evidence Logger

**AuditTrace** is an enterprise-grade mobile application built with **React Native (Expo SDK 58)** designed for consulting and audit professionals (e.g., KPMG, PwC, Deloitte-style field workflows). The app empowers auditors to conduct on-site physical inspections, verify IT & fixed assets, capture tamper-evident photo evidence with automatic forensic metadata overlays, collect digital manager sign-offs, and generate compliance summary working papers with offline-first resilience.

---

## 📸 Key Capabilities

1. **Dashboard & Engagement Management**:
   - Executive metric cards: Total Audits, In Progress, Pending Sync, Completed.
   - List of assigned audit engagements with client details, due dates, risk levels (*High, Medium, Low*), and status badges (*Draft, In Progress, In Review, Synced*).
   - Real-time search by client, engagement code, or title, plus multi-factor status and risk filtering.
   - "+ New Inspection" modal to initialize field audits on-site.

2. **Checklist & Control Inspection Screen**:
   - Filterable by audit domain (*Physical Security*, *Asset Tagging*, *Network Controls*, etc.).
   - Interactive 4-way compliance status toggles: **PASS** (Emerald), **FAIL** (Crimson), **FLAG** (Amber), and **HOLD / UNTESTED** (Slate).
   - Inline expandable auditor observation notes with automatic local save.
   - Attached evidence thumbnails with GPS badge indicators and manager sign-off seals.

3. **Tamper-Evident Evidence Vault & Camera Modal**:
   - Camera & gallery integration via `expo-image-picker`, alongside realistic enterprise quick-capture presets.
   - **Forensic Watermark Overlay**:
     - Exact ISO 8601 UTC Timestamp (e.g., `2026-10-27T14:15:22.410Z`)
     - High-precision Geotagging (`Lat 40.712792° N, Lon -74.005988° W, Alt: 22.4m, Acc: ±1.8m`)
     - Unique Auditor Identifier (`AUD-8824 - A. Harrison, CISA`)
     - Control Reference Tag (e.g., `SEC-01`)
     - Tamper-Evident SHA-256 Checksum (`sha256:4a6b29f9...`)
   - **Digital Signature Pad**:
     - Cross-platform touch & gesture drawing canvas.
     - Facility manager attestation declaration affirmation with signer name and title.

4. **Audit Summary & Working Paper Export**:
   - Compliance % breakdown gauge and progress bars (*% Passed vs. Issues Identified*).
   - Deficiencies & Significant Findings register with root-cause observations.
   - Working Paper modal with formatted report preview and full serialized JSON payload export.
   - Enterprise Server Sync simulator with real-time feedback.

5. **Offline-First Resilience**:
   - Local persistence via `@react-native-async-storage/async-storage` with automatic seed data initialization.
   - Interactive offline toggle banner in the UI to simulate field disconnections and verify that audits, evidence, and observations remain completely intact and queue for cloud sync.

---

## 📂 Project Structure

```text
AuditTrace/
├── App.js                         # Root application navigator and provider wrapper
├── app.json                       # Expo configuration with web & mobile metadata
├── package.json                   # Dependencies (Expo SDK 58, React Native 0.88, React 19)
├── server/                        # Enterprise Node.js / Express Backend Server
│   ├── index.js                   # Express server entry point (Port 5000)
│   ├── db.js                      # Persistent atomic database engine (server/data/database.json)
│   ├── package.json               # Backend dependencies (express, cors, multer)
│   ├── routes/
│   │   ├── audits.js              # REST endpoints for audits, controls & sync (/api/audits)
│   │   └── evidence.js            # Cryptographic SHA-256 evidence upload & verify (/api/evidence)
│   └── uploads/                   # Stored field evidence photos & artifacts
├── src/
│   ├── services/
│   │   └── api.js                 # API client for backend communication & offline fallback
│   ├── theme/
│   │   └── colors.js              # Corporate enterprise navy/slate palette & spacing tokens
│   ├── data/
│   │   └── mockAudits.js          # KPMG/PwC-style field audits, controls, and sample evidence
│   ├── context/
│   │   └── AuditContext.js        # React Context API with AsyncStorage offline persistence
│   ├── components/
│   │   ├── Header.js              # Corporate header with auditor ID & workspace reset
│   │   ├── OfflineBanner.js       # Live connection state & sync queue indicator
│   │   ├── MetricCard.js          # KPI statistic cards with accent borders
│   │   ├── AuditCard.js           # Engagement card with risk tags & completion progress
│   │   ├── ControlItem.js         # Interactive checklist item with 4-way toggles & notes
│   │   ├── EvidenceModal.js       # Tamper-evident photo capture & metadata watermark
│   │   ├── SignaturePad.js        # Touch gesture signature canvas for manager sign-off
│   │   ├── CreateAuditModal.js    # Engagement creation modal
│   │   └── WorkingPaperModal.js   # Executive working paper preview & JSON exporter
│   └── screens/
│       ├── DashboardScreen.js     # Engagement overview & metrics
│       ├── ChecklistScreen.js     # Domain-filtered control checklist
│       ├── EvidenceVaultScreen.js # Forensic photo gallery & signature chain-of-custody
│       └── ReportScreen.js        # Compliance findings scorecard & cloud sync
```

---

## 🚀 How to Run Locally

### 1. Start the Enterprise Backend Server
```bash
cd server
npm start
```
*The server starts on `http://localhost:5000` with live health check at `http://localhost:5000/api/health`.*

### 2. Start the Mobile / Web Client
```bash
# In the root directory:
npm run web
```
Open [http://localhost:8081](http://localhost:8081) in any browser.

### 2. Android
```bash
npm run android
```
*(Requires Android Studio & Android SDK or physical Android device with USB debugging)*

### 3. iOS
```bash
npm run ios
```
*(Requires macOS & Xcode)*

### 4. Expo Go (On Physical Phone)
```bash
npx expo start
```
Scan the QR code in your terminal using the **Expo Go** app on iOS or Android.

---

## 🔒 Forensic Verification Model

Each evidence asset captured through AuditTrace undergoes cryptographic metadata binding:
```json
{
  "id": "EVD-081-01",
  "type": "photo",
  "caption": "Biometric Scanner & Mantrap Entry Terminal A",
  "timestamp": "2026-10-27T14:15:22.410Z",
  "gps": {
    "latitude": 40.712792,
    "longitude": -74.005988,
    "altitude": 22.4,
    "accuracy": 1.8
  },
  "auditorId": "AUD-8824",
  "controlRef": "SEC-01",
  "sha256Hash": "4a6b29f9e208b087f9859f518e11b3d6872583d7890efd019f37c35d1234abcd",
  "tamperVerified": true
}
```
This guarantees an immutable audit trail matching international working paper standards.
