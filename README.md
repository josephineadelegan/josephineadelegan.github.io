# Alafia Braiding Studio

Static salon website for Alafia Braiding Studio.

## Files

- `index.html`: main site markup
- `styles.css`: visual design and responsive layout
- `script.js`: booking preview, local persistence, and live submission flow
- `assets/studio-reel.mov`: local salon video asset
- `manifest.webmanifest`: installable app metadata
- `sw.js`: offline caching for the PWA
- `capacitor.config.json`: native wrapper starter config
- `APP-STORES.md`: App Store and Google Play packaging notes

## Local preview

Run:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open:

`http://127.0.0.1:8000`

## Live booking flow

The booking form posts to FormSubmit:

- endpoint: `https://formsubmit.co/ajax/alafiabraidingsalon@gmail.com`
- first live submission may require activation from the salon email inbox

After activation, form submissions can be delivered without maintaining a custom backend.

## Deployment

This project can be deployed as a plain static site on:

- GitHub Pages
- Netlify
- Vercel static hosting

## Mobile app readiness

The site now supports:

- installable PWA behavior in supported browsers
- offline caching for core assets
- a Capacitor starter config for packaging as iOS and Android apps later

Read `APP-STORES.md` for the remaining App Store / Google Play steps.

## Recommended next edits

- replace starting prices with exact final service pricing
- add more real braid photos
- connect a dedicated booking system if calendar management is needed
