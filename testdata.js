// World Skin — axis visual test data
// Purpose: verify per-axis dot-grid rendering by providing records whose
//   senseVector / textureModifier / soundVector values change predictably.
//
// Geographic layout (国分寺 centre, 8km radius):
//   Columns (west → east, 7 steps): axis value from -1 to +1
//   Rows    (north → south, 1 row per axis being tested)
//   3 records per position → field accumulates enough to be visible
//
// Usage: press T in the app to toggle test mode on/off.
//        In test mode, world records are replaced with these test records.
//        Normal world_data and my_data are never modified.
//
// Convention: one section is appended below after each v2-TODO is accepted.
//   v2-TODO 5  spaciousness  → Row 0 (northernmost)
//   v2-TODO 6  gravity       → Row 1
//   v2-TODO 7  tension       → Row 2
//   v2-TODO 8  flow          → Row 3
//   v2-TODO 9  soundVector   → Row 4
//   v2-TODO 10 textureModifier → Row 5

(function () {
  const CENTER = { lat: 35.7000, lng: 139.4808 };
  const D_LNG  =  0.0013;   // ~110 m east per column
  const D_LAT  = -0.0022;   // ~244 m south per row

  // 7 pole-to-pole steps: -1 → +1
  const POLES = [-1.00, -0.67, -0.33, 0.00, +0.33, +0.67, +1.00];

  const NEUTRAL_SV  = { spaciousness: 0, gravity: 0, tension: 0, flow: 0 };
  const NEUTRAL_TEX = { warmth: 0, roughness: 0, clarity: 0, dryness: 0 };
  const NEUTRAL_SND = { loudness: 0.35, turbulence: 0.18, sharpness: 0.30, continuity: 0.80, texture: 0.30 };

  const BASE_DATE = "2026-01-01T10:00:00.000Z";

  function makeRec(lat, lng, idx, sv, tex, snd) {
    return {
      id: `test-${idx}`,
      lat, lng,
      noise: 0.38, flux: 0.20, peak: 0.38,
      movement: "still", direction: 0, distance: 0,
      slot: "day",
      createdAt: BASE_DATE,
      word: null, selectedWords: [],
      senseVector:     Object.assign({}, NEUTRAL_SV,  sv  || {}),
      textureModifier: Object.assign({}, NEUTRAL_TEX, tex || {}),
      soundVector:     Object.assign({}, NEUTRAL_SND, snd || {}),
    };
  }

  // Build one row: rowIdx 0=north, 6=south.
  // svFn / texFn / sndFn receive the pole value v ∈ [-1,+1] and return a partial object.
  let _id = 0;
  function row(rowIdx, svFn, texFn, sndFn) {
    const recs = [];
    const lat0 = CENTER.lat + 0.0033 + rowIdx * D_LAT;
    POLES.forEach((v, col) => {
      const lng = CENTER.lng + (col - 3) * D_LNG;
      const sv  = svFn  ? svFn(v)  : {};
      const tex = texFn ? texFn(v) : {};
      const snd = sndFn ? sndFn(v) : {};
      // 3 records stacked in the same cell (tiny offset keeps IDs unique)
      for (let k = 0; k < 3; k++) {
        recs.push(makeRec(lat0 + k * 0.00003, lng + k * 0.00003, _id++, sv, tex, snd));
      }
    });
    return recs;
  }

  // ── v2-TODO 5 acceptance: spaciousness -1 → +1, all other axes neutral ✓ ─
  const ROW_SPACIOUSNESS = row(0, v => ({ spaciousness: v }));

  // ── v2-TODO 6 acceptance: gravity -1 → +1 ────────────────────────────────
  const ROW_GRAVITY = row(1, v => ({ gravity: v }));

  // ── v2-TODO 7 acceptance: tension -1 → +1 ────────────────────────────────
  const ROW_TENSION = row(2, v => ({ tension: v }));

  // ── v2-TODO 8 acceptance: flow -1 → +1 ───────────────────────────────────
  const ROW_FLOW = row(3, v => ({ flow: v }));

  // ── v2-TODO 9 acceptance: soundVector loudness 0 → 1, others neutral ─────
  const ROW_SOUND = row(4, null, null, v => ({ loudness: (v + 1) / 2 }));

  // ── v2-TODO 10 acceptance: textureModifier warmth -1 → +1 ────────────────
  const ROW_TEXTURE = row(5, null, v => ({ warmth: v }));

  const ALL_TEST_RECORDS = [
    ...ROW_SPACIOUSNESS,
    ...ROW_GRAVITY,
    ...ROW_TENSION,
    ...ROW_FLOW,
    ...ROW_SOUND,
    ...ROW_TEXTURE,
  ];

  window.TEST_SKIN_DATA = {
    meta:         { label: "axis-pole-test", version: "v1" },
    origin:       CENTER,
    radiusMeters: 3000,
    records:      ALL_TEST_RECORDS,
    corridors: [], zones: [], voids: [],
  };
})();
