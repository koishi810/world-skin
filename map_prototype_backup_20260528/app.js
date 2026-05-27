(() => {
  // ── World Skin · Map Engine (no UI) ──────────────────────────────────────
  // Pure rendering engine: MapLibre map + canvas dot-texture field.
  // No view switching, no recording flow, no sense UI, no DOM widgets.

  const RADIUS_METERS = window.WORLD_SKIN_DATA?.radiusMeters || 5000;
  const WORLD_ORIGIN  = window.WORLD_SKIN_DATA?.origin || { lat: 35.7000, lng: 139.4808 };
  const WORLD_RECORDS = window.WORLD_SKIN_DATA?.records || [];

  const VISUAL_LIMITS = {
    strength: 0.72, flux: 0.72, contrast: 0.48,
    height: 92, radius: 2.4, alpha: 0.72, boundaryAlpha: 0.32
  };
  const GRID_VISUAL = {
    spacing: 13, baseRadius: 1.15, minRadius: 0.8, maxRadius: 2.4,
    minAlpha: 0.008, voidAlpha: 0.018, maxAlpha: 0.88,
    minGlow: 0, maxGlow: 8, maxJitter: 0.8, maxPulse: 0.12,
    influenceCutoff: 0.006, strengthCutoff: 0.014,
    colors: {
      void:       { r: 35,  g: 40,  b: 46  },
      voidWarm:   { r: 49,  g: 43,  b: 39  },
      voidCool:   { r: 18,  g: 28,  b: 54  },
      cold:       { r: 82,  g: 148, b: 215 },
      cyanGray:   { r: 72,  g: 198, b: 190 },
      neutral:    { r: 204, g: 212, b: 220 },
      bright:     { r: 225, g: 236, b: 248 },
      silver:     { r: 188, g: 224, b: 252 },
      warmBright: { r: 252, g: 220, b: 168 },
      warm:       { r: 238, g: 182, b: 118 },
      amberGray:  { r: 245, g: 162, b: 52  },
      rust:       { r: 218, g: 88,  b: 32  },
      purpleGray: { r: 148, g: 72,  b: 148 },
      redBrown:   { r: 168, g: 44,  b: 22  },
      blueBlack:  { r: 23,  g: 32,  b: 41  },
      mossTeal:   { r: 48,  g: 128, b: 116 },
      stoneBlue:  { r: 52,  g: 86,  b: 158 },
      indigoNight:{ r: 28,  g: 36,  b: 112 },
      oliveAsh:   { r: 148, g: 148, b: 58  },
      dustGray:   { r: 155, g: 142, b: 118 },
      concreteBlue:{ r: 88, g: 104, b: 126 },
      hazeWhite:  { r: 205, g: 210, b: 218 },
      warmEarth:  { r: 162, g: 132, b: 88  },
      flowSlate:  { r: 90,  g: 115, b: 150 }
    }
  };
  const DOT_VISUAL_TUNING = {
    alphaMul: 1.68, activeAlphaMul: 2.10,
    nightAlphaBoost: 1.18, maxAlpha: 0.92
  };
  const DOT_DENSITY_VISUAL = {
    targetScreenSpacingPx: 11.0,
    minScreenSpacingPx: 9, maxScreenSpacingPx: 13,
    baseRadiusPx: 1.10, minRadiusPx: 0.7, maxRadiusPx: 9,
    maxDotsDesktop: 9600, maxDotsMobile: 6800,
    minDotsVisible: 2600, densityMode: "screen-stable"
  };
  const MAP_VISUAL_MODES = {
    dark:     { tileBrightness: 0.62, tileContrast: 1.02, tileSaturation: 0.22, hueRotate: 0, baseOpacity: 0.94, edgeBoost: 1.06 },
    balanced: { tileBrightness: 0.70, tileContrast: 1.06, tileSaturation: 0.30, hueRotate: 0, baseOpacity: 0.94, edgeBoost: 1.24 },
    bright:   { tileBrightness: 1.00, tileContrast: 1.10, tileSaturation: 0.40, hueRotate: 0, baseOpacity: 1,    edgeBoost: 1.42 }
  };
  const ZOOM_LEVELS = {
    region:       { min: 0,    max: 12.4 },
    area:         { min: 12.4, max: 13.6 },
    neighborhood: { min: 13.6, max: 15.0 },
    street:       { min: 15.0, max: 16.0 },
    detail:       { min: 16.0, max: 22   }
  };
  const ZOOM_VISUAL_PRESETS = {
    region: {
      alphaScale: 0.75, heightScale: 0.88, sigmaScale: 0.62, contrastScale: 0.72,
      boundaryScale: 0.50, rasterContrastBase: 0.18, densityBias: 0.88,
      maxInfluenceDist: 260,
      showSmallIslands: false, showLocalRecordDetail: false, showVoidLarge: true, showBoundary: false
    },
    area: {
      alphaScale: 1.00, heightScale: 1.34, sigmaScale: 0.82, contrastScale: 0.95,
      boundaryScale: 0.78, rasterContrastBase: 0.28, densityBias: 1.00,
      maxInfluenceDist: 160,
      showSmallIslands: true, showLocalRecordDetail: false, showVoidLarge: true, showBoundary: true
    },
    neighborhood: {
      alphaScale: 1.08, heightScale: 1.48, sigmaScale: 0.95, contrastScale: 1.05,
      boundaryScale: 0.95, rasterContrastBase: 0.36, densityBias: 1.06,
      maxInfluenceDist: 90,
      showSmallIslands: true, showLocalRecordDetail: true, showVoidLarge: true, showBoundary: true
    },
    street: {
      alphaScale: 1.12, heightScale: 1.38, sigmaScale: 0.88, contrastScale: 1.08,
      boundaryScale: 1.00, rasterContrastBase: 0.38, densityBias: 1.10,
      maxInfluenceDist: 160, heightLineScale: 2.2,
      showSmallIslands: true, showLocalRecordDetail: true, showVoidLarge: false, showBoundary: true
    },
    detail: {
      alphaScale: 1.20, heightScale: 1.50, sigmaScale: 0.85, contrastScale: 1.10,
      boundaryScale: 1.05, rasterContrastBase: 0.40, densityBias: 1.18,
      maxInfluenceDist: 200, heightLineScale: 3.8,
      showSmallIslands: true, showLocalRecordDetail: true, showVoidLarge: false, showBoundary: true
    }
  };
  const ZOOM_ANCHORS = [
    { zoom: 11.0, preset: "region"       },
    { zoom: 13.0, preset: "area"         },
    { zoom: 14.3, preset: "neighborhood" },
    { zoom: 15.5, preset: "street"       },
    { zoom: 16.5, preset: "detail"       }
  ];
  const DEFAULT_VIEW = {
    center: [139.4800, 35.7000],
    zoom: 13.1, pitch: 42, bearing: -16
  };
  const PERF = {
    gridSpacing: 14, cellSize: 128,
    maxInfluenceDistance: 260, maxVisibleRecords: 2500,
    targetFPS: 30, renderDebounceMs: 60, useOffscreenCache: true
  };
  const FIELD_KEY_SCALE = 1000000;
  function fieldKey(a, b) { return a * FIELD_KEY_SCALE + b; }

  const _now = new Date();
  const currentHour = _now.getHours() + _now.getMinutes() / 60;
  function normalizeHour(h) { return ((h % 24) + 24) % 24; }
  function getTimelineHour(offset) { return normalizeHour(currentHour + offset); }

  // ── DOM ───────────────────────────────────────────────────────────────────
  const app      = document.getElementById("app");
  const realMap  = document.getElementById("realMap");
  const canvas   = document.getElementById("skinCanvas");
  const ctx      = canvas.getContext("2d");

  // ── State ─────────────────────────────────────────────────────────────────
  const state = {
    position:      null,
    heading:       null,
    t:             0,
    dpr:           1,
    width:         0,
    height:        0,
    zoom:          1,             // fallback when MapLibre not ready
    centerOffset:  { x: 0, y: 0 },
    map:           null,
    mapReady:      false,
    mapLevel:      "area",
    mapVisualMode: "balanced",
    selectedHour:  getTimelineHour(0),
    aggregation:   { hour: 0.44, day: 0.24, threeDay: 0.16, week: 0.11, month: 0.05 },
    cachedCells:   [],
    renderDirty:   true,
    fieldDirty:    true,
    renderHandle:  null,
    renderTimer:   null,
    fieldTransition: null,
    debugStats:    null
  };

  // ── Math utilities ────────────────────────────────────────────────────────
  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function lerp(a, b, t)          { return a + (b - a) * t; }
  function smoothstep(e0, e1, x)  { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  function easeInOutCubic(t)      { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }

  function stableSignedNoise(a, b, salt = 0) {
    let x = (Math.round(a) * 374761393) ^ (Math.round(b) * 668265263) ^ (salt * 1442695041);
    x = Math.imul(x ^ (x >>> 13), 1274126177);
    return ((((x ^ (x >>> 16)) >>> 0) / 4294967295) * 2) - 1;
  }

  function normalizeVector(x, y) {
    const len = Math.hypot(x, y);
    return len > 0.0001 ? { x: x / len, y: y / len, length: len } : { x: 0, y: -1, length: 0 };
  }

  function directionToMeters(direction, fallbackAngle = 0) {
    const d = Number(direction);
    if (Number.isFinite(d)) {
      if (Math.abs(d) > Math.PI * 2) {
        const rad = d * Math.PI / 180;
        return { dx: Math.sin(rad), dy: -Math.cos(rad) };
      }
      return { dx: Math.cos(d), dy: -Math.sin(d) };
    }
    return { dx: Math.cos(fallbackAngle), dy: -Math.sin(fallbackAngle) };
  }

  // ── Geo math ──────────────────────────────────────────────────────────────
  function metersToLatLng(dx, dy, origin = WORLD_ORIGIN) {
    return {
      lat: origin.lat + dy / 111320,
      lng: origin.lng + dx / (111320 * Math.cos(origin.lat * Math.PI / 180))
    };
  }

  function metersToLatLngInto(dx, dy, origin, out) {
    out.lat = origin.lat + dy / 111320;
    out.lng = origin.lng + dx / (111320 * Math.cos(origin.lat * Math.PI / 180));
    return out;
  }

  function latLngToMeters(pos, origin = WORLD_ORIGIN) {
    return {
      dx: (pos.lng - origin.lng) * 111320 * Math.cos(origin.lat * Math.PI / 180),
      dy: (pos.lat - origin.lat) * 111320
    };
  }

  function haversine(a, b) {
    const R = 6371000;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function distanceMeters(a, b) { return haversine(a, b); }

  function mapScaleAt(origin) {
    if (!state.mapReady) return null;
    const here  = state.map.project([origin.lng, origin.lat]);
    const east  = metersToLatLng(1000, 0, origin);
    const there = state.map.project([east.lng, east.lat]);
    return Math.max(0.001, Math.hypot(there.x - here.x, there.y - here.y) / 1000);
  }

  function project(pos, origin = WORLD_ORIGIN) {
    if (state.mapReady) {
      const point = state.map.project([pos.lng, pos.lat]);
      return { x: point.x, y: point.y, scale: mapScaleAt(origin) };
    }
    const latMeters = (pos.lat - origin.lat) * 111320;
    const lngMeters = (pos.lng - origin.lng) * 111320 * Math.cos(origin.lat * Math.PI / 180);
    const usable = Math.min(state.width, state.height - 140) * 0.42;
    const scale  = usable / RADIUS_METERS * state.zoom;
    return {
      x: state.width / 2 + lngMeters * scale + state.centerOffset.x,
      y: state.height / 2 - 18 - latMeters * scale + state.centerOffset.y,
      scale
    };
  }

  function getMetersPerScreenPixels(pixels = DOT_DENSITY_VISUAL.targetScreenSpacingPx) {
    if (!state.mapReady || !state.map) return pixels * 14;
    const center = state.map.getCenter();
    const p0 = state.map.project([center.lng, center.lat]);
    const ll1 = state.map.unproject([p0.x + pixels, p0.y]);
    const meters = distanceMeters(
      { lng: center.lng, lat: center.lat },
      { lng: ll1.lng,    lat: ll1.lat    }
    );
    return Number.isFinite(meters) && meters > 0 ? meters : pixels * 14;
  }

  function getStableDotSpacingMeters() {
    return clamp(getMetersPerScreenPixels(DOT_DENSITY_VISUAL.targetScreenSpacingPx), 18, 180);
  }

  function screenFlowDirectionForRecord(record, origin) {
    const fallbackAngle = stableSignedNoise(record.mx / 220, record.my / 220, 19) * Math.PI;
    const moving = record.movement === "passing" || record.movement === "slow";
    const v = directionToMeters(moving ? record.direction : null, fallbackAngle);
    const from = metersToLatLng(record.mx, record.my, origin);
    const to   = metersToLatLng(record.mx + v.dx * 28, record.my + v.dy * 28, origin);
    const a = state.mapReady ? state.map.project([from.lng, from.lat]) : project(from, origin);
    const b = state.mapReady ? state.map.project([to.lng,   to.lat  ]) : project(to,   origin);
    return normalizeVector(b.x - a.x, b.y - a.y);
  }

  // ── Record field accessors ─────────────────────────────────────────────────
  function recordNoise(rec) { return clamp(Number(rec.noise ?? rec.noiseLevel ?? 0.18), 0, 1); }
  function recordFlux(rec)  { return clamp(Number(rec.flux  ?? rec.turbulence  ?? 0.08), 0, 1); }
  function recordMove(rec) {
    const m = rec.movement ?? rec.mobility ?? "still";
    return ["still", "slow", "passing"].includes(m) ? m : "still";
  }
  function recordTime(rec) { return rec.createdAt ?? rec.timestamp ?? new Date().toISOString(); }
  function recordSlot(rec) {
    if (rec.slot) return rec.slot;
    const hour = Number.isFinite(rec.hour) ? rec.hour : new Date(recordTime(rec)).getHours();
    if (hour >= 5  && hour < 11) return "morning";
    if (hour >= 11 && hour < 17) return "day";
    if (hour >= 17 && hour < 22) return "evening";
    return "night";
  }
  function getSV(rec) {
    if (rec.senseVector) return rec.senseVector;
    return { spaciousness: 0, gravity: 0, tension: 0, flow: 0 };
  }
  function getSoundV(rec) {
    if (rec.soundVector) return rec.soundVector;
    const loudness   = clamp(Number(rec.noise ?? rec.noiseLevel ?? 0.18), 0, 1);
    const turbulence = clamp(Number(rec.flux  ?? rec.turbulence  ?? 0.08), 0, 1);
    return { loudness, turbulence, sharpness: 0.3, continuity: 0.8, texture: 0.3 };
  }
  function getTexMod(rec) {
    if (rec.textureModifier) return rec.textureModifier;
    return { warmth: 0, roughness: 0, clarity: 0, dryness: 0 };
  }

  // ── Temporal weight ────────────────────────────────────────────────────────
  function temporalWeight(record, visual = null) {
    const date = new Date(recordTime(record));
    const hour = Number.isFinite(record.hour) ? record.hour : date.getUTCHours();
    const day  = Math.floor((date.getTime() - Date.UTC(2026, 4, 4)) / 86400000);
    const selectedHour = state.selectedHour;
    const hourDiff  = Math.min(Math.abs(hour - selectedHour), 24 - Math.abs(hour - selectedHour));
    const hourSigma = 1.55 + (visual?.flowPersistence || 0) * 0.55;
    const hourWeight      = Math.exp(-(hourDiff * hourDiff) / (2 * hourSigma * hourSigma));
    const dayWeight       = 1.0;
    const threeDayWeight  = day >= 4 ? 1 : 0.45;
    const weekWeight      = 1;
    const monthWeight     = 0.55;
    const a = state.aggregation;
    return a.hour * hourWeight + a.day * dayWeight + a.threeDay * threeDayWeight + a.week * weekWeight + a.month * monthWeight;
  }

  // ── Time / daylight ────────────────────────────────────────────────────────
  function getDaylightState(hour) {
    if (hour >= 23 || hour < 4) return "deepNight";
    if (hour >= 4  && hour < 7) return "dawn";
    if (hour >= 7  && hour < 16.5) return "day";
    if (hour >= 16.5 && hour < 18.5) return "dusk";
    return "night";
  }

  function getDaylightAmount(hour) {
    const morning = smoothstep(4.5, 7.0, hour);
    const evening = 1 - smoothstep(16.5, 19.5, hour);
    return clamp(Math.min(morning, evening), 0, 1);
  }

  function getMapVisualByHour(hour) {
    const daylight = getDaylightAmount(hour);
    const base = {
      brightness:      lerp(0.58, 0.66, daylight),
      contrast:        lerp(1.22, 1.16, daylight),
      saturation:      lerp(0.18, 0.26, daylight),
      opacity:         lerp(0.76, 0.78, daylight),
      overlayDarkness: lerp(0.42, 0.34, daylight),
      daylight, state: getDaylightState(hour)
    };
    const dusk = smoothstep(16.5, 19.5, hour);
    if (dusk > 0 && hour < 19.5) {
      base.brightness      *= lerp(1, 0.92, dusk);
      base.overlayDarkness  = lerp(base.overlayDarkness, 0.40, dusk * 0.65);
    }
    return base;
  }

  // ── Zoom visual ────────────────────────────────────────────────────────────
  function getSkinZoomLevel(zoom) {
    if (zoom < ZOOM_LEVELS.area.min)         return "region";
    if (zoom < ZOOM_LEVELS.neighborhood.min) return "area";
    if (zoom < ZOOM_LEVELS.street.min)       return "neighborhood";
    if (zoom < ZOOM_LEVELS.detail.min)       return "street";
    return "detail";
  }

  function getZoomLightAmount(zoom) {
    return smoothstep(0, 1, clamp((zoom - 12.0) / (17.0 - 12.0), 0, 1));
  }

  function getZoomVisualModifier(zoom) {
    const z = getZoomLightAmount(zoom);
    return {
      brightnessMul: lerp(0.92, 1.06, z),
      opacityMul:    lerp(0.94, 1.04, z),
      overlayAdd:    lerp(0.05, -0.03, z)
    };
  }

  function interpolateZoomPreset(a, b, t, zoom) {
    return {
      alphaScale:            lerp(a.alphaScale,            b.alphaScale,            t),
      heightScale:           lerp(a.heightScale,           b.heightScale,           t),
      sigmaScale:            lerp(a.sigmaScale,            b.sigmaScale,            t),
      contrastScale:         lerp(a.contrastScale,         b.contrastScale,         t),
      boundaryScale:         lerp(a.boundaryScale,         b.boundaryScale,         t),
      rasterContrastBase:    lerp(a.rasterContrastBase,    b.rasterContrastBase,    t),
      densityBias:           lerp(a.densityBias || 1,      b.densityBias || 1,      t),
      maxInfluenceDist:      lerp(a.maxInfluenceDist,      b.maxInfluenceDist,      t),
      showSmallIslands:      t >= 0.5 ? b.showSmallIslands      : a.showSmallIslands,
      showLocalRecordDetail: t >= 0.5 ? b.showLocalRecordDetail : a.showLocalRecordDetail,
      showVoidLarge:         t >= 0.5 ? b.showVoidLarge         : a.showVoidLarge,
      showBoundary:          t >= 0.5 ? b.showBoundary          : a.showBoundary,
      level: getSkinZoomLevel(zoom)
    };
  }

  function getContinuousZoomPreset(zoom = state.mapReady ? state.map.getZoom() : DEFAULT_VIEW.zoom) {
    const anchors = ZOOM_ANCHORS;
    if (zoom <= anchors[0].zoom) return { ...ZOOM_VISUAL_PRESETS[anchors[0].preset], level: getSkinZoomLevel(zoom) };
    if (zoom >= anchors[anchors.length - 1].zoom) return { ...ZOOM_VISUAL_PRESETS[anchors[anchors.length - 1].preset], level: getSkinZoomLevel(zoom) };
    let i = 0;
    while (i < anchors.length - 2 && zoom > anchors[i + 1].zoom) i++;
    const a = anchors[i], b = anchors[i + 1];
    return interpolateZoomPreset(ZOOM_VISUAL_PRESETS[a.preset], ZOOM_VISUAL_PRESETS[b.preset], smoothstep(a.zoom, b.zoom, zoom), zoom);
  }

  function getMapEdgeOpacityByZoom(zoom) {
    if (zoom < 12.5) return 0.18;
    if (zoom < 14)   return 0.26;
    if (zoom < 15.5) return 0.34;
    return 0.42;
  }

  // ── Map visual ────────────────────────────────────────────────────────────
  function applyMapVisualMode() {
    if (!realMap) return;
    const visual     = MAP_VISUAL_MODES[state.mapVisualMode] || MAP_VISUAL_MODES.balanced;
    const timeVisual = getMapVisualByHour(state.selectedHour);
    const currentZoom = state.mapReady ? state.map.getZoom() : DEFAULT_VIEW.zoom;
    const zoomMod    = getZoomVisualModifier(currentZoom);

    const finalBrightness = visual.tileBrightness * timeVisual.brightness * zoomMod.brightnessMul;
    const finalContrast   = visual.tileContrast   * timeVisual.contrast;
    const finalSaturation = visual.tileSaturation * timeVisual.saturation;
    const finalOpacity    = timeVisual.opacity     * zoomMod.opacityMul;
    const finalOverlay    = clamp(timeVisual.overlayDarkness + zoomMod.overlayAdd, 0.18, 0.58);

    realMap.style.filter  = `brightness(${finalBrightness.toFixed(3)}) contrast(${finalContrast.toFixed(3)}) saturate(${finalSaturation.toFixed(3)})`;
    realMap.style.opacity = finalOpacity.toFixed(3);
    document.documentElement.style.setProperty("--map-overlay-darkness", finalOverlay.toFixed(3));

    if (!state.mapReady || !state.map.getLayer("aerial-base")) return;
    const preset = getContinuousZoomPreset();
    const edge   = getMapEdgeOpacityByZoom(currentZoom) * visual.edgeBoost;
    state.map.setPaintProperty("aerial-base", "raster-opacity",        clamp(visual.baseOpacity * finalOpacity, 0.48, 0.90));
    state.map.setPaintProperty("aerial-base", "raster-brightness-max", 1);
    state.map.setPaintProperty("aerial-base", "raster-contrast",       preset.rasterContrastBase + edge * 0.10);
  }

  function applyMapLevel() {
    if (!state.mapReady || !state.map.getLayer("aerial-base")) return;
    const level = getSkinZoomLevel(state.map.getZoom());
    if (state.mapLevel === level) return;
    state.mapLevel = level;
    applyMapVisualMode();
  }

  // ── Map init ──────────────────────────────────────────────────────────────
  function initRealMap() {
    if (!window.maplibregl || !realMap) {
      console.warn("[MapBase] MapLibre not loaded");
      return;
    }
    state.map = new maplibregl.Map({
      container: realMap,
      style: {
        version: 8,
        sources: {
          aerial: {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
              "https://b.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
              "https://c.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
              "https://d.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
            ],
            tileSize: 256
          }
        },
        layers: [{
          id: "aerial-base", type: "raster", source: "aerial",
          paint: {
            "raster-opacity": 0.95, "raster-brightness-min": 0,
            "raster-brightness-max": 1, "raster-contrast": 0.18, "raster-saturation": -0.72
          }
        }]
      },
      center:       DEFAULT_VIEW.center,
      zoom:         DEFAULT_VIEW.zoom,
      minZoom:      11, maxZoom: 17,
      bearing:      DEFAULT_VIEW.bearing,
      pitch:        DEFAULT_VIEW.pitch,
      maxPitch:     60,
      attributionControl: false,
      interactive:  true
    });

    state.map.on("load", () => {
      state.mapReady = true;
      const initPos = state.position;
      state.map.jumpTo(initPos
        ? { center: [initPos.lng, initPos.lat], zoom: 14.1, pitch: DEFAULT_VIEW.pitch, bearing: DEFAULT_VIEW.bearing }
        : DEFAULT_VIEW);
      applyMapVisualMode();
      applyMapLevel();
      invalidateField(true);
    });

    const onFrameChange = () => { applyMapLevel(); requestRender(); };
    ["move", "zoom", "rotate", "pitch"].forEach(e => state.map.on(e, onFrameChange));
    state.map.on("zoomend", () => { applyMapVisualMode(); startFieldTransition(); });
    ["moveend", "rotateend", "pitchend"].forEach(e => state.map.on(e, () => invalidateField(false)));
    state.map.on("resize", () => requestRender());
  }

  // ── Location ──────────────────────────────────────────────────────────────
  function initLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        state.position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        state.heading  = Number.isFinite(pos.coords.heading) ? pos.coords.heading : state.heading;
        if (state.mapReady) {
          state.map.jumpTo({ center: [state.position.lng, state.position.lat], zoom: 14.1, pitch: DEFAULT_VIEW.pitch, bearing: DEFAULT_VIEW.bearing });
          invalidateField(true);
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );
    navigator.geolocation.watchPosition(
      pos => {
        state.position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        state.heading  = Number.isFinite(pos.coords.heading) ? pos.coords.heading : state.heading;
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 3000 }
    );
  }

  // ── Canvas resize ─────────────────────────────────────────────────────────
  function resizeCanvas() {
    const rect = app.getBoundingClientRect();
    state.dpr    = Math.min(window.devicePixelRatio || 1, 2);
    state.width  = Math.floor(rect.width  || window.innerWidth  || 360);
    state.height = Math.floor(rect.height || window.innerHeight || 640);
    canvas.width  = Math.floor(state.width  * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width  = state.width  + "px";
    canvas.style.height = state.height + "px";
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    state.renderHandle = null;
    if (state.mapReady) state.map.resize();
    rebuildGrids();
    requestRender();
  }

  // ── Render scheduling ─────────────────────────────────────────────────────
  function requestRender() {
    state.renderDirty = true;
    if (state.renderHandle) return;
    state.renderHandle = requestAnimationFrame(render);
  }

  function invalidateField(immediate = false) {
    state.fieldDirty    = true;
    state.fieldTransition = null;
    clearTimeout(state.renderTimer);
    if (immediate) { requestRender(); return; }
    state.renderTimer = setTimeout(requestRender, PERF.renderDebounceMs);
  }

  function rebuildGrids() {
    if (!state.width || !state.height) return;
    invalidateField(true);
  }

  // ── Grid field config ─────────────────────────────────────────────────────
  function gridRenderConfig() {
    const zoom   = state.mapReady ? state.map.getZoom() : DEFAULT_VIEW.zoom;
    const preset = getContinuousZoomPreset(zoom);
    const sigmaMeters       = 88 * preset.sigmaScale;
    const dotSpacingMeters  = getStableDotSpacingMeters();
    const isMobile = state.width < 768;
    const maxDots  = isMobile ? DOT_DENSITY_VISUAL.maxDotsMobile : DOT_DENSITY_VISUAL.maxDotsDesktop;
    return {
      ...preset,
      level: getSkinZoomLevel(zoom),
      densityMode: DOT_DENSITY_VISUAL.densityMode,
      dotSpacingMeters, sigmaMeters,
      cellSize: clamp(sigmaMeters * 0.9, 96, 180),
      gain: 0.58,
      influenceCutoff: GRID_VISUAL.influenceCutoff,
      maxDots, minDots: DOT_DENSITY_VISUAL.minDotsVisible,
      maxInfluenceDistance: preset.maxInfluenceDist
    };
  }

  function isValidLngLat(ll) { return ll && isFinite(ll.lng) && isFinite(ll.lat); }

  function viewBoundsMeters(origin) {
    if (!state.mapReady) {
      const half = RADIUS_METERS / Math.max(1, state.zoom);
      return { minX: -half, maxX: half, minY: -half, maxY: half };
    }
    const pad = 180;
    const corners = [
      [-pad, -pad], [state.width + pad, -pad],
      [state.width + pad, state.height + pad], [-pad, state.height + pad]
    ].map(([x, y]) => state.map.unproject([x, y]));
    if (!corners.every(isValidLngLat)) {
      const c  = state.map.getCenter();
      const cm = latLngToMeters({ lat: c.lat, lng: c.lng }, origin);
      const fallback = 2000;
      return { minX: cm.dx - fallback, maxX: cm.dx + fallback, minY: cm.dy - fallback, maxY: cm.dy + fallback };
    }
    const points = corners.map(ll => latLngToMeters({ lat: ll.lat, lng: ll.lng }, origin));
    return {
      minX: Math.min(...points.map(p => p.dx)), maxX: Math.max(...points.map(p => p.dx)),
      minY: Math.min(...points.map(p => p.dy)), maxY: Math.max(...points.map(p => p.dy))
    };
  }

  // ── Visual channel functions ───────────────────────────────────────────────
  function mixColorInto(color, target, amount) {
    const t = clamp(amount, 0, 1);
    color.r = Math.round(color.r + (target.r - color.r) * t);
    color.g = Math.round(color.g + (target.g - color.g) * t);
    color.b = Math.round(color.b + (target.b - color.b) * t);
    return color;
  }

  function recordBaseVisual(record) {
    const noise    = recordNoise(record);
    const flux     = recordFlux(record);
    const peak     = clamp(Number(record.peak ?? 0.18), 0, 1);
    const movement = recordMove(record);
    const slot     = recordSlot(record);
    const sv       = getSV(record);
    const snd      = getSoundV(record);
    const legacyTex = getTexMod(record);
    const legacyWarmth = clamp(((legacyTex.warmth ?? 0) - (legacyTex.dryness ?? 0) * 0.35) * 0.035, -0.035, 0.035);
    const flowNorm      = clamp(((sv.flow ?? 0) + 1) / 2, 0, 1);
    const soundLoudness    = clamp(snd.loudness   ?? noise, 0, 1);
    const soundTurbulence  = clamp(snd.turbulence ?? flux,  0, 1);
    const soundSharpness   = clamp(snd.sharpness  ?? 0.3,   0, 1);
    const soundContinuity  = clamp(snd.continuity ?? 0.8,   0, 1);
    const soundTexture     = clamp(snd.texture    ?? 0.3,   0, 1);
    const loudnessBias    = clamp((soundLoudness   - 0.45) * 0.16, -0.055, 0.095);
    const turbulenceBias  = clamp((soundTurbulence - 0.20) * 0.22, -0.09,  0.13);
    const flowBase = movement === "passing"
      ? 0.72 + flowNorm * 0.26
      : movement === "slow"
        ? 0.48 + flowNorm * 0.24
        : 0.15 + flowNorm * 0.10;
    const flowStrength  = clamp((flowBase + clamp((snd.turbulence - 0.20) * 0.22, 0, 0.12)) * clamp(Number(record.trustScore ?? 1), 0.45, 1), 0.05, 1);
    const activeSlot    = slot === "day" ? 0.08 : slot === "evening" ? 0.02 : slot === "night" ? -0.12 : -0.03;
    const movementFlux  = movement === "passing" ? 0.08 : movement === "slow" ? 0.03 : -0.02;
    const movementSpread = movement === "passing" ? 0.08 : movement === "slow" ? 0.03 : -0.02;
    return {
      strength:    clamp(0.04 + noise * 0.38 + peak * 0.16 + loudnessBias + (movement === "still" ? 0.03 : 0), 0.04, VISUAL_LIMITS.strength),
      flux:        clamp(flux + movementFlux + (sv.flow ?? 0) * 0.10 + turbulenceBias, 0, VISUAL_LIMITS.flux),
      contrast:    clamp(flux * 0.2 + peak * 0.14 + soundTurbulence * 0.075 + (noise > 0.65 ? 0.04 : 0), 0, VISUAL_LIMITS.contrast),
      warmth:      clamp(activeSlot + (noise - 0.5) * 0.08 + legacyWarmth, -0.35, 0.35),
      spread:      clamp(0.9 + noise * 0.16 + movementSpread + sv.spaciousness * 0.18 + (soundContinuity - 0.8) * 0.05, 0.65, 1.35),
      boundary:    clamp(flux * 0.16 + (movement === "passing" ? 0.04 : 0) + Math.max(0, sv.flow ?? 0) * 0.035 + soundSharpness * 0.026, 0, VISUAL_LIMITS.boundaryAlpha),
      breathSpeed: clamp(1 - flux * 0.08 + (slot === "night" ? -0.06 : 0), 0.65, 1.2),
      radiusBias:  clamp((noise - 0.45) * 0.18 + peak * 0.08, -0.16, 0.28),
      heightBias:  clamp((noise - 0.45) * 16 + peak * 8, -12, 18),
      senseSpacious: sv.spaciousness,
      senseGravity:  sv.gravity,
      senseTension:  sv.tension ?? 0,
      senseFlow:     sv.flow ?? 0,
      flowStrength,
      flowPersistence: clamp(flowStrength * (0.35 + Math.max(0, sv.flow ?? 0) * 0.45), 0, 1),
      soundLoudness, soundTurbulence, soundSharpness, soundContinuity, soundTexture,
      edgeHardness: clamp((soundSharpness - 0.30) * 0.38, -0.10, 0.22),
    };
  }

  function getDotAlpha(params) {
    const s = clamp(params.strength,  0, 1);
    const c = clamp(params.contrast,  0, 1);
    const b = clamp(params.boundary,  0, 1);
    const f = clamp(params.flux,      0, 1);
    const e = clamp(params.edgeHardness ?? 0, -0.16, 0.24);
    const sExp = clamp(0.95 + e * 0.9, 0.78, 1.20);
    const cExp = clamp(0.92 + e * 0.6, 0.78, 1.10);
    if (s < GRID_VISUAL.strengthCutoff) {
      return clamp(0.016 + c * 0.038 - Math.max(0, e) * 0.012, GRID_VISUAL.minAlpha, 0.058);
    }
    return clamp(
      0.030 + Math.pow(s, sExp) * 0.70 + Math.pow(c, cExp) * 0.20 + Math.pow(b, 1.05) * 0.16 + Math.pow(f, 1.2) * 0.10,
      GRID_VISUAL.minAlpha, GRID_VISUAL.maxAlpha
    );
  }

  function getDotRadius(params) {
    const s  = clamp(params.strength,  0, 1);
    const f  = clamp(params.flux,      0, 1);
    const b  = clamp(params.boundary,  0, 1);
    const _sp = params.senseSpacious ?? 0;
    const spBias = _sp >= 0 ? clamp(-_sp * 0.55, -0.55, 0) : clamp(-_sp * 2.8, 0, 2.8);
    const tBias  = clamp(-(params.senseTension ?? 0) * 0.8, -0.3, 0.8);
    return clamp(
      DOT_DENSITY_VISUAL.baseRadiusPx + Math.pow(s, 1.0) * 1.85 + Math.pow(f, 1.4) * 0.22 + b * 0.12 + (params.radiusBias || 0) + spBias + tBias,
      DOT_DENSITY_VISUAL.minRadiusPx, DOT_DENSITY_VISUAL.maxRadiusPx
    );
  }

  function getDotColor(params, out = { r: 0, g: 0, b: 0 }) {
    const s    = clamp(params.strength,        0, 1);
    const sp   = clamp(params.senseSpacious ?? 0, -1, 1);
    const g    = clamp(params.senseGravity  ?? 0, -1, 1);
    const t    = clamp(params.senseTension  ?? 0, -1, 1);
    const fl   = clamp(params.senseFlow     ?? 0, -1, 1);
    const loud      = clamp(params.soundLoudness    ?? 0.18, 0, 1);
    const turbulence= clamp(params.soundTurbulence  ?? 0.08, 0, 1);
    const sharp     = clamp(params.soundSharpness   ?? 0.30, 0, 1);
    const continuity= clamp(params.soundContinuity  ?? 0.80, 0, 1);
    const texture   = clamp(params.soundTexture     ?? 0.30, 0, 1);
    const micro         = clamp(params.colorMicro ?? 0, -1, 1);
    const grain         = clamp(params.soundGrain ?? 0, -1, 1);
    const localContrast = clamp(params.localContrast ?? 0, 0, 1);
    const timeWarmth    = clamp(params.warmth ?? 0, -0.35, 0.35);
    if (s < GRID_VISUAL.strengthCutoff) {
      const voidLift = clamp(s * 1.8 + loud * 0.04, 0, 0.08);
      out.r = GRID_VISUAL.colors.void.r;
      out.g = GRID_VISUAL.colors.void.g;
      out.b = GRID_VISUAL.colors.void.b;
      return mixColorInto(out, GRID_VISUAL.colors.voidCool, clamp(sp * 0.05, 0, 0.08) + voidLift);
    }
    const activation = clamp(0.24 + s * 0.76 + loud * 0.20 + localContrast * 0.12, 0, 0.98);
    const color = out;
    color.r = GRID_VISUAL.colors.void.r;
    color.g = GRID_VISUAL.colors.void.g;
    color.b = GRID_VISUAL.colors.void.b;
    mixColorInto(color, GRID_VISUAL.colors.neutral, activation);

    const heatBias = clamp(
      (Math.max(0, -sp) + Math.max(0, g) * 1.2) * 0.45
      - (Math.max(0, sp) + Math.max(0, -g)) * 0.45
      + timeWarmth * 0.65
    , -1, 1);
    const coldScale = clamp((-heatBias + 0.18) / 0.68, 0, 1);
    const warmScale = clamp(( heatBias + 0.18) / 0.68, 0, 1);

    const silverRaw   = (-g) * 0.310 + sharp * 0.120 + Math.max(0, sp) * 0.090 + loud * 0.080;
    const coolRaw     = Math.max(0, sp) * 0.240 + Math.max(0, -g) * 0.280 + sharp * 0.100 + Math.max(0, -timeWarmth) * 0.110;
    const cyanRaw     = Math.max(0, sp) * 0.180 + turbulence * 0.072 + Math.max(0, -timeWarmth) * 0.185 + texture * 0.068;
    const warmRaw     = Math.max(0, -sp) * 0.190 + Math.max(0, g) * 0.240 + Math.max(0, timeWarmth) * 0.310;
    const amberRaw    = Math.max(0, timeWarmth) * 0.320 + loud * 0.110 + localContrast * 0.120;
    const rustRaw     = Math.max(0, g) * 0.280 + turbulence * 0.150 + localContrast * 0.110;
    const purpleRaw   = Math.max(0, g) * Math.max(0, -sp) * 0.160 + (1 - continuity) * 0.110;
    const redBrownRaw = Math.max(0, g) * turbulence * 0.220 + Math.max(0, timeWarmth) * Math.max(0, g) * 0.180;

    mixColorInto(color, GRID_VISUAL.colors.cold,       clamp(coolRaw   * coldScale, 0, 0.62));
    mixColorInto(color, GRID_VISUAL.colors.cyanGray,   clamp(cyanRaw   * coldScale, 0, 0.52));
    mixColorInto(color, GRID_VISUAL.colors.silver,     clamp(silverRaw * coldScale, 0, 0.60));
    mixColorInto(color, GRID_VISUAL.colors.warm,       clamp(warmRaw   * warmScale, 0, 0.60));
    mixColorInto(color, GRID_VISUAL.colors.amberGray,  clamp(amberRaw  * warmScale, 0, 0.52));
    mixColorInto(color, GRID_VISUAL.colors.rust,       clamp(rustRaw   * warmScale, 0, 0.50));
    mixColorInto(color, GRID_VISUAL.colors.purpleGray, clamp(purpleRaw * warmScale, 0, 0.30));
    mixColorInto(color, GRID_VISUAL.colors.redBrown,   clamp(redBrownRaw * warmScale, 0, 0.36));
    mixColorInto(color, GRID_VISUAL.colors.blueBlack,  clamp(Math.max(0, g) * 0.035 + (1 - s) * 0.045 - loud * 0.060, 0, 0.10));

    const cw = v => Math.pow(clamp(v, 0, 1), 0.4);
    mixColorInto(color, GRID_VISUAL.colors.stoneBlue,    clamp(cw(Math.max(0, -sp) * Math.max(0,  g))  * 0.70, 0, 0.70));
    mixColorInto(color, GRID_VISUAL.colors.mossTeal,     clamp(cw(Math.max(0,  sp) * Math.max(0, -g))  * 0.76, 0, 0.76));
    mixColorInto(color, GRID_VISUAL.colors.concreteBlue, clamp(cw(Math.max(0,  sp) * Math.max(0,  g))  * 0.54, 0, 0.54));
    mixColorInto(color, GRID_VISUAL.colors.indigoNight,  clamp(cw(Math.max(0,  t)  * Math.max(0, -sp)) * 0.58, 0, 0.58));
    mixColorInto(color, GRID_VISUAL.colors.hazeWhite,    clamp(cw(Math.max(0,  t)  * Math.max(0,  sp)) * 0.48, 0, 0.48));
    mixColorInto(color, GRID_VISUAL.colors.dustGray,     clamp(cw(Math.max(0, -t)  * Math.max(0,  sp)) * 0.42, 0, 0.42));
    mixColorInto(color, GRID_VISUAL.colors.oliveAsh,     clamp(cw(Math.max(0, -t)  * Math.max(0,  g))  * 0.50, 0, 0.50));
    mixColorInto(color, GRID_VISUAL.colors.warmEarth,    clamp(cw(Math.max(0, -t)  * Math.max(0, -sp)) * 0.52, 0, 0.52));
    mixColorInto(color, GRID_VISUAL.colors.flowSlate,    clamp(cw(Math.max(0,  fl) * Math.max(0, -sp)) * 0.52, 0, 0.52));
    mixColorInto(color, GRID_VISUAL.colors.stoneBlue,    clamp(cw(Math.max(0, -fl) * Math.max(0, -sp)) * 0.48, 0, 0.48));
    mixColorInto(color, GRID_VISUAL.colors.amberGray,    clamp(cw(clamp((loud - 0.45) / 0.55, 0, 1) * Math.max(0, sp)) * 0.56, 0, 0.56));
    mixColorInto(color, GRID_VISUAL.colors.indigoNight,  clamp(cw(clamp((0.45 - loud) / 0.45, 0, 1) * Math.max(0, g))  * 0.50, 0, 0.50));

    const varianceAmount   = clamp(0.082 - t * 0.092 + turbulence * 0.045 + texture * 0.034, 0.004, 0.285);
    const soundFragment    = clamp(1.08 - continuity * 0.22, 0.86, 1.08);
    const chromaShift      = clamp((micro * varianceAmount + grain * texture * 0.052) * soundFragment, -0.295, 0.320);
    const warmMicroTarget  = chromaShift > 0 && g > 0.45 ? GRID_VISUAL.colors.rust : GRID_VISUAL.colors.amberGray;
    const coolMicroTarget  = sharp > 0.55 ? GRID_VISUAL.colors.silver : GRID_VISUAL.colors.cyanGray;
    mixColorInto(color, chromaShift < 0 ? coolMicroTarget : warmMicroTarget, Math.abs(chromaShift));
    const brightnessMicro  = clamp(micro * varianceAmount * 1.18 + grain * turbulence * 0.030 + loud * 0.030, -0.170, 0.230);
    mixColorInto(color, brightnessMicro < 0 ? GRID_VISUAL.colors.void : GRID_VISUAL.colors.bright, Math.abs(brightnessMicro));
    return color;
  }

  function getDotHeight(params) {
    const g  = clamp(params.senseGravity  ?? 0, -1, 1);
    const sp = clamp(params.senseSpacious ?? 0, -1, 1);
    const base = 60 + Math.pow(clamp(params.strength, 0, 1), 1.25) * 5;
    const gFactor  = clamp(1 - g  * 1.20, 0.15, 2.73);
    const spFactor = clamp(1 + sp * 0.50, 0.45, 1.50);
    return clamp(base * gFactor * spFactor, 4, 160);
  }

  // ── Field build ────────────────────────────────────────────────────────────
  function buildGeoGridField(records) {
    const config    = gridRenderConfig();
    const origin    = WORLD_ORIGIN;
    const bounds    = viewBoundsMeters(origin);
    const sigmaBase = config.sigmaMeters;
    const maxDistance = config.maxInfluenceDistance;
    const cellSize  = config.cellSize;
    const estimatedDots = ((bounds.maxX - bounds.minX) / config.dotSpacingMeters) * ((bounds.maxY - bounds.minY) / config.dotSpacingMeters);
    let spacing = config.dotSpacingMeters;
    if (estimatedDots > config.maxDots) {
      spacing = config.dotSpacingMeters * Math.min(Math.pow(estimatedDots / config.maxDots, 0.35), 1.28);
    } else if (estimatedDots > 0 && estimatedDots < config.minDots) {
      spacing = config.dotSpacingMeters * Math.sqrt(estimatedDots / config.minDots);
    }
    spacing = clamp(spacing, 16, 240);
    config.actualDotSpacingMeters = spacing;

    const visibleRecords = [];
    const recordLimit = Math.min(records.length, PERF.maxVisibleRecords);
    for (let i = 0; i < recordLimit; i++) {
      const rec = records[i];
      const m   = latLngToMeters(rec, origin);
      const visual = recordBaseVisual(rec);
      const tw  = temporalWeight(rec, visual);
      if (
        tw <= 0.025 ||
        m.dx < bounds.minX - maxDistance || m.dx > bounds.maxX + maxDistance ||
        m.dy < bounds.minY - maxDistance || m.dy > bounds.maxY + maxDistance
      ) continue;
      const normalized = {
        noise: recordNoise(rec), flux: recordFlux(rec),
        movement: recordMove(rec), direction: rec.direction,
        mx: m.dx, my: m.dy, tw, visual
      };
      normalized.flowDir = screenFlowDirectionForRecord(normalized, origin);
      visibleRecords.push(normalized);
    }

    const bins = new Map();
    for (const rec of visibleRecords) {
      const bx  = Math.floor(rec.mx / cellSize);
      const by  = Math.floor(rec.my / cellSize);
      const key = fieldKey(bx, by);
      if (!bins.has(key)) bins.set(key, []);
      bins.get(key).push(rec);
    }

    const cells = [];
    const startX = Math.floor(bounds.minX / spacing) * spacing;
    const endX   = Math.ceil(bounds.maxX / spacing)  * spacing;
    const startY = Math.floor(bounds.minY / spacing) * spacing;
    const endY   = Math.ceil(bounds.maxY / spacing)  * spacing;
    let row = 0;
    for (let my = startY; my <= endY; my += spacing, row++) {
      let col = 0;
      for (let mx = startX; mx <= endX; mx += spacing, col++) {
        const ll = metersToLatLng(mx, my, origin);
        const p  = state.mapReady ? state.map.project([ll.lng, ll.lat]) : project(ll, origin);
        if (p.x < -120 || p.x > state.width + 120 || p.y < -140 || p.y > state.height + 140) continue;

        let sum = 0, strength = 0, flux = 0, contrast = 0, warmth = 0, boundary = 0, breathSpeed = 0;
        let radiusBias = 0, heightBias = 0;
        let senseSpacious = 0, senseGravity = 0, senseTension = 0, senseFlow = 0;
        let soundLoudness = 0, soundTurbulence = 0, soundSharpness = 0, soundContinuity = 0, soundTexture = 0;
        let edgeHardness = 0, flowX = 0, flowY = 0, flowWeight = 0;

        const bx = Math.floor(mx / cellSize);
        const by = Math.floor(my / cellSize);
        for (let oy = -2; oy <= 2; oy++) {
          for (let ox = -2; ox <= 2; ox++) {
            const nearby = bins.get(fieldKey(bx + ox, by + oy));
            if (!nearby) continue;
            for (const rec of nearby) {
              const dx    = mx - rec.mx, dy = my - rec.my;
              const sigma = sigmaBase * rec.visual.spread;
              const d2    = dx * dx + dy * dy;
              if (d2 > maxDistance * maxDistance || d2 > sigma * sigma * 9) continue;
              const influence = Math.exp(-d2 / (2 * sigma * sigma));
              if (influence < config.influenceCutoff) continue;
              const w = influence * (0.55 + rec.noise * 0.45) * rec.tw;
              sum           += w;
              strength      += w * rec.visual.strength;
              flux          += w * rec.visual.flux;
              contrast      += w * rec.visual.contrast;
              warmth        += w * rec.visual.warmth;
              boundary      += w * rec.visual.boundary;
              breathSpeed   += w * rec.visual.breathSpeed;
              radiusBias    += w * rec.visual.radiusBias;
              heightBias    += w * rec.visual.heightBias;
              senseSpacious += w * rec.visual.senseSpacious;
              senseGravity  += w * rec.visual.senseGravity;
              senseTension  += w * rec.visual.senseTension;
              senseFlow     += w * rec.visual.senseFlow;
              soundLoudness    += w * rec.visual.soundLoudness;
              soundTurbulence  += w * rec.visual.soundTurbulence;
              soundSharpness   += w * rec.visual.soundSharpness;
              soundContinuity  += w * rec.visual.soundContinuity;
              soundTexture     += w * rec.visual.soundTexture;
              edgeHardness     += w * rec.visual.edgeHardness;
              const fw = w * rec.visual.flowStrength;
              flowX += rec.flowDir.x * fw;
              flowY += rec.flowDir.y * fw;
              flowWeight += w;
            }
          }
        }

        const ns  = sum ? clamp(1 - Math.exp(-strength * config.gain), 0, VISUAL_LIMITS.strength) : 0;
        const nc  = sum ? clamp((contrast / sum) * config.contrastScale, 0, VISUAL_LIMITS.contrast) : 0;
        const nb  = sum && config.showBoundary ? clamp((boundary / sum) * config.boundaryScale, 0, VISUAL_LIMITS.boundaryAlpha) : 0;
        const nhb = sum ? clamp(heightBias / sum, -24, 32) : 0;
        const nsg = sum ? clamp(senseGravity  / sum, -1, 1) : 0;
        const nst = sum ? clamp(senseTension  / sum, -1, 1) : 0;
        const flowDir    = normalizeVector(flowX, flowY);
        const flowAmount = flowWeight > 0 ? clamp(flowDir.length / flowWeight, 0, 1) : 0;

        cells.push({
          x: p.x, y: p.y, mx, my, row, col,
          base: 0.010, spacing,
          screenRecords: visibleRecords.length,
          strength: ns,
          flux:        sum ? clamp(flux      / sum, 0, VISUAL_LIMITS.flux)    : 0,
          baseContrast: nc,
          warmth:      sum ? clamp(warmth    / sum, -0.35, 0.35)              : -0.05,
          boundary: nb,
          breathSpeed: sum ? clamp(breathSpeed / sum, 0.65, 1.2)             : 1,
          radiusBias:  sum ? clamp(radiusBias / sum, -0.24, 0.44)             : 0,
          heightBias: nhb,
          senseSpacious: sum ? clamp(senseSpacious / sum * 1.7, -1, 1) : 0,
          senseGravity:  sum ? clamp(nsg  * 1.7, -1, 1) : 0,
          senseTension:  sum ? clamp(nst  * 1.7, -1, 1) : 0,
          senseFlow:     sum ? clamp(senseFlow / sum * 1.7, -1, 1) : 0,
          soundLoudness:   sum ? clamp(soundLoudness   / sum * 1.5, 0, 1) : 0.18,
          soundTurbulence: sum ? clamp(soundTurbulence / sum * 1.5, 0, 1) : 0.08,
          soundSharpness:  sum ? clamp(soundSharpness  / sum * 1.5, 0, 1) : 0.30,
          soundContinuity: sum ? clamp(soundContinuity / sum * 1.4, 0, 1) : 0.80,
          soundTexture:    sum ? clamp(soundTexture    / sum * 1.5, 0, 1) : 0.30,
          edgeHardness:    sum ? clamp(edgeHardness    / sum, -0.16, 0.24) : 0,
          flowX: flowDir.x, flowY: flowDir.y,
          flowRawX: flowDir.x, flowRawY: flowDir.y,
          flowRawAmount: flowAmount, flowAmount,
          height: getDotHeight({
            strength: ns, contrast: nc, boundary: nb,
            heightBias: nhb, senseGravity: nsg
          }) * config.heightScale,
          contrast: 0
        });
      }
    }

    const byKey = new Map();
    for (const cell of cells) byKey.set(fieldKey(cell.row, cell.col), cell);
    cells.forEach(cell => {
      const n0 = byKey.get(fieldKey(cell.row, cell.col - 1));
      const n1 = byKey.get(fieldKey(cell.row, cell.col + 1));
      const n2 = byKey.get(fieldKey(cell.row - 1, cell.col));
      const n3 = byKey.get(fieldKey(cell.row + 1, cell.col));
      let nc = 0, sT = 0, fT = 0, cT = 0;
      if (n0) { nc++; sT += n0.strength; fT += n0.flux; cT += n0.baseContrast; }
      if (n1) { nc++; sT += n1.strength; fT += n1.flux; cT += n1.baseContrast; }
      if (n2) { nc++; sT += n2.strength; fT += n2.flux; cT += n2.baseContrast; }
      if (n3) { nc++; sT += n3.strength; fT += n3.flux; cT += n3.baseContrast; }
      if (!nc) return;
      const avg = sT / nc, fluxAvg = fT / nc, contrastAvg = cT / nc;
      cell.contrast = clamp(
        (cell.baseContrast * 0.72 + Math.abs(cell.strength - avg) * 1.85 + Math.abs(cell.flux - fluxAvg) * 0.9 + Math.abs(cell.baseContrast - contrastAvg) * 1.1 + cell.boundary * 0.72) * config.contrastScale,
        0, VISUAL_LIMITS.contrast
      );
      cell.localContrast = config.showBoundary
        ? clamp((Math.abs(cell.strength - avg) * 1.9 + Math.abs(cell.flux - fluxAvg) * 0.72) * config.boundaryScale, 0, VISUAL_LIMITS.contrast)
        : 0;
      let sx = (cell.flowRawX || 0) * (cell.flowRawAmount || 0) * 1.6;
      let sy = (cell.flowRawY || 0) * (cell.flowRawAmount || 0) * 1.6;
      let sw = 1.6;
      if (n0) { sx += (n0.flowRawX || 0) * (n0.flowRawAmount || 0) * 0.55; sy += (n0.flowRawY || 0) * (n0.flowRawAmount || 0) * 0.55; sw += 0.55; }
      if (n1) { sx += (n1.flowRawX || 0) * (n1.flowRawAmount || 0) * 0.55; sy += (n1.flowRawY || 0) * (n1.flowRawAmount || 0) * 0.55; sw += 0.55; }
      if (n2) { sx += (n2.flowRawX || 0) * (n2.flowRawAmount || 0) * 0.55; sy += (n2.flowRawY || 0) * (n2.flowRawAmount || 0) * 0.55; sw += 0.55; }
      if (n3) { sx += (n3.flowRawX || 0) * (n3.flowRawAmount || 0) * 0.55; sy += (n3.flowRawY || 0) * (n3.flowRawAmount || 0) * 0.55; sw += 0.55; }
      const sf = normalizeVector(sx, sy);
      cell.flowX = sf.x; cell.flowY = sf.y;
      cell.flowAmount = clamp(sf.length / sw, 0, 1);
    });
    return cells;
  }

  // ── Draw field ────────────────────────────────────────────────────────────
  function drawGridTexture(cells = state.cachedCells) {
    const config     = gridRenderConfig();
    const hourWarmth = Math.cos((state.selectedHour - 14) / 24 * Math.PI * 2);
    const daylight   = getDaylightAmount(state.selectedHour);
    const nightBoost = 1 - daylight;
    const origin     = WORLD_ORIGIN;
    const params     = {};
    const color      = { r: 0, g: 0, b: 0 };
    const projLl     = { lat: 0, lng: 0 };
    const projArr    = [0, 0];
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    for (const cell of cells) {
      let surfaceX = cell.x, surfaceY = cell.y;
      if (state.mapReady && Number.isFinite(cell.mx) && Number.isFinite(cell.my)) {
        const ll = metersToLatLngInto(cell.mx, cell.my, origin, projLl);
        projArr[0] = ll.lng; projArr[1] = ll.lat;
        const pt = state.map.project(projArr);
        surfaceX = pt.x; surfaceY = pt.y;
      }
      if (surfaceX < -160 || surfaceX > state.width + 160 || surfaceY < -180 || surfaceY > state.height + 180) continue;

      params.strength        = cell.strength;
      params.flux            = cell.flux;
      params.contrast        = cell.contrast;
      params.warmth          = clamp(cell.warmth + hourWarmth * 0.12 + (cell.localContrast || 0) * 0.04, -0.35, 0.35);
      params.boundary        = cell.boundary;
      params.breathSpeed     = cell.breathSpeed;
      params.radiusBias      = cell.radiusBias;
      params.heightBias      = cell.heightBias;
      params.senseSpacious   = cell.senseSpacious   ?? 0;
      params.senseGravity    = cell.senseGravity     ?? 0;
      params.senseTension    = cell.senseTension     ?? 0;
      params.senseFlow       = cell.senseFlow        ?? 0;
      params.soundLoudness   = cell.soundLoudness    ?? 0.18;
      params.soundTurbulence = cell.soundTurbulence  ?? 0.08;
      params.soundSharpness  = cell.soundSharpness   ?? 0.30;
      params.soundContinuity = cell.soundContinuity  ?? 0.80;
      params.soundTexture    = cell.soundTexture     ?? 0.30;
      params.localContrast   = cell.localContrast    || 0;
      params.edgeHardness    = cell.edgeHardness     ?? 0;

      const baseSkinAlpha = 0.012;
      const rawAlpha      = cell.strength < GRID_VISUAL.strengthCutoff
        ? baseSkinAlpha + getDotAlpha(params) * 0.34
        : baseSkinAlpha + getDotAlpha(params) * 1.55 + (cell.localContrast || 0) * 0.21;
      const depth    = clamp(1.02 - (surfaceY / Math.max(1, state.height)) * 0.16, 0.86, 1.02);
      const aMul     = cell.strength >= GRID_VISUAL.strengthCutoff ? DOT_VISUAL_TUNING.activeAlphaMul : DOT_VISUAL_TUNING.alphaMul;
      const nightMul = lerp(1, DOT_VISUAL_TUNING.nightAlphaBoost, nightBoost);
      const spAlphaFactor = clamp(1 - (params.senseSpacious ?? 0) * 0.38, 0.50, 1.42);
      const tension       = clamp(params.senseTension ?? 0, -1, 1);
      const micro         = stableSignedNoise(cell.mx / Math.max(1, cell.spacing), cell.my / Math.max(1, cell.spacing), 7);
      const activeMicro   = cell.strength >= GRID_VISUAL.strengthCutoff ? 1 : 0.35;
      const gravity       = clamp(params.senseGravity ?? 0, -1, 1);
      const microAlphaAmp  = clamp(0.175 - tension * 0.125 - gravity * 0.045, 0.05, 0.44) * activeMicro;
      const microHeightAmp = clamp(0.195 - tension * 0.145 - gravity * 0.065, 0.05, 0.34) * activeMicro;
      const soundGrain     = stableSignedNoise(cell.mx / Math.max(1, cell.spacing), cell.my / Math.max(1, cell.spacing), 23);
      const soundGrainAmp  = clamp((cell.soundTexture ?? 0.3) * 0.13 + (cell.soundTurbulence ?? 0.08) * 0.07, 0, 0.17) * activeMicro;
      const soundCFactor   = clamp(0.92 + (cell.soundContinuity ?? 0.8) * 0.11, 0.92, 1.055);
      params.colorMicro = micro;
      params.soundGrain = soundGrain;

      const microAlphaFactor = clamp(1 + micro * microAlphaAmp + soundGrain * soundGrainAmp, 0.64, 1.38);
      const alpha  = clamp(rawAlpha * microAlphaFactor * spAlphaFactor * soundCFactor * aMul * nightMul * depth * config.alphaScale, GRID_VISUAL.minAlpha, DOT_VISUAL_TUNING.maxAlpha);
      const radius = clamp(getDotRadius(params), DOT_DENSITY_VISUAL.minRadiusPx, DOT_DENSITY_VISUAL.maxRadiusPx);
      getDotColor(params, color);

      const heightScale      = state.mapReady ? 0.36 * Math.sin(state.map.getPitch() * Math.PI / 180) : 0.2;
      const microHeightFactor = clamp(1 + micro * microHeightAmp + soundGrain * soundGrainAmp * 0.56, 0.62, 1.38);
      const heightOffset     = cell.height * microHeightFactor * heightScale * depth * (config.heightLineScale ?? 1.0);
      const hasHeightLine    = cell.height > 22 && cell.strength > 0.16;
      const flowVisible      = hasHeightLine ? smoothstep(0.12, 0.55, cell.flowAmount || 0) : 0;
      const flowOffset       = heightOffset * clamp(flowVisible * 0.35, 0, 0.35);
      const x = surfaceX + (cell.flowX || 0) * flowOffset;
      const y = surfaceY - heightOffset + (cell.flowY || 0) * flowOffset;

      if (hasHeightLine) {
        const ldx = surfaceX - x, ldy = surfaceY - y;
        const llen = Math.sqrt(ldx * ldx + ldy * ldy);
        const lineEndX = llen > radius ? x + ldx / llen * radius : surfaceX;
        const lineEndY = llen > radius ? y + ldy / llen * radius : surfaceY;
        ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.42})`;
        ctx.lineWidth   = 1.30;
        ctx.beginPath(); ctx.moveTo(surfaceX, surfaceY); ctx.lineTo(lineEndX, lineEndY); ctx.stroke();
      }
      ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  // ── Draw player marker ────────────────────────────────────────────────────
  function drawCurrentMarker() {
    const pos = state.position || WORLD_ORIGIN;
    const p   = project(pos);
    if (p.x < -80 || p.x > state.width + 80 || p.y < -80 || p.y > state.height + 80) return;

    let heading = state.heading;
    if (!Number.isFinite(heading)) heading = 0;
    const rad  = heading * Math.PI / 180;
    const dest = metersToLatLng(Math.sin(rad) * 140, Math.cos(rad) * 140, pos);
    const ahead = project(dest);
    const screenAngle = Math.atan2(ahead.y - p.y, ahead.x - p.x);

    const pitch     = state.mapReady ? state.map.getPitch() : 0;
    const pitchNorm = pitch / 60;
    const R = 11;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.translate(p.x, p.y - 6);

    const pulse = 0.5 + Math.sin(state.t * 2.2) * 0.5;
    const halo  = ctx.createRadialGradient(0, 0, 0, 0, 0, 28 + pulse * 6);
    halo.addColorStop(0, "rgba(225, 240, 241, 0.14)");
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(0, 0, 34, 0, Math.PI * 2); ctx.fill();

    ctx.save();
    ctx.rotate(screenAngle);

    const tipDist = R * (1.55 - pitchNorm * 0.45);
    const cosTheta = Math.min(R / tipDist, 0.995);
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
    const theta    = Math.acos(cosTheta);
    const tx = R * cosTheta, ty = R * sinTheta;

    ctx.beginPath();
    ctx.moveTo(tipDist, 0);
    ctx.lineTo(tx, -ty);
    ctx.arc(0, 0, R, -theta, theta, true);
    ctx.closePath();

    const grad = ctx.createRadialGradient(-R * 0.15, -R * 0.38, R * 0.05, R * 0.25, R * 0.1, R * 1.45);
    grad.addColorStop(0,    "rgba(246, 248, 250, 1.00)");
    grad.addColorStop(0.52, "rgba(225, 234, 240, 0.97)");
    grad.addColorStop(1,    "rgba(185, 208, 225, 0.82)");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  // ── Field cache ───────────────────────────────────────────────────────────
  function rebuildFieldCache() {
    state.cachedCells   = buildGeoGridField(WORLD_RECORDS);
    state.fieldDirty    = false;
    state.fieldTransition = null;
  }

  function startFieldTransition() {
    const from = (state.cachedCells && state.cachedCells.length) ? state.cachedCells.slice() : null;
    const to   = buildGeoGridField(WORLD_RECORDS);
    if (!from || from.length !== to.length) {
      state.cachedCells = to;
      state.fieldDirty  = false;
      invalidateField(true);
      return;
    }
    state.fieldTransition = { from, to, start: performance.now(), duration: 420 };
    state.fieldDirty = false;
    requestRender();
  }

  function interpolateCells(fromCells, toCells, t) {
    if (!fromCells?.length || fromCells.length !== toCells.length) {
      return toCells.map(c => ({ ...c, strength: c.strength * t, height: c.height * t }));
    }
    return toCells.map((cell, i) => {
      const from = fromCells[i];
      return {
        ...cell,
        strength:       from.strength       + (cell.strength       - from.strength)       * t,
        flux:           from.flux           + (cell.flux           - from.flux)           * t,
        baseContrast:   from.baseContrast   + (cell.baseContrast   - from.baseContrast)   * t,
        contrast:       from.contrast       + (cell.contrast       - from.contrast)       * t,
        localContrast:  (from.localContrast  || 0) + ((cell.localContrast  || 0) - (from.localContrast  || 0)) * t,
        warmth:         from.warmth         + (cell.warmth         - from.warmth)         * t,
        boundary:       from.boundary       + (cell.boundary       - from.boundary)       * t,
        radiusBias:     from.radiusBias     + (cell.radiusBias     - from.radiusBias)     * t,
        heightBias:     from.heightBias     + (cell.heightBias     - from.heightBias)     * t,
        height:         from.height         + (cell.height         - from.height)         * t,
        senseSpacious:  (from.senseSpacious  || 0) + ((cell.senseSpacious  || 0) - (from.senseSpacious  || 0)) * t,
        senseGravity:   (from.senseGravity   || 0) + ((cell.senseGravity   || 0) - (from.senseGravity   || 0)) * t,
        senseTension:   (from.senseTension   || 0) + ((cell.senseTension   || 0) - (from.senseTension   || 0)) * t,
        senseFlow:      (from.senseFlow      || 0) + ((cell.senseFlow      || 0) - (from.senseFlow      || 0)) * t,
        soundLoudness:  (from.soundLoudness  || 0) + ((cell.soundLoudness  || 0) - (from.soundLoudness  || 0)) * t,
        soundTurbulence:(from.soundTurbulence|| 0) + ((cell.soundTurbulence|| 0) - (from.soundTurbulence|| 0)) * t,
        soundSharpness: (from.soundSharpness || 0) + ((cell.soundSharpness || 0) - (from.soundSharpness || 0)) * t,
        soundContinuity:(from.soundContinuity|| 0) + ((cell.soundContinuity|| 0) - (from.soundContinuity|| 0)) * t,
        soundTexture:   (from.soundTexture   || 0) + ((cell.soundTexture   || 0) - (from.soundTexture   || 0)) * t,
        edgeHardness:   (from.edgeHardness   || 0) + ((cell.edgeHardness   || 0) - (from.edgeHardness   || 0)) * t,
        flowX:          (from.flowX          || 0) + ((cell.flowX          || 0) - (from.flowX          || 0)) * t,
        flowY:          (from.flowY          || 0) + ((cell.flowY          || 0) - (from.flowY          || 0)) * t,
        flowAmount:     (from.flowAmount     || 0) + ((cell.flowAmount     || 0) - (from.flowAmount     || 0)) * t,
      };
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function drawBackground() {
    ctx.clearRect(0, 0, state.width, state.height);
    if (state.mapReady) return;
    ctx.fillStyle = "#020304";
    ctx.fillRect(0, 0, state.width, state.height);
    const cx = state.width / 2, cy = state.height / 2;
    const radius = Math.min(state.width, state.height) * 0.43;
    const glow = ctx.createRadialGradient(cx, cy, radius * 0.06, cx, cy, radius * 1.16);
    glow.addColorStop(0, "rgba(154, 180, 184, 0.16)");
    glow.addColorStop(0.48, "rgba(31, 45, 48, 0.17)");
    glow.addColorStop(1, "rgba(2, 3, 4, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, state.width, state.height);
  }

  function render() {
    state.renderHandle = null;
    state.t += 1 / Math.max(1, PERF.targetFPS);
    if (state.fieldDirty) rebuildFieldCache();
    drawBackground();
    let cells = state.cachedCells;
    if (state.fieldTransition) {
      const progress = clamp((performance.now() - state.fieldTransition.start) / state.fieldTransition.duration, 0, 1);
      cells = interpolateCells(state.fieldTransition.from, state.fieldTransition.to, easeInOutCubic(progress));
      if (progress >= 1) {
        state.cachedCells     = state.fieldTransition.to;
        state.fieldTransition = null;
      }
    }
    drawGridTexture(cells);
    drawCurrentMarker();
    state.renderDirty = false;
    if (state.fieldTransition) requestRender();
  }

  // ── Boot ──────────────────────────────────────────────────────────────────
  function boot() {
    initRealMap();
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    initLocation();
    invalidateField(true);
  }

  boot();
})();
