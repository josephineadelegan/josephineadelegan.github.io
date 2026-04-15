# App Store And Google Play Prep

This project is now prepared in two layers:

1. `PWA`:
   - installable from the browser
   - offline-capable for core assets
   - app icon + manifest included

2. `Native wrapper ready`:
   - `capacitor.config.json` is included for packaging the site as iOS and Android apps

## What still must happen before store submission

You cannot submit a plain website directly to the Apple App Store or Google Play.
It needs to be wrapped as a native app, then built and uploaded from a Mac with the proper tools installed.

## Required accounts

- Apple Developer Program account
- Google Play Console account

## Recommended packaging path

Use Capacitor:

```bash
npm install @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
npx cap copy
npx cap sync
```

## Store submission notes

### Apple App Store

- open the generated iOS project in Xcode
- add real app icons, launch screen assets, and privacy strings
- archive and upload through Xcode or Transporter
- submit for App Review

### Google Play

- open the generated Android project in Android Studio
- add adaptive icons, screenshots, privacy policy, and signing config
- build an Android App Bundle (`.aab`)
- upload to Google Play Console and complete release details

## Important replacements before submission

- replace `assets/app-icon.svg` with proper store-quality icon sets
- create splash screens and screenshots
- add a privacy policy page if booking/contact data is collected
- confirm FormSubmit behavior is acceptable for production booking intake
