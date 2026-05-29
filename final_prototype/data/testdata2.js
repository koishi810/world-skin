// World Skin — v2-TODO 11 extreme-value combo test data
//
// Each 7×7 square holds ONE fixed combo at its extreme values throughout.
//   Columns: all identical — no horizontal axis variation
//   Rows (S→N, row 0→6): record count 1 → 20 (density axis only)
//
// 10 squares in 2 rows × 5 cols:
//   Row E (N, lat+0.0920): 密集+沉重 | 密集+轻盈 | 空旷+沉重 | 空旷+轻盈 | 绷紧+空旷
//   Row F (S, lat-0.0920): 松开+密集 | 流动+密集 | 静止+密集 | 嘈杂+空旷 | 安静+沉重
//
// Toggle: press Y in app.

(function () {
  const D_LNG = 0.00331;
  const D_LAT = 0.00270;

  const RECORD_COUNTS = [1, 2, 4, 6, 10, 15, 20]; // south→north

  const NEUTRAL_SV  = { spaciousness: 0, gravity: 0, tension: 0, flow: 0 };
  const NEUTRAL_SND = { loudness: 0.50, turbulence: 0.20, sharpness: 0.30, continuity: 0.80, texture: 0.30 };
  const BASE_DATE   = "2026-01-01T10:00:00.000Z";

  let _id = 0;

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  function cellOffsets(n) {
    const STEP = 0.000090;
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

  function makeRec(lat, lng, sv, snd, extra) {
    return Object.assign({
      id: `test2-${_id++}`,
      lat, lng,
      noise: 0.58, flux: 0.20, peak: 0.52,
      movement: "still", direction: 0, distance: 0,
      slot: "day",
      createdAt: BASE_DATE,
      word: null, selectedWords: [],
      senseVector: Object.assign({}, NEUTRAL_SV,  sv  || {}),
      soundVector:  Object.assign({}, NEUTRAL_SND, snd || {}),
    }, extra || {});
  }

  // All cells in each square share the same fixed sv/snd/extra.
  // Only record count varies by row (density axis).
  function square(center, sv, snd, extra) {
    const recs = [];
    const originLat = center.lat - 3 * D_LAT;
    const originLng = center.lng + 3 * D_LNG;
    for (let row = 0; row < 7; row++) {
      const lat0    = originLat + row * D_LAT;
      const count   = RECORD_COUNTS[row];
      const offsets = cellOffsets(count);
      for (let col = 0; col < 7; col++) {
        const lng0 = originLng - col * D_LNG;
        for (const [dlat, dlng] of offsets) {
          recs.push(makeRec(lat0 + dlat, lng0 + dlng, sv, snd, extra));
        }
      }
    }
    return recs;
  }

  // ── Square centres ──────────────────────────────────────────────────────────
  const CTR  = { lat: 35.7000, lng: 139.4808 };
  const E_LAT = CTR.lat + 0.0920;
  const F_LAT = CTR.lat - 0.0920;
  const LNG5  = [-2, -1, 0, 1, 2].map(i => CTR.lng + i * 0.0220);

  const CENTERS = {
    E0: { lat: E_LAT, lng: LNG5[0] },
    E1: { lat: E_LAT, lng: LNG5[1] },
    E2: { lat: E_LAT, lng: LNG5[2] },
    E3: { lat: E_LAT, lng: LNG5[3] },
    E4: { lat: E_LAT, lng: LNG5[4] },
    F0: { lat: F_LAT, lng: LNG5[0] },
    F1: { lat: F_LAT, lng: LNG5[1] },
    F2: { lat: F_LAT, lng: LNG5[2] },
    F3: { lat: F_LAT, lng: LNG5[3] },
    F4: { lat: F_LAT, lng: LNG5[4] },
  };

  // ── Row E ──────────────────────────────────────────────────────────────────

  // E0: 密集+沉重  sp=-1, g=+1
  const SQ_DENSE_HEAVY  = square(CENTERS.E0, { spaciousness: -1, gravity: +1 });             // v2-TODO 11

  // E1: 密集+轻盈  sp=-1, g=-1
  const SQ_DENSE_LIGHT  = square(CENTERS.E1, { spaciousness: -1, gravity: -1 });             // v2-TODO 11

  // E2: 空旷+沉重  sp=+1, g=+1
  const SQ_OPEN_HEAVY   = square(CENTERS.E2, { spaciousness: +1, gravity: +1 });             // v2-TODO 11

  // E3: 空旷+轻盈  sp=+1, g=-1
  const SQ_OPEN_LIGHT   = square(CENTERS.E3, { spaciousness: +1, gravity: -1 });             // v2-TODO 11

  // E4: 绷紧+空旷  t=+1, sp=+1
  const SQ_TENSE_OPEN   = square(CENTERS.E4, { tension: +1, spaciousness: +1 });             // v2-TODO 11

  // ── Row F ──────────────────────────────────────────────────────────────────

  // F0: 松开+密集  t=-1, sp=-1
  const SQ_LOOSE_DENSE  = square(CENTERS.F0, { tension: -1, spaciousness: -1 });             // v2-TODO 11

  // F1: 流动+密集  flow=+1, sp=-1
  const SQ_FLOW_DENSE   = square(                                                             // v2-TODO 11
    CENTERS.F1,
    { flow: +1, spaciousness: -1 },
    null,
    { movement: "passing", direction: 90, flux: 0.50 }
  );

  // F2: 静止+密集  flow=-1, sp=-1
  const SQ_STILL_DENSE  = square(                                                             // v2-TODO 11
    CENTERS.F2,
    { flow: -1, spaciousness: -1 },
    null,
    { movement: "still", direction: 0, flux: 0.08 }
  );

  // F3: 嘈杂+空旷  sp=+1, loudness=1
  const SQ_LOUD_OPEN    = square(                                                             // v2-TODO 11
    CENTERS.F3,
    { spaciousness: +1 },
    { loudness: 1.0, turbulence: 0.60 }
  );

  // F4: 安静+沉重  g=+1, loudness=0
  const SQ_QUIET_HEAVY  = square(                                                             // v2-TODO 11
    CENTERS.F4,
    { gravity: +1 },
    { loudness: 0.0, turbulence: 0.05 }
  );

  window.TEST_SKIN_DATA_2 = {
    meta:         { label: "combo-extreme-matrix-v2", version: "v2" },
    origin:       CTR,
    radiusMeters: 12000,
    records: [
      ...SQ_DENSE_HEAVY,
      ...SQ_DENSE_LIGHT,
      ...SQ_OPEN_HEAVY,
      ...SQ_OPEN_LIGHT,
      ...SQ_TENSE_OPEN,
      ...SQ_LOOSE_DENSE,
      ...SQ_FLOW_DENSE,
      ...SQ_STILL_DENSE,
      ...SQ_LOUD_OPEN,
      ...SQ_QUIET_HEAVY,
    ],
    corridors: [], zones: [], voids: [],
  };
})();
