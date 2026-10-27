# Devpost submission — ready to paste
Hackathon: **Hack to the Future** (https://hack-to-the-missing-future-ai.devpost.com/)
Deadline: **Oct 27, 2026, 5:00 PM ET / 2:00 PM PT**
Status: ☐ demo video link to add ☐ public GitHub repo link to add (local pack is complete; repo push + Devpost form are Rene/parent steps, not done by this build)

---

## 1. Project name + the app upgraded

**FairQueue for Spotify Jam**
App upgraded: **Spotify** (Spotify Jam group listening)

## 2. Problem statement (2–3 sentences)

In a Spotify Jam, anyone can add songs, but the queue is pure first-come-first-served with no turn order — one person can stack their songs at the front while everyone else's picks wait at the back. The quieter people in the room effectively never get a DJ turn, and the only fix today is arguing about it in person. FairQueue adds the missing fairness layer: the queue takes turns, one song per person per round.

## 3. Before / after

**Before (Spotify Jam today):** One member stacks 3 songs at positions 1–3; three other members have picks waiting and have played nothing. No fairness indicator, no turn order, no in-app fix. Longest same-person run: 3 in a row. Fairness score: 49.
*(See `screenshots/before.svg` — a labeled recreation of this state in the prototype, with sample data. No screenshot of the real Spotify app is used.)*

**After (with FairQueue):** The same nine songs are rebuilt as a rotation — Aysha → Jordan → Maya → Rene, rotating the starting member each round — so every member plays in every round, nobody's own song order changes, and the longest run drops to 1. A FairQueue panel shows a fairness score (73 after reorder), each member's share, who leads the next turn and why; newly added songs are inserted at their fair rotation slot automatically.
*(See `screenshots/after.svg` — capture of the prototype's After state; queue order is the verified output of the fairness logic.)*

## 4. Demo video (max 3 min)

**[PASTE VIDEO LINK HERE — YouTube / Vimeo / Loom, public or unlisted]**
Script, shot list and recording checklist: `DEMO.md` (target runtime 2:20–2:40). The video shows: the stacked "before" queue, one-tap FairQueue reorder (score 49 → 73), Auto-Fair song insert with its on-screen explanation, and Play Next advancing the Jam with live fairness updates.

## 5. Public GitHub repo

**[PASTE PUBLIC REPO LINK HERE]**
Repo contains the working prototype plus a README explaining how to run/view it: `node server.js`, then open http://localhost:5173 (zero dependencies; `index.html` also opens directly). README includes problem statement, before/after, how-it-works, smoke test instructions (`node tests/smoke.test.js`) and the build disclosure. MIT licensed.

## 6. How it works — tools / APIs / languages / AI models

- **Languages:** HTML, CSS, vanilla JavaScript — no framework, no dependencies
- **Runtime/hosting for the demo:** Node.js built-in `http` static server (`server.js`); no external APIs, no audio (song titles are text-only sample data)
- **Core logic (`logic.js`):** round-robin rotation (one song per member per round; rotation order by fewest songs already played, starting member rotates each round; per-member song order preserved), a 0–100 fairness score (share balance minus a run penalty), Auto-Fair insert positioning, and plain-language explainers for every queue change
- **Testing:** automated smoke test of the full feature flow (`tests/smoke.test.js`, Node `assert`)
- **AI tools/models:** the prototype was designed and coded by AI agents (Tree / Muse fleet) under Rene Turcios's direction — see the build disclosure below. No AI/ML APIs are called at runtime; the fairness logic is deterministic.

## 7. Team members

**Solo: Rene Turcios** (Devpost: CloudCorpRecords) — chose the app and the missing feature, directed the build, reviewed the result.

---

### Additional copy (if the form asks "anything else" / for the project page footer)

**Rollout:** FairQueue ships as a per-Jam host toggle ("Queue fairness") in existing Jam settings — it runs purely on queue metadata Spotify already has (who added each track, what's played), so it needs no audio, licensing or playback changes.

Build Disclosure: AI-built. This prototype was built by AI agents (Tree / Muse fleet) directed by Rene Turcios during the hackathon period. Rene chose the app, the missing feature, and reviewed the result; agents designed and coded the prototype.

**Honest limit:** if one member queues far more songs than everyone else combined, their surplus forms the tail once everyone else runs out of songs to rotate with. FairQueue guarantees equal turns per round — it can't interleave songs that don't exist.
