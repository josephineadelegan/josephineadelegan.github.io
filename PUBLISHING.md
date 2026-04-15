# Publishing Guide

## GitHub Pages

1. Create a new GitHub repository.
2. In this project directory run:

```bash
git add .
git commit -m "Build Alafia Braiding Studio app"
git remote add origin <your-repo-url>
git push -u origin main
```

3. In GitHub:
   - open `Settings`
   - open `Pages`
   - choose `GitHub Actions` as the source

The included workflow at `.github/workflows/deploy-pages.yml` will publish the site automatically.

## PWA install

Once the site is deployed over HTTPS, supported browsers can install it as an app.

## iPhone and Android app packaging

On a machine with Node.js installed:

```bash
npm install
npx cap add ios
npx cap add android
npx cap copy
npx cap sync
```

Then:

- open the iOS project in Xcode
- open the Android project in Android Studio
- configure icons, splash screens, signing, screenshots, and store metadata

## Current blockers in this workspace

- no GitHub remote is configured yet
- `node` and `npm` are not installed here
- App Store / Google Play uploads require Apple and Google developer accounts
