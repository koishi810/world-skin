const WORLD_SKIN_META = {
  center: { lat: 35.7000, lng: 139.4800 },
  radiusKm: 5,
  generatedAt: "2026-05-11T00:00:00.000Z",
  days: 7,
  userCount: 100,
  recordCount: 0,
  source: "kokubunji-structure-sim-v2"
};

const WORLD_SKIN_WORDS = ["ざらつく", "重い", "浮く", "乾く", "遠い", "詰まる", "ほどける", "眠い"];

const WORLD_SKIN_ZONES = [
  {
    id: "kokubunji_station",
    label: "国分寺駅",
    type: "station",
    center: { lat: 35.7001, lng: 139.4808 },
    radius: 260,
    noise: [0.62, 0.90],
    turbulence: [0.48, 0.86],
    mobility: { passing: 0.52, slow: 0.34, still: 0.14 },
    words: [["ざらつく", 0.32], ["詰まる", 0.30], ["遠い", 0.18], ["重い", 0.12], ["乾く", 0.08]],
    hours: [[7, 0.16], [8, 0.18], [9, 0.10], [12, 0.05], [17, 0.13], [18, 0.17], [19, 0.13], [20, 0.05], [22, 0.03]]
  },
  {
    id: "nishikokubunji_station",
    label: "西国分寺駅",
    type: "station",
    center: { lat: 35.6991, lng: 139.4657 },
    radius: 250,
    noise: [0.56, 0.84],
    turbulence: [0.42, 0.78],
    mobility: { passing: 0.48, slow: 0.36, still: 0.16 },
    words: [["ざらつく", 0.28], ["詰まる", 0.26], ["遠い", 0.24], ["重い", 0.12], ["眠い", 0.10]],
    hours: [[7, 0.16], [8, 0.2], [9, 0.1], [17, 0.14], [18, 0.18], [19, 0.14], [20, 0.05], [23, 0.03]]
  },
  {
    id: "koigakubo_station",
    label: "恋ヶ窪駅",
    type: "station",
    center: { lat: 35.7110, lng: 139.4624 },
    radius: 220,
    noise: [0.46, 0.74],
    turbulence: [0.34, 0.68],
    mobility: { passing: 0.44, slow: 0.38, still: 0.18 },
    words: [["遠い", 0.28], ["ざらつく", 0.24], ["詰まる", 0.20], ["乾く", 0.14], ["眠い", 0.14]],
    hours: [[7, 0.17], [8, 0.18], [9, 0.1], [17, 0.15], [18, 0.18], [19, 0.13], [21, 0.06], [23, 0.03]]
  },
  {
    id: "hitotsubashi_gakuen_station",
    label: "一橋学園駅",
    type: "station",
    center: { lat: 35.7221, lng: 139.4806 },
    radius: 230,
    noise: [0.44, 0.72],
    turbulence: [0.30, 0.64],
    mobility: { passing: 0.40, slow: 0.42, still: 0.18 },
    words: [["遠い", 0.25], ["ざらつく", 0.22], ["詰まる", 0.18], ["眠い", 0.18], ["乾く", 0.17]],
    hours: [[7, 0.12], [8, 0.15], [9, 0.12], [12, 0.07], [16, 0.09], [17, 0.15], [18, 0.16], [19, 0.1], [22, 0.04]]
  },
  {
    id: "musashino_art_university",
    label: "武蔵野美術大学",
    type: "school",
    center: { lat: 35.7243, lng: 139.4480 },
    radius: 430,
    noise: [0.28, 0.58],
    turbulence: [0.22, 0.52],
    mobility: { passing: 0.12, slow: 0.42, still: 0.46 },
    words: [["重い", 0.24], ["ほどける", 0.22], ["眠い", 0.20], ["ざらつく", 0.18], ["乾く", 0.16]],
    hours: [[9, 0.08], [10, 0.12], [11, 0.12], [12, 0.11], [13, 0.11], [14, 0.13], [15, 0.13], [16, 0.1], [17, 0.07], [18, 0.03]]
  },
  {
    id: "tokyo_keizai_university",
    label: "東京経済大学周辺",
    type: "school",
    center: { lat: 35.6988, lng: 139.4869 },
    radius: 330,
    noise: [0.30, 0.60],
    turbulence: [0.22, 0.50],
    mobility: { passing: 0.16, slow: 0.44, still: 0.40 },
    words: [["重い", 0.22], ["ほどける", 0.20], ["眠い", 0.20], ["ざらつく", 0.20], ["遠い", 0.18]],
    hours: [[9, 0.08], [10, 0.11], [11, 0.12], [12, 0.11], [13, 0.10], [14, 0.11], [15, 0.12], [16, 0.11], [17, 0.08], [18, 0.06]]
  },
  {
    id: "musashi_kokubunji_park",
    label: "都立武蔵国分寺公園",
    type: "park",
    center: { lat: 35.6956, lng: 139.4678 },
    radius: 520,
    noise: [0.10, 0.36],
    turbulence: [0.08, 0.36],
    mobility: { passing: 0.08, slow: 0.28, still: 0.64 },
    words: [["浮く", 0.30], ["ほどける", 0.28], ["眠い", 0.18], ["遠い", 0.16], ["乾く", 0.08]],
    hours: [[9, 0.08], [10, 0.12], [11, 0.12], [12, 0.10], [13, 0.1], [14, 0.13], [15, 0.14], [16, 0.13], [17, 0.08]]
  },
  {
    id: "tonogayato_garden",
    label: "殿ヶ谷戸庭園",
    type: "park",
    center: { lat: 35.6972, lng: 139.4799 },
    radius: 220,
    noise: [0.12, 0.38],
    turbulence: [0.08, 0.34],
    mobility: { passing: 0.10, slow: 0.32, still: 0.58 },
    words: [["浮く", 0.28], ["ほどける", 0.26], ["眠い", 0.18], ["遠い", 0.18], ["乾く", 0.10]],
    hours: [[9, 0.08], [10, 0.12], [11, 0.12], [12, 0.1], [13, 0.1], [14, 0.13], [15, 0.14], [16, 0.13], [17, 0.08]]
  },
  {
    id: "nogawa_green_edge",
    label: "野川・小金井方面の緑地縁",
    type: "park",
    center: { lat: 35.6903, lng: 139.5008 },
    radius: 620,
    noise: [0.14, 0.42],
    turbulence: [0.10, 0.40],
    mobility: { passing: 0.12, slow: 0.36, still: 0.52 },
    words: [["浮く", 0.26], ["ほどける", 0.24], ["遠い", 0.20], ["眠い", 0.18], ["乾く", 0.12]],
    hours: [[8, 0.05], [9, 0.09], [10, 0.12], [11, 0.13], [13, 0.12], [14, 0.15], [15, 0.14], [16, 0.12], [17, 0.08]]
  },
  {
    id: "south_residential",
    label: "南町・東元町住宅地",
    type: "residential",
    center: { lat: 35.6920, lng: 139.4823 },
    radius: 720,
    noise: [0.20, 0.52],
    turbulence: [0.12, 0.42],
    mobility: { passing: 0.18, slow: 0.44, still: 0.38 },
    words: [["眠い", 0.24], ["遠い", 0.22], ["乾く", 0.20], ["ほどける", 0.20], ["浮く", 0.14]],
    hours: [[7, 0.10], [8, 0.10], [18, 0.12], [19, 0.16], [20, 0.16], [21, 0.14], [22, 0.12], [23, 0.06], [12, 0.04]]
  },
  {
    id: "northwest_residential",
    label: "戸倉・並木町住宅地",
    type: "residential",
    center: { lat: 35.7150, lng: 139.4540 },
    radius: 820,
    noise: [0.18, 0.50],
    turbulence: [0.10, 0.40],
    mobility: { passing: 0.18, slow: 0.46, still: 0.36 },
    words: [["眠い", 0.24], ["遠い", 0.22], ["乾く", 0.22], ["ほどける", 0.18], ["浮く", 0.14]],
    hours: [[7, 0.11], [8, 0.12], [18, 0.13], [19, 0.16], [20, 0.16], [21, 0.13], [22, 0.11], [23, 0.05], [12, 0.03]]
  }
];

const WORLD_SKIN_CORRIDORS = [
  {
    id: "chuo_line_corridor",
    label: "中央線沿い",
    type: "corridor",
    points: [
      { lat: 35.6991, lng: 139.4657 },
      { lat: 35.7001, lng: 139.4808 },
      { lat: 35.7018, lng: 139.5060 }
    ],
    width: 170,
    noise: [0.50, 0.82],
    turbulence: [0.36, 0.72],
    mobility: { passing: 0.66, slow: 0.28, still: 0.06 },
    words: [["ざらつく", 0.31], ["遠い", 0.26], ["詰まる", 0.24], ["重い", 0.10], ["乾く", 0.09]],
    hours: [[7, 0.16], [8, 0.18], [9, 0.10], [16, 0.07], [17, 0.14], [18, 0.17], [19, 0.13], [20, 0.05]]
  },
  {
    id: "seibu_kokubunji_line_corridor",
    label: "西武国分寺線沿い",
    type: "corridor",
    points: [
      { lat: 35.7001, lng: 139.4808 },
      { lat: 35.7110, lng: 139.4624 },
      { lat: 35.7243, lng: 139.4480 }
    ],
    width: 190,
    noise: [0.42, 0.74],
    turbulence: [0.30, 0.66],
    mobility: { passing: 0.58, slow: 0.34, still: 0.08 },
    words: [["遠い", 0.30], ["ざらつく", 0.26], ["詰まる", 0.20], ["乾く", 0.14], ["眠い", 0.10]],
    hours: [[7, 0.16], [8, 0.18], [9, 0.12], [17, 0.14], [18, 0.18], [19, 0.14], [20, 0.05], [22, 0.03]]
  },
  {
    id: "fuchu_kaido_corridor",
    label: "府中街道方向",
    type: "corridor",
    points: [
      { lat: 35.6860, lng: 139.4710 },
      { lat: 35.6990, lng: 139.4660 },
      { lat: 35.7130, lng: 139.4620 }
    ],
    width: 210,
    noise: [0.54, 0.86],
    turbulence: [0.40, 0.76],
    mobility: { passing: 0.64, slow: 0.30, still: 0.06 },
    words: [["ざらつく", 0.34], ["詰まる", 0.27], ["遠い", 0.20], ["重い", 0.12], ["乾く", 0.07]],
    hours: [[7, 0.14], [8, 0.16], [9, 0.10], [13, 0.06], [17, 0.15], [18, 0.18], [19, 0.15], [20, 0.06]]
  },
  {
    id: "kokubunji_north_south_corridor",
    label: "国分寺南北生活動線",
    type: "corridor",
    points: [
      { lat: 35.6890, lng: 139.4830 },
      { lat: 35.7001, lng: 139.4808 },
      { lat: 35.7105, lng: 139.4780 },
      { lat: 35.7221, lng: 139.4806 }
    ],
    width: 180,
    noise: [0.36, 0.66],
    turbulence: [0.24, 0.58],
    mobility: { passing: 0.44, slow: 0.44, still: 0.12 },
    words: [["遠い", 0.24], ["ざらつく", 0.24], ["乾く", 0.18], ["眠い", 0.18], ["ほどける", 0.16]],
    hours: [[7, 0.12], [8, 0.12], [10, 0.08], [12, 0.08], [16, 0.10], [17, 0.14], [18, 0.16], [19, 0.12], [21, 0.08]]
  }
];

const WORLD_SKIN_VOIDS = [
  { id: "park_interior_void", center: { lat: 35.6959, lng: 139.4678 }, radius: 260 },
  { id: "residential_back_void_west", center: { lat: 35.7068, lng: 139.4554 }, radius: 360 },
  { id: "between_corridors_void", center: { lat: 35.7080, lng: 139.4928 }, radius: 420 },
  { id: "south_green_edge_void", center: { lat: 35.6888, lng: 139.4920 }, radius: 360 }
];

const WORLD_SKIN_RECORDS = (() => {
  const origin = WORLD_SKIN_META.center;
  const radiusMeters = WORLD_SKIN_META.radiusKm * 1000;
  const baseDate = Date.UTC(2026, 4, 4, 0, 0, 0);
  const rand = seededRandom(2026051117);
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function weighted(items) {
    const total = items.reduce((sum, item) => sum + item[1], 0);
    let pick = rand() * total;
    for (const item of items) {
      pick -= item[1];
      if (pick <= 0) return item[0];
    }
    return items[items.length - 1][0];
  }

  function metersToLatLng(dx, dy) {
    return {
      lat: origin.lat + dy / 111320,
      lng: origin.lng + dx / (111320 * Math.cos(origin.lat * Math.PI / 180))
    };
  }

  function latLngToMeters(pos) {
    return {
      dx: (pos.lng - origin.lng) * 111320 * Math.cos(origin.lat * Math.PI / 180),
      dy: (pos.lat - origin.lat) * 111320
    };
  }

  function distanceMeters(a, b) {
    const am = latLngToMeters(a);
    const bm = latLngToMeters(b);
    return Math.hypot(am.dx - bm.dx, am.dy - bm.dy);
  }

  function insideVoid(pos) {
    return WORLD_SKIN_VOIDS.some(voidZone => distanceMeters(pos, voidZone.center) < voidZone.radius);
  }

  function randomInZone(zone) {
    const center = latLngToMeters(zone.center);
    const concentration = zone.type === "station" ? 0.58 : zone.type === "school" ? 0.72 : zone.type === "park" ? 0.82 : 1;
    for (let attempt = 0; attempt < 14; attempt++) {
      const angle = rand() * Math.PI * 2;
      const distance = Math.pow(rand(), zone.type === "station" ? 0.72 : 0.5) * zone.radius * concentration;
      const pos = metersToLatLng(
        center.dx + Math.cos(angle) * distance,
        center.dy + Math.sin(angle) * distance
      );
      if (!insideVoid(pos) || rand() < 0.12) return pos;
    }
    return zone.center;
  }

  function sampleCorridor(corridor) {
    const segments = [];
    for (let i = 1; i < corridor.points.length; i++) {
      const a = latLngToMeters(corridor.points[i - 1]);
      const b = latLngToMeters(corridor.points[i]);
      const length = Math.hypot(b.dx - a.dx, b.dy - a.dy);
      segments.push({ a, b, length });
    }
    const total = segments.reduce((sum, seg) => sum + seg.length, 0);
    let pick = rand() * total;
    let seg = segments[0];
    for (const candidate of segments) {
      pick -= candidate.length;
      if (pick <= 0) {
        seg = candidate;
        break;
      }
    }
    const t = rand();
    const dx = seg.b.dx - seg.a.dx;
    const dy = seg.b.dy - seg.a.dy;
    const length = Math.max(1, seg.length);
    const normal = { x: -dy / length, y: dx / length };
    const alongWander = (rand() - 0.5) * 80;
    const lateral = (rand() - 0.5) * corridor.width * (0.24 + rand() * 0.62);
    const pos = metersToLatLng(
      seg.a.dx + dx * t + (dx / length) * alongWander + normal.x * lateral,
      seg.a.dy + dy * t + (dy / length) * alongWander + normal.y * lateral
    );
    return {
      pos,
      direction: (Math.atan2(dx, dy) * 180 / Math.PI + 360 + (rand() - 0.5) * 22) % 360
    };
  }

  function sampleIsolated() {
    const angle = rand() * Math.PI * 2;
    const distance = (0.38 + rand() * 0.58) * radiusMeters;
    return metersToLatLng(Math.cos(angle) * distance, Math.sin(angle) * distance);
  }

  function sampleHour(profile, day, type) {
    let hour = weighted(profile);
    if (type === "park" && day >= 5 && rand() < 0.28) hour = weighted([[10, 0.18], [11, 0.18], [13, 0.2], [14, 0.22], [15, 0.14], [16, 0.08]]);
    if (rand() < 0.035) hour = weighted([[0, 0.08], [1, 0.06], [5, 0.14], [6, 0.22], [22, 0.28], [23, 0.22]]);
    return clamp(hour + Math.floor(rand() * 3) - 1, 0, 23);
  }

  function sampleMobility(profile) {
    return weighted(Object.entries(profile));
  }

  function zoneByDistribution() {
    const type = weighted([
      ["station", 0.32],
      ["corridor", 0.25],
      ["school", 0.14],
      ["park", 0.12],
      ["residential", 0.13],
      ["isolated", 0.04]
    ]);
    if (type === "corridor") return { type, item: WORLD_SKIN_CORRIDORS[Math.floor(rand() * WORLD_SKIN_CORRIDORS.length)] };
    if (type === "isolated") return { type, item: null };
    const zones = WORLD_SKIN_ZONES.filter(zone => zone.type === type);
    return { type, item: zones[Math.floor(rand() * zones.length)] };
  }

  function slotForHour(hour) {
    if (hour < 6) return "night";
    if (hour < 11) return "morning";
    if (hour < 17) return "day";
    if (hour < 22) return "evening";
    return "night";
  }

  function pushRecord(user, day, index) {
    const selected = zoneByDistribution();
    let pos;
    let direction = rand() * 360;
    let profile;
    let sourceId;

    if (selected.type === "isolated") {
      pos = sampleIsolated();
      profile = {
        id: "isolated",
        type: "isolated",
        noise: [0.12, 0.48],
        turbulence: [0.08, 0.38],
        mobility: { still: 0.52, slow: 0.34, passing: 0.14 },
        words: [["遠い", 0.38], ["浮く", 0.28], ["乾く", 0.22], ["眠い", 0.12]],
        hours: [[8, 0.08], [10, 0.12], [13, 0.16], [15, 0.16], [18, 0.14], [20, 0.14], [22, 0.12], [23, 0.08]]
      };
      sourceId = "isolated";
    } else if (selected.type === "corridor") {
      const sampled = sampleCorridor(selected.item);
      pos = sampled.pos;
      direction = sampled.direction;
      profile = selected.item;
      sourceId = selected.item.id;
    } else {
      pos = randomInZone(selected.item);
      profile = selected.item;
      sourceId = selected.item.id;
    }

    if (distanceMeters(pos, origin) > radiusMeters * 1.06) return;
    if (selected.type !== "park" && selected.type !== "isolated" && insideVoid(pos) && rand() < 0.78) return;

    const hour = sampleHour(profile.hours, day, profile.type);
    const minute = Math.floor(rand() * 60);
    const mobility = sampleMobility(profile.mobility);
    const commute = hour >= 7 && hour <= 9 || hour >= 17 && hour <= 20;
    const night = hour <= 5 || hour >= 23;
    const weekend = day >= 5;
    const noiseLevel = clamp(
      profile.noise[0] + rand() * (profile.noise[1] - profile.noise[0]) + (commute && profile.type !== "park" ? 0.08 : 0) + (night ? -0.08 : 0),
      0.05,
      0.95
    );
    const turbulence = clamp(
      profile.turbulence[0] + rand() * (profile.turbulence[1] - profile.turbulence[0]) + (mobility === "passing" ? 0.08 : 0) + (weekend && profile.type === "park" ? 0.03 : 0),
      0.02,
      0.90
    );
    const peak = clamp(noiseLevel + turbulence * 0.34 + rand() * 0.16, 0.05, 1);
    const word = weighted(profile.words);
    const timestamp = new Date(baseDate + day * 86400000 + hour * 3600000 + minute * 60000 + Math.floor(rand() * 60000)).toISOString();
    const duration = Math.round(clamp(8 + rand() * 10 + (mobility === "still" ? 2 : 0), 8, 18));
    const trustScore = clamp(0.62 + rand() * 0.34 - (night ? 0.05 : 0), 0.55, 1);

    records.push({
      id: `kbj-v2-u${String(user).padStart(3, "0")}-d${day}-${index}-${records.length}`,
      userId: `user-${String(user).padStart(3, "0")}`,
      lat: Number(pos.lat.toFixed(7)),
      lng: Number(pos.lng.toFixed(7)),
      timestamp,
      hour,
      weekday: day,
      noiseLevel: Number(noiseLevel.toFixed(3)),
      turbulence: Number(turbulence.toFixed(3)),
      peak: Number(peak.toFixed(3)),
      mobility,
      direction: Number(direction.toFixed(1)),
      duration,
      word,
      trustScore: Number(trustScore.toFixed(3)),
      zoneId: sourceId,
      source: "kokubunji-structure-sim-v2",

      // Compatibility fields used by test0.2.html.
      noise: Number(noiseLevel.toFixed(3)),
      flux: Number(turbulence.toFixed(3)),
      movement: mobility,
      distance: mobility === "passing" ? 140 + rand() * 520 : mobility === "slow" ? 45 + rand() * 150 : rand() * 42,
      slot: slotForHour(hour),
      createdAt: timestamp
    });
  }

  for (let user = 0; user < WORLD_SKIN_META.userCount; user++) {
    for (let day = 0; day < WORLD_SKIN_META.days; day++) {
      const dailyCount = 2 + Math.floor(rand() * 4) + (rand() < 0.24 ? 1 : 0) + (rand() < 0.08 ? 1 : 0);
      for (let index = 0; index < dailyCount; index++) pushRecord(user, day, index);
    }
  }

  return records.slice(0, 3200);
})();

WORLD_SKIN_META.recordCount = WORLD_SKIN_RECORDS.length;

window.WORLD_SKIN_RECORDS = WORLD_SKIN_RECORDS;
window.WORLD_SKIN_META = WORLD_SKIN_META;
window.WORLD_SKIN_ZONES = WORLD_SKIN_ZONES;
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
