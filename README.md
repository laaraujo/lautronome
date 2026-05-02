# Lautronome

A simple, accurate metronome with a built-in interval timer for practice rounds.

Pick a tempo (BPM), how long each practice round should last, and how long the break between rounds should be. Hit start.

## Stack

- [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5, runes mode) with `adapter-static`
- [Skeleton UI v3](https://www.skeleton.dev) component library
- [Tailwind CSS v4](https://tailwindcss.com)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for sample-accurate click scheduling (lookahead pattern, no `setInterval`-based playback drift)
- TypeScript

## Develop

This project uses [pnpm](https://pnpm.io). The required version is locked in the `packageManager` field of `package.json`. Use [Corepack](https://nodejs.org/api/corepack.html) (`corepack enable`) or install pnpm globally if you don't have it.

```bash
pnpm install
pnpm dev
```

Open the URL the dev server prints. The first click on **Start** also resumes the `AudioContext` (required by browser autoplay policy).

## Build

```bash
pnpm build
```

The static site is emitted to `build/`. You can preview it with:

```bash
pnpm preview
```

## Deploy

A GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically builds and deploys to GitHub Pages on every push to `main`.

One-time setup on the repo:

1. Push the repo to GitHub as `lautronome` (the base path in `svelte.config.js` is hardcoded to `/lautronome`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. The workflow will publish to `https://<your-user>.github.io/lautronome/`.

If the repo name ever changes, update `paths.base` in `svelte.config.js` to match.

## Project layout

```
src/
├── app.html               <-- root HTML; sets data-theme="pine"
├── lib/
│   └── metronome.svelte.ts  <-- audio engine + reactive state ($state)
└── routes/
    ├── +layout.svelte
    ├── +layout.ts         <-- prerender = true (required for static export)
    ├── +page.svelte       <-- the metronome UI
    └── layout.css         <-- Tailwind + Skeleton imports
```

## How the metronome stays accurate

JavaScript timers (`setInterval`, `setTimeout`) drift, especially when the tab is backgrounded. So instead of triggering each click from a JS timer, this app uses the **lookahead pattern**:

- A coarse timer wakes every 25 ms.
- Each wake-up, it schedules every click that should fire in the next 100 ms via `AudioContext.currentTime` and `OscillatorNode.start(when)`.
- Click playback is then handled by the audio thread, which is sample-accurate.

The phase boundaries (round → break → round) still use `setTimeout`, but that's fine — being a few milliseconds late on a 60-second round is invisible.
