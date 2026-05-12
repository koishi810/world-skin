const WORLD_SKIN_META = {
  center: { lat: 35.7000, lng: 139.4800 },
  radiusKm: 8,
  generatedAt: "2026-05-13T00:00:00.000Z",
  days: 10,
  userCount: 200,
  recordCount: 0,
  source: "kokubunji-sim-v4-clean"
};

const WORLD_SKIN_WORDS = [
  "ざらつく", "重い", "浮く", "乾く", "遠い", "詰まる", "ほどける", "眠い",
  "流れる", "速い", "澄む", "硬い", "滞る", "広がる", "こもる", "薄い"
];

const WORLD_SKIN_ZONES = [
  { id:"kokubunji_station",      label:"国分寺駅",           type:"station",     center:{lat:35.7001,lng:139.4808}, radius:280, noise:[0.65,0.92], turbulence:[0.52,0.88], mobility:{passing:0.52,slow:0.34,still:0.14}, words:[["ざらつく",0.28],["詰まる",0.26],["硬い",0.18],["滞る",0.16],["重い",0.12]], hours:[[7,0.16],[8,0.19],[9,0.11],[12,0.05],[17,0.13],[18,0.17],[19,0.13],[20,0.06]] },
  { id:"nishikokubunji_station", label:"西国分寺駅",          type:"station",     center:{lat:35.6991,lng:139.4657}, radius:255, noise:[0.58,0.86], turbulence:[0.44,0.80], mobility:{passing:0.48,slow:0.36,still:0.16}, words:[["ざらつく",0.26],["詰まる",0.24],["硬い",0.20],["滞る",0.18],["重い",0.12]], hours:[[7,0.16],[8,0.20],[9,0.11],[17,0.14],[18,0.18],[19,0.14],[20,0.07]] },
  { id:"musashikoganei_station", label:"武蔵小金井駅",        type:"station",     center:{lat:35.7029,lng:139.5036}, radius:272, noise:[0.62,0.90], turbulence:[0.48,0.84], mobility:{passing:0.50,slow:0.36,still:0.14}, words:[["ざらつく",0.26],["詰まる",0.24],["硬い",0.18],["流れる",0.18],["重い",0.14]], hours:[[7,0.15],[8,0.18],[9,0.11],[12,0.06],[17,0.14],[18,0.18],[19,0.14],[20,0.04]] },
  { id:"higashikoganei_station", label:"東小金井駅",          type:"station",     center:{lat:35.7024,lng:139.5185}, radius:230, noise:[0.50,0.80], turbulence:[0.36,0.72], mobility:{passing:0.44,slow:0.40,still:0.16}, words:[["ざらつく",0.24],["詰まる",0.22],["硬い",0.22],["乾く",0.18],["遠い",0.14]], hours:[[7,0.16],[8,0.19],[9,0.12],[17,0.14],[18,0.18],[19,0.13],[20,0.05],[22,0.03]] },
  { id:"kunitachi_station",      label:"国立駅",              type:"station",     center:{lat:35.6849,lng:139.4677}, radius:262, noise:[0.56,0.84], turbulence:[0.40,0.76], mobility:{passing:0.46,slow:0.38,still:0.16}, words:[["ざらつく",0.24],["詰まる",0.22],["乾く",0.22],["硬い",0.18],["遠い",0.14]], hours:[[7,0.14],[8,0.17],[9,0.12],[12,0.07],[17,0.14],[18,0.18],[19,0.14],[20,0.04]] },
  { id:"koigakubo_station",      label:"恋ヶ窪駅",            type:"station",     center:{lat:35.7110,lng:139.4624}, radius:222, noise:[0.44,0.74], turbulence:[0.32,0.66], mobility:{passing:0.42,slow:0.40,still:0.18}, words:[["ざらつく",0.24],["詰まる",0.20],["硬い",0.20],["乾く",0.20],["遠い",0.16]], hours:[[7,0.16],[8,0.18],[9,0.11],[17,0.15],[18,0.17],[19,0.13],[21,0.07],[23,0.03]] },
  { id:"hitotsubashi_station",   label:"一橋学園駅",          type:"station",     center:{lat:35.7221,lng:139.4806}, radius:232, noise:[0.42,0.72], turbulence:[0.28,0.62], mobility:{passing:0.38,slow:0.44,still:0.18}, words:[["ざらつく",0.22],["詰まる",0.18],["乾く",0.22],["眠い",0.20],["遠い",0.18]], hours:[[7,0.12],[8,0.14],[9,0.12],[12,0.07],[16,0.09],[17,0.14],[18,0.16],[19,0.12],[22,0.04]] },
  { id:"kodaira_station",        label:"小平駅",              type:"station",     center:{lat:35.7286,lng:139.4769}, radius:242, noise:[0.46,0.76], turbulence:[0.33,0.68], mobility:{passing:0.44,slow:0.40,still:0.16}, words:[["ざらつく",0.24],["詰まる",0.20],["乾く",0.20],["硬い",0.20],["遠い",0.16]], hours:[[7,0.14],[8,0.17],[9,0.12],[12,0.06],[17,0.14],[18,0.17],[19,0.13],[20,0.05],[22,0.02]] },
  { id:"musashi_kokubunji_park", label:"都立武蔵国分寺公園",  type:"park",        center:{lat:35.6956,lng:139.4678}, radius:540, noise:[0.08,0.34], turbulence:[0.06,0.32], mobility:{passing:0.08,slow:0.28,still:0.64}, words:[["浮く",0.28],["ほどける",0.26],["澄む",0.22],["広がる",0.14],["遠い",0.10]],    hours:[[8,0.06],[9,0.10],[10,0.14],[11,0.13],[12,0.10],[13,0.11],[14,0.14],[15,0.14],[16,0.08]] },
  { id:"tonogayato_garden",      label:"殿ヶ谷戸庭園",        type:"park",        center:{lat:35.6972,lng:139.4799}, radius:222, noise:[0.10,0.36], turbulence:[0.06,0.30], mobility:{passing:0.08,slow:0.30,still:0.62}, words:[["浮く",0.26],["ほどける",0.24],["澄む",0.24],["広がる",0.14],["薄い",0.12]],    hours:[[9,0.08],[10,0.14],[11,0.14],[12,0.10],[13,0.10],[14,0.14],[15,0.16],[16,0.14]] },
  { id:"koganei_park",           label:"小金井公園",          type:"park",        center:{lat:35.7213,lng:139.5057}, radius:680, noise:[0.06,0.30], turbulence:[0.04,0.28], mobility:{passing:0.06,slow:0.24,still:0.70}, words:[["浮く",0.30],["ほどける",0.26],["澄む",0.20],["広がる",0.16],["薄い",0.08]],    hours:[[9,0.08],[10,0.14],[11,0.14],[12,0.12],[13,0.12],[14,0.16],[15,0.16],[16,0.08]] },
  { id:"tamagawa_greenway",      label:"玉川上水緑道",        type:"park",        center:{lat:35.7148,lng:139.4902}, radius:480, noise:[0.10,0.38], turbulence:[0.08,0.34], mobility:{passing:0.14,slow:0.38,still:0.48}, words:[["澄む",0.28],["ほどける",0.22],["浮く",0.20],["薄い",0.16],["遠い",0.14]],    hours:[[8,0.10],[9,0.12],[10,0.12],[11,0.10],[16,0.10],[17,0.14],[18,0.14],[19,0.10]] },
  { id:"nogawa_green_edge",      label:"野川緑地縁",          type:"park",        center:{lat:35.6903,lng:139.5008}, radius:560, noise:[0.12,0.40], turbulence:[0.08,0.36], mobility:{passing:0.10,slow:0.34,still:0.56}, words:[["浮く",0.24],["ほどける",0.22],["澄む",0.20],["広がる",0.18],["遠い",0.16]],   hours:[[8,0.06],[9,0.10],[10,0.14],[11,0.13],[13,0.12],[14,0.15],[15,0.14],[16,0.12],[17,0.08]] },
  { id:"musashino_art_univ",     label:"武蔵野美術大学",      type:"school",      center:{lat:35.7243,lng:139.4480}, radius:440, noise:[0.26,0.58], turbulence:[0.20,0.50], mobility:{passing:0.12,slow:0.44,still:0.44}, words:[["重い",0.22],["こもる",0.20],["ほどける",0.18],["乾く",0.22],["眠い",0.18]],   hours:[[9,0.08],[10,0.12],[11,0.13],[12,0.12],[13,0.12],[14,0.13],[15,0.13],[16,0.10],[17,0.07]] },
  { id:"tokyo_keizai_univ",      label:"東京経済大学",        type:"school",      center:{lat:35.6988,lng:139.4869}, radius:342, noise:[0.28,0.58], turbulence:[0.20,0.48], mobility:{passing:0.14,slow:0.46,still:0.40}, words:[["重い",0.24],["こもる",0.22],["眠い",0.20],["乾く",0.18],["ほどける",0.16]], hours:[[9,0.08],[10,0.11],[11,0.12],[12,0.12],[13,0.11],[14,0.12],[15,0.12],[16,0.12],[17,0.10]] },
  { id:"hitotsubashi_univ",      label:"一橋大学",            type:"school",      center:{lat:35.6834,lng:139.4695}, radius:424, noise:[0.24,0.54], turbulence:[0.18,0.46], mobility:{passing:0.10,slow:0.44,still:0.46}, words:[["重い",0.22],["こもる",0.24],["眠い",0.18],["乾く",0.18],["ほどける",0.18]], hours:[[9,0.08],[10,0.12],[11,0.13],[12,0.12],[13,0.12],[14,0.13],[15,0.13],[16,0.10],[17,0.07]] },
  { id:"tokyo_gakugei_univ",     label:"東京学芸大学",        type:"school",      center:{lat:35.6843,lng:139.4974}, radius:402, noise:[0.26,0.56], turbulence:[0.18,0.48], mobility:{passing:0.12,slow:0.44,still:0.44}, words:[["重い",0.22],["こもる",0.22],["眠い",0.20],["乾く",0.20],["ほどける",0.16]], hours:[[9,0.08],[10,0.11],[11,0.12],[12,0.12],[13,0.11],[14,0.12],[15,0.12],[16,0.12],[17,0.10],[18,0.06]] },
  { id:"kokubunji_shopping",     label:"国分寺駅前商業地",    type:"shopping",    center:{lat:35.7005,lng:139.4820}, radius:200, noise:[0.45,0.78], turbulence:[0.32,0.68], mobility:{passing:0.36,slow:0.46,still:0.18}, words:[["詰まる",0.26],["ざらつく",0.22],["重い",0.20],["滞る",0.18],["遠い",0.14]],    hours:[[10,0.10],[11,0.12],[12,0.14],[13,0.12],[14,0.12],[15,0.12],[16,0.12],[17,0.08],[18,0.06]] },
  { id:"musashikoganei_shopping",label:"武蔵小金井駅前商業地",type:"shopping",    center:{lat:35.7032,lng:139.5048}, radius:182, noise:[0.40,0.74], turbulence:[0.28,0.64], mobility:{passing:0.34,slow:0.48,still:0.18}, words:[["詰まる",0.24],["ざらつく",0.22],["重い",0.20],["滞る",0.18],["眠い",0.16]],    hours:[[10,0.10],[11,0.12],[12,0.14],[13,0.12],[14,0.12],[15,0.12],[16,0.12],[17,0.08],[18,0.06]] },
  { id:"musashi_temple",         label:"武蔵国分寺跡・元八幡",type:"shrine",      center:{lat:35.6988,lng:139.4767}, radius:202, noise:[0.08,0.28], turbulence:[0.04,0.18], mobility:{passing:0.08,slow:0.26,still:0.66}, words:[["遠い",0.30],["澄む",0.26],["浮く",0.22],["薄い",0.14],["ほどける",0.08]],   hours:[[8,0.12],[9,0.14],[10,0.14],[11,0.12],[12,0.10],[14,0.12],[15,0.14],[16,0.12]] },
  { id:"south_residential",      label:"南町・東元町住宅地",  type:"residential", center:{lat:35.6920,lng:139.4823}, radius:722, noise:[0.18,0.50], turbulence:[0.10,0.40], mobility:{passing:0.16,slow:0.44,still:0.40}, words:[["眠い",0.26],["ほどける",0.22],["薄い",0.20],["遠い",0.18],["浮く",0.14]],    hours:[[7,0.10],[8,0.10],[18,0.12],[19,0.16],[20,0.16],[21,0.14],[22,0.12],[23,0.06],[12,0.04]] },
  { id:"northwest_residential",  label:"戸倉・並木町住宅地",  type:"residential", center:{lat:35.7150,lng:139.4540}, radius:820, noise:[0.16,0.48], turbulence:[0.08,0.38], mobility:{passing:0.16,slow:0.46,still:0.38}, words:[["眠い",0.26],["ほどける",0.22],["薄い",0.22],["遠い",0.18],["浮く",0.12]],    hours:[[7,0.11],[8,0.12],[18,0.13],[19,0.16],[20,0.16],[21,0.13],[22,0.11],[23,0.05],[12,0.03]] },
  { id:"east_koganei_residential",label:"武蔵小金井周辺住宅地",type:"residential",center:{lat:35.7055,lng:139.5120}, radius:662, noise:[0.16,0.46], turbulence:[0.10,0.38], mobility:{passing:0.16,slow:0.46,still:0.38}, words:[["眠い",0.24],["ほどける",0.22],["薄い",0.22],["遠い",0.18],["浮く",0.14]],    hours:[[7,0.10],[8,0.11],[18,0.14],[19,0.16],[20,0.16],[21,0.14],[22,0.11],[23,0.05],[12,0.03]] },
  { id:"kunitachi_residential",  label:"国立南部住宅地",      type:"residential", center:{lat:35.6810,lng:139.4720}, radius:682, noise:[0.14,0.46], turbulence:[0.08,0.36], mobility:{passing:0.14,slow:0.46,still:0.40}, words:[["眠い",0.26],["ほどける",0.22],["薄い",0.20],["遠い",0.20],["浮く",0.12]],    hours:[[7,0.10],[8,0.10],[18,0.13],[19,0.16],[20,0.16],[21,0.14],[22,0.12],[23,0.06],[12,0.03]] },
  { id:"kodaira_residential",    label:"小平住宅地",          type:"residential", center:{lat:35.7380,lng:139.4720}, radius:752, noise:[0.14,0.44], turbulence:[0.08,0.36], mobility:{passing:0.14,slow:0.46,still:0.40}, words:[["眠い",0.26],["ほどける",0.20],["薄い",0.22],["遠い",0.20],["浮く",0.12]],    hours:[[7,0.10],[8,0.10],[18,0.13],[19,0.16],[20,0.16],[21,0.14],[22,0.12],[23,0.05],[12,0.04]] },
  { id:"fuchu_east_residential", label:"府中東部住宅地",      type:"residential", center:{lat:35.6750,lng:139.4920}, radius:702, noise:[0.16,0.48], turbulence:[0.10,0.38], mobility:{passing:0.16,slow:0.46,still:0.38}, words:[["眠い",0.24],["ほどける",0.22],["薄い",0.22],["遠い",0.18],["浮く",0.14]],    hours:[[7,0.10],[8,0.10],[18,0.14],[19,0.16],[20,0.16],[21,0.14],[22,0.12],[23,0.05],[12,0.03]] }
];

const WORLD_SKIN_CORRIDORS = [
  { id:"chuo_line",         label:"中央線沿い",          type:"corridor", points:[{lat:35.6849,lng:139.4677},{lat:35.6991,lng:139.4657},{lat:35.7001,lng:139.4808},{lat:35.7029,lng:139.5036},{lat:35.7024,lng:139.5185}], width:178, noise:[0.56,0.90], turbulence:[0.44,0.80], mobility:{passing:0.68,slow:0.26,still:0.06}, words:[["流れる",0.28],["速い",0.26],["ざらつく",0.22],["乾く",0.14],["硬い",0.10]], hours:[[7,0.16],[8,0.18],[9,0.10],[16,0.07],[17,0.14],[18,0.17],[19,0.13],[20,0.05]] },
  { id:"seibu_kokubunji",   label:"西武国分寺線沿い",    type:"corridor", points:[{lat:35.7001,lng:139.4808},{lat:35.7110,lng:139.4624},{lat:35.7221,lng:139.4806},{lat:35.7286,lng:139.4769}], width:192, noise:[0.44,0.76], turbulence:[0.32,0.68], mobility:{passing:0.60,slow:0.34,still:0.06}, words:[["流れる",0.28],["速い",0.24],["ざらつく",0.22],["乾く",0.16],["遠い",0.10]], hours:[[7,0.16],[8,0.18],[9,0.12],[17,0.14],[18,0.18],[19,0.14],[20,0.05],[22,0.03]] },
  { id:"fuchu_kaido",       label:"府中街道",            type:"corridor", points:[{lat:35.6750,lng:139.4710},{lat:35.6849,lng:139.4677},{lat:35.6991,lng:139.4657},{lat:35.7110,lng:139.4624}], width:218, noise:[0.58,0.90], turbulence:[0.44,0.80], mobility:{passing:0.66,slow:0.28,still:0.06}, words:[["流れる",0.26],["速い",0.24],["ざらつく",0.24],["乾く",0.14],["硬い",0.12]], hours:[[7,0.14],[8,0.16],[9,0.10],[13,0.06],[17,0.15],[18,0.18],[19,0.15],[20,0.06]] },
  { id:"ns_corridor",       label:"国分寺南北生活動線",  type:"corridor", points:[{lat:35.6890,lng:139.4830},{lat:35.7001,lng:139.4808},{lat:35.7105,lng:139.4780},{lat:35.7221,lng:139.4806}], width:182, noise:[0.36,0.68], turbulence:[0.24,0.58], mobility:{passing:0.44,slow:0.44,still:0.12}, words:[["流れる",0.26],["ざらつく",0.24],["乾く",0.20],["遠い",0.16],["眠い",0.14]], hours:[[7,0.12],[8,0.12],[10,0.08],[12,0.08],[16,0.10],[17,0.14],[18,0.16],[19,0.12],[21,0.08]] },
  { id:"tamagawa_path",     label:"玉川上水沿い遊歩道",  type:"corridor", points:[{lat:35.7221,lng:139.4806},{lat:35.7175,lng:139.4950},{lat:35.7120,lng:139.5090}], width:148, noise:[0.22,0.54], turbulence:[0.14,0.44], mobility:{passing:0.32,slow:0.46,still:0.22}, words:[["澄む",0.28],["流れる",0.24],["ほどける",0.22],["薄い",0.14],["遠い",0.12]], hours:[[7,0.08],[8,0.10],[9,0.12],[10,0.12],[16,0.12],[17,0.16],[18,0.16],[19,0.08],[20,0.06]] },
  { id:"renjaku_dori",      label:"連雀通り",            type:"corridor", points:[{lat:35.6930,lng:139.4650},{lat:35.6960,lng:139.4808},{lat:35.6980,lng:139.5050}], width:202, noise:[0.40,0.72], turbulence:[0.28,0.62], mobility:{passing:0.56,slow:0.36,still:0.08}, words:[["流れる",0.26],["速い",0.22],["ざらつく",0.22],["乾く",0.18],["滞る",0.12]], hours:[[7,0.12],[8,0.14],[9,0.10],[12,0.08],[13,0.08],[17,0.14],[18,0.18],[19,0.14],[20,0.02]] }
];

const WORLD_SKIN_VOIDS = [
  { id:"park_interior_void",    center:{lat:35.6959,lng:139.4678}, radius:240 },
  { id:"residential_back_west", center:{lat:35.7068,lng:139.4554}, radius:360 },
  { id:"between_corridors",     center:{lat:35.7080,lng:139.4928}, radius:380 },
  { id:"south_green_void",      center:{lat:35.6888,lng:139.4920}, radius:340 },
  { id:"north_kodaira_void",    center:{lat:35.7420,lng:139.4850}, radius:420 },
  { id:"koganei_park_interior", center:{lat:35.7213,lng:139.5057}, radius:300 }
];

const WORLD_SKIN_RECORDS = (() => {
  const origin = WORLD_SKIN_META.center;
  const radiusMeters = WORLD_SKIN_META.radiusKm * 1000;
  const baseDate = Date.UTC(2026, 4, 2, 0, 0, 0);
  const rand = seededRandom(2026051318);
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
    const total = items.reduce((s, it) => s + it[1], 0);
    let pick = rand() * total;
    for (const it of items) { pick -= it[1]; if (pick <= 0) return it[0]; }
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
    const am = latLngToMeters(a), bm = latLngToMeters(b);
    return Math.hypot(am.dx - bm.dx, am.dy - bm.dy);
  }

  function insideVoid(pos) {
    return WORLD_SKIN_VOIDS.some(v => distanceMeters(pos, v.center) < v.radius);
  }

  function randomInZone(zone) {
    const center = latLngToMeters(zone.center);
    const conc = zone.type === "station" ? 0.60 : zone.type === "shopping" ? 0.55 : zone.type === "shrine" ? 0.66 : zone.type === "park" ? 0.82 : 1.0;
    const pow  = zone.type === "station" || zone.type === "shopping" ? 0.72 : 0.5;
    for (let attempt = 0; attempt < 14; attempt++) {
      const angle = rand() * Math.PI * 2;
      const dist  = Math.pow(rand(), pow) * zone.radius * conc;
      const pos   = metersToLatLng(center.dx + Math.cos(angle) * dist, center.dy + Math.sin(angle) * dist);
      if (!insideVoid(pos) || rand() < 0.12) return pos;
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
    const total = segments.reduce((s, sg) => s + sg.length, 0);
    let pick = rand() * total, seg = segments[0];
    for (const c of segments) { pick -= c.length; if (pick <= 0) { seg = c; break; } }
    const t = rand();
    const dx = seg.b.dx - seg.a.dx, dy = seg.b.dy - seg.a.dy;
    const len = Math.max(1, seg.length);
    return {
      pos: metersToLatLng(
        seg.a.dx + dx * t + (-dy / len) * (rand() - 0.5) * corridor.width * (0.22 + rand() * 0.64),
        seg.a.dy + dy * t + ( dx / len) * (rand() - 0.5) * corridor.width * (0.22 + rand() * 0.64)
      ),
      direction: (Math.atan2(dx, dy) * 180 / Math.PI + 360 + (rand() - 0.5) * 22) % 360
    };
  }

  function sampleIsolated() {
    const angle = rand() * Math.PI * 2;
    return metersToLatLng(Math.cos(angle) * (0.40 + rand() * 0.56) * radiusMeters, Math.sin(angle) * (0.40 + rand() * 0.56) * radiusMeters);
  }

  function sampleHour(profile, day, type) {
    let hour = weighted(profile);
    if (type === "park" && day >= 5 && rand() < 0.30)
      hour = weighted([[10,0.18],[11,0.18],[13,0.20],[14,0.22],[15,0.14],[16,0.08]]);
    if (rand() < 0.028)
      hour = weighted([[0,0.08],[1,0.06],[5,0.14],[6,0.22],[22,0.28],[23,0.22]]);
    return clamp(hour + Math.floor(rand() * 3) - 1, 0, 23);
  }

  function zoneByType() {
    const type = weighted([
      ["station",    0.28], ["corridor",   0.22], ["school",     0.12],
      ["park",       0.14], ["residential",0.14], ["shopping",   0.06],
      ["shrine",     0.02], ["isolated",   0.02]
    ]);
    if (type === "corridor") return { type, item: WORLD_SKIN_CORRIDORS[Math.floor(rand() * WORLD_SKIN_CORRIDORS.length)] };
    if (type === "isolated") return { type, item: null };
    const zones = WORLD_SKIN_ZONES.filter(z => z.type === type);
    if (!zones.length) return { type: "isolated", item: null };
    const total = zones.reduce((s, z) => s + z.radius, 0);
    let pick = rand() * total;
    for (const z of zones) { pick -= z.radius; if (pick <= 0) return { type, item: z }; }
    return { type, item: zones[zones.length - 1] };
  }

  function slotForHour(h) {
    if (h < 6)  return "night";
    if (h < 11) return "morning";
    if (h < 17) return "day";
    if (h < 22) return "evening";
    return "night";
  }

  function pushRecord(user, day, index) {
    const selected = zoneByType();
    let pos, direction = rand() * 360, profile, sourceId;

    if (selected.type === "isolated") {
      pos = sampleIsolated();
      profile = { id:"isolated", type:"isolated", noise:[0.10,0.44], turbulence:[0.06,0.34], mobility:{still:0.54,slow:0.32,passing:0.14}, words:[["遠い",0.30],["浮く",0.26],["澄む",0.22],["薄い",0.14],["ほどける",0.08]], hours:[[8,0.08],[10,0.12],[13,0.16],[15,0.16],[18,0.14],[20,0.14],[22,0.12],[23,0.08]] };
      sourceId = "isolated";
    } else if (selected.type === "corridor") {
      const s = sampleCorridor(selected.item);
      pos = s.pos; direction = s.direction;
      profile = selected.item; sourceId = selected.item.id;
    } else {
      pos = randomInZone(selected.item);
      profile = selected.item; sourceId = selected.item.id;
    }

    if (distanceMeters(pos, origin) > radiusMeters * 1.04) return;
    if (!["park","shrine","isolated"].includes(selected.type) && insideVoid(pos) && rand() < 0.80) return;

    const hour     = sampleHour(profile.hours, day, profile.type);
    const minute   = Math.floor(rand() * 60);
    const mobility = weighted(Object.entries(profile.mobility));
    const commute  = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
    const night    = hour <= 5 || hour >= 23;
    const weekend  = day % 7 >= 5;

    const noiseLevel = clamp(
      profile.noise[0] + rand() * (profile.noise[1] - profile.noise[0])
        + (commute && profile.type !== "park" ? 0.08 : 0)
        + (night ? -0.08 : 0),
      0.05, 0.95
    );
    const turbulence = clamp(
      profile.turbulence[0] + rand() * (profile.turbulence[1] - profile.turbulence[0])
        + (mobility === "passing" ? 0.08 : 0)
        + (weekend && profile.type === "park" ? 0.04 : 0),
      0.02, 0.92
    );
    const peak      = clamp(noiseLevel + turbulence * 0.34 + rand() * 0.14, 0.05, 1);
    const word      = weighted(profile.words);
    const timestamp = new Date(baseDate + day * 86400000 + hour * 3600000 + minute * 60000 + Math.floor(rand() * 60000)).toISOString();
    const duration  = Math.round(clamp(8 + rand() * 10 + (mobility === "still" ? 2 : 0), 8, 18));
    const trustScore = clamp(0.62 + rand() * 0.34 - (night ? 0.05 : 0), 0.55, 1);

    records.push({
      id: `kbj-v4c-u${String(user).padStart(3,"0")}-d${day}-${index}-${records.length}`,
      userId: `user-${String(user).padStart(3,"0")}`,
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
      source: "kokubunji-sim-v4-clean",
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
      const dailyCount = 2 + Math.floor(rand() * 4) + (rand() < 0.20 ? 1 : 0);
      for (let index = 0; index < dailyCount; index++) pushRecord(user, day, index);
    }
  }

  return records.slice(0, 5000);
})();

WORLD_SKIN_META.recordCount = WORLD_SKIN_RECORDS.length;

window.WORLD_SKIN_RECORDS = WORLD_SKIN_RECORDS;
window.WORLD_SKIN_META    = WORLD_SKIN_META;
window.WORLD_SKIN_ZONES   = WORLD_SKIN_ZONES;
window.WORLD_SKIN_DATA = {
  origin:       WORLD_SKIN_META.center,
  radiusMeters: WORLD_SKIN_META.radiusKm * 1000,
  words:        WORLD_SKIN_WORDS,
  clusters:     WORLD_SKIN_ZONES,
  corridors:    WORLD_SKIN_CORRIDORS,
  voids:        WORLD_SKIN_VOIDS,
  records:      WORLD_SKIN_RECORDS,
  meta:         WORLD_SKIN_META
};
