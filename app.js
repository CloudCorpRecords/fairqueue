'use strict';
/* FairQueue prototype UI — all state is local sample data. */

var MEMBERS = [
  { id: 'rene',   name: 'Rene',   color: '#1db954' },
  { id: 'aysha',  name: 'Aysha',  color: '#e13300' },
  { id: 'maya',   name: 'Maya',   color: '#7358ff' },
  { id: 'jordan', name: 'Jordan', color: '#e8115b' }
];
var MEMBER_IDS = MEMBERS.map(function (m) { return m.id; });
function memberById(id) { return MEMBERS.filter(function (m) { return m.id === id; })[0]; }

var CATALOG = [
  { title: 'Espresso', artist: 'Sabrina Carpenter' },
  { title: 'Birds of a Feather', artist: 'Billie Eilish' },
  { title: 'Levitating', artist: 'Dua Lipa' },
  { title: 'Blinding Lights', artist: 'The Weeknd' },
  { title: 'As It Was', artist: "Harry Styles" },
  { title: 'Midnight City', artist: 'M83' },
  { title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell Williams' },
  { title: 'Lose Yourself', artist: 'Eminem' },
  { title: 'Bad Guy', artist: 'Billie Eilish' },
  { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
  { title: 'Golden Hour', artist: 'JVKE' },
  { title: 'Sunflower', artist: 'Post Malone & Swae Lee' }
];

var seq = 0;
function track(title, artist, addedBy) { return { id: ++seq, title: title, artist: artist, addedBy: addedBy }; }

// Deliberately unfair starting state: Rene stacked the queue before anyone
// else got a turn — exactly what happens in a real Jam today.
var state = {
  mode: 'after', // 'before' | 'after'
  nowPlaying: track('Levitating', 'Dua Lipa', 'rene'),
  played: [track('Blinding Lights', 'The Weeknd', 'rene')],
  queue: [
    track('Espresso', 'Sabrina Carpenter', 'rene'),
    track('As It Was', "Harry Styles", 'rene'),
    track('Midnight City', 'M83', 'rene'),
    track('Birds of a Feather', 'Billie Eilish', 'aysha'),
    track('Get Lucky', 'Daft Punk ft. Pharrell Williams', 'jordan'),
    track('Golden Hour', 'JVKE', 'maya'),
    track('Bad Guy', 'Billie Eilish', 'aysha'),
    track('Uptown Funk', 'Mark Ronson ft. Bruno Mars', 'jordan'),
    track('Sunflower', 'Post Malone & Swae Lee', 'maya')
  ],
  lastMovedIds: []
};

var $ = function (id) { return document.getElementById(id); };

function explain(html) { var el = $('explainer'); if (el) el.innerHTML = html; }
function toast(msg) { var el = $('toast'); if (el) { el.textContent = msg; setTimeout(function(){ if(el.textContent===msg) el.textContent=''; }, 6000); } }

function render() {
  document.body.classList.toggle('mode-before', state.mode === 'before');
  document.body.classList.toggle('mode-after', state.mode === 'after');
  $('btn-before').classList.toggle('active', state.mode === 'before');
  $('btn-after').classList.toggle('active', state.mode === 'after');

  // Now playing
  $('np-title').textContent = state.nowPlaying.title;
  $('np-artist').textContent = state.nowPlaying.artist;
  var npBy = memberById(state.nowPlaying.addedBy);
  $('np-added').innerHTML = 'Added by <span class="member-dot" style="background:' + npBy.color + '"></span>' + npBy.name;
  $('progress-bar').style.width = (20 + (state.played.length * 13) % 65) + '%';

  // Members + counts
  var playedAll = state.played.concat([state.nowPlaying]);
  var counts = FairQueue.countsByMember(state.queue, playedAll);
  $('members-list').innerHTML = MEMBERS.map(function (m) {
    return '<li><span><span class="member-dot" style="background:' + m.color + '"></span>' + m.name + '</span>' +
      '<span class="cnt">' + (counts[m.id] || 0) + ' played + queued</span></li>';
  }).join('');

  // Queue
  $('queue-count').textContent = '· ' + state.queue.length + ' songs';
  $('queue-list').innerHTML = state.queue.map(function (t, i) {
    var m = memberById(t.addedBy);
    var moved = state.lastMovedIds.indexOf(t.id) !== -1 ? ' class="moved"' : '';
    return '<li' + moved + ' style="border-left-color:' + m.color + '"><span class="pos">' + (i + 1) + '</span>' +
      '<span class="song"><b>' + escapeHtml(t.title) + '</b><span>' + escapeHtml(t.artist) + '</span></span>' +
      '<span class="who" style="background:' + m.color + '">' + m.name + '</span></li>';
  }).join('');

  if (state.mode === 'before') {
    var run = FairQueue.maxRun(state.queue);
    $('problem-banner').innerHTML = '⚠ <strong>Before:</strong> Rene has 3 songs stacked at the front. Aysha, Maya and Jordan wait behind them — ' +
      'longest same-person run in queue: <strong>' + run + ' in a row</strong>. Spotify Jam today has no fairness rule, no turn order, no fix.';
    return;
  }

  // FairQueue panel
  $('problem-banner').innerHTML = '✓ <strong>After:</strong> FairQueue is on. Same songs, same people — the queue just takes turns. ' +
    'Longest same-person run now: <strong>' + FairQueue.maxRun(state.queue) + '</strong>.';
  var score = FairQueue.fairnessScore(state.queue, playedAll, MEMBER_IDS);
  $('score-num').textContent = score;
  $('score-num').style.color = score >= 75 ? '#1db954' : (score >= 50 ? '#f5c518' : '#e22134');
  var sh = FairQueue.shares(state.queue, playedAll, MEMBER_IDS);
  $('share-bars').innerHTML = MEMBERS.map(function (m) {
    var s = sh[m.id];
    return '<div class="share-row"><div class="lbl"><span><span class="member-dot" style="background:' + m.color + '"></span>' + m.name + '</span><span>' + s.count + ' songs · ' + s.pct + '%</span></div>' +
      '<div class="share-track"><div class="share-fill" style="width:' + s.pct + '%;background:' + m.color + '"></div></div></div>';
  }).join('');
  var nextId = FairQueue.nextUpMember(state.queue, playedAll, MEMBER_IDS);
  var next = memberById(nextId);
  $('next-up-name').textContent = next.name;
  var playedCounts = FairQueue.countsByMember([], playedAll);
  $('next-up-why').textContent = next.name + ' has heard the fewest of their own picks so far (' + (playedCounts[nextId] || 0) + ' played), so they lead the next FairQueue rotation.';
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

function applyFair(source) {
  var beforeOrder = state.queue.map(function (t) { return t.id; });
  var playedAll = state.played.concat([state.nowPlaying]);
  state.queue = FairQueue.fairReorder(state.queue, playedAll);
  var afterOrder = state.queue.map(function (t) { return t.id; });
  state.lastMovedIds = afterOrder.filter(function (id, i) { return id !== beforeOrder[i]; });
  var first = state.queue[0];
  explain('FairQueue rebuilt the queue as a <strong>rotation</strong>: one song per person per round, starting with the people who have heard least so far. ' +
    (first ? 'First up is now <strong>' + escapeHtml(first.title) + '</strong> by ' + memberById(first.addedBy).name +
    ' instead of a second and third Rene song in a row. ' : '') +
    'Nobody\'s own song order changed — only whose turn it is.');
  toast(source === 'auto' ? 'Auto-Fair kept the queue fair.' : 'Queue reordered fairly ✓');
  render();
}

function addSong() {
  var memberId = $('sel-member').value;
  var custom = $('inp-custom').value.trim();
  var picked;
  if (custom) {
    var parts = custom.split('—').map(function (s) { return s.trim(); });
    if (parts.length === 1) parts = custom.split(' - ').map(function (s) { return s.trim(); });
    picked = { title: parts[0] || 'Untitled', artist: parts[1] || 'Unknown artist' };
  } else {
    var idx = parseInt($('sel-song').value, 10);
    picked = CATALOG[idx];
  }
  var t = track(picked.title, picked.artist, memberId);
  var autoFair = state.mode === 'after' && $('chk-autofair').checked;
  if (autoFair) {
    var playedAll = state.played.concat([state.nowPlaying]);
    var pos = FairQueue.fairInsertIndex(state.queue, playedAll, t);
    var reordered = FairQueue.fairReorder(state.queue.concat([t]), playedAll);
    state.queue = reordered;
    state.lastMovedIds = [t.id];
    explain('<strong>' + escapeHtml(t.title) + '</strong> by ' + memberById(memberId).name +
      ' was placed at position <strong>' + (pos + 1) + '</strong>, not dumped at the end — Auto-Fair inserted it at its fair turn.');
    toast('Added at fair position ' + (pos + 1) + ' ✓');
  } else {
    state.queue.push(t);
    state.lastMovedIds = [t.id];
    explain('<strong>' + escapeHtml(t.title) + '</strong> added by ' + memberById(memberId).name + ' at the end of the queue (position ' + state.queue.length + ').' +
      (state.mode === 'after' ? ' Turn Auto-Fair on or press “Apply FairQueue” to place it fairly.' : ' In Spotify Jam today, this is the only option: last in, last played.'));
    toast('Added to queue');
  }
  $('inp-custom').value = '';
  render();
}

function playNext() {
  if (!state.queue.length) { toast('Queue is empty — add a song first.'); return; }
  state.played.push(state.nowPlaying);
  state.nowPlaying = state.queue.shift();
  state.lastMovedIds = [];
  explain('<strong>' + escapeHtml(state.nowPlaying.title) + '</strong> is now playing. Played history updated — the next rotation order and fairness score now count this song for ' + memberById(state.nowPlaying.addedBy).name + '.');
  render();
}

function init() {
  $('sel-member').innerHTML = MEMBERS.map(function (m) { return '<option value="' + m.id + '">' + m.name + '</option>'; }).join('');
  $('sel-song').innerHTML = CATALOG.map(function (s, i) { return '<option value="' + i + '">' + escapeHtml(s.title) + ' — ' + escapeHtml(s.artist) + '</option>'; }).join('');
  $('btn-before').addEventListener('click', function () { state.mode = 'before'; state.lastMovedIds = []; render(); });
  $('btn-after').addEventListener('click', function () { state.mode = 'after'; render(); });
  $('btn-fair').addEventListener('click', function () { applyFair('manual'); });
  $('btn-add').addEventListener('click', addSong);
  $('btn-playnext').addEventListener('click', playNext);
  $('btn-skip').addEventListener('click', playNext);
  $('btn-prev').addEventListener('click', function () { toast('Demo: previous is disabled — use Play Next to advance the Jam.'); });
  render();
  explain('This Jam starts unfair on purpose: Rene stacked 3 songs up front. Press <strong>“Apply FairQueue”</strong> and watch the same queue take turns — Aysha, Jordan and Maya move up without deleting anyone\'s picks.');
}
document.addEventListener('DOMContentLoaded', init);
