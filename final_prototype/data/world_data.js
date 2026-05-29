const WORLD_SKIN_META = {
  center: { lat: 35.6895, lng: 139.6917 },
  radiusKm: 54,
  generatedAt: "2026-05-29T00:00:00.000Z",
  days: 14,
  userCount: 640,
  recordCount: 0,
  source: "tokyo-prefecture-sim-v1"
};

const WORLD_SKIN_WORDS = [
  "ざらつく", "重い", "浮く", "乾く", "遠い", "詰まる", "ほどける", "眠い",
  "流れる", "速い", "澄む", "硬い", "滞る", "広がる", "こもる", "薄い"
];

const TOKYO_PLACE_TYPES = {
  station: {
    noise: [0.58, 0.94], turbulence: [0.46, 0.88], radius: [260, 560],
    mobility: { passing: 0.60, slow: 0.30, still: 0.10 },
    words: [["ざらつく", 0.24], ["詰まる", 0.24], ["流れる", 0.20], ["速い", 0.18], ["硬い", 0.14]],
    hours: [[7, 0.14], [8, 0.20], [9, 0.12], [12, 0.05], [17, 0.13], [18, 0.18], [19, 0.13], [20, 0.05]]
  },
  commercial: {
    noise: [0.46, 0.84], turbulence: [0.34, 0.76], radius: [360, 760],
    mobility: { passing: 0.36, slow: 0.48, still: 0.16 },
    words: [["詰まる", 0.25], ["ざらつく", 0.22], ["重い", 0.18], ["滞る", 0.18], ["流れる", 0.17]],
    hours: [[10, 0.10], [11, 0.12], [12, 0.14], [13, 0.12], [15, 0.12], [17, 0.12], [18, 0.12], [20, 0.06], [22, 0.04]]
  },
  residential: {
    noise: [0.16, 0.52], turbulence: [0.08, 0.40], radius: [680, 1500],
    mobility: { passing: 0.16, slow: 0.45, still: 0.39 },
    words: [["眠い", 0.24], ["ほどける", 0.22], ["薄い", 0.20], ["遠い", 0.18], ["浮く", 0.16]],
    hours: [[6, 0.08], [7, 0.11], [8, 0.10], [18, 0.13], [19, 0.16], [20, 0.16], [21, 0.14], [22, 0.09], [23, 0.03]]
  },
  park: {
    noise: [0.06, 0.36], turbulence: [0.04, 0.32], radius: [520, 1800],
    mobility: { passing: 0.09, slow: 0.33, still: 0.58 },
    words: [["浮く", 0.28], ["ほどける", 0.26], ["澄む", 0.22], ["広がる", 0.16], ["薄い", 0.08]],
    hours: [[8, 0.06], [9, 0.10], [10, 0.14], [11, 0.13], [13, 0.12], [14, 0.16], [15, 0.16], [16, 0.09], [17, 0.04]]
  },
  campus: {
    noise: [0.24, 0.60], turbulence: [0.16, 0.50], radius: [380, 900],
    mobility: { passing: 0.14, slow: 0.44, still: 0.42 },
    words: [["重い", 0.22], ["こもる", 0.22], ["眠い", 0.20], ["乾く", 0.18], ["ほどける", 0.18]],
    hours: [[9, 0.08], [10, 0.12], [11, 0.13], [12, 0.12], [13, 0.12], [14, 0.13], [15, 0.13], [16, 0.10], [17, 0.07]]
  },
  water: {
    noise: [0.10, 0.42], turbulence: [0.08, 0.40], radius: [520, 1300],
    mobility: { passing: 0.18, slow: 0.44, still: 0.38 },
    words: [["澄む", 0.28], ["流れる", 0.24], ["ほどける", 0.22], ["薄い", 0.14], ["遠い", 0.12]],
    hours: [[6, 0.08], [7, 0.10], [8, 0.10], [16, 0.12], [17, 0.16], [18, 0.16], [19, 0.12], [20, 0.08], [21, 0.06]]
  },
  industry: {
    noise: [0.44, 0.82], turbulence: [0.34, 0.72], radius: [480, 1100],
    mobility: { passing: 0.42, slow: 0.40, still: 0.18 },
    words: [["硬い", 0.24], ["乾く", 0.22], ["ざらつく", 0.22], ["重い", 0.18], ["詰まる", 0.14]],
    hours: [[6, 0.09], [7, 0.12], [8, 0.13], [9, 0.10], [12, 0.10], [15, 0.10], [17, 0.14], [18, 0.14], [20, 0.08]]
  },
  island: {
    noise: [0.08, 0.40], turbulence: [0.06, 0.38], radius: [600, 1800],
    mobility: { passing: 0.12, slow: 0.36, still: 0.52 },
    words: [["遠い", 0.28], ["澄む", 0.25], ["浮く", 0.22], ["広がる", 0.15], ["薄い", 0.10]],
    hours: [[6, 0.08], [8, 0.12], [10, 0.14], [12, 0.12], [14, 0.14], [16, 0.14], [18, 0.12], [20, 0.08], [22, 0.06]]
  }
};

const TOKYO_MUNICIPAL_CENTERS = [
  ["chiyoda", "千代田区", "commercial", 35.6940, 139.7536], ["chuo", "中央区", "commercial", 35.6706, 139.7720],
  ["minato", "港区", "commercial", 35.6581, 139.7516], ["shinjuku", "新宿区", "commercial", 35.6938, 139.7034],
  ["bunkyo", "文京区", "campus", 35.7079, 139.7524], ["taito", "台東区", "commercial", 35.7126, 139.7800],
  ["sumida", "墨田区", "residential", 35.7107, 139.8016], ["koto", "江東区", "water", 35.6728, 139.8175],
  ["shinagawa", "品川区", "station", 35.6092, 139.7301], ["meguro", "目黒区", "residential", 35.6415, 139.6982],
  ["ota", "大田区", "industry", 35.5613, 139.7160], ["setagaya", "世田谷区", "residential", 35.6466, 139.6532],
  ["shibuya", "渋谷区", "commercial", 35.6618, 139.7041], ["nakano", "中野区", "residential", 35.7074, 139.6638],
  ["suginami", "杉並区", "residential", 35.6995, 139.6364], ["toshima", "豊島区", "commercial", 35.7295, 139.7109],
  ["kita", "北区", "residential", 35.7528, 139.7336], ["arakawa", "荒川区", "residential", 35.7361, 139.7837],
  ["itabashi", "板橋区", "residential", 35.7512, 139.7092], ["nerima", "練馬区", "residential", 35.7356, 139.6517],
  ["adachi", "足立区", "residential", 35.7750, 139.8044], ["katsushika", "葛飾区", "residential", 35.7434, 139.8473],
  ["edogawa", "江戸川区", "water", 35.7067, 139.8683], ["hachioji", "八王子市", "station", 35.6558, 139.3389],
  ["tachikawa", "立川市", "station", 35.7140, 139.4078], ["musashino", "武蔵野市", "commercial", 35.7178, 139.5661],
  ["mitaka", "三鷹市", "residential", 35.6835, 139.5596], ["ome", "青梅市", "park", 35.7881, 139.2758],
  ["fuchu", "府中市", "station", 35.6689, 139.4776], ["akishima", "昭島市", "residential", 35.7056, 139.3537],
  ["chofu", "調布市", "station", 35.6506, 139.5407], ["machida", "町田市", "station", 35.5467, 139.4386],
  ["koganei", "小金井市", "park", 35.6995, 139.5030], ["kodaira", "小平市", "residential", 35.7286, 139.4770],
  ["hino", "日野市", "residential", 35.6713, 139.3951], ["higashimurayama", "東村山市", "residential", 35.7546, 139.4685],
  ["kokubunji", "国分寺市", "station", 35.7001, 139.4808], ["kunitachi", "国立市", "campus", 35.6849, 139.4677],
  ["fussa", "福生市", "industry", 35.7387, 139.3264], ["komae", "狛江市", "residential", 35.6348, 139.5785],
  ["higashiyamato", "東大和市", "residential", 35.7455, 139.4266], ["kiyose", "清瀬市", "residential", 35.7720, 139.5199],
  ["higashikurume", "東久留米市", "residential", 35.7581, 139.5299], ["musashimurayama", "武蔵村山市", "residential", 35.7548, 139.3875],
  ["tama", "多摩市", "residential", 35.6372, 139.4463], ["inagi", "稲城市", "park", 35.6379, 139.5046],
  ["hamura", "羽村市", "residential", 35.7672, 139.3110], ["akiruno", "あきる野市", "park", 35.7289, 139.2941],
  ["nishitokyo", "西東京市", "residential", 35.7256, 139.5383], ["mizuho", "瑞穂町", "industry", 35.7719, 139.3541],
  ["hinode", "日の出町", "park", 35.7421, 139.2577], ["hinohara", "檜原村", "park", 35.7265, 139.1485],
  ["okutama", "奥多摩町", "park", 35.8095, 139.0965], ["oshima", "大島町", "island", 34.7501, 139.3556],
  ["niijima", "新島村", "island", 34.3777, 139.2566], ["miyake", "三宅村", "island", 34.0757, 139.4797],
  ["hachijo", "八丈町", "island", 33.1030, 139.7989], ["ogasawara", "小笠原村", "island", 27.0944, 142.1919]
];

const TOKYO_MAJOR_STATIONS = [
  ["tokyo", "東京駅", 35.6812, 139.7671], ["shinjuku_station", "新宿駅", 35.6896, 139.7006],
  ["shibuya_station", "渋谷駅", 35.6580, 139.7016], ["ikebukuro_station", "池袋駅", 35.7295, 139.7109],
  ["ueno_station", "上野駅", 35.7138, 139.7770], ["shinagawa_station", "品川駅", 35.6285, 139.7388],
  ["akihabara_station", "秋葉原駅", 35.6984, 139.7730], ["kitasenju_station", "北千住駅", 35.7490, 139.8048],
  ["kinshicho_station", "錦糸町駅", 35.6972, 139.8144], ["tachikawa_station", "立川駅", 35.6983, 139.4137],
  ["kichijoji_station", "吉祥寺駅", 35.7031, 139.5798], ["machida_station", "町田駅", 35.5420, 139.4454],
  ["hachioji_station", "八王子駅", 35.6556, 139.3389], ["fuchu_station", "府中駅", 35.6722, 139.4801],
  ["kokubunji_station", "国分寺駅", 35.7001, 139.4808], ["chofu_station", "調布駅", 35.6518, 139.5444]
];

const TOKYO_PARKS = [
  ["yoyogi_park", "代々木公園", 35.6717, 139.6949, 1100], ["ueno_park", "上野公園", 35.7156, 139.7732, 900],
  ["shinjuku_gyoen", "新宿御苑", 35.6852, 139.7100, 960], ["imperial_palace", "皇居外苑", 35.6852, 139.7528, 1500],
  ["komazawa_park", "駒沢公園", 35.6266, 139.6606, 900], ["kinuta_park", "砧公園", 35.6320, 139.6225, 960],
  ["koganei_park", "小金井公園", 35.7169, 139.5118, 1450], ["showa_kinen_park", "昭和記念公園", 35.7042, 139.3944, 1800],
  ["tama_river", "多摩川河川敷", 35.6244, 139.5901, 1400], ["okutama_lake", "奥多摩湖", 35.7870, 139.0478, 1700]
];

const WORLD_SKIN_ZONES = [
  ...TOKYO_MUNICIPAL_CENTERS.map(([id, label, type, lat, lng]) => {
    const preset = TOKYO_PLACE_TYPES[type];
    return {
      id: `${id}_${type}`,
      label,
      type,
      center: { lat, lng },
      radius: Math.round(preset.radius[0] + (preset.radius[1] - preset.radius[0]) * 0.62),
      noise: preset.noise,
      turbulence: preset.turbulence,
      mobility: preset.mobility,
      words: preset.words,
      hours: preset.hours
    };
  }),
  ...TOKYO_MAJOR_STATIONS.map(([id, label, lat, lng]) => ({
    id, label, type: "station", center: { lat, lng }, radius: 360,
    noise: TOKYO_PLACE_TYPES.station.noise, turbulence: TOKYO_PLACE_TYPES.station.turbulence,
    mobility: TOKYO_PLACE_TYPES.station.mobility, words: TOKYO_PLACE_TYPES.station.words, hours: TOKYO_PLACE_TYPES.station.hours
  })),
  ...TOKYO_PARKS.map(([id, label, lat, lng, radius]) => ({
    id, label, type: "park", center: { lat, lng }, radius,
    noise: TOKYO_PLACE_TYPES.park.noise, turbulence: TOKYO_PLACE_TYPES.park.turbulence,
    mobility: TOKYO_PLACE_TYPES.park.mobility, words: TOKYO_PLACE_TYPES.park.words, hours: TOKYO_PLACE_TYPES.park.hours
  }))
];

const WORLD_SKIN_CORRIDORS = [
  { id: "yamanote_loop", label: "山手線環状", type: "corridor", width: 260, points: [
    { lat: 35.6812, lng: 139.7671 }, { lat: 35.7138, lng: 139.7770 }, { lat: 35.7295, lng: 139.7109 },
    { lat: 35.6896, lng: 139.7006 }, { lat: 35.6580, lng: 139.7016 }, { lat: 35.6285, lng: 139.7388 },
    { lat: 35.6812, lng: 139.7671 }
  ] },
  { id: "chuo_line", label: "中央線", type: "corridor", width: 280, points: [
    { lat: 35.6812, lng: 139.7671 }, { lat: 35.6896, lng: 139.7006 }, { lat: 35.7031, lng: 139.5798 },
    { lat: 35.7001, lng: 139.4808 }, { lat: 35.6983, lng: 139.4137 }, { lat: 35.6556, lng: 139.3389 }
  ] },
  { id: "keio_line", label: "京王線", type: "corridor", width: 240, points: [
    { lat: 35.6896, lng: 139.7006 }, { lat: 35.6518, lng: 139.5444 }, { lat: 35.6722, lng: 139.4801 },
    { lat: 35.6372, lng: 139.4463 }, { lat: 35.6556, lng: 139.3389 }
  ] },
  { id: "tama_river_corridor", label: "多摩川", type: "corridor", width: 420, points: [
    { lat: 35.5613, lng: 139.7160 }, { lat: 35.6244, lng: 139.5901 }, { lat: 35.6379, lng: 139.5046 },
    { lat: 35.6713, lng: 139.3951 }, { lat: 35.7672, lng: 139.3110 }, { lat: 35.8095, lng: 139.0965 }
  ] },
  { id: "sumida_arakawa_corridor", label: "隅田川・荒川", type: "corridor", width: 420, points: [
    { lat: 35.6285, lng: 139.7388 }, { lat: 35.6706, lng: 139.7720 }, { lat: 35.7138, lng: 139.7770 },
    { lat: 35.7490, lng: 139.8048 }, { lat: 35.7750, lng: 139.8044 }, { lat: 35.7067, lng: 139.8683 }
  ] },
  { id: "tokyo_bay_edge", label: "東京湾岸", type: "corridor", width: 520, points: [
    { lat: 35.5613, lng: 139.7160 }, { lat: 35.6092, lng: 139.7301 }, { lat: 35.6728, lng: 139.8175 },
    { lat: 35.7067, lng: 139.8683 }
  ] }
].map(corridor => ({
  ...corridor,
  noise: TOKYO_PLACE_TYPES.station.noise,
  turbulence: TOKYO_PLACE_TYPES.station.turbulence,
  mobility: { passing: 0.66, slow: 0.27, still: 0.07 },
  words: [["流れる", 0.28], ["速い", 0.25], ["ざらつく", 0.20], ["乾く", 0.15], ["硬い", 0.12]],
  hours: TOKYO_PLACE_TYPES.station.hours
}));

const WORLD_SKIN_VOIDS = [
  { id: "imperial_core_void", center: { lat: 35.6852, lng: 139.7528 }, radius: 760 },
  { id: "tokyo_bay_void", center: { lat: 35.6000, lng: 139.8350 }, radius: 2600 },
  { id: "okutama_mountain_void", center: { lat: 35.8050, lng: 139.0500 }, radius: 5200 },
  { id: "tama_hills_void", center: { lat: 35.6250, lng: 139.3650 }, radius: 2300 },
  { id: "arakawa_river_void", center: { lat: 35.7600, lng: 139.8250 }, radius: 1700 }
];

const WORLD_SKIN_RECORDS = (() => {
  const origin = WORLD_SKIN_META.center;
  const baseDate = Date.UTC(2026, 4, 15, 0, 0, 0);
  const rand = seededRandom(2026052904);
  const records = [];

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
  function metersToLatLng(dx, dy, ref = origin) {
    return {
      lat: ref.lat + dy / 111320,
      lng: ref.lng + dx / (111320 * Math.cos(ref.lat * Math.PI / 180))
    };
  }
  function latLngToMeters(pos, ref = origin) {
    return {
      dx: (pos.lng - ref.lng) * 111320 * Math.cos(ref.lat * Math.PI / 180),
      dy: (pos.lat - ref.lat) * 111320
    };
  }
  function distanceMeters(a, b) {
    const am = latLngToMeters(a);
    const bm = latLngToMeters(b);
    return Math.hypot(am.dx - bm.dx, am.dy - bm.dy);
  }
  function insideVoid(pos) {
    return WORLD_SKIN_VOIDS.some(v => distanceMeters(pos, v.center) < v.radius);
  }
  function randomNear(center, radius, pow = 0.56) {
    const angle = rand() * Math.PI * 2;
    const dist = Math.pow(rand(), pow) * radius;
    return metersToLatLng(Math.cos(angle) * dist, Math.sin(angle) * dist, center);
  }
  function randomInZone(zone) {
    const pow = zone.type === "station" || zone.type === "commercial" ? 0.72 : 0.52;
    for (let attempt = 0; attempt < 16; attempt++) {
      const pos = randomNear(zone.center, zone.radius, pow);
      if (!insideVoid(pos) || ["park", "island"].includes(zone.type) || rand() < 0.18) return pos;
    }
    return zone.center;
  }
  function sampleCorridor(corridor) {
    const segments = [];
    for (let i = 1; i < corridor.points.length; i++) {
      const a = latLngToMeters(corridor.points[i - 1]);
      const b = latLngToMeters(corridor.points[i]);
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
        segment.a.dx + dx * t + (-dy / len) * (rand() - 0.5) * corridor.width * (0.20 + rand() * 0.72),
        segment.a.dy + dy * t + ( dx / len) * (rand() - 0.5) * corridor.width * (0.20 + rand() * 0.72)
      ),
      direction: (Math.atan2(dx, dy) * 180 / Math.PI + 360 + (rand() - 0.5) * 24) % 360
    };
  }
  function sampleHour(profile, day, type) {
    let hour = weighted(profile);
    if (type === "park" && day >= 5 && rand() < 0.28) {
      hour = weighted([[10, 0.18], [11, 0.18], [13, 0.20], [14, 0.22], [15, 0.14], [16, 0.08]]);
    }
    if (rand() < 0.024) hour = weighted([[0, 0.08], [1, 0.06], [5, 0.14], [6, 0.22], [22, 0.28], [23, 0.22]]);
    return clamp(hour + Math.floor(rand() * 3) - 1, 0, 23);
  }
  function zoneByType() {
    const type = weighted([
      ["station", 0.30], ["corridor", 0.20], ["commercial", 0.15], ["residential", 0.15],
      ["park", 0.10], ["campus", 0.05], ["industry", 0.035], ["water", 0.012], ["island", 0.003]
    ]);
    if (type === "corridor") return { type, item: WORLD_SKIN_CORRIDORS[Math.floor(rand() * WORLD_SKIN_CORRIDORS.length)] };
    const zones = WORLD_SKIN_ZONES.filter(zone => zone.type === type);
    return { type, item: zones[Math.floor(rand() * zones.length)] || WORLD_SKIN_ZONES[0] };
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
    commercial: { sp: [-0.46, -0.08], g: [0.18, 0.52], t: [0.28, 0.62], f: [0.08, 0.42] },
    residential: { sp: [-0.08, 0.32], g: [0.14, 0.52], t: [-0.48, 0.02], f: [-0.48, -0.08] },
    park: { sp: [0.34, 0.82], g: [-0.58, -0.08], t: [-0.68, -0.18], f: [-0.48, 0.12] },
    campus: { sp: [-0.18, 0.22], g: [0.08, 0.46], t: [-0.08, 0.34], f: [-0.28, 0.22] },
    water: { sp: [0.20, 0.66], g: [-0.36, 0.08], t: [-0.42, 0.08], f: [0.18, 0.62] },
    industry: { sp: [-0.52, -0.10], g: [0.22, 0.64], t: [0.22, 0.66], f: [0.02, 0.36] },
    island: { sp: [0.32, 0.82], g: [-0.48, 0.04], t: [-0.48, 0.10], f: [-0.16, 0.38] }
  };
  const SND_BASE = {
    station: { sh: 0.58, co: 0.82, tx: 0.56 }, corridor: { sh: 0.60, co: 0.80, tx: 0.54 },
    commercial: { sh: 0.52, co: 0.76, tx: 0.50 }, residential: { sh: 0.26, co: 0.58, tx: 0.30 },
    park: { sh: 0.16, co: 0.64, tx: 0.20 }, campus: { sh: 0.38, co: 0.70, tx: 0.42 },
    water: { sh: 0.20, co: 0.70, tx: 0.24 }, industry: { sh: 0.56, co: 0.66, tx: 0.60 },
    island: { sh: 0.18, co: 0.56, tx: 0.22 }
  };
  function buildSenseVector(type, mobility, hour, day) {
    const base = SV_BASE[type] || SV_BASE.residential;
    const commute = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
    const night = hour <= 5 || hour >= 23;
    const weekend = day % 7 >= 5;
    let sp = base.sp[0] + rand() * (base.sp[1] - base.sp[0]);
    let g = base.g[0] + rand() * (base.g[1] - base.g[0]);
    let t = base.t[0] + rand() * (base.t[1] - base.t[0]);
    let f = base.f[0] + rand() * (base.f[1] - base.f[0]);
    if (mobility === "still") { f -= 0.16 + rand() * 0.10; g += 0.06 + rand() * 0.08; }
    if (mobility === "passing") { f += 0.16 + rand() * 0.14; g -= 0.06 + rand() * 0.06; }
    if (commute) { t += 0.08 + rand() * 0.08; sp -= 0.06; f += 0.04; }
    if (night) { g += 0.06 + rand() * 0.08; sp -= 0.04; t -= 0.06; }
    if (weekend && ["park", "island"].includes(type)) { t -= 0.08; f -= 0.05; }
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
    if (!words || !words.length) return [];
    const count = rand() < 0.10 ? 0 : rand() < 0.32 ? 2 : 1;
    if (count === 0) return [];
    const first = weighted(words);
    if (count === 1) return [first];
    const rest = words.filter(([word]) => word !== first);
    return rest.length ? [first, weighted(rest)] : [first];
  }
  function pushRecord(user, day, index) {
    const selected = zoneByType();
    let pos;
    let direction = rand() * 360;
    let profile;
    let sourceId;

    if (selected.type === "corridor") {
      const sample = sampleCorridor(selected.item);
      pos = sample.pos;
      direction = sample.direction;
      profile = selected.item;
      sourceId = selected.item.id;
    } else {
      pos = randomInZone(selected.item);
      profile = selected.item;
      sourceId = selected.item.id;
    }

    const hour = sampleHour(profile.hours, day, profile.type);
    const minute = Math.floor(rand() * 60);
    const mobility = weighted(Object.entries(profile.mobility));
    const commute = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
    const night = hour <= 5 || hour >= 23;
    const weekend = day % 7 >= 5;
    const noiseLevel = clamp(
      profile.noise[0] + rand() * (profile.noise[1] - profile.noise[0])
        + (commute && !["park", "island"].includes(profile.type) ? 0.08 : 0)
        + (night ? -0.08 : 0),
      0.04, 0.96
    );
    const turbulence = clamp(
      profile.turbulence[0] + rand() * (profile.turbulence[1] - profile.turbulence[0])
        + (mobility === "passing" ? 0.08 : 0)
        + (weekend && ["park", "island"].includes(profile.type) ? 0.04 : 0),
      0.02, 0.94
    );
    const peak = clamp(noiseLevel + turbulence * 0.34 + rand() * 0.14, 0.05, 1);
    const word = weighted(profile.words);
    const selectedWords = pickSelectedWords(profile.words);
    const senseVector = buildSenseVector(profile.type, mobility, hour, day);
    const soundVector = buildSoundVector(noiseLevel, turbulence, profile.type);
    const timestamp = new Date(baseDate + day * 86400000 + hour * 3600000 + minute * 60000 + Math.floor(rand() * 60000)).toISOString();
    const duration = Math.round(clamp(8 + rand() * 10 + (mobility === "still" ? 2 : 0), 8, 18));
    const trustScore = clamp(0.62 + rand() * 0.34 - (night ? 0.05 : 0), 0.55, 1);

    records.push({
      id: `tokyo-v1-u${String(user).padStart(4, "0")}-d${day}-${index}-${records.length}`,
      userId: `tokyo-user-${String(user).padStart(4, "0")}`,
      lat: Number(pos.lat.toFixed(7)),
      lng: Number(pos.lng.toFixed(7)),
      timestamp,
      hour,
      weekday: day % 7,
      noiseLevel: Number(noiseLevel.toFixed(3)),
      turbulence: Number(turbulence.toFixed(3)),
      peak: Number(peak.toFixed(3)),
      mobility,
      direction: Number(direction.toFixed(1)),
      duration,
      word,
      selectedWords,
      senseVector,
      soundVector,
      trustScore: Number(trustScore.toFixed(3)),
      zoneId: sourceId,
      source: "tokyo-prefecture-sim-v1",
      noise: Number(noiseLevel.toFixed(3)),
      flux: Number(turbulence.toFixed(3)),
      movement: mobility,
      distance: mobility === "passing" ? 140 + rand() * 620 : mobility === "slow" ? 45 + rand() * 180 : rand() * 44,
      slot: slotForHour(hour),
      createdAt: timestamp
    });
  }

  for (let user = 0; user < WORLD_SKIN_META.userCount; user++) {
    for (let day = 0; day < WORLD_SKIN_META.days; day++) {
      const dailyCount = 1 + Math.floor(rand() * 4) + (rand() < 0.26 ? 1 : 0);
      for (let index = 0; index < dailyCount; index++) pushRecord(user, day, index);
    }
  }

  return records.slice(0, 18000);
})();

WORLD_SKIN_META.recordCount = WORLD_SKIN_RECORDS.length;

window.WORLD_SKIN_RECORDS = WORLD_SKIN_RECORDS;
window.WORLD_SKIN_META = WORLD_SKIN_META;
window.WORLD_SKIN_ZONES = WORLD_SKIN_ZONES;
window.WORLD_SKIN_CORRIDORS = WORLD_SKIN_CORRIDORS;
window.WORLD_SKIN_VOIDS = WORLD_SKIN_VOIDS;
window.WORLD_SKIN_DATA = {
  origin: WORLD_SKIN_META.center,
  radiusMeters: WORLD_SKIN_META.radiusKm * 1000,
  words: WORLD_SKIN_WORDS,
  clusters: WORLD_SKIN_ZONES,
  corridors: WORLD_SKIN_CORRIDORS,
  voids: WORLD_SKIN_VOIDS,
  records: WORLD_SKIN_RECORDS,
  meta: WORLD_SKIN_META
};
