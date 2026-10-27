/**
 * FairQueue logic — pure, dependency-free. Works in browser (window.FairQueue)
 * and in Node (module.exports) so it can be smoke-tested headlessly.
 *
 * The fairness model — round-robin rotation:
 * - Members take turns in rounds. In every full round, each member with
 *   songs left gets exactly ONE song before the next round starts, so no
 *   one gets a second turn while someone else is still waiting for a first.
 * - Round order is set by who has heard least so far: members sort by
 *   songs already played (fewest first), ties break by who queued first.
 *   That is why, in the demo, the three members who haven't played yet
 *   open the rotation ahead of the person who stacked the queue.
 * - Inside one member, their own song order is never changed.
 * - fairnessScore() returns 0-100: a share-balance score (100 when every
 *   member's played+queued share is equal) minus 12 points for every
 *   extra song in the longest same-member run in the upcoming queue —
 *   stacking the queue literally costs fairness points, reordering
 *   fairly earns them back.
 */
(function (global) {
  'use strict';

  function countsByMember(queue, played) {
    var counts = {};
    (played || []).forEach(function (t) { counts[t.addedBy] = (counts[t.addedBy] || 0) + 1; });
    (queue || []).forEach(function (t) { counts[t.addedBy] = (counts[t.addedBy] || 0) + 1; });
    return counts;
  }

  function fairnessScore(queue, played, memberIds) {
    if (!memberIds || memberIds.length === 0) return 100;
    var counts = countsByMember(queue, played);
    var values = memberIds.map(function (id) { return counts[id] || 0; });
    var total = values.reduce(function (a, b) { return a + b; }, 0);
    if (total === 0) return 100;
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    var spread = (max - min) / total;
    var shareScore = 100 * (1 - spread);
    var runPenalty = Math.max(0, maxRun(queue) - 1) * 12;
    var score = Math.round(shareScore - runPenalty);
    return Math.max(0, Math.min(100, score));
  }

  function shares(queue, played, memberIds) {
    var counts = countsByMember(queue, played);
    var total = memberIds.reduce(function (a, id) { return a + (counts[id] || 0); }, 0);
    var out = {};
    memberIds.forEach(function (id) {
      out[id] = {
        count: counts[id] || 0,
        pct: total === 0 ? 0 : Math.round(((counts[id] || 0) / total) * 100)
      };
    });
    return out;
  }

  function nextUpMember(queue, played, memberIds) {
    // The head of the FairQueue rotation among members who actually have
    // a song queued: fewest played so far, tie-break by first queued song.
    var playedCounts = {};
    (played || []).forEach(function (t) { playedCounts[t.addedBy] = (playedCounts[t.addedBy] || 0) + 1; });
    var firstSeen = {};
    (queue || []).forEach(function (t, i) { if (!(t.addedBy in firstSeen)) firstSeen[t.addedBy] = i; });
    var candidates = memberIds.filter(function (id) { return id in firstSeen; });
    if (!candidates.length) candidates = memberIds.slice();
    candidates.sort(function (a, b) {
      var dp = (playedCounts[a] || 0) - (playedCounts[b] || 0);
      if (dp !== 0) return dp;
      return (firstSeen[a] === undefined ? 999 : firstSeen[a]) - (firstSeen[b] === undefined ? 999 : firstSeen[b]);
    });
    return candidates[0] || null;
  }

  function fairReorder(queue, played) {
    var playedCounts = {};
    (played || []).forEach(function (t) { playedCounts[t.addedBy] = (playedCounts[t.addedBy] || 0) + 1; });

    // group queued tracks by member, preserving each member's own order,
    // and remember where each member first appears in the raw queue
    var byMember = {}, firstSeen = {};
    queue.forEach(function (t, i) {
      if (!byMember[t.addedBy]) { byMember[t.addedBy] = []; firstSeen[t.addedBy] = i; }
      byMember[t.addedBy].push(t);
    });

    // rotation order: fewest songs already played first (they've waited
    // longest), ties break by who queued first
    var rotation = Object.keys(byMember).sort(function (a, b) {
      var dp = (playedCounts[a] || 0) - (playedCounts[b] || 0);
      if (dp !== 0) return dp;
      return firstSeen[a] - firstSeen[b];
    });

    // round-robin: one song per member per round until everyone runs out.
    // The starting member rotates by one each round (a real turn-taking
    // circle — the "first pick" privilege circulates), which also spreads
    // out a surplus member's extra songs instead of bunching them at the
    // end. The only possible same-member run is at the very tail, when
    // just one member still has songs left — which no ordering can avoid.
    var result = [];
    var remaining = queue.length;
    var round = 0;
    var guard = 0;
    while (remaining > 0 && guard++ < 10000) {
      var progressed = false;
      var offset = rotation.length ? round % rotation.length : 0;
      for (var k = 0; k < rotation.length && remaining > 0; k++) {
        var id = rotation[(offset + k) % rotation.length];
        if (byMember[id].length) {
          result.push(byMember[id].shift());
          remaining--;
          progressed = true;
        }
      }
      if (!progressed) break;
      round++;
    }
    return result;
  }

  // Where a new track would land if Auto-Fair is ON: simulate the fair
  // position by fair-reordering queue+newTrack and reporting the index.
  function fairInsertIndex(queue, played, newTrack) {
    var reordered = fairReorder(queue.concat([newTrack]), played);
    for (var i = 0; i < reordered.length; i++) if (reordered[i] === newTrack) return i;
    return reordered.length - 1;
  }

  function maxRun(queue) {
    var best = 0, run = 0, last = null;
    (queue || []).forEach(function (t) {
      run = t.addedBy === last ? run + 1 : 1;
      last = t.addedBy;
      if (run > best) best = run;
    });
    return best;
  }

  var api = {
    countsByMember: countsByMember,
    fairnessScore: fairnessScore,
    shares: shares,
    nextUpMember: nextUpMember,
    fairReorder: fairReorder,
    fairInsertIndex: fairInsertIndex,
    maxRun: maxRun
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  global.FairQueue = api;
})(typeof window !== 'undefined' ? window : globalThis);
