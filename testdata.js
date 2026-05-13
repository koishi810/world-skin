// World Skin — axis visual test data
// Purpose: verify per-axis dot-grid rendering by providing records whose
//   senseVector / textureModifier / soundVector values change predictably.
//
// Geographic layout (国分寺 centre, 8km radius):
//   Columns (west → east, 7 zones): axis value from -1 to +1
//   Each zone: 20 records in a 4×5 sub-grid (~40m × 54m patch)
//   Zone spacing: 0.003° lng ≈ 270m  (sigma ≈ 120m → cross-bleed < 8%)
//   Row spacing:  0.005° lat ≈ 555m  (prevents row-to-row bleeding)
//   noise: 0.65 (strong signal so field builds up clearly)
//
// Usage: press T in the app to toggle test mode on/off.
//
// Convention: ROW_* comment gets ✓ appended after each axis is verified.
//   v2-TODO 5  spaciousness  → Row 0 (northernmost)
//   v2-TODO 6  gravity       → Row 1
//   v2-TODO 7  tension       → Row 2
//   v2-TODO 8  flow          → Row 3
//   v2-TODO 9  soundVector   → Row 4
//   v2-TODO 10 textureModifier → Row 5

(function () {
  const CENTER = { lat: 35.7000, lng: 139.4808 };

  // Zone spacing: 270m apart — cross-bleed = exp(-270²/(2×120²)) ≈ 7%
  const D_LNG_ZONE = 0.0030;  // ~270 m east per zone
  const D_LAT_ROW  = -0.0050; // ~555 m south per axis row

  // 7 pole-to-pole steps: -1 → +1
  const POLES = [-1.00, -0.67, -0.33, 0.00, +0.33, +0.67, +1.00];

  // 4×5 sub-grid offsets within each zone (degrees)
  // lat offsets: 4 rows at ±0.00012° (~13 m apart)
  // lng offsets: 5 cols at ±0.00015° (~13 m apart)
  const SUB_LAT = [-1.5, -0.5, +0.5, +1.5].map(k => k * 0.00012);
  const SUB_LNG = [-2, -1, 0, +1, +2].map(k => k * 0.00015);

  const NEUTRAL_SV  = { spaciousness: 0, gravity: 0, tension: 0, flow: 0 };
  const NEUTRAL_TEX = { warmth: 0, roughness: 0, clarity: 0, dryness: 0 };
  const NEUTRAL_SND = { loudness: 0.50, turbulence: 0.20, sharpness: 0.30, continuity: 0.80, texture: 0.30 };

  const BASE_DATE = "2026-01-01T10:00:00.000Z";

  let _id = 0;
  function makeRec(lat, lng, sv, tex, snd) {
    return {
      id: `test-${_id++}`,
      lat, lng,
      noise: 0.65, flux: 0.22, peak: 0.60,
      movement: "still", direction: 0, distance: 0,
      slot: "day",
      createdAt: BASE_DATE,
      word: null, selectedWords: [],
      senseVector:     Object.assign({}, NEUTRAL_SV,  sv  || {}),
      textureModifier: Object.assign({}, NEUTRAL_TEX, tex || {}),
      soundVector:     Object.assign({}, NEUTRAL_SND, snd || {}),
    };
  }

  // Build one axis row.
  // rowIdx 0 = northernmost. svFn / texFn / sndFn receive pole value v ∈ [-1,+1].
  function axisRow(rowIdx, svFn, texFn, sndFn) {
    const recs = [];
    const lat0 = CENTER.lat + 0.0125 + rowIdx * D_LAT_ROW;
    POLES.forEach((v, col) => {
      const lng0 = CENTER.lng + (col - 3) * D_LNG_ZONE;
      const sv  = svFn  ? svFn(v)  : {};
      const tex = texFn ? texFn(v) : {};
      const snd = sndFn ? sndFn(v) : {};
      // 4×5 = 20 records per zone
      for (const dlat of SUB_LAT) {
        for (const dlng of SUB_LNG) {
          recs.push(makeRec(lat0 + dlat, lng0 + dlng, sv, tex, snd));
        }
      }
    });
    return recs;
  }

  // ── v2-TODO 5 acceptance: spaciousness -1 → +1, all other axes neutral ✓ ─
  const ROW_SPACIOUSNESS = axisRow(0, v => ({ spaciousness: v }));

  // ── v2-TODO 6 acceptance: gravity -1 → +1 ────────────────────────────────
  const ROW_GRAVITY = axisRow(1, v => ({ gravity: v }));

  // ── v2-TODO 7 acceptance: tension -1 → +1 ────────────────────────────────
  const ROW_TENSION = axisRow(2, v => ({ tension: v }));

  // ── v2-TODO 8 acceptance: flow -1 → +1 ───────────────────────────────────
  const ROW_FLOW = axisRow(3, v => ({ flow: v }));

  // ── v2-TODO 9 acceptance: soundVector loudness 0 → 1, others neutral ─────
  const ROW_SOUND = axisRow(4, null, null, v => ({ loudness: (v + 1) / 2 }));

  // ── v2-TODO 10 acceptance: textureModifier warmth -1 → +1 ────────────────
  const ROW_TEXTURE = axisRow(5, null, v => ({ warmth: v }));

  window.TEST_SKIN_DATA = {
    meta:         { label: "axis-pole-test-v2", version: "v2" },
    origin:       CENTER,
    radiusMeters: 8000,
    records: [
      ...ROW_SPACIOUSNESS,
      ...ROW_GRAVITY,
      ...ROW_TENSION,
      ...ROW_FLOW,
      ...ROW_SOUND,
      ...ROW_TEXTURE,
    ],
    corridors: [], zones: [], voids: [],
  };
})();
