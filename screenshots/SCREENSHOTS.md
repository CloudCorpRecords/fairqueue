# Screenshots — status & how to capture PNGs

## What's in this folder

| File | What it shows | Status |
|---|---|---|
| `before.svg` | **Before** — the prototype in "Before: Spotify Jam today" mode: Rene's 3 songs stacked at positions 1–3, no fairness panel, longest run 3 in a row. | Faithful vector capture of the prototype's Before state (same layout, colors, sample data). Labeled "prototype recreation" inside the image itself. |
| `after.svg` | **After** — the same Jam after pressing "Apply FairQueue" in the prototype: queue reordered to Aysha → Jordan → Maya → Rene rotation, fairness score 73 (was 49), share bars, next-turn indicator. | Faithful vector capture of the prototype's verified After state — the queue order is the exact output of `logic.js` in `tests/smoke.test.js` (PASS). |
| `generate-screenshots.js` | Regenerates both SVGs: `node screenshots/generate-screenshots.js` | — |

## Honesty note

- These are captures **of this prototype**, never of the real Spotify app. No real Spotify screenshot is used or imitated as evidence anywhere in this pack; the Before image is explicitly a recreation with sample data and says so in the image.
- They are SVG renders, not browser PNG captures, because the build sandbox has no headless browser (Chromium/Puppeteer install was attempted and the download timed out). The live prototype's Before and After screens match these states — run it and toggle / press Apply FairQueue to see the identical queues.

## Capture real PNGs in ~30 seconds (any browser)

1. `node server.js` in this folder, open `http://localhost:5173`
2. Click **"Before: Spotify Jam today"** → screenshot the window → `before.png`
3. Click **"After: + FairQueue"**, then **"⚖ Apply FairQueue — reorder fairly"** → screenshot → `after.png`
4. (Optional, stronger) Also capture after choosing *Maya → Add to queue* with Auto-Fair on, showing the toast "Added at fair position …"
