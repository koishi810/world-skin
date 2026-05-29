#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = "tokyo-23ku-kokubunji-scale-v4";
const DEFAULT_RECORDS = 120000;
const DEFAULT_BATCH_SIZE = 1000;
const OLD_WORLD_SOURCES = [
  "central-tokyo-experience-v1",
  "central-tokyo-experience-v2",
  "asakusa-skytree-kokubunji-scale-v3",
  SOURCE
];

const WORDS = {
  station: [["ざらつく", 0.28], ["詰まる", 0.25], ["硬い", 0.18], ["流れる", 0.17], ["重い", 0.12]],
  corridor: [["流れる", 0.28], ["速い", 0.23], ["ざらつく", 0.21], ["乾く", 0.16], ["硬い", 0.12]],
  shopping: [["詰まる", 0.25], ["ざらつく", 0.22], ["重い", 0.19], ["滞る", 0.18], ["遠い", 0.16]],
  office: [["硬い", 0.25], ["重い", 0.21], ["乾く", 0.19], ["詰まる", 0.18], ["遠い", 0.17]],
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
  office: [[8, 0.13], [9, 0.17], [11, 0.08], [12, 0.13], [13, 0.10], [17, 0.13], [18, 0.14], [20, 0.08], [22, 0.04]],
  park: [[8, 0.07], [9, 0.10], [10, 0.14], [11, 0.13], [12, 0.10], [13, 0.10], [14, 0.15], [15, 0.13], [16, 0.08]],
  water: [[6, 0.08], [7, 0.10], [8, 0.10], [12, 0.08], [16, 0.12], [17, 0.16], [18, 0.16], [19, 0.12], [21, 0.08]],
  residential: [[6, 0.08], [7, 0.12], [8, 0.10], [18, 0.13], [19, 0.16], [20, 0.16], [21, 0.14], [22, 0.08], [23, 0.03]],
  shrine: [[8, 0.12], [9, 0.14], [10, 0.14], [11, 0.12], [12, 0.10], [14, 0.12], [15, 0.14], [16, 0.12]],
  night: [[18, 0.12], [19, 0.14], [20, 0.16], [21, 0.16], [22, 0.16], [23, 0.14], [0, 0.08], [1, 0.04]]
};

const SCENE = {
  station: { noise: [0.58, 0.90], turbulence: [0.44, 0.84], mobility: { passing: 0.50, slow: 0.36, still: 0.14 } },
  corridor: { noise: [0.38, 0.74], turbulence: [0.26, 0.64], mobility: { passing: 0.56, slow: 0.36, still: 0.08 } },
  shopping: { noise: [0.44, 0.82], turbulence: [0.30, 0.70], mobility: { passing: 0.32, slow: 0.50, still: 0.18 } },
  office: { noise: [0.34, 0.72], turbulence: [0.20, 0.58], mobility: { passing: 0.30, slow: 0.46, still: 0.24 } },
  park: { noise: [0.08, 0.34], turbulence: [0.05, 0.30], mobility: { passing: 0.08, slow: 0.30, still: 0.62 } },
  water: { noise: [0.12, 0.44], turbulence: [0.08, 0.38], mobility: { passing: 0.20, slow: 0.44, still: 0.36 } },
  residential: { noise: [0.14, 0.48], turbulence: [0.08, 0.36], mobility: { passing: 0.14, slow: 0.46, still: 0.40 } },
  shrine: { noise: [0.08, 0.30], turbulence: [0.04, 0.20], mobility: { passing: 0.08, slow: 0.28, still: 0.64 } },
  night: { noise: [0.46, 0.84], turbulence: [0.32, 0.76], mobility: { passing: 0.26, slow: 0.48, still: 0.26 } }
};

const LEVEL_COUNTS = { S: 2000, A: 1400, B: 800, C: 350, D: 80, E: 8 };
const AREAS = [
  // S: strongest daily flows, capped at 2000 each
  a("shinjuku", "新宿", 35.6909, 139.7003, "S", "night"),
  a("shibuya", "渋谷", 35.6595, 139.7005, "S", "night"),
  a("ikebukuro", "池袋", 35.7295, 139.7132, "S", "night"),
  a("tokyo_marunouchi", "東京丸の内", 35.6812, 139.7671, "S", "office"),
  a("ginza_shinbashi", "銀座新橋", 35.6694, 139.7626, "S", "shopping"),
  a("shinagawa", "品川", 35.6285, 139.7415, "S", "office"),
  a("ueno_okachimachi", "上野御徒町", 35.7099, 139.7747, "S", "shopping"),
  a("asakusa_skytree", "浅草天空樹", 35.7135, 139.8040, "S", "water"),
  a("akihabara_kanda", "秋葉原神田", 35.6965, 139.7720, "S", "shopping"),
  a("roppongi_akasaka", "六本木赤坂", 35.6685, 139.7336, "S", "night"),
  a("ebisu_meguro", "恵比寿目黒", 35.6415, 139.7130, "S", "shopping"),
  a("toyoso_tsukiji", "豊洲築地", 35.6572, 139.7903, "S", "water"),
  a("kitasenju", "北千住", 35.7490, 139.8055, "S", "station"),
  a("nakano", "中野", 35.7060, 139.6656, "S", "shopping"),
  a("kamata", "蒲田", 35.5625, 139.7160, "S", "station"),

  // A
  a("nihonbashi_ningyocho", "日本橋人形町", 35.6840, 139.7793, "A", "office"),
  a("otemachi_kanda", "大手町神田", 35.6892, 139.7656, "A", "office"),
  a("hamamatsucho_tamachi", "浜松町田町", 35.6520, 139.7522, "A", "office"),
  a("gotanda_osaki", "五反田大崎", 35.6226, 139.7253, "A", "office"),
  a("yoyogi_harajuku", "代々木原宿", 35.6726, 139.7022, "A", "park"),
  a("omotesando_aoyama", "表参道青山", 35.6652, 139.7123, "A", "shopping"),
  a("yotsuya_ichigaya", "四谷市ヶ谷", 35.6902, 139.7335, "A", "water"),
  a("iidabashi_kagurazaka", "飯田橋神楽坂", 35.7023, 139.7414, "A", "water"),
  a("takadanobaba_waseda", "高田馬場早稲田", 35.7114, 139.7114, "A", "campus"),
  a("kinshicho", "錦糸町", 35.6972, 139.8144, "A", "station"),
  a("monzennakacho_kiyosumi", "門前仲町清澄", 35.6761, 139.7971, "A", "water"),
  a("ryogoku_morishita", "両国森下", 35.6947, 139.7956, "A", "water"),
  a("nishinippori_nippori", "日暮里西日暮里", 35.7303, 139.7705, "A", "station"),
  a("akabane", "赤羽", 35.7780, 139.7209, "A", "station"),
  a("itabashi_oyama", "板橋大山", 35.7470, 139.7046, "A", "shopping"),
  a("nerima", "練馬", 35.7378, 139.6545, "A", "residential"),
  a("jiyugaoka", "自由が丘", 35.6074, 139.6686, "A", "shopping"),
  a("sangenjaya", "三軒茶屋", 35.6436, 139.6713, "A", "shopping"),
  a("shimokitazawa", "下北沢", 35.6615, 139.6660, "A", "night"),
  a("futako_tamagawa", "二子玉川", 35.6115, 139.6260, "A", "water"),
  a("omori", "大森", 35.5885, 139.7279, "A", "station"),
  a("haneda_kamata", "羽田蒲田", 35.5533, 139.7470, "A", "water"),
  a("kasai_nishikasai", "葛西西葛西", 35.6640, 139.8685, "A", "residential"),
  a("koiwa", "小岩", 35.7330, 139.8819, "A", "station"),
  a("ayase_kameari", "綾瀬亀有", 35.7650, 139.8328, "A", "residential"),
  a("machiya_minamisenju", "町屋南千住", 35.7404, 139.7937, "A", "residential"),
  a("sugamo_komagome", "巣鴨駒込", 35.7351, 139.7462, "A", "residential"),
  a("mejiro_zoshigaya", "目白雑司が谷", 35.7192, 139.7136, "A", "residential"),
  a("oimachi", "大井町", 35.6063, 139.7348, "A", "station"),
  a("ariake_odaiba", "有明お台場", 35.6305, 139.7818, "A", "water"),
  a("toyocho_kiba", "東陽町木場", 35.6694, 139.8134, "A", "water"),
  a("senzoku_hatagaya", "幡ヶ谷笹塚", 35.6748, 139.6680, "A", "residential"),
  a("ogikubo_asagaya", "荻窪阿佐ヶ谷", 35.7048, 139.6222, "A", "shopping"),
  a("koenji", "高円寺", 35.7052, 139.6503, "A", "night"),
  a("toshimaen_hikarigaoka", "豊島園光が丘", 35.7515, 139.6322, "A", "park"),

  // B
  a("higashi_nakano", "東中野", 35.7068, 139.6820, "B", "residential"),
  a("ochiai_nakai", "落合中井", 35.7144, 139.6872, "B", "residential"),
  a("sendagaya", "千駄ヶ谷", 35.6814, 139.7110, "B", "park"),
  a("hiroo_azabu", "広尾麻布", 35.6525, 139.7248, "B", "residential"),
  a("shirokane_takanawa", "白金高輪", 35.6429, 139.7341, "B", "residential"),
  a("gakugeidaigaku_yutenji", "学芸大学祐天寺", 35.6328, 139.6885, "B", "residential"),
  a("komazawa_sakura", "駒沢桜新町", 35.6311, 139.6559, "B", "park"),
  a("chitose_funabashi", "千歳船橋", 35.6476, 139.6221, "B", "residential"),
  a("meidaimae_eifukucho", "明大前永福町", 35.6731, 139.6408, "B", "residential"),
  a("hamadayama_takaido", "浜田山高井戸", 35.6830, 139.6166, "B", "residential"),
  a("shakujii_oizumi", "石神井大泉", 35.7477, 139.5978, "B", "park"),
  a("heiwadai_narimasu", "平和台成増", 35.7698, 139.6410, "B", "residential"),
  a("tobu_nerima", "東武練馬", 35.7680, 139.6625, "B", "shopping"),
  a("jujo_oji", "十条王子", 35.7567, 139.7334, "B", "shopping"),
  a("tabata", "田端", 35.7381, 139.7615, "B", "station"),
  a("uguisudani_iriya", "鶯谷入谷", 35.7217, 139.7852, "B", "residential"),
  a("kuramae_asakusabashi", "蔵前浅草橋", 35.7012, 139.7890, "B", "water"),
  a("hatchobori_shinkawa", "八丁堀新川", 35.6752, 139.7802, "B", "office"),
  a("tsukishima_kachidoki", "月島勝どき", 35.6621, 139.7790, "B", "water"),
  a("shinonome_tatsumi", "東雲辰巳", 35.6440, 139.8068, "B", "water"),
  a("sunamachi_ojima", "砂町大島", 35.6866, 139.8369, "B", "residential"),
  a("hirai_shinkoiwa", "平井新小岩", 35.7098, 139.8458, "B", "station"),
  a("funabori_ichinoe", "船堀一之江", 35.6869, 139.8720, "B", "residential"),
  a("mizue_shinozaki", "瑞江篠崎", 35.7040, 139.8982, "B", "residential"),
  a("kanamachi_shibamata", "金町柴又", 35.7668, 139.8730, "B", "water"),
  a("yotsugi_tateishi", "四ツ木立石", 35.7388, 139.8375, "B", "shopping"),
  a("umejima_takenotsuka", "梅島竹ノ塚", 35.7798, 139.7975, "B", "residential"),
  a("nishi_arai", "西新井", 35.7771, 139.7908, "B", "station"),
  a("senju_ohashi", "千住大橋", 35.7428, 139.7978, "B", "water"),
  a("komazawa_ikejiri", "池尻大橋", 35.6502, 139.6842, "B", "night"),
  a("togoshi_musashikoyama", "戸越武蔵小山", 35.6159, 139.7041, "B", "shopping"),
  a("yukigaya_den_en", "雪が谷田園調布", 35.5914, 139.6811, "B", "residential"),
  a("senzoku_ookayama", "洗足大岡山", 35.6090, 139.6864, "B", "residential"),
  a("samezu_aomonoyokocho", "鮫洲青物横丁", 35.6070, 139.7459, "B", "station"),
  a("heiwajima_omorikaigan", "平和島大森海岸", 35.5820, 139.7394, "B", "water"),
  a("zoshiki_rokugodote", "雑色六郷土手", 35.5470, 139.7130, "B", "water"),
  a("nishimagome_ikegami", "西馬込池上", 35.5798, 139.7042, "B", "residential"),
  a("hasune_takashimadaira", "蓮根高島平", 35.7860, 139.6740, "B", "residential"),
  a("nishidai_ukimafunado", "西台浮間舟渡", 35.7905, 139.6900, "B", "water"),
  a("kasumigaseki_toranomon", "霞ヶ関虎ノ門", 35.6680, 139.7500, "B", "office"),
  a("kojimachi_hanzomon", "麹町半蔵門", 35.6844, 139.7408, "B", "office"),
  a("kudanshita_jimbocho", "九段下神保町", 35.6960, 139.7560, "B", "office"),

  // C/D/E: thin coverage and edge texture
  a("yumenoshima_shinkiba", "夢の島新木場", 35.6502, 139.8280, "C", "water"),
  a("wakasu", "若洲", 35.6220, 139.8330, "D", "water"),
  a("kasai_rinkai", "葛西臨海", 35.6420, 139.8610, "C", "park"),
  a("rokugo_river", "六郷多摩川", 35.5400, 139.7045, "C", "water"),
  a("arakawa_river_north", "荒川北縁", 35.7850, 139.8200, "D", "water"),
  a("arakawa_river_east", "荒川東縁", 35.7200, 139.8800, "D", "water"),
  a("tokyo_bay_void_edge", "東京湾空白縁", 35.6000, 139.7900, "E", "water"),
  a("haneda_water_edge", "羽田水面縁", 35.5350, 139.7700, "E", "water"),
  a("imperial_palace_edge", "皇居外縁", 35.6852, 139.7528, "C", "park"),
  a("meiji_jingu_edge", "明治神宮外縁", 35.6764, 139.6993, "C", "park"),
  a("arakawa_industrial_gap", "荒川工業隙間", 35.7500, 139.8450, "E", "residential"),
  a("shinagawa_wharf_gap", "品川埠頭隙間", 35.6150, 139.7600, "D", "water"),
  a("itabashi_river_gap", "板橋河川隙間", 35.7950, 139.7050, "E", "water"),
  a("setagaya_edge_gap", "世田谷外縁", 35.6450, 139.5900, "D", "residential"),
  a("nerima_edge_gap", "練馬外縁", 35.7600, 139.5700, "D", "residential")
];

const TEMPLATE_ZONES = [
  ["station_main", "駅前", "station", 0, 0, 260, 1.00],
  ["station_side", "駅裏", "station", -210, 120, 220, 0.55],
  ["shopping_main", "商店街", "shopping", -260, -190, 230, 0.70],
  ["shopping_cross", "横断歩道", "shopping", -80, -260, 190, 0.45],
  ["night_lane", "夜の路地", "night", -430, -90, 230, 0.34],
  ["office_edge", "業務街縁", "office", 300, -180, 260, 0.42],
  ["residential_west", "西側住宅地", "residential", -620, 160, 620, 0.70],
  ["residential_east", "東側住宅地", "residential", 620, 160, 640, 0.70],
  ["residential_south", "南側住宅地", "residential", 80, -720, 620, 0.52],
  ["park_gate", "公園入口", "park", -520, 620, 390, 0.44],
  ["park_inner", "公園外周", "park", -760, 820, 520, 0.36],
  ["water_edge", "水辺", "water", 700, 720, 520, 0.52],
  ["bridge", "橋詰", "water", 420, 500, 240, 0.34],
  ["shrine", "寺社境内", "shrine", -120, 520, 220, 0.25],
  ["backstreet", "裏道", "residential", -360, 380, 420, 0.42],
  ["school_route", "通学路", "residential", 380, 380, 400, 0.34],
  ["market_corner", "市場角", "shopping", 280, -420, 210, 0.34],
  ["quiet_void_edge", "静かな端", "residential", 820, -280, 340, 0.18]
];

const TEMPLATE_CORRIDORS = [
  ["main_axis", "駅前主動線", "corridor", [[-760, 0], [-260, 0], [0, 0], [360, 40], [820, 90]], 160],
  ["shopping_axis", "商店街動線", "shopping", [[-720, -280], [-260, -190], [-80, -260], [280, -420]], 140],
  ["river_axis", "水辺動線", "water", [[420, 500], [700, 720], [980, 940]], 170],
  ["residential_axis", "生活路", "residential", [[-620, 160], [-360, 380], [0, 0], [380, 380], [620, 160]], 150],
  ["park_axis", "公園外周", "park", [[-760, 820], [-520, 620], [-120, 520], [420, 500]], 150],
  ["night_axis", "夜間路地", "night", [[-430, -90], [-260, -190], [0, 0], [300, -180]], 120]
];

const TEMPLATE_VOIDS = [
  ["core_void", 140, 80, 130],
  ["park_inner_void", -760, 820, 230],
  ["water_channel_void", 760, 820, 170],
  ["residential_back_void", -980, 140, 280],
  ["industrial_gap_void", 980, -380, 260],
  ["between_corridors_void", 120, 720, 240]
];

function a(id, label, lat, lng, level, bias) {
  return { id, label, center: { lat, lng }, level, bias, records: LEVEL_COUNTS[level] };
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
      console.log("Usage: node scripts/seed_tokyo_dense_v4.js [--records 120000] [--batch-size 1000] [--dry-run] [--replace-world]");
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

const rand = seededRandom(2026052942);
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
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

function sceneFor(type) {
  const s = SCENE[type] || SCENE.residential;
  return { noise: s.noise, turbulence: s.turbulence, mobility: s.mobility, words: WORDS[type] || WORDS.residential, hours: HOURS[type] || HOURS.residential };
}
function areaScale(area) {
  if (area.level === "S") return 1.08;
  if (area.level === "A") return 1.00;
  if (area.level === "B") return 0.92;
  if (area.level === "C") return 0.82;
  return 0.72;
}

function buildAreaStructure(area) {
  const scale = areaScale(area);
  const zones = TEMPLATE_ZONES.map(([id, suffix, typeRaw, dx, dy, radius, weight]) => {
    const type = typeRaw === "shopping" && area.bias === "office" ? "office" : typeRaw;
    const scene = sceneFor(type);
    const center = metersToLatLng(dx * scale, dy * scale, area.center);
    return {
      id: `tokyo_v4_${area.id}_${id}`,
      areaId: area.id,
      label: `${area.label}${suffix}`,
      type,
      center,
      radius: Math.round(radius * scale),
      weight: weight * (type === area.bias ? 1.35 : 1),
      ...scene
    };
  });
  const corridors = TEMPLATE_CORRIDORS.map(([id, suffix, typeRaw, points, width]) => {
    const type = typeRaw === "shopping" && area.bias === "office" ? "office" : typeRaw;
    const scene = sceneFor(type);
    return {
      id: `tokyo_v4_${area.id}_${id}`,
      areaId: area.id,
      label: `${area.label}${suffix}`,
      type: "corridor",
      sceneType: type,
      points: points.map(([dx, dy]) => metersToLatLng(dx * scale, dy * scale, area.center)),
      width: Math.round(width * scale),
      weight: type === area.bias ? 1.25 : 1,
      ...scene
    };
  });
  const voids = TEMPLATE_VOIDS.map(([id, dx, dy, radius]) => ({
    id: `tokyo_v4_${area.id}_${id}`,
    areaId: area.id,
    center: metersToLatLng(dx * scale, dy * scale, area.center),
    radius: Math.round(radius * scale)
  }));
  return { zones, corridors, voids };
}

function sampleZone(zone) {
  const conc = zone.type === "station" ? 0.60 : zone.type === "shopping" ? 0.55 : zone.type === "shrine" ? 0.66 : zone.type === "park" ? 0.82 : 1.0;
  const pow = zone.type === "station" || zone.type === "shopping" ? 0.72 : 0.50;
  const angle = rand() * Math.PI * 2;
  const dist = Math.pow(rand(), pow) * zone.radius * conc;
  return metersToLatLng(Math.cos(angle) * dist, Math.sin(angle) * dist, zone.center);
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
    pos: metersToLatLng(
      segment.a.dx + dx * t + (-dy / len) * (rand() - 0.5) * corridor.width * (0.22 + rand() * 0.64),
      segment.a.dy + dy * t + ( dx / len) * (rand() - 0.5) * corridor.width * (0.22 + rand() * 0.64),
      origin
    ),
    direction: (Math.atan2(dx, dy) * 180 / Math.PI + 360 + (rand() - 0.5) * 22) % 360
  };
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
  office: { sp: [-0.34, 0.04], g: [0.18, 0.58], t: [0.16, 0.56], f: [-0.12, 0.26] },
  residential: { sp: [-0.08, 0.32], g: [0.14, 0.52], t: [-0.48, 0.02], f: [-0.48, -0.08] },
  park: { sp: [0.34, 0.82], g: [-0.58, -0.08], t: [-0.68, -0.18], f: [-0.48, 0.12] },
  water: { sp: [0.20, 0.66], g: [-0.36, 0.08], t: [-0.42, 0.08], f: [0.18, 0.62] },
  shrine: { sp: [0.22, 0.62], g: [-0.38, 0.12], t: [-0.58, -0.18], f: [-0.58, -0.08] },
  night: { sp: [-0.52, -0.04], g: [0.16, 0.58], t: [0.18, 0.66], f: [-0.04, 0.38] }
};
const SND_BASE = {
  station: { sh: 0.56, co: 0.82, tx: 0.56 },
  corridor: { sh: 0.60, co: 0.80, tx: 0.54 },
  shopping: { sh: 0.52, co: 0.76, tx: 0.50 },
  office: { sh: 0.42, co: 0.68, tx: 0.42 },
  residential: { sh: 0.26, co: 0.58, tx: 0.30 },
  park: { sh: 0.16, co: 0.64, tx: 0.20 },
  water: { sh: 0.20, co: 0.70, tx: 0.24 },
  shrine: { sh: 0.12, co: 0.52, tx: 0.16 },
  night: { sh: 0.48, co: 0.62, tx: 0.60 }
};
function buildSenseVector(type, mobility, hour, weekday) {
  const base = SV_BASE[type] || SV_BASE.residential;
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
  const base = SND_BASE[type] || SND_BASE.residential;
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

function buildAllStructures() {
  const zones = [];
  const corridors = [];
  const voids = [];
  for (const area of AREAS) {
    const built = buildAreaStructure(area);
    zones.push(...built.zones);
    corridors.push(...built.corridors);
    voids.push(...built.voids);
  }
  return { zones, corridors, voids };
}

function allocateRecords(targetCount) {
  const maxForArea = area => {
    if (area.level === "S") return 2000;
    if (area.level === "A") return 1600;
    if (area.level === "B") return 1000;
    if (area.level === "C") return 500;
    if (area.level === "D") return 100;
    return 8;
  };
  const totalBase = AREAS.reduce((sum, area) => sum + area.records, 0);
  let allocated = AREAS.map(area => ({ ...area, target: Math.min(maxForArea(area), Math.max(0, Math.round(area.records * targetCount / totalBase))) }));
  let diff = targetCount - allocated.reduce((sum, area) => sum + area.target, 0);
  allocated.sort((a, b) => b.records - a.records || a.id.localeCompare(b.id));
  let spins = 0;
  for (let i = 0; diff !== 0 && spins < allocated.length * Math.abs(diff + allocated.length); i = (i + 1) % allocated.length) {
    spins++;
    const step = diff > 0 ? 1 : -1;
    if (allocated[i].target + step >= 0 && allocated[i].target + step <= maxForArea(allocated[i])) {
      allocated[i].target += step;
      diff -= step;
    }
  }
  if (diff !== 0) throw new Error(`Could not allocate ${targetCount} records within per-level caps`);
  return allocated;
}

function buildRecords(targetCount, structures) {
  const rows = [];
  const baseTime = Date.UTC(2026, 4, 1, 0, 0, 0);
  const areaAllocations = allocateRecords(targetCount);
  const zonesByArea = groupBy(structures.zones, "areaId");
  const corridorsByArea = groupBy(structures.corridors, "areaId");
  for (const area of areaAllocations) {
    const zones = zonesByArea.get(area.id) || [];
    const corridors = corridorsByArea.get(area.id) || [];
    const sources = [
      ...zones.map(zone => [{ kind: "zone", item: zone }, zone.weight]),
      ...corridors.map(corridor => [{ kind: "corridor", item: corridor }, corridor.weight * 0.95])
    ];
    for (let local = 0; local < area.target; local++) {
      const selected = weighted(sources);
      let profile;
      let pos;
      let direction = rand() * 360;
      let zoneId;
      if (selected.kind === "corridor") {
        const sample = sampleCorridor(selected.item);
        profile = { ...selected.item, type: selected.item.sceneType || "corridor" };
        pos = sample.pos;
        direction = sample.direction;
        zoneId = selected.item.id;
      } else {
        profile = selected.item;
        pos = sampleZone(profile);
        zoneId = profile.id;
      }
      const index = rows.length;
      const weekday = index % 7;
      const hour = sampleHour(profile.hours, weekday, profile.type);
      const minute = Math.floor(rand() * 60);
      const timestamp = new Date(baseTime + (index % 28) * 86400000 + hour * 3600000 + minute * 60000 + Math.floor(rand() * 60000)).toISOString();
      const mobility = weighted(Object.entries(profile.mobility));
      const commute = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
      const late = hour <= 5 || hour >= 23;
      const noiseLevel = clamp(profile.noise[0] + rand() * (profile.noise[1] - profile.noise[0]) + (commute && profile.type !== "park" ? 0.08 : 0) + (late ? -0.08 : 0), 0.05, 0.95);
      const turbulence = clamp(profile.turbulence[0] + rand() * (profile.turbulence[1] - profile.turbulence[0]) + (mobility === "passing" ? 0.08 : 0), 0.02, 0.92);
      const peak = clamp(noiseLevel + turbulence * 0.34 + rand() * 0.14, 0.05, 1);
      const word = weighted(profile.words);
      const selectedWords = pickSelectedWords(profile.words);
      const senseVector = buildSenseVector(profile.type, mobility, hour, weekday);
      const soundVector = buildSoundVector(noiseLevel, turbulence, profile.type);
      rows.push({
        id: `tokyo-v4-${String(index).padStart(6, "0")}`,
        user_id: `tokyo-v4-user-${String(index % 6800).padStart(5, "0")}`,
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
        trust_score: Number(clamp(0.62 + rand() * 0.34 - (late ? 0.05 : 0), 0.55, 1).toFixed(3)),
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
  }
  return rows;
}

function groupBy(items, key) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item[key])) map.set(item[key], []);
    map.get(item[key]).push(item);
  }
  return map;
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

function summarize(records, structures) {
  const byLevel = {};
  const byType = {};
  const byArea = {};
  const areaMap = new Map(AREAS.map(area => [area.id, area]));
  const zoneArea = new Map([...structures.zones, ...structures.corridors].map(item => [item.id, item.areaId]));
  const zoneType = new Map(structures.zones.map(item => [item.id, item.type]));
  for (const item of structures.corridors) zoneType.set(item.id, item.sceneType || "corridor");
  for (const row of records) {
    const areaId = zoneArea.get(row.zone_id);
    const area = areaMap.get(areaId);
    const type = zoneType.get(row.zone_id) || "unknown";
    if (area) byLevel[area.level] = (byLevel[area.level] || 0) + 1;
    if (area) byArea[`${area.level}:${area.label}`] = (byArea[`${area.level}:${area.label}`] || 0) + 1;
    byType[type] = (byType[type] || 0) + 1;
  }
  return {
    source: SOURCE,
    areas: AREAS.length,
    records: records.length,
    zones: structures.zones.length,
    corridors: structures.corridors.length,
    voids: structures.voids.length,
    byLevel,
    byType,
    topAreas: Object.entries(byArea).sort((a, b) => b[1] - a[1]).slice(0, 18),
    lowExamples: Object.entries(byArea).sort((a, b) => a[1] - b[1]).slice(0, 12),
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
  const structures = buildAllStructures();
  const records = buildRecords(options.records, structures);
  console.log(JSON.stringify(summarize(records, structures), null, 2));
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
    for (const prefix of ["central", "asakusa_v3", "tokyo_v4"]) {
      await requestSupabase("DELETE", "zones", null, `?id=like.${prefix}_%25`);
      await requestSupabase("DELETE", "corridors", null, `?id=like.${prefix}_%25`);
      await requestSupabase("DELETE", "voids", null, `?id=like.${prefix}_%25`);
    }
  }
  await upsertTable("zones", toZoneRows(structures.zones), options.batchSize);
  await upsertTable("corridors", toCorridorRows(structures.corridors), options.batchSize);
  await upsertTable("voids", toVoidRows(structures.voids), options.batchSize);
  await upsertTable("records", records, options.batchSize);
  console.log("Done.");
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exit(1);
});
