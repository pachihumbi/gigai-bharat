# GigAI Bharat — Android (Capacitor)

Native Android shell for the worker PWA super app.

## Prerequisites

- Node.js 20+
- [Android Studio](https://developer.android.com/studio) with SDK 34+
- Java 17

## First-time setup

From repo root:

```bash
npm install
npm run build -w @gigai/worker
cd apps/worker
npx cap sync android
```

Open in Android Studio:

```bash
npx cap open android
```

## Build debug APK

```bash
cd apps/worker
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`

On Windows PowerShell:

```powershell
cd apps\worker\android
.\gradlew.bat assembleDebug
```

## Release APK / AAB

1. Generate signing keystore (one-time).
2. Configure `android/app/build.gradle` signingConfigs.
3. Run `./gradlew bundleRelease` for Play Store AAB.

## Icons & splash

- App icons: `public/icons/icon-512.png`, `icon-maskable-512.png`
- Theme: `#020810` / accent `#00F5D4`
- Regenerate native assets: `npx @capacitor/assets generate --android`

## Deep linking

Production hostname: `app.bharatgig.live`  
Demo entry: `https://app.bharatgig.live/demo`

Configure Android App Links in `AndroidManifest.xml` after `cap add android`.
