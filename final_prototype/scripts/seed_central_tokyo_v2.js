#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_RECORDS = 120000;
const DEFAULT_BATCH_SIZE = 500;
const SOURCE = "central-tokyo-experience-v2";
const PREVIOUS_SOURCE = "central-tokyo-experience-v1";

const WORDS = {
  station: [["ざらつく", 0.24], ["詰まる", 0.23], ["流れる", 0.20], ["速い", 0.18], ["硬い", 0.15]],
  office: [["硬い", 0.25], ["重い", 0.21], ["乾く", 0.19], ["詰まる", 0.18], ["遠い", 0.17]],
  shopping: [["詰まる", 0.24], ["ざらつく", 0.22], ["流れる", 0.19], ["重い", 0.18], ["滞る", 0.17]],
  night: [["こもる", 0.25], ["ざらつく", 0.22], ["熱を持つ", 0.18], ["滞る", 0.18], ["重い", 0.17]],
  park: [["浮く", 0.29], ["ほどける", 0.24], ["澄む", 0.22], ["広がる", 0.16], ["薄い", 0.09]],
  water: [["澄む", 0.28], ["流れる", 0.25], ["ほどける", 0.20], ["遠い", 0.15], ["薄い", 0.12]],
  residential: [["眠い", 0.25], ["ほどける", 0.22], ["薄い", 0.20], ["遠い", 0.18], ["浮く", 0.15]],
  campus: [["こもる", 0.23], ["重い", 0.20], ["乾く", 0.20], ["眠い", 0.19], ["ほどける", 0.18]],
  shrine: [["遠い", 0.29], ["澄む", 0.25], ["浮く", 0.22], ["薄い", 0.15], ["ほどける", 0.09]]
};

const HOURS = {
  station: [[7, 0.12], [8, 0.20], [9, 0.13], [12, 0.06], [17, 0.13], [18, 0.18], [19, 0.13], [21, 0.05]],
  office: [[8, 0.13], [9, 0.17], [11, 0.08], [12, 0.13], [13, 0.10], [17, 0.13], [18, 0.14], [20, 0.08], [22, 0.04]],
  shopping: [[10, 0.08], [11, 0.11], [12, 0.14], [13, 0.12], [15, 0.13], [17, 0.13], [18, 0.13], [20, 0.10], [22, 0.06]],
  night: [[18, 0.12], [19, 0.14], [20, 0.16], [21, 0.16], [22, 0.16], [23, 0.14], [0, 0.08], [1, 0.04]],
  park: [[7, 0.06], [8, 0.08], [10, 0.13], [11, 0.14], [13, 0.12], [14, 0.16], [15, 0.15], [16, 0.10], [18, 0.06]],
  water: [[6, 0.08], [7, 0.10], [8, 0.10], [12, 0.08], [16, 0.12], [17, 0.16], [18, 0.16], [19, 0.12], [21, 0.08]],
  residential: [[6, 0.08], [7, 0.12], [8, 0.10], [18, 0.13], [19, 0.16], [20, 0.16], [21, 0.14], [22, 0.08], [23, 0.03]],
  campus: [[9, 0.08], [10, 0.12], [11, 0.13], [12, 0.12], [13, 0.12], [14, 0.13], [15, 0.13], [16, 0.10], [17, 0.07]],
  shrine: [[8, 0.12], [9, 0.14], [10, 0.14], [11, 0.12], [12, 0.10], [14, 0.12], [15, 0.14], [16, 0.12]]
};

const SCENES = {
  station: { type: "station", noise: [0.60, 0.94], turbulence: [0.46, 0.88], mobility: { passing: 0.62, slow: 0.31, still: 0.07 } },
  interchange: { type: "station", noise: [0.70, 0.98], turbulence: [0.54, 0.94], mobility: { passing: 0.70, slow: 0.25, still: 0.05 } },
  office: { type: "office", noise: [0.34, 0.72], turbulence: [0.20, 0.58], mobility: { passing: 0.30, slow: 0.46, still: 0.24 } },
  shopping: { type: "shopping", noise: [0.48, 0.86], turbulence: [0.34, 0.78], mobility: { passing: 0.34, slow: 0.50, still: 0.16 } },
  night: { type: "night", noise: [0.50, 0.88], turbulence: [0.36, 0.82], mobility: { passing: 0.28, slow: 0.48, still: 0.24 } },
  park: { type: "park", noise: [0.08, 0.38], turbulence: [0.04, 0.32], mobility: { passing: 0.10, slow: 0.34, still: 0.56 } },
  water: { type: "water", noise: [0.12, 0.44], turbulence: [0.08, 0.40], mobility: { passing: 0.20, slow: 0.44, still: 0.36 } },
  residential: { type: "residential", noise: [0.16, 0.52], turbulence: [0.08, 0.40], mobility: { passing: 0.17, slow: 0.45, still: 0.38 } },
  campus: { type: "campus", noise: [0.24, 0.60], turbulence: [0.16, 0.50], mobility: { passing: 0.14, slow: 0.44, still: 0.42 } },
  shrine: { type: "shrine", noise: [0.08, 0.30], turbulence: [0.04, 0.20], mobility: { passing: 0.08, slow: 0.28, still: 0.64 } }
};
for (const [key, scene] of Object.entries(SCENES)) {
  scene.words = WORDS[scene.type] || WORDS.station;
  scene.hours = HOURS[scene.type] || HOURS.station;
}

const DISTRICTS = [
  ["tokyo_marunouchi", "東京駅丸の内", "interchange", 35.6812, 139.7671, 2.20],
  ["tokyo_yaesu", "東京駅八重洲", "interchange", 35.6802, 139.7704, 1.72],
  ["otemachi", "大手町", "office", 35.6860, 139.7649, 1.36],
  ["nihonbashi", "日本橋", "office", 35.6827, 139.7745, 1.08],
  ["kyobashi", "京橋", "office", 35.6764, 139.7701, 0.88],
  ["ginza_chuo", "銀座中央通り", "shopping", 35.6718, 139.7650, 1.55],
  ["ginza_corridor", "銀座コリドー", "night", 35.6703, 139.7610, 1.05],
  ["yurakucho", "有楽町", "night", 35.6750, 139.7630, 1.02],
  ["hibiya", "日比谷", "park", 35.6739, 139.7556, 0.95],
  ["shinbashi", "新橋", "interchange", 35.6663, 139.7584, 1.38],
  ["shiodome", "汐留", "office", 35.6627, 139.7595, 0.82],
  ["toranomon", "虎ノ門", "office", 35.6662, 139.7499, 1.00],
  ["kamiyacho", "神谷町", "office", 35.6627, 139.7453, 0.76],
  ["roppongi", "六本木", "night", 35.6637, 139.7310, 1.25],
  ["azabu_juban", "麻布十番", "residential", 35.6547, 139.7365, 0.72],
  ["akasaka", "赤坂", "night", 35.6770, 139.7374, 1.02],
  ["nagatacho", "永田町", "office", 35.6780, 139.7410, 0.68],
  ["aoyama", "青山", "shopping", 35.6652, 139.7123, 0.98],
  ["omotesando", "表参道", "shopping", 35.6650, 139.7120, 1.20],
  ["harajuku", "原宿", "shopping", 35.6716, 139.7046, 1.28],
  ["yoyogi_park", "代々木公園", "park", 35.6692, 139.6932, 1.05],
  ["shibuya", "渋谷駅前", "interchange", 35.6595, 139.7005, 2.05],
  ["shibuya_center", "渋谷センター街", "night", 35.6604, 139.6988, 1.40],
  ["daikanyama", "代官山", "residential", 35.6481, 139.7031, 0.68],
  ["nakameguro", "中目黒", "water", 35.6442, 139.6992, 0.86],
  ["ebisu", "恵比寿", "station", 35.6467, 139.7101, 1.02],
  ["meguro", "目黒", "station", 35.6339, 139.7156, 0.82],
  ["gotanda", "五反田", "station", 35.6264, 139.7234, 0.86],
  ["shinagawa", "品川港南口", "interchange", 35.6285, 139.7415, 1.22],
  ["takanawa", "高輪", "office", 35.6355, 139.7407, 0.72],
  ["tamachi", "田町", "office", 35.6457, 139.7470, 0.84],
  ["hamamatsucho", "浜松町", "interchange", 35.6550, 139.7567, 0.92],
  ["takeshiba", "竹芝", "water", 35.6543, 139.7625, 0.68],
  ["odaiba", "お台場", "water", 35.6267, 139.7753, 0.88],
  ["toyosu", "豊洲", "station", 35.6550, 139.7966, 0.96],
  ["toyosu_market", "豊洲市場", "water", 35.6456, 139.7850, 0.78],
  ["tsukiji", "築地", "shopping", 35.6654, 139.7707, 0.86],
  ["kachidoki", "勝どき", "residential", 35.6584, 139.7768, 0.72],
  ["monzennakacho", "門前仲町", "night", 35.6718, 139.7958, 0.82],
  ["kiyosumi", "清澄白河", "park", 35.6811, 139.7985, 0.76],
  ["sumida_walk", "隅田川テラス", "water", 35.7045, 139.7999, 0.92],
  ["asakusa", "浅草", "shopping", 35.7101, 139.7977, 0.96],
  ["ueno", "上野", "park", 35.7137, 139.7767, 1.02],
  ["ameyoko", "アメ横", "shopping", 35.7094, 139.7747, 1.10],
  ["akihabara", "秋葉原", "interchange", 35.6984, 139.7730, 1.30],
  ["ochanomizu", "御茶ノ水", "campus", 35.6993, 139.7649, 0.82],
  ["kanda", "神田", "night", 35.6917, 139.7709, 0.86],
  ["kudanshita", "九段下", "office", 35.6956, 139.7519, 0.76],
  ["iidabashi", "飯田橋", "water", 35.7013, 139.7444, 0.82],
  ["yotsuya", "四ツ谷", "station", 35.6860, 139.7307, 0.80],
  ["ichigaya", "市ヶ谷", "water", 35.6921, 139.7357, 0.70],
  ["shinjuku_south", "新宿南口", "interchange", 35.6887, 139.7002, 1.85],
  ["shinjuku_west", "西新宿", "office", 35.6913, 139.6925, 1.20],
  ["kabukicho", "歌舞伎町", "night", 35.6950, 139.7037, 1.42],
  ["shinjuku_gyoen", "新宿御苑", "park", 35.6852, 139.7100, 1.00],
  ["takadanobaba", "高田馬場", "station", 35.7123, 139.7038, 0.92],
  ["waseda", "早稲田", "campus", 35.7077, 139.7210, 0.74],
  ["ikebukuro_east", "池袋東口", "interchange", 35.7295, 139.7132, 1.45],
  ["ikebukuro_west", "池袋西口", "night", 35.7312, 139.7081, 1.08],
  ["kinshicho", "錦糸町", "interchange", 35.6972, 139.8144, 1.05]
];

const LOCAL_PATTERNS = {
  station: [
    ["north_exit", "北口", 0, 58, 0.92], ["south_exit", "南口", 180, 58, 0.88], ["east_exit", "東口", 90, 54, 0.84],
    ["west_exit", "西口", 270, 54, 0.82], ["ticket_gate", "改札前", 18, 26, 1.00], ["bus_stop", "バス乗り場", 145, 92, 0.60],
    ["underpass", "地下通路", 225, 84, 0.56], ["station_backstreet", "駅裏路地", 305, 128, 0.42]
  ],
  interchange: [
    ["main_gate", "中央改札", 0, 32, 1.16], ["deck", "歩行デッキ", 68, 76, 0.92], ["taxi_pool", "タクシー乗り場", 132, 90, 0.74],
    ["bus_loop", "バスロータリー", 206, 116, 0.78], ["underpass", "地下通路", 270, 94, 0.70], ["crossing", "駅前横断歩道", 330, 72, 1.02],
    ["side_gate", "脇改札", 36, 118, 0.66], ["mall_link", "商業連絡口", 248, 132, 0.64], ["platform_edge", "ホーム端", 164, 46, 0.58],
    ["backstreet", "駅裏細道", 300, 164, 0.38]
  ],
  office: [
    ["tower_entrance", "ビル入口", 18, 70, 0.74], ["lobby_edge", "ロビー脇", 96, 48, 0.66], ["office_canyon", "ビル谷間", 172, 94, 0.78],
    ["lunch_crossing", "昼の交差点", 248, 108, 0.72], ["service_lane", "搬入口通り", 315, 132, 0.40], ["pocket_plaza", "公開空地", 55, 158, 0.48],
    ["metro_stair", "地下鉄階段", 220, 62, 0.58], ["quiet_side", "裏手歩道", 285, 180, 0.34]
  ],
  shopping: [
    ["main_street", "表通り", 0, 62, 0.92], ["crosswalk", "横断歩道", 74, 76, 0.86], ["department_door", "百貨店入口", 142, 54, 0.74],
    ["side_alley", "横道", 214, 118, 0.56], ["cafe_front", "店先", 292, 92, 0.62], ["arcade", "アーケード", 32, 136, 0.68],
    ["queue_edge", "行列の端", 170, 104, 0.58], ["back_lane", "裏路地", 250, 164, 0.38]
  ],
  night: [
    ["bar_lane", "飲み屋通り", 20, 58, 0.82], ["neon_crossing", "夜の交差点", 84, 72, 0.88], ["under_rail", "高架下", 156, 96, 0.72],
    ["taxi_edge", "タクシー待ち", 224, 84, 0.62], ["late_alley", "深夜路地", 300, 128, 0.50], ["station_return", "帰路改札前", 342, 70, 0.66],
    ["service_back", "店裏", 254, 178, 0.34]
  ],
  park: [
    ["gate", "公園入口", 10, 100, 0.58], ["inner_path", "園路", 78, 176, 0.54], ["bench_edge", "ベンチ周り", 154, 128, 0.42],
    ["tree_shadow", "木陰", 228, 218, 0.38], ["outer_walk", "外周歩道", 304, 182, 0.52], ["quiet_lawn", "芝生端", 28, 260, 0.34],
    ["pond_side", "水辺", 194, 246, 0.30]
  ],
  water: [
    ["river_terrace", "川沿いテラス", 18, 112, 0.60], ["bridge_foot", "橋詰", 82, 78, 0.58], ["canal_edge", "運河沿い", 156, 136, 0.52],
    ["deck_corner", "デッキ端", 230, 168, 0.48], ["waterfront_path", "水辺歩道", 302, 134, 0.54], ["quiet_revetment", "護岸の静けさ", 40, 210, 0.32]
  ],
  residential: [
    ["slope", "坂道", 24, 138, 0.44], ["small_crossing", "小さな交差点", 88, 112, 0.46], ["apartment_edge", "集合住宅前", 154, 126, 0.40],
    ["shop_corner", "商店角", 220, 94, 0.42], ["backstreet", "住宅路地", 286, 176, 0.38], ["school_route", "通学路", 338, 156, 0.36]
  ],
  campus: [
    ["gate", "校門", 12, 86, 0.54], ["campus_path", "構内通路", 80, 148, 0.48], ["library_edge", "図書館脇", 148, 116, 0.44],
    ["lecture_exit", "講義棟出口", 218, 96, 0.50], ["student_street", "学生通り", 292, 136, 0.46], ["quiet_corner", "静かな隅", 340, 186, 0.30]
  ],
  shrine: [
    ["gate", "鳥居前", 0, 78, 0.48], ["approach", "参道", 70, 112, 0.42], ["tree_edge", "木立", 148, 158, 0.34],
    ["stone_path", "石畳", 224, 98, 0.40], ["quiet_back", "境内奥", 305, 176, 0.28]
  ]
};

const ROUTES = [
  ["yamanote_south_west", "山手線南西側", ["shinagawa", "gotanda", "meguro", "ebisu", "shibuya", "harajuku", "shinjuku_south", "takadanobaba", "ikebukuro_east"], 120, 1.05, "station"],
  ["yamanote_east", "山手線東側", ["ikebukuro_east", "ueno", "akihabara", "kanda", "tokyo_marunouchi", "yurakucho", "shinbashi", "hamamatsucho", "tamachi", "shinagawa"], 122, 1.08, "station"],
  ["ginza_omotesando_surface", "銀座-青山-渋谷地上動線", ["ginza_chuo", "toranomon", "akasaka", "aoyama", "omotesando", "shibuya"], 90, 0.72, "shopping"],
  ["sumida_bay_waterfront", "隅田川-湾岸水辺", ["asakusa", "sumida_walk", "kiyosumi", "monzennakacho", "toyosu", "toyosu_market", "odaiba"], 150, 0.62, "water"],
  ["moat_campus_line", "外濠-大学通り", ["iidabashi", "ichigaya", "yotsuya", "shinjuku_gyoen", "waseda", "takadanobaba"], 96, 0.56, "campus"],
  ["night_spine", "夜の滞留軸", ["shibuya_center", "roppongi", "akasaka", "ginza_corridor", "shinbashi", "kanda", "ueno", "ikebukuro_west"], 105, 0.68, "night"]
];

const VOIDS = [
  ["central_imperial_palace_void", 35.6852, 139.7528, 780],
  ["central_shinjuku_gyoen_core_void", 35.6852, 139.7100, 520],
  ["central_yoyogi_park_core_void", 35.6717, 139.6949, 640],
  ["central_tokyo_bay_void", 35.6220, 139.7980, 1450],
  ["central_arakawa_far_void", 35.7250, 139.8350, 880]
];

function parseArgs(argv) {
  const options = {
    records: DEFAULT_RECORDS,
    batchSize: DEFAULT_BATCH_SIZE,
    dryRun: false,
    replaceV1: false,
    resetV2: false,
    statsOnly: false
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--records") options.records = Number(argv[++i]);
    else if (arg === "--batch-size") options.batchSize = Number(argv[++i]);
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--replace-v1") options.replaceV1 = true;
    else if (arg === "--reset-v2") options.resetV2 = true;
    else if (arg === "--stats-only") options.statsOnly = true;
    else if (arg === "--help" || arg === "-h") {
      console.log([
        "Usage: node scripts/seed_central_tokyo_v2.js [--records 120000] [--batch-size 500] [--dry-run] [--stats-only] [--reset-v2] [--replace-v1]",
        "",
        "  --dry-run      Build and print stats/sample without Supabase writes.",
        "  --stats-only   Print compact stats only.",
        "  --reset-v2     Delete existing central-tokyo-experience-v2 rows before inserting.",
        "  --replace-v1   Delete central-tokyo-experience-v1 and v2 rows before inserting v2.",
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

const rand = seededRandom(2026052924);
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
function distanceMeters(a, b) {
  const origin = a;
  const bm = latLngToMeters(b, origin);
  return Math.hypot(bm.dx, bm.dy);
}
function offset(center, degrees, meters) {
  const rad = degrees * Math.PI / 180;
  return metersToLatLng(Math.sin(rad) * meters, Math.cos(rad) * meters, center);
}
function jitter(pos, meters) {
  return offset(pos, rand() * 360, Math.pow(rand(), 0.65) * meters);
}
function hourSlot(hour) {
  if (hour < 6) return "night";
  if (hour < 11) return "morning";
  if (hour < 17) return "day";
  if (hour < 22) return "evening";
  return "night";
}

function buildZones() {
  const zones = [];
  for (const [districtId, districtLabel, sceneKey, lat, lng, districtWeight] of DISTRICTS) {
    const center = { lat, lng };
    const scene = SCENES[sceneKey];
    const patterns = LOCAL_PATTERNS[scene.type] || LOCAL_PATTERNS.station;
    const extraCount = Math.max(0, Math.round((districtWeight - 0.7) * 3));
    const selectedPatterns = patterns.concat(patterns.slice(0, extraCount));
    selectedPatterns.forEach(([suffix, labelSuffix, angle, dist, patternWeight], index) => {
      const variantCount = 1 + (districtWeight > 0.82 && index % 2 === 0 ? 1 : 0) + (districtWeight > 1.18 && index % 3 === 0 ? 1 : 0);
      for (let variant = 0; variant < variantCount; variant++) {
        const variantAngle = angle + (variant - 0.5) * 18 + (rand() - 0.5) * 14;
        const variantDist = dist * (0.82 + rand() * 0.36) + variant * (22 + rand() * 18);
        const point = jitter(offset(center, variantAngle, variantDist), 12 + rand() * 18);
        const micro = index >= patterns.length ? "spill" : suffix;
        const radiusBase = scene.type === "station" ? 36 : scene.type === "park" ? 74 : scene.type === "water" ? 66 : scene.type === "residential" ? 70 : 50;
        const radius = Math.round(radiusBase * (0.62 + rand() * 0.68) * (sceneKey === "interchange" ? 1.08 : 1));
        const variantLabel = variant === 0 ? labelSuffix : variant === 1 ? `${labelSuffix}脇` : `${labelSuffix}角`;
        zones.push({
          id: `central_v2_${districtId}_${micro}_${index}_${variant}`,
          districtId,
          label: `${districtLabel}${variantLabel}`,
          type: scene.type,
          sceneKey,
          center: point,
          radius,
          weight: Number((districtWeight * patternWeight * (0.70 + rand() * 0.28) / variantCount).toFixed(4)),
          noise: scene.noise,
          turbulence: scene.turbulence,
          mobility: scene.mobility,
          words: scene.words,
          hours: scene.hours
        });
      }
    });
  }
  return zones;
}

function buildCorridors(zones) {
  const byDistrict = new Map(DISTRICTS.map(([id, label, sceneKey, lat, lng, weight]) => [id, { id, label, sceneKey, center: { lat, lng }, weight }]));
  const corridors = [];
  for (const [routeId, routeLabel, ids, width, weight, sceneKey] of ROUTES) {
    for (let i = 1; i < ids.length; i++) {
      const a = byDistrict.get(ids[i - 1]);
      const b = byDistrict.get(ids[i]);
      if (!a || !b) continue;
      const scene = SCENES[sceneKey] || SCENES.station;
      corridors.push({
        id: `central_v2_${routeId}_${String(i).padStart(2, "0")}`,
        label: `${routeLabel} ${a.label}-${b.label}`,
        type: "corridor",
        points: [a.center, offset(a.center, rand() * 360, 60 + rand() * 80), offset(b.center, rand() * 360, 60 + rand() * 80), b.center],
        width: Math.round(width * (0.76 + rand() * 0.42)),
        weight: Number((weight * (a.weight + b.weight) * 0.46).toFixed(4)),
        sceneKey,
        noise: scene.noise,
        turbulence: scene.turbulence,
        mobility: sceneKey === "water" ? SCENES.water.mobility : { passing: 0.62, slow: 0.31, still: 0.07 },
        words: scene.words,
        hours: scene.hours
      });
    }
  }

  for (const district of byDistrict.values()) {
    const localZones = zones.filter(zone => zone.districtId === district.id);
    for (let i = 1; i < localZones.length; i++) {
      const a = localZones[i - 1];
      const b = localZones[i];
      if (distanceMeters(a.center, b.center) > 360) continue;
      const scene = SCENES[a.sceneKey] || SCENES.station;
      corridors.push({
        id: `central_v2_${district.id}_local_${String(i).padStart(2, "0")}`,
        label: `${district.label}細街路 ${i}`,
        type: "corridor",
        points: [a.center, b.center],
        width: Math.round((a.type === "park" || a.type === "water") ? 52 + rand() * 58 : 34 + rand() * 46),
        weight: Number((a.weight * 0.18 + b.weight * 0.18).toFixed(4)),
        sceneKey: a.sceneKey,
        noise: scene.noise,
        turbulence: scene.turbulence,
        mobility: scene.mobility,
        words: scene.words,
        hours: scene.hours
      });
    }
  }
  return corridors;
}

function buildVoids() {
  return VOIDS.map(([id, lat, lng, radius]) => ({ id, center: { lat, lng }, radius }));
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
  campus: { sp: [-0.18, 0.22], g: [0.08, 0.46], t: [-0.08, 0.34], f: [-0.28, 0.22] },
  shrine: { sp: [0.22, 0.62], g: [-0.38, 0.12], t: [-0.58, -0.18], f: [-0.58, -0.08] }
};
const SND_BASE = {
  station: { sh: 0.60, co: 0.82, tx: 0.58 }, office: { sh: 0.42, co: 0.68, tx: 0.42 },
  shopping: { sh: 0.54, co: 0.76, tx: 0.52 }, night: { sh: 0.48, co: 0.62, tx: 0.60 },
  park: { sh: 0.16, co: 0.64, tx: 0.20 }, water: { sh: 0.20, co: 0.70, tx: 0.24 },
  residential: { sh: 0.26, co: 0.58, tx: 0.30 }, campus: { sh: 0.38, co: 0.70, tx: 0.42 },
  shrine: { sh: 0.12, co: 0.52, tx: 0.16 }
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
  if (commute && !["park", "water", "shrine"].includes(type)) { t += 0.10; sp -= 0.08; }
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

function pickSelectedWords(words) {
  const first = weighted(words);
  if (rand() < 0.17) return [];
  if (rand() < 0.28) {
    const rest = words.filter(([word]) => word !== first);
    return rest.length ? [first, weighted(rest)] : [first];
  }
  return [first];
}

function buildUserProfiles(count) {
  const districtIds = DISTRICTS.map(([id]) => id);
  const users = [];
  for (let index = 0; index < count; index++) {
    const home = districtIds[Math.floor(rand() * districtIds.length)];
    const work = districtIds[Math.floor(rand() * districtIds.length)];
    const leisure = districtIds[Math.floor(rand() * districtIds.length)];
    users.push({ id: `central-v2-user-${String(index).padStart(5, "0")}`, home, work, leisure });
  }
  return users;
}

function buildRecords(targetCount, zones, corridors) {
  const rows = [];
  const byDistrict = new Map();
  for (const zone of zones) {
    if (!byDistrict.has(zone.districtId)) byDistrict.set(zone.districtId, []);
    byDistrict.get(zone.districtId).push(zone);
  }
  const weightedZones = zones.map(zone => [{ kind: "zone", item: zone }, zone.weight]);
  const weightedCorridors = corridors.map(corridor => [{ kind: "corridor", item: corridor }, corridor.weight]);
  const mixedSources = weightedZones.concat(weightedCorridors);
  const users = buildUserProfiles(10800);
  const baseTime = Date.UTC(2026, 4, 1, 0, 0, 0);

  for (let index = 0; index < targetCount; index++) {
    const user = users[index % users.length];
    const weekday = index % 28 % 7;
    const phase = rand();
    let selected;
    if (phase < 0.42) {
      selected = weighted(mixedSources);
    } else {
      const district = phase < 0.64 ? user.work : phase < 0.82 ? user.home : user.leisure;
      const local = byDistrict.get(district);
      selected = { kind: "zone", item: local ? weighted(local.map(zone => [zone, zone.weight])) : weighted(weightedZones).item };
    }

    const profile = selected.item;
    const scene = SCENES[profile.sceneKey] || SCENES.station;
    let pos;
    let direction = rand() * 360;
    if (selected.kind === "corridor") {
      const sample = sampleCorridor(profile);
      pos = sample.latLng;
      direction = sample.direction;
    } else {
      const pow = ["station", "shopping", "night"].includes(profile.type) ? 0.76 : 0.58;
      pos = jitter(profile.center, Math.pow(rand(), pow) * profile.radius);
    }

    let hour = Number(weighted(scene.hours));
    if (weekday >= 5 && ["shopping", "park", "water"].includes(profile.type) && rand() < 0.34) {
      hour = Number(weighted([[10, 0.12], [11, 0.16], [12, 0.14], [14, 0.20], [15, 0.18], [16, 0.10], [18, 0.10]]));
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
    const selectedWords = pickSelectedWords(scene.words);
    const senseVector = buildSenseVector(profile.type, mobility, hour, weekday);
    const soundVector = buildSoundVector(noiseLevel, turbulence, profile.type);
    const peak = clamp(noiseLevel + turbulence * 0.34 + rand() * 0.14, 0.05, 1);

    rows.push({
      id: `central-tokyo-v2-${String(index).padStart(7, "0")}`,
      user_id: user.id,
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

function summarize(zones, corridors, records) {
  const byType = {};
  const bySlot = {};
  const byDistrict = {};
  for (const zone of zones) byType[zone.type] = (byType[zone.type] || 0) + 1;
  for (const row of records) {
    bySlot[row.slot] = (bySlot[row.slot] || 0) + 1;
    const district = row.zone_id.split("_").slice(2, 4).join("_");
    byDistrict[district] = (byDistrict[district] || 0) + 1;
  }
  const topDistricts = Object.entries(byDistrict).sort((a, b) => b[1] - a[1]).slice(0, 12);
  return {
    source: SOURCE,
    zones: zones.length,
    corridors: corridors.length,
    records: records.length,
    zoneTypes: byType,
    slots: bySlot,
    topDistricts,
    sample: records.slice(0, 5).map(row => ({
      id: row.id,
      user_id: row.user_id,
      lat: row.lat,
      lng: row.lng,
      hour: row.hour,
      word: row.word,
      zone_id: row.zone_id,
      mobility: row.mobility
    }))
  };
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
  const corridors = buildCorridors(zones);
  const voids = buildVoids();
  const records = buildRecords(options.records, zones, corridors);
  const stats = summarize(zones, corridors, records);
  console.log(JSON.stringify(stats, null, 2));
  if (options.dryRun || options.statsOnly) return;

  loadEnvFile(path.join(ROOT, ".env"));
  if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("sb_secret_")) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY must be the secret service role key, not the publishable key");
  }

  await upsertTable("zones", toZoneRows(zones), options.batchSize);
  await upsertTable("corridors", toCorridorRows(corridors), options.batchSize);
  await upsertTable("voids", toVoidRows(voids), options.batchSize);
  if (options.replaceV1) {
    console.log(`Deleting existing ${PREVIOUS_SOURCE} records...`);
    await requestSupabase("DELETE", "records", null, `?source=eq.${PREVIOUS_SOURCE}`);
    console.log(`Deleting existing ${SOURCE} records...`);
    await requestSupabase("DELETE", "records", null, `?source=eq.${SOURCE}`);
  } else if (options.resetV2) {
    console.log(`Deleting existing ${SOURCE} records...`);
    await requestSupabase("DELETE", "records", null, `?source=eq.${SOURCE}`);
  }
  await upsertTable("records", records, options.batchSize);
  console.log("Done.");
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
