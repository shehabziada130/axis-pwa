# Axis — One Thing at a Time

> *The time budget for people who lose track of time.*

A free, offline-first, ADHD-friendly day manager. No accounts. No subscriptions. No cloud. Everything stays on your device.

---

## Deploy to GitHub Pages (5 minutes)

### Step 1 — Create a GitHub repo
1. Go to [github.com](https://github.com) and sign in
2. Click **New repository**
3. Name it `axis` (or anything you like)
4. Set it to **Public**
5. Click **Create repository**

### Step 2 — Upload the files
Upload all four files to the root of your repo:
```
index.html
manifest.json
sw.js
icon.svg
```

You can drag and drop them directly on GitHub, or use Git:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/axis.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch: `main`, folder: `/ (root)`
4. Click **Save**

### Step 4 — Done
In ~60 seconds your app is live at:
```
https://YOUR_USERNAME.github.io/axis
```

---

## Install as a Mobile App (PWA)

### Android
1. Open the GitHub Pages URL in Chrome
2. Tap the **⋮ menu** → **Add to Home Screen**
3. Tap **Add**
4. Axis appears on your home screen like a native app

### iOS (iPhone / iPad)
1. Open the URL in **Safari**
2. Tap the **Share** button (square with arrow)
3. Scroll down → tap **Add to Home Screen**
4. Tap **Add**

The app works fully offline after the first load.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | The entire app — all screens, logic, and styles |
| `manifest.json` | PWA manifest — name, icon, theme color |
| `sw.js` | Service worker — offline caching |
| `icon.svg` | App icon (works on all platforms) |

---

## Features
- ⏱ Live countdown timer with progress ring
- 📋 Full day schedule with task list
- 📅 Plan tomorrow tonight
- 📁 Reusable schedule templates
- ⚠️ Recovery mode (no AI — pure local logic)
- ⏸ Pause / resume any task
- ✓ End task early / skip task
- ➕ Insert tasks mid-day
- 🌙 Sleep / Wake Up logic
- 💾 All data stored locally — no account needed
- 📶 Works fully offline

---

## No paid services. No backend. No AI. Free forever.
