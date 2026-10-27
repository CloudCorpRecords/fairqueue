# FairQueue for Spotify Jam

**The app upgraded:** Spotify — specifically Spotify Jam (group listening sessions)
**The missing feature:** **FairQueue** — a turn-taking DJ for group listening. One song per person per round, so nobody can stack the queue and make everyone else wait.

> One-line pitch: Spotify Jam lets the fastest tapper run the whole night. FairQueue makes the queue take turns — same songs, same people, every voice in the room gets heard in rotation.

---

## Problem statement

In a Spotify Jam, anyone can add songs, but the queue is pure first-come-first-served with no turn order — one person can stack three, five, ten of their songs at the front while everyone else's picks wait at the back. The quieter people in the room effectively don't get a DJ turn, and the only fix today is arguing about it in person. Group listening is social, but Spotify's queue has no concept of fairness.

## Before / After

**Before — Spotify Jam today (what the prototype's "Before" mode recreates, with sample data):**
One member (Rene) adds three songs in a row; they sit at positions 1, 2 and 3. Aysha, Jordan and Maya each have picks waiting behind them and haven't played a single song yet. There is no fairness indicator, no turn order, and no in-app way to fix the stack. Longest same-person run: **3 in a row**. Fairness score (model below): **49**.

**After — with FairQueue (the prototype's "After" mode, after pressing "Apply FairQueue"):**
The *same nine songs* are rebuilt as a rotation: Aysha → Jordan → Maya → Rene, then the starting member rotates (Jordan → Maya → Rene → Aysha), then Rene's last pick. Every member plays in every round, nobody's own song order changes, and the longest same-person run drops to **1**. Fairness score: **73**. A FairQueue panel shows each member's share, who's next and why, and every reorder explains itself in plain language.

Captures of both states are in `screenshots/` (`before.svg`, `after.svg` — labeled vector captures of this prototype; see `screenshots/SCREENSHOTS.md` for status and how to grab PNGs from the live app in 30 seconds). No screenshot of the real Spotify app is used anywhere — the "before" is an honest recreation with sample data.

## How to run

Zero dependencies. Needs only Node.js (any modern version):

```bash
node server.js
# then open http://localhost:5173
```

(Or simply open `index.html` in a browser — everything is static.)

**Try the feature flow (60 seconds):**
1. The Jam opens deliberately unfair: Rene stacked 3 songs at the front.
2. Toggle **"Before: Spotify Jam today"** to see the problem state.
3. Toggle back to **"After: + FairQueue"** and press **⚖ Apply FairQueue — reorder fairly**. Watch the queue interleave and the fairness score jump 49 → 73.
4. Add a song (pick a member + a song, or type your own `Title — Artist`). With **Auto-Fair on**, it lands at its fair rotation slot, not the back of the line — and the app tells you exactly where and why.
5. Press **▶ Play Next** — the queue advances, played history updates, and the next rotation + fairness score recalculate live.

## How it works

- **Rotation algorithm** (`logic.js`, pure and unit-tested): members take turns in rounds — one song per member per round. Rotation order is set by who has heard least so far (fewest songs already played; ties by who queued first), and the starting member rotates by one each round so first-pick privilege circulates. A member's own song order is never changed.
- **Fairness score** (0–100): a share-balance score over songs played + queued per member, minus 12 points per extra song in the longest same-member run in the upcoming queue. Stacking literally costs points; fair ordering earns them back.
- **Auto-Fair insert:** a newly added song is placed by simulating the fair reorder, so it joins the rotation at its fair slot instead of dumping at the end.
- **Explainers:** every reorder/insert states the reason in the UI ("placed at position 4 — Maya has heard least so far"), because a queue that moves songs silently would feel like a bug, not a feature.
- **Known limit (honest):** if one member queues far more songs than everyone else *combined*, their surplus forms the tail once everyone else has run out of songs to rotate with. No ordering can interleave songs that don't exist — FairQueue's guarantee is equal turns per round, not magic.
- **Tools / languages / AI:** HTML, CSS, vanilla JavaScript (no framework, no dependencies), Node.js built-in `http` server for local hosting. No external APIs and no audio — song titles are sample data only. Prototype designed and coded by AI agents (see disclosure below); the fairness logic is covered by an automated smoke test.

## Smoke test

```bash
node tests/smoke.test.js
```

Verifies the full feature flow against the exact sample data in the app: stacked queue (run = 3, score 49) → FairQueue reorder (run = 1, score 73, one turn per member per round, per-member order preserved) → Auto-Fair insert (new song lands in a late rotation slot, full rounds intact) → Play Next bookkeeping (share counts total correctly). Exit 0 = pass.

## How Spotify could ship it

FairQueue is a per-Jam host toggle in the existing Jam settings ("Queue fairness: On"), defaulting to on for Jams with 3+ people — it operates purely on queue metadata Spotify already has (who added each track, what's played), needs no audio or licensing changes, and can roll out as an ordering layer over the current queue without touching playback.

## Credits

- **Team:** Solo — Rene Turcios (direction, app/feature selection, review)
- Sample song titles belong to their respective artists; used as text-only sample data. This is a concept prototype for a hackathon and is **not affiliated with Spotify**.

## Build Disclosure

Build Disclosure: AI-built. This prototype was built by AI agents (Tree / Muse fleet) directed by Rene Turcios during the hackathon period. Rene chose the app, the missing feature, and reviewed the result; agents designed and coded the prototype.

## License

MIT — see `LICENSE`.
