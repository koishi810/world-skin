// World Skin — axis visual test data
//
// Layout: one 7×7 square matrix per axis / combo
//   Columns (E→W, col 0→6): axis value +1 → -1
//   Rows    (S→N, row 0→6): record count  1 → 20
//   Cell spacing: ~300 m in both directions (cross-bleed ≈ 4% at σ=120m)
//
// 16 squares in a 4-row × arrangement:
//   Row A (N):  spaciousness | gravity   | tension               (3 cols)
//   Row B:      flow         | sound     | finalColor            (3 cols)
//   Row C:      密集+沉重 | 密集+轻盈 | 空旷+沉重 | 空旷+轻盈 | 绷紧+空旷  (5 cols)
//   Row D (S):  松开+密集 | 流动+密集 | 静止+密集 | 嘈杂+空旷 | 安静+沉重  (5 cols)
//
// Usage: press T in app to swap world records for test records.
//
// Convention: append ✓ to the SQ_* comment after visual verification.
//   v2-TODO 5  spaciousness    → A0
//   v2-TODO 6  gravity         → A1
//   v2-TODO 7  tension         → A2
//   v2-TODO 8  flow            → B0
//   v2-TODO 9  soundVector     → B1
//   v2-TODO 10 finalColor      → B2
//   v2-TODO 11 combos          → C0–C4, D0–D4

(function () {
  const D_LNG = 0.00331;  // ~300 m east  (1°lng ≈ 90.5 km at lat 35.7°)
  const D_LAT = 0.00270;  // ~300 m north (1°lat ≈ 111 km)

  // Axis values east→west (col 0 = east = +1, col 6 = west = -1)
  const AXIS_VALUES   = [+1.00, +0.67, +0.33, 0.00, -0.33, -0.67, -1.00];
  // Record counts south→north (row 0 = south = sparse, row 6 = north = dense)
  const RECORD_COUNTS = [1, 2, 4, 6, 10, 15, 20];

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
      id: `test-${_id++}`,
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

  function square(center, svFn, sndFn, extraFn) {
    const recs = [];
    const originLat = center.lat - 3 * D_LAT;
    const originLng = center.lng + 3 * D_LNG;
    for (let row = 0; row < 7; row++) {
      const lat0    = originLat + row * D_LAT;
      const count   = RECORD_COUNTS[row];
      const offsets = cellOffsets(count);
      for (let col = 0; col < 7; col++) {
        const lng0  = originLng - col * D_LNG;
        const v     = AXIS_VALUES[col];
        const sv    = svFn    ? svFn(v)    : {};
        const snd   = sndFn   ? sndFn(v)   : {};
        const extra = extraFn ? extraFn(v) : {};
        for (const [dlat, dlng] of offsets) {
          recs.push(makeRec(lat0 + dlat, lng0 + dlng, sv, snd, extra));
        }
      }
    }
    return recs;
  }

  // ── Square centres ──────────────────────────────────────────────────────────
  const CTR = { lat: 35.7000, lng: 139.4808 };

  // Row A/B: original 3-col layout, ±0.0200 lat
  const A_LAT = CTR.lat + 0.0200;
  const B_LAT = CTR.lat - 0.0200;
  // Row C/D: 5-col layout, ±0.0560 lat, 0.0220 lng spacing
  const C_LAT = CTR.lat + 0.0560;
  const D_LAT_ROW = CTR.lat - 0.0560;
  const LNG5 = [-2, -1, 0, 1, 2].map(i => CTR.lng + i * 0.0220);

  const CENTERS = {
    // Row A — single-axis
    A0: { lat: A_LAT, lng: CTR.lng - 0.0253 }, // spaciousness
    A1: { lat: A_LAT, lng: CTR.lng          }, // gravity
    A2: { lat: A_LAT, lng: CTR.lng + 0.0253 }, // tension
    // Row B — single-axis
    B0: { lat: B_LAT, lng: CTR.lng - 0.0253 }, // flow
    B1: { lat: B_LAT, lng: CTR.lng          }, // sound
    B2: { lat: B_LAT, lng: CTR.lng + 0.0253 }, // finalColor
    // Row C — combos 1–5
    C0: { lat: C_LAT, lng: LNG5[0] }, // 密集+沉重
    C1: { lat: C_LAT, lng: LNG5[1] }, // 密集+轻盈
    C2: { lat: C_LAT, lng: LNG5[2] }, // 空旷+沉重
    C3: { lat: C_LAT, lng: LNG5[3] }, // 空旷+轻盈
    C4: { lat: C_LAT, lng: LNG5[4] }, // 绷紧+空旷
    // Row D — combos 6–10
    D0: { lat: D_LAT_ROW, lng: LNG5[0] }, // 松开+密集
    D1: { lat: D_LAT_ROW, lng: LNG5[1] }, // 流动+密集
    D2: { lat: D_LAT_ROW, lng: LNG5[2] }, // 静止+密集
    D3: { lat: D_LAT_ROW, lng: LNG5[3] }, // 嘈杂+空旷
    D4: { lat: D_LAT_ROW, lng: LNG5[4] }, // 安静+沉重
  };

  // ── Row A: single-axis squares ─────────────────────────────────────────────
  const SQ_SPACIOUSNESS = square(CENTERS.A0, v => ({ spaciousness: v }));                   // v2-TODO 5  ✓
  const SQ_GRAVITY      = square(CENTERS.A1, v => ({ gravity: v }));                        // v2-TODO 6  ✓
  const SQ_TENSION      = square(CENTERS.A2, v => ({ tension: v }));                        // v2-TODO 7  ✓

  // ── Row B: single-axis squares ─────────────────────────────────────────────
  const SQ_FLOW = square(CENTERS.B0, v => ({ flow: v }), null, v => ({                     // v2-TODO 8  ✓
    movement:  v >  0.10 ? "passing" : v > -0.10 ? "slow" : "still",
    direction: 90,
    flux:      v >  0.10 ? 0.42     : v > -0.10  ? 0.26   : 0.08,
  }));
  const SQ_SOUND = square(CENTERS.B1, null, v => ({ loudness: (v + 1) / 2 }));             // v2-TODO 9
  const SQ_COLOR = square(                                                                   // v2-TODO 10 ✓
    CENTERS.B2,
    v => ({ gravity: v, spaciousness: -v * 0.35, tension: -v * 0.25, flow: v * 0.20 }),
    v => ({
      loudness:    clamp01((v + 1) / 2),
      turbulence:  clamp01(0.18 + Math.max(0, v) * 0.34),
      sharpness:   clamp01(0.28 + Math.max(0, -v) * 0.30),
      continuity:  clamp01(0.82 - Math.abs(v) * 0.18),
      texture:     clamp01(0.28 + Math.max(0, v) * 0.26),
    })
  );

  // ── Row C: combination squares (v2-TODO 11) ────────────────────────────────
  // 每列 E→W: 组合强度 +1 → -1（东端 = 主组合极值，西端 = 对称反向）

  // C0: 密集+沉重  E(sp=-1,g=+1) → W(sp=+1,g=-1) 空旷+轻盈
  const SQ_COMBO_DENSE_HEAVY   = square(CENTERS.C0, v => ({ spaciousness: -v, gravity: v }));

  // C1: 密集+轻盈  E(sp=-1,g=-1) → W(sp=+1,g=+1) 空旷+沉重
  const SQ_COMBO_DENSE_LIGHT   = square(CENTERS.C1, v => ({ spaciousness: -v, gravity: -v }));

  // C2: 空旷+沉重  E(sp=+1,g=+1) → W(sp=-1,g=-1) 密集+轻盈
  const SQ_COMBO_OPEN_HEAVY    = square(CENTERS.C2, v => ({ spaciousness: v, gravity: v }));

  // C3: 空旷+轻盈  E(sp=+1,g=-1) → W(sp=-1,g=+1) 密集+沉重
  const SQ_COMBO_OPEN_LIGHT    = square(CENTERS.C3, v => ({ spaciousness: v, gravity: -v }));

  // C4: 绷紧+空旷  E(t=+1,sp=+1) → W(t=-1,sp=-1) 松开+密集
  const SQ_COMBO_TENSE_OPEN    = square(CENTERS.C4, v => ({ tension: v, spaciousness: v }));

  // ── Row D: combination squares (v2-TODO 11, cont.) ─────────────────────────

  // D0: 松开+密集  E(t=-1,sp=-1) → W(t=+1,sp=+1) 绷紧+空旷
  const SQ_COMBO_LOOSE_DENSE   = square(CENTERS.D0, v => ({ tension: -v, spaciousness: -v }));

  // D1: 流动+密集  E(flow=+1,sp=-1) → W(flow=-1,sp=+1)
  const SQ_COMBO_FLOW_DENSE    = square(CENTERS.D1, v => ({ flow: v, spaciousness: -v }), null, v => ({
    movement:  v >  0.10 ? "passing" : v > -0.10 ? "slow" : "still",
    direction: 90,
    flux:      clamp01(0.12 + Math.max(0, v) * 0.38),
  }));

  // D2: 静止+密集  E(flow=-1,sp=-1) → W(flow=+1,sp=+1)
  const SQ_COMBO_STILL_DENSE   = square(CENTERS.D2, v => ({ flow: -v, spaciousness: -v }), null, v => ({
    movement:  v >  0.10 ? "still"   : v > -0.10 ? "slow" : "passing",
    direction: 0,
    flux:      clamp01(0.08 + Math.max(0, -v) * 0.34),
  }));

  // D3: 嘈杂+空旷  E(loud=1,sp=+1) → W(loud=0,sp=-1)
  const SQ_COMBO_LOUD_OPEN     = square(
    CENTERS.D3,
    v => ({ spaciousness: v }),
    v => ({ loudness: clamp01((v + 1) / 2), turbulence: clamp01(0.10 + Math.max(0, v) * 0.50) })
  );

  // D4: 安静+沉重  E(loud=0,g=+1) → W(loud=1,g=-1)
  const SQ_COMBO_QUIET_HEAVY   = square(
    CENTERS.D4,
    v => ({ gravity: v }),
    v => ({ loudness: clamp01((1 - v) / 2), turbulence: clamp01(0.05 + Math.max(0, -v) * 0.38) })
  );

  window.TEST_SKIN_DATA = {
    meta:         { label: "axis-square-matrix-v4", version: "v4" },
    origin:       CTR,
    radiusMeters: 8000,
    records: [
      ...SQ_SPACIOUSNESS,
      ...SQ_GRAVITY,
      ...SQ_TENSION,
      ...SQ_FLOW,
      ...SQ_SOUND,
      ...SQ_COLOR,
      ...SQ_COMBO_DENSE_HEAVY,
      ...SQ_COMBO_DENSE_LIGHT,
      ...SQ_COMBO_OPEN_HEAVY,
      ...SQ_COMBO_OPEN_LIGHT,
      ...SQ_COMBO_TENSE_OPEN,
      ...SQ_COMBO_LOOSE_DENSE,
      ...SQ_COMBO_FLOW_DENSE,
      ...SQ_COMBO_STILL_DENSE,
      ...SQ_COMBO_LOUD_OPEN,
      ...SQ_COMBO_QUIET_HEAVY,
    ],
    corridors: [], zones: [], voids: [],
  };
})();
