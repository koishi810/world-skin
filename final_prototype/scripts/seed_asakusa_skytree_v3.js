#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_RECORDS = 20000;
const DEFAULT_BATCH_SIZE = 1000;
const SOURCE = "asakusa-skytree-kokubunji-scale-v3";
const OLD_WORLD_SOURCES = [
  "central-tokyo-experience-v1",
  "central-tokyo-experience-v2",
  SOURCE
];

const WORDS = {
  station: [["ざらつく", 0.28], ["詰まる", 0.25], ["硬い", 0.18], ["流れる", 0.17], ["重い", 0.12]],
  corridor: [["流れる", 0.28], ["速い", 0.23], ["ざらつく", 0.21], ["乾く", 0.16], ["硬い", 0.12]],
  shopping: [["詰まる", 0.25], ["ざらつく", 0.22], ["重い", 0.19], ["滞る", 0.18], ["遠い", 0.16]],
  park: [["浮く", 0.29], ["ほどける", 0.25], ["澄む", 0.22], ["広がる", 0.15], ["薄い", 0.09]],
  water: [["澄む", 0.29], ["流れる", 0.25], ["ほどける", 0.20], ["遠い", 0.15], ["薄い", 0.11]],
  residential: [["眠い", 0.25], ["ほどける", 0.22], ["薄い", 0.20], ["遠い", 0.19], ["浮く", 0.14]],
  shrine: [["遠い", 0.30], ["澄む", 0.26], ["浮く", 0.21], ["薄い", 0.14], ["ほどける", 0.09]],
  night: [["こもる", 0.25], ["ざらつく", 0.22], ["熱を持つ", 0.18], ["滞る", 0.18], ["重い", 0.17]]
};

const HOURS = {
  station: [[7, 0.15], [8, 0.18], [9, 0.12], [12, 0.06], [17, 0.14], [18, 0.18], [19, 0.13], [20, 0.04]],
  corridor: [[7, 0.13], [8, 0.15], [9, 0.10], [12, 0.08], [13, 0.07], [16, 0.09], [17, 0.15], [18, 0.16], [19, 0.07]],
  shopping: [[10, 0.10], [11, 0.13], [12, 0.15], [13, 0.12], [14, 0.11], [15, 0.12], [16, 0.11], [17, 0.09], [19, 0.07]],
  park: [[8, 0.07], [9, 0.10], [10, 0.14], [11, 0.13], [12, 0.10], [13, 0.10], [14, 0.15], [15, 0.13], [16, 0.08]],
  water: [[6, 0.08], [7, 0.10], [8, 0.10], [12, 0.08], [16, 0.12], [17, 0.16], [18, 0.16], [19, 0.12], [21, 0.08]],
  residential: [[6, 0.08], [7, 0.12], [8, 0.10], [18, 0.13], [19, 0.16], [20, 0.16], [21, 0.14], [22, 0.08], [23, 0.03]],
  shrine: [[8, 0.12], [9, 0.14], [10, 0.14], [11, 0.12], [12, 0.10], [14, 0.12], [15, 0.14], [16, 0.12]],
  night: [[18, 0.12], [19, 0.14], [20, 0.16], [21, 0.16], [22, 0.16], [23, 0.14], [0, 0.08], [1, 0.04]]
};

const ZONES = [
  zone("asakusa_station", "浅草駅", "station", 35.7108, 139.7985, 260, [0.62, 0.90], [0.48, 0.84], { passing: 0.50, slow: 0.36, still: 0.14 }),
  zone("oshiage_station", "押上駅", "station", 35.7101, 139.8130, 270, [0.60, 0.90], [0.46, 0.82], { passing: 0.52, slow: 0.34, still: 0.14 }),
  zone("tokyo_skytree_station", "とうきょうスカイツリー駅", "station", 35.7106, 139.8107, 230, [0.56, 0.84], [0.40, 0.76], { passing: 0.46, slow: 0.38, still: 0.16 }),
  zone("tawaramachi_station", "田原町駅", "station", 35.7090, 139.7908, 210, [0.48, 0.78], [0.34, 0.68], { passing: 0.42, slow: 0.40, still: 0.18 }),
  zone("honjo_azumabashi_station", "本所吾妻橋駅", "station", 35.7086, 139.8049, 220, [0.50, 0.80], [0.36, 0.70], { passing: 0.44, slow: 0.40, still: 0.16 }),
  zone("sensoji", "浅草寺境内", "shrine", 35.7148, 139.7967, 360, [0.10, 0.34], [0.06, 0.24], { passing: 0.10, slow: 0.30, still: 0.60 }),
  zone("nakamise", "仲見世通り", "shopping", 35.7126, 139.7966, 210, [0.52, 0.86], [0.38, 0.76], { passing: 0.34, slow: 0.50, still: 0.16 }),
  zone("shin_nakamise", "新仲見世商店街", "shopping", 35.7117, 139.7942, 220, [0.48, 0.82], [0.34, 0.70], { passing: 0.32, slow: 0.50, still: 0.18 }),
  zone("rokku", "浅草六区", "night", 35.7138, 139.7923, 260, [0.44, 0.82], [0.30, 0.72], { passing: 0.26, slow: 0.48, still: 0.26 }),
  zone("kappabashi", "かっぱ橋道具街", "shopping", 35.7145, 139.7882, 300, [0.36, 0.70], [0.24, 0.58], { passing: 0.26, slow: 0.48, still: 0.26 }),
  zone("sumida_park_west", "隅田公園西岸", "park", 35.7157, 139.8017, 520, [0.08, 0.34], [0.05, 0.30], { passing: 0.08, slow: 0.30, still: 0.62 }),
  zone("sumida_park_east", "隅田公園東岸", "park", 35.7160, 139.8062, 460, [0.08, 0.34], [0.05, 0.30], { passing: 0.08, slow: 0.32, still: 0.60 }),
  zone("sumida_river", "隅田川テラス", "water", 35.7142, 139.8030, 600, [0.12, 0.42], [0.08, 0.38], { passing: 0.20, slow: 0.44, still: 0.36 }),
  zone("azumabashi", "吾妻橋", "water", 35.7108, 139.8024, 220, [0.20, 0.52], [0.14, 0.44], { passing: 0.28, slow: 0.46, still: 0.26 }),
  zone("kototoibashi", "言問橋", "water", 35.7180, 139.8052, 260, [0.18, 0.48], [0.12, 0.42], { passing: 0.30, slow: 0.44, still: 0.26 }),
  zone("skytree_town", "東京スカイツリータウン", "shopping", 35.7100, 139.8107, 330, [0.50, 0.86], [0.36, 0.76], { passing: 0.34, slow: 0.48, still: 0.18 }),
  zone("solamachi", "ソラマチ内部縁", "shopping", 35.7103, 139.8116, 210, [0.48, 0.84], [0.34, 0.72], { passing: 0.28, slow: 0.50, still: 0.22 }),
  zone("oshiage_residential", "押上住宅地", "residential", 35.7130, 139.8174, 650, [0.14, 0.46], [0.08, 0.36], { passing: 0.14, slow: 0.46, still: 0.40 }),
  zone("mukojima_residential", "向島住宅地", "residential", 35.7198, 139.8127, 720, [0.14, 0.46], [0.08, 0.36], { passing: 0.14, slow: 0.46, still: 0.40 }),
  zone("honjo_residential", "本所住宅地", "residential", 35.7035, 139.8076, 700, [0.16, 0.48], [0.10, 0.38], { passing: 0.16, slow: 0.46, still: 0.38 }),
  zone("kuramae_edge", "蔵前北端", "residential", 35.7040, 139.7952, 520, [0.18, 0.52], [0.12, 0.42], { passing: 0.20, slow: 0.46, still: 0.34 }),
  zone("higashi_komagata", "東駒形裏道", "residential", 35.7072, 139.8034, 430, [0.16, 0.48], [0.10, 0.38], { passing: 0.16, slow: 0.48, still: 0.36 }),
  zone("hanayashiki_edge", "花やしき周辺", "shopping", 35.7150, 139.7932, 210, [0.42, 0.78], [0.30, 0.66], { passing: 0.24, slow: 0.48, still: 0.28 }),
  zone("asakusa_backstreets", "浅草裏路地", "residential", 35.7171, 139.7938, 420, [0.18, 0.50], [0.12, 0.42], { passing: 0.18, slow: 0.48, still: 0.34 }),
  zone("ushijima_shrine", "牛嶋神社周辺", "shrine", 35.7176, 139.8084, 220, [0.08, 0.28], [0.04, 0.18], { passing: 0.08, slow: 0.28, still: 0.64 }),
  zone("komagata_river_edge", "駒形川沿い", "water", 35.7075, 139.7998, 260, [0.14, 0.44], [0.09, 0.38], { passing: 0.22, slow: 0.44, still: 0.34 })
];

const CORRIDORS = [
  corridor("sumida_river_spine", "隅田川南北テラス", "water", [
    [35.7044, 139.7995], [35.7108, 139.8024], [35.7142, 139.8030], [35.7180, 139.8052], [35.7226, 139.8076]
  ], 170),
  corridor("asakusa_skytree_axis", "浅草-スカイツリー東西動線", "corridor", [
    [35.7108, 139.7985], [35.7108, 139.8024], [35.7086, 139.8049], [35.7100, 139.8107], [35.7101, 139.8130]
  ], 180),
  corridor("nakamise_sensoji", "雷門-仲見世-浅草寺", "shopping", [
    [35.7106, 139.7962], [35.7126, 139.7966], [35.7148, 139.7967]
  ], 140),
  corridor("kokusai_rokku", "国際通り-六区", "night", [
    [35.7077, 139.7910], [35.7112, 139.7915], [35.7138, 139.7923], [35.7171, 139.7938]
  ], 170),
  corridor("kototoi_dori", "言問通り", "corridor", [
    [35.7171, 139.7938], [35.7180, 139.8052], [35.7198, 139.8127], [35.7202, 139.8184]
  ], 160),
  corridor("oshiage_backstreet", "押上生活路", "residential", [
    [35.7035, 139.8076], [35.7101, 139.8130], [35.7130, 139.8174], [35.7198, 139.8127]
  ], 150),
  corridor("kappabashi_asakusa", "かっぱ橋-浅草商店路", "shopping", [
    [35.7145, 139.7882], [35.7138, 139.7923], [35.7117, 139.7942], [35.7108, 139.7985]
  ], 150)
];

const VOIDS = [
  { id: "asakusa_v3_sumida_channel_void", center: { lat: 35.7140, lng: 139.8044 }, radius: 150 },
  { id: "asakusa_v3_sensoji_inner_void", center: { lat: 35.7149, lng: 139.7967 }, radius: 130 },
  { id: "asakusa_v3_skytree_core_void", center: { lat: 35.7101, lng: 139.8107 }, radius: 150 },
  { id: "asakusa_v3_mukojima_quiet_void", center: { lat: 35.7234, lng: 139.8132 }, radius: 300 },
  { id: "asakusa_v3_honjo_block_void", center: { lat: 35.7028, lng: 139.8046 }, radius: 260 },
  { id: "asakusa_v3_ueno_side_void", center: { lat: 35.7185, lng: 139.7864 }, radius: 420 }
];

function zone(id, label, type, lat, lng, radius, noise, turbulence, mobility) {
  return { id: `asakusa_v3_${id}`, label, type, center: { lat, lng }, radius, noise, turbulence, mobility, words: WORDS[type], hours: HOURS[type] };
}

function corridor(id, label, type, points, width) {
  const noise = type === "water" ? [0.16, 0.48] : type === "shopping" ? [0.44, 0.80] : type === "night" ? [0.42, 0.80] : type === "residential" ? [0.24, 0.58] : [0.40, 0.76];
  const turbulence = type === "water" ? [0.10, 0.42] : type === "shopping" ? [0.30, 0.70] : type === "night" ? [0.28, 0.70] : type === "residential" ? [0.16, 0.48] : [0.28, 0.66];
  const mobility = type === "water" ? { passing: 0.24, slow: 0.46, still: 0.30 } : type === "residential" ? { passing: 0.34, slow: 0.48, still: 0.18 } : { passing: 0.58, slow: 0.34, still: 0.08 };
  return {
    id: `asakusa_v3_${id}`,
    label,
    type: "corridor",
    sceneType: type,
    points: points.map(([lat, lng]) => ({ lat, lng })),
    width,
    noise,
    turbulence,
    mobility,
    words: WORDS[type] || WORDS.corridor,
    hours: HOURS[type] || HOURS.corridor
  };
}

function parseArgs(argv) {
  const options = { records: DEFAULT_RECORDS, batchSize: DEFAULT_BATCH_SIZE, dryRun: false, replaceWorld: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--records") options.records = Number(argv[++i]);
    else if (arg === "--batch-size") options.batchSize = Number(argv[++i]);
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--replace-world") options.replaceWorld = true;
    else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/seed_asakusa_skytree_v3.js [--records 20000] [--batch-size 1000] [--dry-run] [--replace-world]");
      process.exit(0);
    }
  }
  if (!Number.isFinite(options.records) || options.records < 1) throw new Error("--records must be positive");
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

const rand = seededRandom(2026052931);
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function weighted(items) {
  const total = items.reduce((sum, item) => sum + item[1], 0);
  let pick = rand() * total;
  for (const item of items) {
    pick -= item[1];
    if (pick <= 0) return item[0];
  }
  return items[items.length - 1][0];
}
function metersToLatLng(dx, dy, origin) {
  return {
    lat: origin.lat + dy / 111320,
    lng: origin.lng + dx / (111320 * Math.cos(origin.lat * Math.PI / 180))
  };
}
function latLngToMeters(pos, origin) {
  return {
    dx: (pos.lng - origin.lng) * 111320 * Math.cos(origin.lat * Math.PI / 180),
    dy: (pos.lat - origin.lat) * 111320
  };
}
function distanceMeters(a, b) {
  const bm = latLngToMeters(b, a);
  return Math.hypot(bm.dx, bm.dy);
}
function insideVoid(pos) {
  return VOIDS.some(voidZone => distanceMeters(voidZone.center, pos) < voidZone.radius);
}
function randomInZone(zone) {
  const origin = zone.center;
  const conc = zone.type === "station" ? 0.60 : zone.type === "shopping" ? 0.55 : zone.type === "shrine" ? 0.66 : zone.type === "park" ? 0.82 : 1.0;
  const pow = zone.type === "station" || zone.type === "shopping" ? 0.72 : 0.50;
  for (let attempt = 0; attempt < 14; attempt++) {
    const angle = rand() * Math.PI * 2;
    const dist = Math.pow(rand(), pow) * zone.radius * conc;
    const pos = metersToLatLng(Math.cos(angle) * dist, Math.sin(angle) * dist, origin);
    if (!insideVoid(pos) || ["park", "shrine", "water"].includes(zone.type) || rand() < 0.12) return pos;
  }
  return origin;
}
function sampleCorridor(item) {
  const origin = item.points[0];
  const segments = [];
  for (let i = 1; i < item.points.length; i++) {
    const a = latLngToMeters(item.points[i - 1], origin);
    const b = latLngToMeters(item.points[i], origin);
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
    pos: metersToLatLng(
      segment.a.dx + dx * t + (-dy / len) * (rand() - 0.5) * item.width * (0.22 + rand() * 0.64),
      segment.a.dy + dy * t + ( dx / len) * (rand() - 0.5) * item.width * (0.22 + rand() * 0.64),
      origin
    ),
    direction: (Math.atan2(dx, dy) * 180 / Math.PI + 360 + (rand() - 0.5) * 22) % 360
  };
}
function isolatedSample() {
  const center = { lat: 35.7135, lng: 139.8040 };
  const angle = rand() * Math.PI * 2;
  const dist = 900 + rand() * 2100;
  return metersToLatLng(Math.cos(angle) * dist, Math.sin(angle) * dist, center);
}
function sampleHour(profile, weekday, type) {
  let hour = weighted(profile);
  if (type === "park" && weekday >= 5 && rand() < 0.30) hour = weighted([[10, 0.18], [11, 0.18], [13, 0.20], [14, 0.22], [15, 0.14], [16, 0.08]]);
  if (rand() < 0.028) hour = weighted([[0, 0.08], [1, 0.06], [5, 0.14], [6, 0.22], [22, 0.28], [23, 0.22]]);
  return (hour + Math.floor(rand() * 3) - 1 + 24) % 24;
}
function slotForHour(hour) {
  if (hour < 6) return "night";
  if (hour < 11) return "morning";
  if (hour < 17) return "day";
  if (hour < 22) return "evening";
  return "night";
}

const SV_BASE = {
  station: { sp: [-0.58, -0.14], g: [0.24, 0.62], t: [0.34, 0.72], f: [0.16, 0.58] },
  corridor: { sp: [-0.36, 0.06], g: [-0.08, 0.28], t: [0.08, 0.42], f: [0.38, 0.82] },
  shopping: { sp: [-0.46, -0.08], g: [0.18, 0.52], t: [0.28, 0.62], f: [0.08, 0.42] },
  residential: { sp: [-0.08, 0.32], g: [0.14, 0.52], t: [-0.48, 0.02], f: [-0.48, -0.08] },
  park: { sp: [0.34, 0.82], g: [-0.58, -0.08], t: [-0.68, -0.18], f: [-0.48, 0.12] },
  water: { sp: [0.20, 0.66], g: [-0.36, 0.08], t: [-0.42, 0.08], f: [0.18, 0.62] },
  shrine: { sp: [0.22, 0.62], g: [-0.38, 0.12], t: [-0.58, -0.18], f: [-0.58, -0.08] },
  night: { sp: [-0.52, -0.04], g: [0.16, 0.58], t: [0.18, 0.66], f: [-0.04, 0.38] },
  isolated: { sp: [0.22, 0.72], g: [-0.48, 0.12], t: [-0.38, 0.12], f: [-0.38, 0.12] }
};
const SND_BASE = {
  station: { sh: 0.56, co: 0.82, tx: 0.56 },
  corridor: { sh: 0.60, co: 0.80, tx: 0.54 },
  shopping: { sh: 0.52, co: 0.76, tx: 0.50 },
  residential: { sh: 0.26, co: 0.58, tx: 0.30 },
  park: { sh: 0.16, co: 0.64, tx: 0.20 },
  water: { sh: 0.20, co: 0.70, tx: 0.24 },
  shrine: { sh: 0.12, co: 0.52, tx: 0.16 },
  night: { sh: 0.48, co: 0.62, tx: 0.60 },
  isolated: { sh: 0.20, co: 0.48, tx: 0.26 }
};

function buildSenseVector(type, mobility, hour, weekday) {
  const base = SV_BASE[type] || SV_BASE.isolated;
  const commute = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
  const night = hour <= 5 || hour >= 23;
  const weekend = weekday >= 5;
  let sp = base.sp[0] + rand() * (base.sp[1] - base.sp[0]);
  let g = base.g[0] + rand() * (base.g[1] - base.g[0]);
  let t = base.t[0] + rand() * (base.t[1] - base.t[0]);
  let f = base.f[0] + rand() * (base.f[1] - base.f[0]);
  if (mobility === "still") { f -= 0.16 + rand() * 0.10; g += 0.06 + rand() * 0.08; }
  if (mobility === "passing") { f += 0.16 + rand() * 0.14; g -= 0.06 + rand() * 0.06; }
  if (commute && !["park", "shrine", "water"].includes(type)) { t += 0.08 + rand() * 0.08; sp -= 0.06; f += 0.04; }
  if (night) { g += 0.06 + rand() * 0.08; sp -= 0.04; t -= type === "night" ? -0.02 : 0.06; }
  if (weekend && ["park", "water", "shrine"].includes(type)) { t -= 0.08; f -= 0.05; }
  return {
    spaciousness: Number(clamp(sp, -1, 1).toFixed(3)),
    gravity: Number(clamp(g, -1, 1).toFixed(3)),
    tension: Number(clamp(t, -1, 1).toFixed(3)),
    flow: Number(clamp(f, -1, 1).toFixed(3))
  };
}
function buildSoundVector(noiseLevel, turbulence, type) {
  const base = SND_BASE[type] || SND_BASE.isolated;
  return {
    loudness: Number(clamp(noiseLevel + (rand() - 0.5) * 0.06, 0, 1).toFixed(3)),
    turbulence: Number(clamp(turbulence + (rand() - 0.5) * 0.06, 0, 1).toFixed(3)),
    sharpness: Number(clamp(base.sh + (rand() - 0.5) * 0.20, 0, 1).toFixed(3)),
    continuity: Number(clamp(base.co + (rand() - 0.5) * 0.22, 0, 1).toFixed(3)),
    texture: Number(clamp(base.tx + (rand() - 0.5) * 0.20, 0, 1).toFixed(3))
  };
}
function pickSelectedWords(words) {
  const count = rand() < 0.12 ? 0 : rand() < 0.28 ? 2 : 1;
  if (!count) return [];
  const first = weighted(words);
  if (count === 1) return [first];
  const rest = words.filter(([word]) => word !== first);
  return rest.length ? [first, weighted(rest)] : [first];
}

function selectSource() {
  const type = weighted([
    ["station", 0.20], ["corridor", 0.24], ["park", 0.11], ["water", 0.15],
    ["residential", 0.16], ["shopping", 0.09], ["shrine", 0.03], ["night", 0.02]
  ]);
  if (type === "corridor") return { type, item: CORRIDORS[Math.floor(rand() * CORRIDORS.length)] };
  const pool = ZONES.filter(zone => zone.type === type);
  const weightedZones = pool.map(zone => [zone, zone.radius]);
  return { type, item: weighted(weightedZones) };
}

function buildRecords(targetCount) {
  const rows = [];
  const baseTime = Date.UTC(2026, 4, 1, 0, 0, 0);
  let guard = 0;
  while (rows.length < targetCount && guard < targetCount * 2) {
    guard++;
    const selected = rand() < 0.02 ? { type: "isolated", item: null } : selectSource();
    let profile;
    let pos;
    let direction = rand() * 360;
    let zoneId;
    if (selected.type === "isolated") {
      profile = { id: "isolated", type: "isolated", noise: [0.10, 0.44], turbulence: [0.06, 0.34], mobility: { still: 0.54, slow: 0.32, passing: 0.14 }, words: [["遠い", 0.30], ["浮く", 0.26], ["澄む", 0.22], ["薄い", 0.14], ["ほどける", 0.08]], hours: [[8, 0.08], [10, 0.12], [13, 0.16], [15, 0.16], [18, 0.14], [20, 0.14], [22, 0.12], [23, 0.08]] };
      pos = isolatedSample();
      zoneId = "isolated";
    } else if (selected.type === "corridor") {
      const sample = sampleCorridor(selected.item);
      profile = { ...selected.item, type: selected.item.sceneType || "corridor" };
      pos = sample.pos;
      direction = sample.direction;
      zoneId = selected.item.id;
    } else {
      profile = selected.item;
      pos = randomInZone(profile);
      zoneId = profile.id;
    }
    if (!["park", "water", "shrine", "isolated"].includes(profile.type) && insideVoid(pos) && rand() < 0.80) continue;

    const weekday = rows.length % 7;
    const hour = sampleHour(profile.hours, weekday, profile.type);
    const minute = Math.floor(rand() * 60);
    const timestamp = new Date(baseTime + (rows.length % 28) * 86400000 + hour * 3600000 + minute * 60000 + Math.floor(rand() * 60000)).toISOString();
    const mobility = weighted(Object.entries(profile.mobility));
    const commute = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
    const night = hour <= 5 || hour >= 23;
    const noiseLevel = clamp(profile.noise[0] + rand() * (profile.noise[1] - profile.noise[0]) + (commute && profile.type !== "park" ? 0.08 : 0) + (night ? -0.08 : 0), 0.05, 0.95);
    const turbulence = clamp(profile.turbulence[0] + rand() * (profile.turbulence[1] - profile.turbulence[0]) + (mobility === "passing" ? 0.08 : 0), 0.02, 0.92);
    const peak = clamp(noiseLevel + turbulence * 0.34 + rand() * 0.14, 0.05, 1);
    const word = weighted(profile.words);
    const selectedWords = pickSelectedWords(profile.words);
    const senseVector = buildSenseVector(profile.type, mobility, hour, weekday);
    const soundVector = buildSoundVector(noiseLevel, turbulence, profile.type);

    rows.push({
      id: `asakusa-skytree-v3-${String(rows.length).padStart(6, "0")}`,
      user_id: `asakusa-v3-user-${String(rows.length % 820).padStart(4, "0")}`,
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
      duration: Math.round(clamp(8 + rand() * 10 + (mobility === "still" ? 2 : 0), 8, 18)),
      word,
      selected_words: selectedWords,
      sense_vector: senseVector,
      sound_vector: soundVector,
      trust_score: Number(clamp(0.62 + rand() * 0.34 - (night ? 0.05 : 0), 0.55, 1).toFixed(3)),
      zone_id: zoneId,
      source: SOURCE,
      noise: Number(noiseLevel.toFixed(3)),
      flux: Number(turbulence.toFixed(3)),
      movement: mobility,
      distance: mobility === "passing" ? 140 + rand() * 520 : mobility === "slow" ? 45 + rand() * 150 : rand() * 42,
      slot: slotForHour(hour),
      created_at: timestamp
    });
  }
  return rows;
}

function toZoneRows() {
  return ZONES.map(zone => ({
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
function toCorridorRows() {
  return CORRIDORS.map(item => ({
    id: item.id,
    label: item.label,
    type: item.type,
    points: item.points,
    width: item.width,
    noise_min: item.noise[0],
    noise_max: item.noise[1],
    turbulence_min: item.turbulence[0],
    turbulence_max: item.turbulence[1],
    mobility: item.mobility,
    words: item.words,
    hours: item.hours
  }));
}
function toVoidRows() {
  return VOIDS.map(voidZone => ({
    id: voidZone.id,
    center_lat: voidZone.center.lat,
    center_lng: voidZone.center.lng,
    radius: voidZone.radius
  }));
}

function summarize(records) {
  const byType = {};
  const byZone = {};
  for (const row of records) {
    const zone = ZONES.find(item => item.id === row.zone_id);
    const corridorItem = CORRIDORS.find(item => item.id === row.zone_id);
    const type = zone ? zone.type : corridorItem ? corridorItem.sceneType : row.zone_id;
    byType[type] = (byType[type] || 0) + 1;
    byZone[row.zone_id] = (byZone[row.zone_id] || 0) + 1;
  }
  return {
    source: SOURCE,
    records: records.length,
    zones: ZONES.length,
    corridors: CORRIDORS.length,
    voids: VOIDS.length,
    byType,
    topZones: Object.entries(byZone).sort((a, b) => b[1] - a[1]).slice(0, 15),
    sample: records.slice(0, 5).map(row => ({ id: row.id, lat: row.lat, lng: row.lng, hour: row.hour, word: row.word, zone_id: row.zone_id, mobility: row.mobility }))
  };
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
    await requestSupabase("POST", table, rows.slice(i, i + batchSize), "?on_conflict=id");
    process.stdout.write(`\r${table}: ${Math.min(i + batchSize, rows.length)}/${rows.length}`);
  }
  process.stdout.write("\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const records = buildRecords(options.records);
  console.log(JSON.stringify(summarize(records), null, 2));
  if (options.dryRun) return;

  loadEnvFile(path.join(ROOT, ".env"));
  if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("sb_secret_")) throw new Error("SUPABASE_SERVICE_ROLE_KEY must be the secret service role key");

  if (options.replaceWorld) {
    for (const source of OLD_WORLD_SOURCES) {
      console.log(`Deleting ${source} records...`);
      await requestSupabase("DELETE", "records", null, `?source=eq.${source}`);
    }
    await requestSupabase("DELETE", "zones", null, "?id=like.central_%25");
    await requestSupabase("DELETE", "corridors", null, "?id=like.central_%25");
    await requestSupabase("DELETE", "voids", null, "?id=like.central_%25");
  }
  await upsertTable("zones", toZoneRows(), options.batchSize);
  await upsertTable("corridors", toCorridorRows(), options.batchSize);
  await upsertTable("voids", toVoidRows(), options.batchSize);
  await upsertTable("records", records, options.batchSize);
  console.log("Done.");
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
