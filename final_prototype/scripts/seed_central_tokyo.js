#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_RECORDS = 120000;
const DEFAULT_BATCH_SIZE = 500;
const SOURCE = "central-tokyo-experience-v1";

const WORDS = {
  station: [["ざらつく", 0.24], ["詰まる", 0.22], ["流れる", 0.20], ["速い", 0.20], ["硬い", 0.14]],
  office: [["硬い", 0.24], ["重い", 0.22], ["乾く", 0.18], ["詰まる", 0.18], ["遠い", 0.18]],
  shopping: [["詰まる", 0.24], ["ざらつく", 0.22], ["流れる", 0.18], ["重い", 0.18], ["滞る", 0.18]],
  night: [["こもる", 0.24], ["ざらつく", 0.22], ["熱を持つ", 0.18], ["滞る", 0.18], ["重い", 0.18]],
  park: [["浮く", 0.28], ["ほどける", 0.24], ["澄む", 0.22], ["広がる", 0.16], ["薄い", 0.10]],
  water: [["澄む", 0.28], ["流れる", 0.24], ["ほどける", 0.20], ["遠い", 0.16], ["薄い", 0.12]],
  residential: [["眠い", 0.24], ["ほどける", 0.22], ["薄い", 0.20], ["遠い", 0.18], ["浮く", 0.16]],
  campus: [["こもる", 0.22], ["重い", 0.20], ["乾く", 0.20], ["眠い", 0.20], ["ほどける", 0.18]]
};

const HOURS = {
  station: [[7, 0.12], [8, 0.20], [9, 0.13], [12, 0.06], [17, 0.13], [18, 0.18], [19, 0.13], [21, 0.05]],
  office: [[8, 0.13], [9, 0.17], [11, 0.08], [12, 0.13], [13, 0.10], [17, 0.13], [18, 0.14], [20, 0.08], [22, 0.04]],
  shopping: [[10, 0.08], [11, 0.11], [12, 0.14], [13, 0.12], [15, 0.13], [17, 0.13], [18, 0.13], [20, 0.10], [22, 0.06]],
  night: [[18, 0.12], [19, 0.14], [20, 0.16], [21, 0.16], [22, 0.16], [23, 0.14], [0, 0.08], [1, 0.04]],
  park: [[7, 0.06], [8, 0.08], [10, 0.13], [11, 0.14], [13, 0.12], [14, 0.16], [15, 0.15], [16, 0.10], [18, 0.06]],
  water: [[6, 0.08], [7, 0.10], [8, 0.10], [12, 0.08], [16, 0.12], [17, 0.16], [18, 0.16], [19, 0.12], [21, 0.08]],
  residential: [[6, 0.08], [7, 0.12], [8, 0.10], [18, 0.13], [19, 0.16], [20, 0.16], [21, 0.14], [22, 0.08], [23, 0.03]],
  campus: [[9, 0.08], [10, 0.12], [11, 0.13], [12, 0.12], [13, 0.12], [14, 0.13], [15, 0.13], [16, 0.10], [17, 0.07]]
};

const SCENES = {
  station: {
    type: "station", radius: [80, 260], noise: [0.62, 0.96], turbulence: [0.48, 0.90],
    mobility: { passing: 0.66, slow: 0.27, still: 0.07 }, words: WORDS.station, hours: HOURS.station
  },
  interchange: {
    type: "station", radius: [120, 320], noise: [0.70, 0.98], turbulence: [0.55, 0.94],
    mobility: { passing: 0.72, slow: 0.23, still: 0.05 }, words: WORDS.station, hours: HOURS.station
  },
  office: {
    type: "office", radius: [160, 460], noise: [0.34, 0.72], turbulence: [0.20, 0.58],
    mobility: { passing: 0.28, slow: 0.46, still: 0.26 }, words: WORDS.office, hours: HOURS.office
  },
  shopping: {
    type: "shopping", radius: [130, 420], noise: [0.48, 0.86], turbulence: [0.34, 0.78],
    mobility: { passing: 0.34, slow: 0.50, still: 0.16 }, words: WORDS.shopping, hours: HOURS.shopping
  },
  night: {
    type: "night", radius: [120, 380], noise: [0.50, 0.88], turbulence: [0.36, 0.82],
    mobility: { passing: 0.28, slow: 0.48, still: 0.24 }, words: WORDS.night, hours: HOURS.night
  },
  park: {
    type: "park", radius: [180, 720], noise: [0.08, 0.38], turbulence: [0.04, 0.32],
    mobility: { passing: 0.10, slow: 0.34, still: 0.56 }, words: WORDS.park, hours: HOURS.park
  },
  water: {
    type: "water", radius: [180, 680], noise: [0.12, 0.44], turbulence: [0.08, 0.40],
    mobility: { passing: 0.20, slow: 0.44, still: 0.36 }, words: WORDS.water, hours: HOURS.water
  },
  residential: {
    type: "residential", radius: [220, 760], noise: [0.16, 0.52], turbulence: [0.08, 0.40],
    mobility: { passing: 0.17, slow: 0.45, still: 0.38 }, words: WORDS.residential, hours: HOURS.residential
  },
  campus: {
    type: "campus", radius: [180, 520], noise: [0.24, 0.60], turbulence: [0.16, 0.50],
    mobility: { passing: 0.14, slow: 0.44, still: 0.42 }, words: WORDS.campus, hours: HOURS.campus
  }
};

const MICRO_AREAS = [
  ["marunouchi_tokyo_station", "東京駅丸の内改札", "interchange", 35.6812, 139.7671, 1.65],
  ["yaesu_bus_deck", "八重洲バス乗降口", "station", 35.6802, 139.7694, 1.20],
  ["otemachi_office_canyon", "大手町オフィス谷間", "office", 35.6860, 139.7649, 1.20],
  ["nihonbashi_crossing", "日本橋交差点", "office", 35.6827, 139.7745, 0.95],
  ["ginza_chuo_dori", "銀座中央通り", "shopping", 35.6718, 139.7650, 1.30],
  ["ginza_backstreet", "銀座裏通り", "shopping", 35.6697, 139.7642, 0.88],
  ["yurakucho_underpass", "有楽町高架下", "night", 35.6750, 139.7630, 0.85],
  ["hibiya_park_edge", "日比谷公園外縁", "park", 35.6739, 139.7556, 0.82],
  ["shinbashi_sl_gates", "新橋駅SL広場", "interchange", 35.6663, 139.7584, 1.25],
  ["shiodome_deck", "汐留デッキ", "office", 35.6627, 139.7595, 0.78],
  ["toranomon_hills", "虎ノ門ヒルズ周辺", "office", 35.6662, 139.7499, 0.90],
  ["roppongi_crossing", "六本木交差点", "night", 35.6637, 139.7310, 1.08],
  ["azabu_residential_slope", "麻布住宅坂道", "residential", 35.6557, 139.7346, 0.58],
  ["akasaka_mitsuke", "赤坂見附", "night", 35.6770, 139.7374, 0.95],
  ["aoyama_omotesando", "表参道青山通り", "shopping", 35.6652, 139.7123, 1.05],
  ["harajuku_takeshita", "原宿竹下通り", "shopping", 35.6716, 139.7046, 1.10],
  ["yoyogi_park_south", "代々木公園南端", "park", 35.6692, 139.6932, 0.92],
  ["shibuya_scramble", "渋谷スクランブル", "interchange", 35.6595, 139.7005, 1.55],
  ["shibuya_center_gai", "渋谷センター街", "night", 35.6604, 139.6988, 1.15],
  ["daikanyama_residential", "代官山住宅地", "residential", 35.6481, 139.7031, 0.55],
  ["ebisu_station", "恵比寿駅西口", "station", 35.6467, 139.7101, 0.90],
  ["shinjuku_south_gate", "新宿駅南口", "interchange", 35.6887, 139.7002, 1.45],
  ["shinjuku_west_office", "西新宿高層街", "office", 35.6913, 139.6925, 1.02],
  ["kabukicho", "歌舞伎町", "night", 35.6950, 139.7037, 1.18],
  ["shinjuku_gyoen_edge", "新宿御苑外縁", "park", 35.6852, 139.7100, 0.86],
  ["yotsuya_station", "四ツ谷駅前", "station", 35.6860, 139.7307, 0.72],
  ["iidabashi_moat", "飯田橋外濠", "water", 35.7013, 139.7444, 0.70],
  ["kudanshita", "九段下", "office", 35.6956, 139.7519, 0.66],
  ["akihabara_electric", "秋葉原電気街", "shopping", 35.6997, 139.7714, 1.05],
  ["akihabara_station", "秋葉原駅構内周辺", "interchange", 35.6984, 139.7730, 1.15],
  ["ueno_park_gate", "上野公園口", "park", 35.7137, 139.7767, 0.88],
  ["ameyoko", "アメ横", "shopping", 35.7094, 139.7747, 1.00],
  ["asakusa_kaminarimon", "浅草雷門", "shopping", 35.7101, 139.7977, 0.78],
  ["sumida_river_walk", "隅田川テラス", "water", 35.7045, 139.7999, 0.74],
  ["ikebukuro_east", "池袋東口", "interchange", 35.7295, 139.7132, 1.20],
  ["ikebukuro_west_night", "池袋西口夜間街", "night", 35.7312, 139.7081, 0.95],
  ["takadanobaba_station", "高田馬場駅前", "station", 35.7123, 139.7038, 0.82],
  ["waseda_campus_edge", "早稲田キャンパス縁", "campus", 35.7077, 139.7210, 0.62],
  ["shinagawa_konan", "品川港南口", "interchange", 35.6285, 139.7415, 1.04],
  ["takanawa_gateway", "高輪ゲートウェイ", "office", 35.6355, 139.7407, 0.66],
  ["tamachi_office", "田町オフィス街", "office", 35.6457, 139.7470, 0.72],
  ["odaiba_deck", "お台場デッキ", "water", 35.6267, 139.7753, 0.72],
  ["toyosu_market_edge", "豊洲市場外縁", "water", 35.6456, 139.7850, 0.72],
  ["toyosu_station", "豊洲駅前", "station", 35.6550, 139.7966, 0.84],
  ["monzennakacho", "門前仲町", "night", 35.6718, 139.7958, 0.70],
  ["kiyosumi_park_edge", "清澄庭園周辺", "park", 35.6811, 139.7985, 0.68],
  ["kinshicho_station", "錦糸町駅前", "interchange", 35.6972, 139.8144, 0.94],
  ["nakameguro_river", "中目黒目黒川", "water", 35.6442, 139.6992, 0.72],
  ["meguro_station", "目黒駅前", "station", 35.6339, 139.7156, 0.70],
  ["gotanda_station", "五反田駅前", "station", 35.6264, 139.7234, 0.72]
];

const CORRIDORS = [
  ["central_yamanote", "山手線都心弧", [
    [35.6285, 139.7388], [35.6467, 139.7101], [35.6595, 139.7005], [35.6887, 139.7002],
    [35.7123, 139.7038], [35.7295, 139.7132], [35.7137, 139.7767], [35.6984, 139.7730],
    [35.6812, 139.7671], [35.6663, 139.7584], [35.6285, 139.7388]
  ], 300, 1.0],
  ["ginza_shibuya_surface", "銀座-青山-渋谷地上動線", [
    [35.6718, 139.7650], [35.6662, 139.7499], [35.6637, 139.7310], [35.6652, 139.7123], [35.6595, 139.7005]
  ], 220, 0.72],
  ["sumida_bay_waterfront", "隅田川-湾岸歩行縁", [
    [35.7045, 139.7999], [35.6811, 139.7985], [35.6550, 139.7966], [35.6456, 139.7850], [35.6267, 139.7753]
  ], 360, 0.62]
];

function parseArgs(argv) {
  const options = { records: DEFAULT_RECORDS, batchSize: DEFAULT_BATCH_SIZE, resetSource: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--records") options.records = Number(argv[++i]);
    else if (arg === "--batch-size") options.batchSize = Number(argv[++i]);
    else if (arg === "--reset-source") options.resetSource = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--help" || arg === "-h") {
      console.log([
        "Usage: node scripts/seed_central_tokyo.js [--records 120000] [--batch-size 500] [--reset-source] [--dry-run]",
        "",
        "Required env unless --dry-run:",
        "  SUPABASE_URL",
        "  SUPABASE_SERVICE_ROLE_KEY"
      ].join("\n"));
      process.exit(0);
    }
  }
  if (!Number.isFinite(options.records) || options.records < 1) throw new Error("--records must be a positive number");
  if (!Number.isFinite(options.batchSize) || options.batchSize < 1) throw new Error("--batch-size must be a positive number");
  return options;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seededRandom(2026052911);
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function weighted(items) {
  const entries = Array.isArray(items) ? items : Object.entries(items);
  const total = entries.reduce((sum, item) => sum + item[1], 0);
  let pick = rand() * total;
  for (const item of entries) {
    pick -= item[1];
    if (pick <= 0) return item[0];
  }
  return entries[entries.length - 1][0];
}
function metersToLatLng(dx, dy, center) {
  return {
    lat: center.lat + dy / 111320,
    lng: center.lng + dx / (111320 * Math.cos(center.lat * Math.PI / 180))
  };
}
function latLngToMeters(pos, origin) {
  return {
    dx: (pos.lng - origin.lng) * 111320 * Math.cos(origin.lat * Math.PI / 180),
    dy: (pos.lat - origin.lat) * 111320
  };
}
function randomNear(center, radius, pow = 0.56) {
  const angle = rand() * Math.PI * 2;
  const dist = Math.pow(rand(), pow) * radius;
  return metersToLatLng(Math.cos(angle) * dist, Math.sin(angle) * dist, center);
}
function hourSlot(hour) {
  if (hour < 6) return "night";
  if (hour < 11) return "morning";
  if (hour < 17) return "day";
  if (hour < 22) return "evening";
  return "night";
}

function buildZones() {
  return MICRO_AREAS.map(([id, label, sceneKey, lat, lng, weight]) => {
    const scene = SCENES[sceneKey];
    const radius = Math.round(scene.radius[0] + (scene.radius[1] - scene.radius[0]) * clamp(weight / 1.6, 0.2, 1));
    return {
      id: `central_${id}`,
      label,
      type: scene.type,
      center: { lat, lng },
      radius,
      weight,
      sceneKey,
      noise: scene.noise,
      turbulence: scene.turbulence,
      mobility: scene.mobility,
      words: scene.words,
      hours: scene.hours
    };
  });
}

function buildCorridors() {
  return CORRIDORS.map(([id, label, points, width, weight]) => ({
    id: `central_${id}`,
    label,
    type: "corridor",
    points: points.map(([lat, lng]) => ({ lat, lng })),
    width,
    weight,
    sceneKey: id.includes("water") ? "water" : "station",
    noise: id.includes("water") ? SCENES.water.noise : SCENES.station.noise,
    turbulence: id.includes("water") ? SCENES.water.turbulence : SCENES.station.turbulence,
    mobility: id.includes("water") ? SCENES.water.mobility : { passing: 0.68, slow: 0.26, still: 0.06 },
    words: id.includes("water") ? WORDS.water : WORDS.station,
    hours: id.includes("water") ? HOURS.water : HOURS.station
  }));
}

function buildVoids() {
  return [
    { id: "central_imperial_palace_void", center: { lat: 35.6852, lng: 139.7528 }, radius: 780 },
    { id: "central_shinjuku_gyoen_void", center: { lat: 35.6852, lng: 139.7100 }, radius: 520 },
    { id: "central_yoyogi_park_void", center: { lat: 35.6717, lng: 139.6949 }, radius: 640 },
    { id: "central_tokyo_bay_water_void", center: { lat: 35.6220, lng: 139.7980 }, radius: 1450 }
  ];
}

function sampleCorridor(corridor) {
  const origin = corridor.points[0];
  const segments = [];
  for (let i = 1; i < corridor.points.length; i++) {
    const a = latLngToMeters(corridor.points[i - 1], origin);
    const b = latLngToMeters(corridor.points[i], origin);
    segments.push({ a, b, length: Math.hypot(b.dx - a.dx, b.dy - a.dy) });
  }
  const total = segments.reduce((sum, segment) => sum + segment.length, 0);
  let pick = rand() * total;
  let segment = segments[0];
  for (const candidate of segments) {
    pick -= candidate.length;
    if (pick <= 0) { segment = candidate; break; }
  }
  const t = rand();
  const dx = segment.b.dx - segment.a.dx;
  const dy = segment.b.dy - segment.a.dy;
  const len = Math.max(1, segment.length);
  return {
    latLng: metersToLatLng(
      segment.a.dx + dx * t + (-dy / len) * (rand() - 0.5) * corridor.width,
      segment.a.dy + dy * t + ( dx / len) * (rand() - 0.5) * corridor.width,
      origin
    ),
    direction: (Math.atan2(dx, dy) * 180 / Math.PI + 360 + (rand() - 0.5) * 26) % 360
  };
}

const SV_BASE = {
  station: { sp: [-0.58, -0.14], g: [0.24, 0.62], t: [0.34, 0.72], f: [0.16, 0.58] },
  office: { sp: [-0.34, 0.04], g: [0.18, 0.58], t: [0.16, 0.56], f: [-0.12, 0.26] },
  shopping: { sp: [-0.46, -0.08], g: [0.18, 0.52], t: [0.28, 0.62], f: [0.08, 0.42] },
  night: { sp: [-0.52, -0.04], g: [0.16, 0.58], t: [0.18, 0.66], f: [-0.04, 0.38] },
  park: { sp: [0.34, 0.82], g: [-0.58, -0.08], t: [-0.68, -0.18], f: [-0.48, 0.12] },
  water: { sp: [0.20, 0.66], g: [-0.36, 0.08], t: [-0.42, 0.08], f: [0.18, 0.62] },
  residential: { sp: [-0.08, 0.32], g: [0.14, 0.52], t: [-0.48, 0.02], f: [-0.48, -0.08] },
  campus: { sp: [-0.18, 0.22], g: [0.08, 0.46], t: [-0.08, 0.34], f: [-0.28, 0.22] }
};
const SND_BASE = {
  station: { sh: 0.60, co: 0.82, tx: 0.58 }, office: { sh: 0.42, co: 0.68, tx: 0.42 },
  shopping: { sh: 0.54, co: 0.76, tx: 0.52 }, night: { sh: 0.48, co: 0.62, tx: 0.60 },
  park: { sh: 0.16, co: 0.64, tx: 0.20 }, water: { sh: 0.20, co: 0.70, tx: 0.24 },
  residential: { sh: 0.26, co: 0.58, tx: 0.30 }, campus: { sh: 0.38, co: 0.70, tx: 0.42 }
};

function buildSenseVector(type, mobility, hour, weekday) {
  const base = SV_BASE[type] || SV_BASE.station;
  const commute = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
  const night = hour <= 5 || hour >= 22;
  const weekend = weekday >= 5;
  let sp = base.sp[0] + rand() * (base.sp[1] - base.sp[0]);
  let g = base.g[0] + rand() * (base.g[1] - base.g[0]);
  let t = base.t[0] + rand() * (base.t[1] - base.t[0]);
  let f = base.f[0] + rand() * (base.f[1] - base.f[0]);
  if (mobility === "passing") { f += 0.16 + rand() * 0.14; g -= 0.04; }
  if (mobility === "still") { f -= 0.14; g += 0.08; }
  if (commute && !["park", "water"].includes(type)) { t += 0.10; sp -= 0.08; }
  if (night && type === "night") { g += 0.06; t += 0.08; sp -= 0.06; }
  if (weekend && ["park", "shopping", "water"].includes(type)) { t -= 0.06; sp += 0.04; }
  return {
    spaciousness: Number(clamp(sp, -1, 1).toFixed(3)),
    gravity: Number(clamp(g, -1, 1).toFixed(3)),
    tension: Number(clamp(t, -1, 1).toFixed(3)),
    flow: Number(clamp(f, -1, 1).toFixed(3))
  };
}

function buildSoundVector(noiseLevel, turbulence, type) {
  const base = SND_BASE[type] || SND_BASE.station;
  return {
    loudness: Number(clamp(noiseLevel + (rand() - 0.5) * 0.06, 0, 1).toFixed(3)),
    turbulence: Number(clamp(turbulence + (rand() - 0.5) * 0.06, 0, 1).toFixed(3)),
    sharpness: Number(clamp(base.sh + (rand() - 0.5) * 0.20, 0, 1).toFixed(3)),
    continuity: Number(clamp(base.co + (rand() - 0.5) * 0.22, 0, 1).toFixed(3)),
    texture: Number(clamp(base.tx + (rand() - 0.5) * 0.20, 0, 1).toFixed(3))
  };
}

function buildRecords(targetCount, zones, corridors) {
  const rows = [];
  const allSources = [
    ...zones.map(zone => ({ kind: "zone", item: zone, weight: zone.weight })),
    ...corridors.map(corridor => ({ kind: "corridor", item: corridor, weight: corridor.weight }))
  ];
  const weightedSources = allSources.map(source => [source, source.weight]);
  const baseTime = Date.UTC(2026, 4, 15, 0, 0, 0);

  for (let index = 0; index < targetCount; index++) {
    const selected = weighted(weightedSources);
    const profile = selected.item;
    const scene = SCENES[profile.sceneKey] || SCENES.station;
    let pos;
    let direction = rand() * 360;

    if (selected.kind === "corridor") {
      const sample = sampleCorridor(profile);
      pos = sample.latLng;
      direction = sample.direction;
    } else {
      const pow = ["station", "shopping", "night"].includes(profile.type) ? 0.76 : 0.54;
      pos = randomNear(profile.center, profile.radius, pow);
    }

    const weekday = index % 7;
    let hour = Number(weighted(scene.hours));
    if (weekday >= 5 && ["shopping", "park", "water"].includes(profile.type) && rand() < 0.30) {
      hour = Number(weighted([[11, 0.18], [12, 0.16], [14, 0.22], [15, 0.18], [16, 0.14], [18, 0.12]]));
    }
    hour = (hour + Math.floor(rand() * 3) - 1 + 24) % 24;
    const minute = Math.floor(rand() * 60);
    const timestamp = new Date(baseTime + (index % 28) * 86400000 + hour * 3600000 + minute * 60000 + Math.floor(rand() * 60000)).toISOString();
    const mobility = weighted(Object.entries(scene.mobility));
    const commute = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
    const late = hour >= 22 || hour <= 4;
    const noiseLevel = clamp(scene.noise[0] + rand() * (scene.noise[1] - scene.noise[0]) + (commute ? 0.06 : 0) + (late ? -0.04 : 0), 0.03, 0.98);
    const turbulence = clamp(scene.turbulence[0] + rand() * (scene.turbulence[1] - scene.turbulence[0]) + (mobility === "passing" ? 0.08 : 0), 0.02, 0.96);
    const word = weighted(scene.words);
    const selectedWords = rand() < 0.22 ? [word, weighted(scene.words.filter(([candidate]) => candidate !== word))] : [word];
    const senseVector = buildSenseVector(profile.type, mobility, hour, weekday);
    const soundVector = buildSoundVector(noiseLevel, turbulence, profile.type);
    const peak = clamp(noiseLevel + turbulence * 0.34 + rand() * 0.14, 0.05, 1);

    rows.push({
      id: `central-tokyo-${String(index).padStart(7, "0")}`,
      user_id: `central-user-${String(index % 9000).padStart(5, "0")}`,
      device_id: null,
      record_type: "world",
      lat: Number(pos.lat.toFixed(7)),
      lng: Number(pos.lng.toFixed(7)),
      timestamp,
      hour,
      weekday,
      noise_level: Number(noiseLevel.toFixed(3)),
      turbulence: Number(turbulence.toFixed(3)),
      peak: Number(peak.toFixed(3)),
      mobility,
      direction: Number(direction.toFixed(1)),
      duration: Math.round(clamp(7 + rand() * 12 + (mobility === "still" ? 3 : 0), 7, 22)),
      word,
      selected_words: selectedWords,
      sense_vector: senseVector,
      sound_vector: soundVector,
      trust_score: Number(clamp(0.64 + rand() * 0.32 - (late ? 0.04 : 0), 0.55, 1).toFixed(3)),
      zone_id: profile.id,
      source: SOURCE,
      noise: Number(noiseLevel.toFixed(3)),
      flux: Number(turbulence.toFixed(3)),
      movement: mobility,
      distance: mobility === "passing" ? 120 + rand() * 520 : mobility === "slow" ? 40 + rand() * 160 : rand() * 36,
      slot: hourSlot(hour),
      created_at: timestamp
    });
  }
  return rows;
}

function toZoneRows(zones) {
  return zones.map(zone => ({
    id: zone.id,
    label: zone.label,
    type: zone.type,
    center_lat: zone.center.lat,
    center_lng: zone.center.lng,
    radius: zone.radius,
    noise_min: zone.noise[0],
    noise_max: zone.noise[1],
    turbulence_min: zone.turbulence[0],
    turbulence_max: zone.turbulence[1],
    mobility: zone.mobility,
    words: zone.words,
    hours: zone.hours
  }));
}
function toCorridorRows(corridors) {
  return corridors.map(corridor => ({
    id: corridor.id,
    label: corridor.label,
    type: corridor.type,
    points: corridor.points,
    width: corridor.width,
    noise_min: corridor.noise[0],
    noise_max: corridor.noise[1],
    turbulence_min: corridor.turbulence[0],
    turbulence_max: corridor.turbulence[1],
    mobility: corridor.mobility,
    words: corridor.words,
    hours: corridor.hours
  }));
}
function toVoidRows(voids) {
  return voids.map(voidZone => ({
    id: voidZone.id,
    center_lat: voidZone.center.lat,
    center_lng: voidZone.center.lng,
    radius: voidZone.radius
  }));
}

async function requestSupabase(method, table, body = null, query = "") {
  const url = `${process.env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${table}${query}`;
  const response = await fetch(url, {
    method,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates"
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) throw new Error(`${method} ${table}: ${response.status} ${await response.text()}`);
}
async function upsertTable(table, rows, batchSize) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    await requestSupabase("POST", table, chunk, "?on_conflict=id");
    process.stdout.write(`\r${table}: ${Math.min(i + batchSize, rows.length)}/${rows.length}`);
  }
  process.stdout.write("\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const zones = buildZones();
  const corridors = buildCorridors();
  const voids = buildVoids();
  const records = buildRecords(options.records, zones, corridors);

  console.log(`Central Tokyo zones: ${zones.length}`);
  console.log(`Central Tokyo corridors: ${corridors.length}`);
  console.log(`Central Tokyo records: ${records.length}`);
  if (options.dryRun) {
    console.log(JSON.stringify(records.slice(0, 3), null, 2));
    return;
  }

  loadEnvFile(path.join(ROOT, ".env"));
  if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("sb_secret_")) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY must be the secret service role key, not the publishable key");
  }

  await upsertTable("zones", toZoneRows(zones), options.batchSize);
  await upsertTable("corridors", toCorridorRows(corridors), options.batchSize);
  await upsertTable("voids", toVoidRows(voids), options.batchSize);
  if (options.resetSource) {
    console.log(`Deleting existing ${SOURCE} records...`);
    await requestSupabase("DELETE", "records", null, `?source=eq.${SOURCE}`);
  }
  await upsertTable("records", records, options.batchSize);
  console.log("Done.");
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
