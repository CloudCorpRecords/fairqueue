# Demo video script — FairQueue for Spotify Jam (max 3:00)

**Format:** Screen recording of the live prototype (`node server.js` → http://localhost:5173), voiceover or captions. Target runtime **2:20–2:40**. Record the browser at a wide window so all three panels are visible.

| Time | On screen | Say / caption |
|---|---|---|
| 0:00–0:15 | Prototype open, "After" mode, unfair starting queue visible. Zoom on the queue's first 3 rows (all Rene). | "This is a Spotify Jam. Four friends, one queue — and one problem Spotify never fixed. Rene added three songs in a row. Aysha, Jordan and Maya? Their picks are stuck at the back, and they haven't played a single song yet." |
| 0:15–0:30 | Click **"Before: Spotify Jam today"**. Show the yellow banner and the "What's missing" list in your head — point at longest run: 3. | "This is Jam today. No turn order, no fairness rule, no fix — except arguing with your friends. The fastest tapper is the DJ. Everyone else is the audience." |
| 0:30–0:45 | Click **"After: + FairQueue"**. Point at the FairQueue panel: fairness score **49**. | "So I built the missing feature: FairQueue. Same Jam, plus one idea — the queue takes turns. Right now our fairness score is 49, because one person owns half the night." |
| 0:45–1:10 | Click **⚖ Apply FairQueue — reorder fairly**. Let the reordered queue settle; run your cursor down it: Aysha, Jordan, Maya, Rene, Jordan… Point at score **73** and "longest run: 1". | "One tap. Same nine songs, nobody's picks deleted, nobody's own order changed — but now it's a rotation. Aysha, Jordan, Maya, Rene. Everyone plays in every round. Longest run drops from three in a row to one, and fairness jumps to 73." |
| 1:10–1:35 | Add a song: member **Maya**, pick any catalog song, **Auto-Fair stays ON**, click **+ Add to queue**. Show the toast/explainer with its fair position. | "Adding a song is fair too. Maya adds a track and Auto-Fair slots it into the rotation where her turn actually falls — not dumped at the back of the line. And the app explains every move it makes. No silent shuffling." |
| 1:35–1:55 | Press **▶ Play Next** twice. Show Now Playing change, member counts and next-turn indicator update. | "As songs play, FairQueue keeps score — who's heard their picks, whose turn leads the next round. It recalculates live, every song." |
| 1:55–2:20 | Return to the full view. Briefly show the explainer line and the How-it-works list in the FairQueue panel. | "Under the hood it's simple: one song per person per round, the starting member rotates, and the people who've heard least go first. Spotify could ship this as a host toggle in Jam settings — it's just queue metadata they already have." |
| 2:20–2:40 | End card: FairQueue logo text + GitHub repo URL + disclosure line. | "FairQueue for Spotify Jam — built solo for Hack to the Future. The quiet person in your group session gets a turn now. Code's open source — link below. Built by AI agents directed by Rene Turcios, and disclosed as such." |

**Recording checklist**
- [ ] Browser zoom ~90–100%, all three panels visible, no personal tabs/notifications
- [ ] Start from a fresh page load so the queue is in the scripted starting state
- [ ] Don't speed up the Apply FairQueue moment — the reorder is the money shot, let it land
- [ ] Upload public or unlisted (YouTube / Vimeo / Loom) and paste the link into SUBMISSION.md + the Devpost form
- [ ] Total runtime under 3:00 — if a take runs long, trim the 1:35–1:55 section first
