// World Skin — axis visual test data
//
// Layout per axis: one 7×7 square matrix
//   Columns (E→W, col 0→6): axis value +1 → -1
//   Rows    (S→N, row 0→6): record count  1 → 20
//   Cell spacing: ~300 m in both directions (cross-bleed ≈ 4% at σ=120m)
//
// 6 squares placed on the map in a 2-row × 3-col arrangement:
//   Row A (north): spaciousness | gravity | tension
//   Row B (south): flow         | sound   | texture
//
// Usage: press T in app to swap world records for test records.
//
// Convention: append ✓ to the ROW_* comment after visual verification.
//   v2-TODO 5  spaciousness    → square A0
//   v2-TODO 6  gravity         → square A1
//   v2-TODO 7  tension         → square A2
//   v2-TODO 8  flow            → square B0
//   v2-TODO 9  soundVector     → square B1
//   v2-TODO 10 textureModifier → square B2

(function () {
  // ~300 m per step (matched to ground distance at lat 35.7°)
  const D_LNG = 0.00331;  // 300 m east  (1°lng ≈ 90.5 km)
  const D_LAT = 0.00270;  // 300 m north (1°lat ≈ 111 km)

  // Axis values east→west (col 0 = east = +1, col 6 = west = -1)
  const AXIS_VALUES   = [+1.00, +0.67, +0.33, 0.00, -0.33, -0.67, -1.00];
  // Record counts south→north (row 0 = south = sparse, row 6 = north = dense)
  const RECORD_COUNTS = [1, 2, 4, 6, 10, 15, 20];

  const NEUTRAL_SV  = { spaciousness: 0, gravity: 0, tension: 0, flow: 0 };
  const NEUTRAL_TEX = { warmth: 0, roughness: 0, clarity: 0, dryness: 0 };
  const NEUTRAL_SND = { loudness: 0.50, turbulence: 0.20, sharpness: 0.30, continuity: 0.80, texture: 0.30 };
  const BASE_DATE   = "2026-01-01T10:00:00.000Z";

  let _id = 0;

  // Deterministic sub-cell offsets for n records — compact square grid
  function cellOffsets(n) {
    const STEP = 0.000090; // ~10 m per slot
    const size = Math.ceil(Math.sqrt(n));
    const half = (size - 1) / 2;
    const pts = [];
    outer: for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (pts.length >= n) break outer;
        pts.push([(i - half) * STEP, (j - half) * STEP]);
      }
    }
    return pts;
  }

  function makeRec(lat, lng, sv, tex, snd) {
    return {
      id: `test-${_id++}`,
      lat, lng,
      noise: 0.58, flux: 0.20, peak: 0.52,
      movement: "still", direction: 0, distance: 0,
      slot: "day",
      createdAt: BASE_DATE,
      word: null, selectedWords: [],
      senseVector:     Object.assign({}, NEUTRAL_SV,  sv  || {}),
      textureModifier: Object.assign({}, NEUTRAL_TEX, tex || {}),
      soundVector:     Object.assign({}, NEUTRAL_SND, snd || {}),
    };
  }

  // Build one 7×7 square matrix for a single axis.
  // squareCenter: { lat, lng } — geographic center of the square.
  // svFn / texFn / sndFn(axisValue) → partial override object.
  function square(squareCenter, svFn, texFn, sndFn) {
    const recs = [];
    const originLat = squareCenter.lat - 3 * D_LAT; // south edge (row 0)
    const originLng = squareCenter.lng + 3 * D_LNG; // east edge  (col 0)

    for (let row = 0; row < 7; row++) {          // S→N
      const lat0 = originLat + row * D_LAT;
      const count = RECORD_COUNTS[row];
      const offsets = cellOffsets(count);

      for (let col = 0; col < 7; col++) {        // E→W
        const lng0 = originLng - col * D_LNG;
        const v   = AXIS_VALUES[col];
        const sv  = svFn  ? svFn(v)  : {};
        const tex = texFn ? texFn(v) : {};
        const snd = sndFn ? sndFn(v) : {};

        for (const [dlat, dlng] of offsets) {
          recs.push(makeRec(lat0 + dlat, lng0 + dlng, sv, tex, snd));
        }
      }
    }
    return recs;
  }

  // Square centres — 2 rows × 3 cols, ~2.3 km apart
  const CTR = { lat: 35.7000, lng: 139.4808 };
  const CENTERS = {
    A0: { lat: CTR.lat + 0.0200, lng: CTR.lng - 0.0253 }, // spaciousness
    A1: { lat: CTR.lat + 0.0200, lng: CTR.lng          }, // gravity
    A2: { lat: CTR.lat + 0.0200, lng: CTR.lng + 0.0253 }, // tension
    B0: { lat: CTR.lat - 0.0200, lng: CTR.lng - 0.0253 }, // flow
    B1: { lat: CTR.lat - 0.0200, lng: CTR.lng          }, // sound
    B2: { lat: CTR.lat - 0.0200, lng: CTR.lng + 0.0253 }, // texture
  };

  // ── v2-TODO 5 acceptance: spaciousness +1(E) → -1(W); sparse(S) → dense(N) ✓ ─
  const SQ_SPACIOUSNESS = square(CENTERS.A0, v => ({ spaciousness: v }));

  // ── v2-TODO 6 acceptance: gravity +1(E) → -1(W) ──────────────────────────────
  const SQ_GRAVITY = square(CENTERS.A1, v => ({ gravity: v }));

  // ── v2-TODO 7 acceptance: tension +1(E) → -1(W) ──────────────────────────────
  const SQ_TENSION = square(CENTERS.A2, v => ({ tension: v }));

  // ── v2-TODO 8 acceptance: flow +1(E) → -1(W) ─────────────────────────────────
  const SQ_FLOW = square(CENTERS.B0, v => ({ flow: v }));

  // ── v2-TODO 9 acceptance: soundVector loudness 1(E) → 0(W) ───────────────────
  const SQ_SOUND = square(CENTERS.B1, null, null, v => ({ loudness: (v + 1) / 2 }));

  // ── v2-TODO 10 acceptance: textureModifier warmth +1(E) → -1(W) ──────────────
  const SQ_TEXTURE = square(CENTERS.B2, null, v => ({ warmth: v }));

  window.TEST_SKIN_DATA = {
    meta:         { label: "axis-square-matrix-v3", version: "v3" },
    origin:       CTR,
    radiusMeters: 8000,
    records: [
      ...SQ_SPACIOUSNESS,
      ...SQ_GRAVITY,
      ...SQ_TENSION,
      ...SQ_FLOW,
      ...SQ_SOUND,
      ...SQ_TEXTURE,
    ],
    corridors: [], zones: [], voids: [],
  };
})();
