'use strict';
/**
 * Generates before.svg / after.svg — faithful vector captures of the two
 * prototype states (same layout, colors, sample data and queue orders the
 * live app shows, verified by tests/smoke.test.js). Used because the build
 * sandbox has no headless browser; see SCREENSHOTS.md for how to capture
 * PNG screenshots from the live prototype in any real browser.
 * Run: node screenshots/generate-screenshots.js
 */
const fs = require('fs');
const path = require('path');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const C = { bg: '#121212', panel: '#181818', panel2: '#1f1f1f', line: '#2a2a2a', text: '#ffffff', muted: '#b3b3b3', green: '#1db954' };
const MEMBER = { rene: ['Rene', '#1db954'], aysha: ['Aysha', '#e13300'], maya: ['Maya', '#7358ff'], jordan: ['Jordan', '#e8115b'] };

const START_QUEUE = [
  ['Espresso', 'Sabrina Carpenter', 'rene'], ['As It Was', "Harry Styles", 'rene'], ['Midnight City', 'M83', 'rene'],
  ['Birds of a Feather', 'Billie Eilish', 'aysha'], ['Get Lucky', 'Daft Punk ft. Pharrell Williams', 'jordan'], ['Golden Hour', 'JVKE', 'maya'],
  ['Bad Guy', 'Billie Eilish', 'aysha'], ['Uptown Funk', 'Mark Ronson ft. Bruno Mars', 'jordan'], ['Sunflower', 'Post Malone & Swae Lee', 'maya']
];
// Exact output of FairQueue.fairReorder in tests/smoke.test.js (PASS, 2026-10-26)
const FAIR_QUEUE = [
  ['Birds of a Feather', 'Billie Eilish', 'aysha'], ['Get Lucky', 'Daft Punk ft. Pharrell Williams', 'jordan'], ['Golden Hour', 'JVKE', 'maya'],
  ['Espresso', 'Sabrina Carpenter', 'rene'], ['Uptown Funk', 'Mark Ronson ft. Bruno Mars', 'jordan'], ['Sunflower', 'Post Malone & Swae Lee', 'maya'],
  ['As It Was', "Harry Styles", 'rene'], ['Bad Guy', 'Billie Eilish', 'aysha'], ['Midnight City', 'M83', 'rene']
];

function queueRows(queue, x, y, w) {
  return queue.map((q, i) => {
    const yy = y + i * 46;
    const [name, color] = MEMBER[q[2]];
    return `<rect x="${x}" y="${yy}" width="${w}" height="38" rx="9" fill="${C.panel2}"/>` +
      `<rect x="${x}" y="${yy}" width="4" height="38" fill="${color}"/>` +
      `<text x="${x + 16}" y="${yy + 24}" fill="${C.muted}" font-size="13" font-weight="bold">${i + 1}</text>` +
      `<text x="${x + 42}" y="${yy + 17}" fill="${C.text}" font-size="13.5" font-weight="bold">${esc(q[0])}</text>` +
      `<text x="${x + 42}" y="${yy + 32}" fill="${C.muted}" font-size="11">${esc(q[1])}</text>` +
      `<rect x="${x + w - 86}" y="${yy + 9}" width="74" height="20" rx="10" fill="${color}"/>` +
      `<text x="${x + w - 49}" y="${yy + 23}" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">${name}</text>`;
  }).join('\n');
}

function frame(title, badge, badgeColor, bannerFill, bannerStroke, bannerText, queue, rightPanel) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1240" height="640" viewBox="0 0 1240 640" font-family="Helvetica, Arial, sans-serif">
<rect width="1240" height="640" fill="${C.bg}"/>
<rect width="1240" height="58" fill="#000"/>
<circle cx="34" cy="29" r="13" fill="${C.green}"/><text x="56" y="36" fill="#fff" font-size="20" font-weight="800">Spotify</text>
<rect x="148" y="19" width="44" height="20" rx="10" fill="${C.green}"/><text x="170" y="33" fill="#000" font-size="11" font-weight="bold" text-anchor="middle">JAM</text>
<rect x="830" y="14" width="386" height="30" rx="15" fill="${badgeColor}"/><text x="1023" y="34" fill="#000" font-size="13.5" font-weight="800" text-anchor="middle">${badge}</text>
<rect x="20" y="76" width="300" height="540" rx="14" fill="${C.panel}" stroke="${C.line}"/>
<text x="40" y="108" fill="#fff" font-size="17" font-weight="bold">Now Playing</text>
<rect x="40" y="124" width="260" height="150" rx="12" fill="#14532d"/><text x="170" y="222" fill="#fff" font-size="56" text-anchor="middle">♪</text>
<text x="40" y="302" fill="#fff" font-size="18" font-weight="800">Levitating</text>
<text x="40" y="322" fill="${C.muted}" font-size="13">Dua Lipa</text>
<text x="40" y="344" fill="${C.muted}" font-size="12.5">Added by ● Rene</text>
<rect x="40" y="362" width="120" height="30" rx="15" fill="${C.green}"/><text x="100" y="382" fill="#000" font-size="12.5" font-weight="800" text-anchor="middle">▶ Play Next</text>
<text x="40" y="428" fill="#fff" font-size="14.5" font-weight="bold">Jam members</text>
${[['Rene', '#1db954', '5 played + queued'], ['Aysha', '#e13300', '2 played + queued'], ['Maya', '#7358ff', '2 played + queued'], ['Jordan', '#e8115b', '2 played + queued']].map((m, i) =>
    `<rect x="40" y="${442 + i * 40}" width="260" height="32" rx="9" fill="${C.panel2}"/><circle cx="56" cy="${458 + i * 40}" r="5" fill="${m[1]}"/><text x="68" y="${463 + i * 40}" fill="#fff" font-size="13">${m[0]}</text><text x="290" y="${463 + i * 40}" fill="${C.muted}" font-size="11.5" text-anchor="end">${m[2]}</text>`).join('\n')}
<rect x="336" y="76" width="520" height="540" rx="14" fill="${C.panel}" stroke="${C.line}"/>
<text x="356" y="108" fill="#fff" font-size="17" font-weight="bold">Up Next · 9 songs</text>
<rect x="356" y="120" width="480" height="42" rx="9" fill="${bannerFill}" stroke="${bannerStroke}"/><text x="368" y="146" fill="${bannerText}" font-size="12.5">${bannerText === '#ffd94d' ? '⚠' : '✓'} ${title}</text>
${queueRows(queue, 356, 176, 480)}
${rightPanel}
<text x="620" y="634" fill="${C.muted}" font-size="11" text-anchor="middle">FairQueue prototype — recreation with sample data. Not affiliated with Spotify. No real Spotify screenshot is used anywhere in this pack.</text>
</svg>`;
}

const beforeRight = `
<rect x="872" y="76" width="348" height="540" rx="14" fill="${C.panel}" stroke="${C.line}"/>
<text x="892" y="108" fill="#fff" font-size="17" font-weight="bold">What's missing</text>
<text x="892" y="140" fill="${C.muted}" font-size="13.5">Spotify Jam today:</text>
${['✗ No turn order — first to tap, first played', '✗ No limit on stacking songs in a row', '✗ No fairness view for the group', '✗ Quiet members wait behind one loud queue', '✗ No way to fix it except arguing in chat'].map((s, i) => `<text x="892" y="${172 + i * 30}" fill="#e8e8e8" font-size="13.5">${s}</text>`).join('\n')}
<rect x="892" y="330" width="308" height="86" rx="10" fill="#3a2b00" stroke="#6b5200"/>
<text x="906" y="358" fill="#ffd94d" font-size="13.5" font-weight="bold">Longest same-person run: 3 in a row</text>
<text x="906" y="380" fill="#ffd94d" font-size="12.5">Rene's picks play at positions 1, 2 and 3 —</text>
<text x="906" y="398" fill="#ffd94d" font-size="12.5">Aysha, Jordan and Maya haven't played yet.</text>
<text x="892" y="452" fill="${C.muted}" font-size="12.5">This panel does not exist in Spotify today.</text>
<text x="892" y="472" fill="${C.muted}" font-size="12.5">FairQueue (right panel in the “after” capture)</text>
<text x="892" y="492" fill="${C.muted}" font-size="12.5">is the proposed feature.</text>`;

const shares = [['Rene', '#1db954', 5, 45], ['Aysha', '#e13300', 2, 18], ['Jordan', '#e8115b', 2, 18], ['Maya', '#7358ff', 2, 18]];
const afterRight = `
<rect x="872" y="76" width="348" height="540" rx="14" fill="${C.panel}" stroke="${C.line}"/>
<text x="892" y="108" fill="#fff" font-size="17" font-weight="bold">⚖ FairQueue</text>
<rect x="892" y="122" width="308" height="86" rx="10" fill="${C.panel2}"/>
<text x="1046" y="168" fill="${C.green}" font-size="40" font-weight="900" text-anchor="middle">73</text>
<text x="1046" y="192" fill="${C.muted}" font-size="11.5" text-anchor="middle">Fairness score (was 49 stacked)</text>
${shares.map((s, i) => {
    const yy = 232 + i * 42;
    return `<text x="892" y="${yy}" fill="#fff" font-size="12.5"><tspan fill="${s[1]}">● </tspan>${s[0]}</text><text x="1200" y="${yy}" fill="${C.muted}" font-size="12" text-anchor="end">${s[2]} songs · ${s[3]}%</text><rect x="892" y="${yy + 7}" width="308" height="8" rx="4" fill="#333"/><rect x="892" y="${yy + 7}" width="${Math.round(308 * s[3] / 100)}" height="8" rx="4" fill="${s[1]}"/>`;
  }).join('\n')}
<rect x="892" y="408" width="308" height="64" rx="10" fill="#0f2e1a" stroke="#14532d"/>
<text x="906" y="434" fill="#fff" font-size="13">Next turn leads with: <tspan font-weight="800">Aysha</tspan></text>
<text x="906" y="454" fill="${C.muted}" font-size="12">Fewest picks played so far (0).</text>
<text x="892" y="500" fill="${C.muted}" font-size="12.5">One song per person per round. Starting</text>
<text x="892" y="519" fill="${C.muted}" font-size="12.5">member rotates each round. Nobody's own</text>
<text x="892" y="538" fill="${C.muted}" font-size="12.5">song order ever changes.</text>
<rect x="892" y="556" width="308" height="34" rx="17" fill="${C.green}"/><text x="1046" y="578" fill="#000" font-size="13" font-weight="800" text-anchor="middle">⚖ Apply FairQueue</text>`;

fs.writeFileSync(path.join(__dirname, 'before.svg'),
  frame('Rene stacked 3 songs at the front — everyone else waits.',
    'BEFORE — Spotify Jam today (prototype recreation)', '#f5c518', '#3a2b00', '#6b5200', '#ffd94d', START_QUEUE, beforeRight));
fs.writeFileSync(path.join(__dirname, 'after.svg'),
  frame('Same songs, same people — the queue now takes turns.',
    'AFTER — with FairQueue applied in the prototype', '#1db954', '#0f2e1a', '#14532d', '#7ee2a0', FAIR_QUEUE, afterRight));
console.log('Wrote screenshots/before.svg and screenshots/after.svg');
