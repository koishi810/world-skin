(() => {
      const DEVICE_ID_KEY = "world-skin-final-device-id";
      const PERSONAL_RECORDS_KEY = "world-skin-final-personal-records";
      const supabase = (() => {
        const url = window.SUPABASE_URL;
        const key = window.SUPABASE_ANON_KEY;
        if (!url || url.includes("YOUR-PROJECT") || !window.supabase) {
          console.warn("[WorldSkin] Supabase not configured — run seed.html first and fill supabase-config.js");
          return null;
        }
        return window.supabase.createClient(url, key);
      })();
      const API_BASE = (window.WORLD_SKIN_API_BASE || "").replace(/\/$/, "");
      const DURATION = 10000;
      const BREATH_VISUAL = {
        growMs:       4000,
        floatMs:      2000,
        shrinkMs:     4000,
        minScale:     0.28,
        maxScale:     1.00,
        ringCount:   7,
        baseRadius:  68,
        radiusStep:  14,
        strokeAlpha: 0.62,
        strokeWidth: 1.4
      };
      const RADIUS_METERS = window.WORLD_SKIN_DATA?.radiusMeters || 54000;
      const WORLD_ORIGIN = window.WORLD_SKIN_DATA?.origin || { lat: 35.6895, lng: 139.6917 };
      const DEFAULT_ORIGIN = WORLD_ORIGIN;
      const TIME_SLOTS = ["morning", "day", "evening", "night"];
      const LOCAL_WORLD_RECORDS = window.WORLD_SKIN_DATA?.records || window.WORLD_SKIN_RECORDS || [];
      const LOCAL_PERSONAL_RECORDS = window.MY_SKIN_DATA?.records || [];
      let WORLD_RECORDS = LOCAL_WORLD_RECORDS;
      const TEST_RECORDS   = window.TEST_SKIN_DATA?.records   || [];
      const TEST_RECORDS_2 = window.TEST_SKIN_DATA_2?.records || [];
      const _LNG5T = [-2,-1,0,1,2].map(i => 139.4808 + i * 0.0220);
      const TEST_LABELS_1 = [
        { id:"A0", name:"spaciousness", lat:35.7200, lng:139.4808-0.0253 },
        { id:"A1", name:"gravity",      lat:35.7200, lng:139.4808        },
        { id:"A2", name:"tension",      lat:35.7200, lng:139.4808+0.0253 },
        { id:"B0", name:"flow",         lat:35.6800, lng:139.4808-0.0253 },
        { id:"B1", name:"sound",        lat:35.6800, lng:139.4808        },
        { id:"B2", name:"finalColor",   lat:35.6800, lng:139.4808+0.0253 },
        { id:"C0", name:"密集+沉重", lat:35.7560, lng:_LNG5T[0] },
        { id:"C1", name:"密集+轻盈", lat:35.7560, lng:_LNG5T[1] },
        { id:"C2", name:"空旷+沉重", lat:35.7560, lng:_LNG5T[2] },
        { id:"C3", name:"空旷+轻盈", lat:35.7560, lng:_LNG5T[3] },
        { id:"C4", name:"绷紧+空旷", lat:35.7560, lng:_LNG5T[4] },
        { id:"D0", name:"松开+密集", lat:35.6440, lng:_LNG5T[0] },
        { id:"D1", name:"流动+密集", lat:35.6440, lng:_LNG5T[1] },
        { id:"D2", name:"静止+密集", lat:35.6440, lng:_LNG5T[2] },
        { id:"D3", name:"嘈杂+空旷", lat:35.6440, lng:_LNG5T[3] },
        { id:"D4", name:"安静+沉重", lat:35.6440, lng:_LNG5T[4] },
      ];
      const TEST_LABELS_2 = [
        { id:"E0", name:"密集+沉重", lat:35.7920, lng:_LNG5T[0] },
        { id:"E1", name:"密集+轻盈", lat:35.7920, lng:_LNG5T[1] },
        { id:"E2", name:"空旷+沉重", lat:35.7920, lng:_LNG5T[2] },
        { id:"E3", name:"空旷+轻盈", lat:35.7920, lng:_LNG5T[3] },
        { id:"E4", name:"绷紧+空旷", lat:35.7920, lng:_LNG5T[4] },
        { id:"F0", name:"松开+密集", lat:35.6080, lng:_LNG5T[0] },
        { id:"F1", name:"流动+密集", lat:35.6080, lng:_LNG5T[1] },
        { id:"F2", name:"静止+密集", lat:35.6080, lng:_LNG5T[2] },
        { id:"F3", name:"嘈杂+空旷", lat:35.6080, lng:_LNG5T[3] },
        { id:"F4", name:"安静+沉重", lat:35.6080, lng:_LNG5T[4] },
      ];
      const VISUAL_LIMITS = {
        strength: 0.72,
        flux: 0.72,
        contrast: 0.48,
        height: 92,
        radius: 2.4,
        alpha: 0.72,
        boundaryAlpha: 0.32
      };
      const GRID_VISUAL = {
        spacing: 13,
        baseRadius: 1.15,
        minRadius: 0.8,
        maxRadius: 2.4,
        minAlpha: 0.008,
        voidAlpha: 0.018,
        maxAlpha: 0.88,
        minGlow: 0,
        maxGlow: 8,
        maxJitter: 0.8,
        maxPulse: 0.12,
        influenceCutoff: 0.006,
        strengthCutoff: 0.014,
        colors: {
          void:      { r: 35,  g: 40,  b: 46  },
          voidWarm:  { r: 49,  g: 43,  b: 39  },
          voidCool:  { r: 18,  g: 28,  b: 54  },
          cold:      { r: 82,  g: 148, b: 215 },
          cyanGray:  { r: 72,  g: 198, b: 190 },
          neutral:   { r: 204, g: 212, b: 220 },
          bright:    { r: 225, g: 236, b: 248 },
          silver:    { r: 188, g: 224, b: 252 },
          warmBright:{ r: 252, g: 220, b: 168 },
          warm:      { r: 238, g: 182, b: 118 },
          amberGray: { r: 245, g: 162, b: 52  },
          rust:      { r: 218, g: 88,  b: 32  },
          purpleGray:{ r: 148, g: 72,  b: 148 },
          redBrown:  { r: 168, g: 44,  b: 22  },
          blueBlack:   { r: 23,  g: 32,  b: 41  },
          mossTeal:    { r: 48,  g: 128, b: 116 },
          stoneBlue:   { r: 52,  g: 86,  b: 158 },
          indigoNight: { r: 28,  g: 36,  b: 112 },
          oliveAsh:    { r: 148, g: 148, b: 58  },
          dustGray:    { r: 155, g: 142, b: 118 },
          concreteBlue:{ r: 88,  g: 104, b: 126 },
          hazeWhite:   { r: 205, g: 210, b: 218 },
          warmEarth:   { r: 162, g: 132, b: 88  },
          flowSlate:   { r: 90,  g: 115, b: 150 }
        }
      };
      const DOT_VISUAL_TUNING = {
        alphaMul:       1.68,
        activeAlphaMul: 2.10,
        nightAlphaBoost: 1.18,
        maxAlpha:       0.92
      };
      const DOT_DENSITY_VISUAL = {
        targetScreenSpacingPx: 11.0,
        minScreenSpacingPx: 9,
        maxScreenSpacingPx: 13,
        baseRadiusPx: 1.10,
        minRadiusPx: 0.7,
        maxRadiusPx: 9,
        maxDotsDesktop: 9600,
        maxDotsMobile: 6800,
        minDotsVisible: 2600,
        densityMode: "screen-stable"
      };
      const MAP_VISUAL_MODES = {
        dark: { tileBrightness: 0.62, tileContrast: 1.02, tileSaturation: 0.22, hueRotate: 0, baseOpacity: 0.94, edgeBoost: 1.06 },
        balanced: { tileBrightness: 0.70, tileContrast: 1.06, tileSaturation: 0.30, hueRotate: 0, baseOpacity: 0.94, edgeBoost: 1.24 },
        bright: { tileBrightness: 1.00, tileContrast: 1.10, tileSaturation: 0.40, hueRotate: 0, baseOpacity: 1, edgeBoost: 1.42 }
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
        center: [WORLD_ORIGIN.lng, WORLD_ORIGIN.lat],
        zoom: 10.45,
        pitch: 42,
        bearing: -16
      };
      const MAP_VIEW = DEFAULT_VIEW;
      const PERF = {
        gridSpacing: 14,
        cellSize: 128,
        maxInfluenceDistance: 260,
        maxVisibleRecords: 12000,
        targetFPS: 30,
        renderDebounceMs: 60,
        useOffscreenCache: true
      };
      const FIELD_KEY_SCALE = 1000000;
      function fieldKey(a, b) { return a * FIELD_KEY_SCALE + b; }
      // Each entry: { word, sv:{spaciousness,gravity,tension,flow}, tex:{...legacy only} }
      // tex is kept for old-record compatibility notes; new records do not write textureModifier.
      // sv axes: subjective spatial/structural feel. tex: surface/material quality.
      // Values in [-1,+1]; texture-heavy words (ざらつく, 乾く, etc.) concentrate weight in tex.
      const SENSE_WORD_LIST = [
        { word:"ざらつく", sv:{spaciousness: 0.0,gravity: 0.0,tension: 0.6,flow: 0.0}, tex:{warmth:-0.2,roughness: 0.8,clarity:-0.3,dryness: 0.4} },
        { word:"なめらか", sv:{spaciousness: 0.2,gravity:-0.1,tension:-0.6,flow: 0.1}, tex:{warmth: 0.0,roughness:-0.7,clarity: 0.5,dryness: 0.0} },
        { word:"重い",     sv:{spaciousness:-0.2,gravity: 0.8,tension: 0.2,flow:-0.2}, tex:{warmth: 0.0,roughness: 0.2,clarity:-0.2,dryness: 0.0} },
        { word:"軽い",     sv:{spaciousness: 0.2,gravity:-0.7,tension:-0.2,flow: 0.2}, tex:{warmth: 0.0,roughness:-0.2,clarity: 0.2,dryness: 0.0} },
        { word:"浮く",     sv:{spaciousness: 0.4,gravity:-0.8,tension:-0.2,flow: 0.3}, tex:{warmth: 0.0,roughness:-0.3,clarity: 0.3,dryness: 0.0} },
        { word:"沈む",     sv:{spaciousness:-0.2,gravity: 0.7,tension: 0.1,flow:-0.3}, tex:{warmth:-0.1,roughness: 0.2,clarity:-0.2,dryness: 0.0} },
        { word:"乾く",     sv:{spaciousness: 0.1,gravity: 0.0,tension: 0.3,flow: 0.0}, tex:{warmth:-0.3,roughness: 0.4,clarity: 0.4,dryness: 0.8} },
        { word:"湿る",     sv:{spaciousness:-0.1,gravity: 0.1,tension:-0.2,flow: 0.0}, tex:{warmth: 0.2,roughness: 0.3,clarity:-0.3,dryness:-0.7} },
        { word:"冷える",   sv:{spaciousness: 0.1,gravity: 0.0,tension: 0.2,flow:-0.1}, tex:{warmth:-0.8,roughness: 0.1,clarity: 0.2,dryness: 0.2} },
        { word:"熱を持つ", sv:{spaciousness:-0.1,gravity: 0.1,tension: 0.0,flow: 0.0}, tex:{warmth: 0.8,roughness: 0.0,clarity:-0.2,dryness:-0.3} },
        { word:"詰まる",   sv:{spaciousness:-0.7,gravity: 0.3,tension: 0.5,flow:-0.5}, tex:{warmth: 0.0,roughness: 0.3,clarity:-0.3,dryness: 0.0} },
        { word:"ほどける", sv:{spaciousness: 0.5,gravity:-0.3,tension:-0.7,flow: 0.3}, tex:{warmth: 0.1,roughness:-0.3,clarity: 0.3,dryness: 0.0} },
        { word:"遠い",     sv:{spaciousness: 0.7,gravity:-0.1,tension:-0.1,flow: 0.1}, tex:{warmth:-0.1,roughness:-0.1,clarity: 0.4,dryness: 0.2} },
        { word:"近い",     sv:{spaciousness:-0.6,gravity: 0.1,tension: 0.1,flow: 0.0}, tex:{warmth: 0.1,roughness: 0.1,clarity:-0.1,dryness: 0.0} },
        { word:"騒ぐ",     sv:{spaciousness:-0.1,gravity: 0.0,tension: 0.5,flow: 0.7}, tex:{warmth: 0.1,roughness: 0.5,clarity:-0.5,dryness: 0.0} },
        { word:"静まる",   sv:{spaciousness: 0.3,gravity:-0.1,tension:-0.6,flow:-0.6}, tex:{warmth: 0.0,roughness:-0.3,clarity: 0.5,dryness: 0.1} },
        { word:"流れる",   sv:{spaciousness: 0.2,gravity:-0.1,tension:-0.3,flow: 0.8}, tex:{warmth: 0.0,roughness:-0.2,clarity: 0.2,dryness: 0.0} },
        { word:"滞る",     sv:{spaciousness:-0.3,gravity: 0.3,tension: 0.3,flow:-0.7}, tex:{warmth: 0.1,roughness: 0.2,clarity:-0.3,dryness: 0.0} },
        { word:"広がる",   sv:{spaciousness: 0.8,gravity:-0.2,tension:-0.3,flow: 0.2}, tex:{warmth: 0.0,roughness:-0.1,clarity: 0.3,dryness: 0.0} },
        { word:"閉じる",   sv:{spaciousness:-0.7,gravity: 0.1,tension: 0.3,flow:-0.3}, tex:{warmth: 0.0,roughness: 0.1,clarity:-0.2,dryness: 0.0} },
        { word:"尖る",     sv:{spaciousness: 0.0,gravity: 0.0,tension: 0.8,flow: 0.2}, tex:{warmth:-0.2,roughness: 0.5,clarity: 0.4,dryness: 0.3} },
        { word:"丸まる",   sv:{spaciousness:-0.2,gravity: 0.2,tension:-0.7,flow:-0.2}, tex:{warmth: 0.2,roughness:-0.4,clarity: 0.1,dryness: 0.0} },
        { word:"濁る",     sv:{spaciousness:-0.1,gravity: 0.2,tension: 0.2,flow:-0.2}, tex:{warmth: 0.2,roughness: 0.4,clarity:-0.7,dryness:-0.2} },
        { word:"澄む",     sv:{spaciousness: 0.3,gravity:-0.2,tension:-0.2,flow: 0.2}, tex:{warmth:-0.2,roughness:-0.5,clarity: 0.8,dryness: 0.3} },
        { word:"硬い",     sv:{spaciousness:-0.1,gravity: 0.2,tension: 0.7,flow:-0.1}, tex:{warmth:-0.3,roughness: 0.6,clarity: 0.2,dryness: 0.4} },
        { word:"柔らかい", sv:{spaciousness: 0.2,gravity:-0.1,tension:-0.7,flow: 0.0}, tex:{warmth: 0.3,roughness:-0.6,clarity: 0.0,dryness:-0.2} },
        { word:"速い",     sv:{spaciousness: 0.1,gravity:-0.2,tension: 0.2,flow: 0.7}, tex:{warmth: 0.0,roughness: 0.1,clarity: 0.2,dryness: 0.1} },
        { word:"遅い",     sv:{spaciousness:-0.1,gravity: 0.2,tension:-0.1,flow:-0.6}, tex:{warmth: 0.1,roughness: 0.1,clarity:-0.1,dryness: 0.0} },
        { word:"薄い",     sv:{spaciousness: 0.5,gravity:-0.6,tension:-0.2,flow: 0.1}, tex:{warmth:-0.1,roughness:-0.3,clarity: 0.4,dryness: 0.3} },
        { word:"厚い",     sv:{spaciousness:-0.4,gravity: 0.6,tension: 0.2,flow:-0.1}, tex:{warmth: 0.2,roughness: 0.3,clarity:-0.3,dryness:-0.1} },
        { word:"こもる",   sv:{spaciousness:-0.6,gravity: 0.3,tension: 0.4,flow:-0.4}, tex:{warmth: 0.4,roughness: 0.2,clarity:-0.5,dryness:-0.3} },
        { word:"抜ける",   sv:{spaciousness: 0.6,gravity:-0.3,tension:-0.3,flow: 0.6}, tex:{warmth:-0.1,roughness:-0.2,clarity: 0.5,dryness: 0.2} },
      ];
      const SENSE_ROUNDS = 2;
      const SENSE_PROTOTYPE_ROUNDS = [
        {
          prompt: "いまの感覚に近い言葉を選ぶ"
        },
        {
          prompt: "もう少しだけ近いものを選ぶ"
        }
      ];
      const SENSE_LABEL_AREA = {
        minLeft: 72,
        maxLeft: 321,
        minTop: 288,
        maxTop: 584,
        centerLeft: 198,
        centerTop: 428,
        minCenterDistance: 84,
        minPairDistance: 132
      };
      const SENSE_LABEL_ANCHORS = [
        { left: 118, top: 350 },
        { left: 282, top: 356 },
        { left: 198, top: 542 }
      ];

      function aggregateSV(words) {
        const zero = { spaciousness: 0, gravity: 0, tension: 0, flow: 0 };
        if (!words.length) return zero;
        const hits = words.map(w => SENSE_WORD_LIST.find(e => e.word === w)?.sv).filter(Boolean);
        if (!hits.length) return zero;
        const n = hits.length;
        return {
          spaciousness: hits.reduce((a, v) => a + v.spaciousness, 0) / n,
          gravity:      hits.reduce((a, v) => a + v.gravity,      0) / n,
          tension:      hits.reduce((a, v) => a + v.tension,      0) / n,
          flow:         hits.reduce((a, v) => a + v.flow,         0) / n,
        };
      }

      const _now = new Date();
      const currentHour = _now.getHours() + _now.getMinutes() / 60;
      function normalizeHour(h) { return ((h % 24) + 24) % 24; }
      function getTimelineHour(offset) { return normalizeHour(currentHour + offset); }

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

      function randomRange(min, max) {
        return min + Math.random() * (max - min);
      }

      function safeVibrate(pattern) {
        if ("vibrate" in navigator) { try { navigator.vibrate(pattern); } catch (e) {} }
      }

      const app = document.getElementById("app");
      const realMap = document.getElementById("realMap");
      const mapDarkOverlay = document.getElementById("mapDarkOverlay");
      const canvas = document.getElementById("skinCanvas");
      const ctx = canvas.getContext("2d");
      const views = document.querySelectorAll(".view");
      const navBtns = document.querySelectorAll(".nav-btn");
      const pressTarget = document.getElementById("pressTarget");
      const recordModal = document.getElementById("recordModal");
      const labelSelect = document.getElementById("labelSelect");
      const avatarBtn = document.getElementById("avatarBtn");
      const profileBack = document.getElementById("profileBack");
      const profileOpenSettings = document.getElementById("profileOpenSettings");
      const profileOpenShare = document.getElementById("profileOpenShare");
      const homeShareBtn = document.getElementById("homeShareBtn");
      const shareBack = document.getElementById("shareBack");
      const settingsPage = document.querySelector(".settings-page");
      const settingsScrollbarThumb = document.querySelector(".settings-scrollbar span");
      const pvCount = document.getElementById("pvCount");
      const pvTrend = document.getElementById("pvTrend");
      const pvTrendTime = document.getElementById("pvTrendTime");
      const pvRecent = document.getElementById("pvRecent");
      const timeSlider = document.getElementById("timeSlider");
      const timeAxisLabel = document.getElementById("timeAxisLabel");
      const toast = document.getElementById("toast");
      const debugPanel = document.getElementById("debugPanel");

      const state = {
        view: "world",
        prevView: "world",
        personalRecords: [],
        worldRecords: WORLD_RECORDS,
        testMode: false,
        origin: DEFAULT_ORIGIN,
        position: null,
        heading: null,
        audioReady: false,
        audioMode: "idle",
        analyser: null,
        freq: new Uint8Array(96),
        volume: 0,
        peak: 0,
        recording: false,
        pressToken: 0,
        pressPointerId: null,
        recordStart: 0,
        samples: [],
        path: [],
        pending: null,
        senseRound: 0,
        selectedWords: [],
        lastBreathPhase: "",
        senseStage: "idle",
        senseIntroTimers: [],
        senseReadyAt: 0,
        t: 0,
        dpr: 1,
        width: 0,
        height: 0,
        centerOffset: { x: 0, y: 0 },
        zoom: 1,
        map: null,
        mapReady: false,
        mapLevel: "area",
        mapVisualMode: "balanced",
        selectedHour: getTimelineHour(0),
        aggregation: { hour: 0.44, day: 0.24, threeDay: 0.16, week: 0.11, month: 0.05 },
        pointers: new Map(),
        dragStart: null,
        pinchStart: null,
        grid: { world: [], radius: [] },
        debug: false,
        debugStats: null,
        renderDirty: true,
        fieldDirty: true,
        renderHandle: null,
        renderTimer: null,
        cachedCells: [],
        lastRenderAt: 0,
        fieldTransition: null,
        markerOpacity: 1,
        markerTargetOpacity: 1,
        markerFadeStartedAt: 0,
        markerFadeFrom: 1,
        markerFadeDuration: 320,
        markerFadeActive: false,
        shareSnapshot: null,
        remoteRecordsTimer: null,
        remoteRecordsRequestId: 0,
        remoteRecordsKey: ""
      };

      state.origin = recordsCenter(state.personalRecords) || DEFAULT_ORIGIN;
      app.dataset.view = state.view;
      app.dataset.senseStage = "idle";

      function getDeviceId() {
        let id = localStorage.getItem(DEVICE_ID_KEY);
        if (!id) {
          id = "dev-" + Math.random().toString(36).slice(2, 11) + "-" + Date.now().toString(36);
          localStorage.setItem(DEVICE_ID_KEY, id);
        }
        return id;
      }

      function deserializeRecord(row) {
        return {
          id:            row.id,
          userId:        row.user_id,
          lat:           row.lat,
          lng:           row.lng,
          timestamp:     row.timestamp,
          hour:          row.hour,
          weekday:       row.weekday,
          noiseLevel:    row.noise_level,
          turbulence:    row.turbulence,
          peak:          row.peak,
          mobility:      row.mobility,
          direction:     row.direction,
          duration:      row.duration,
          word:          row.word,
          selectedWords: row.selected_words || [],
          senseVector:   row.sense_vector   || {},
          soundVector:   row.sound_vector   || {},
          trustScore:    row.trust_score,
          zoneId:        row.zone_id,
          source:        row.source,
          noise:         row.noise,
          flux:          row.flux,
          movement:      row.movement,
          distance:      row.distance,
          slot:          row.slot,
          createdAt:     row.created_at
        };
      }

      function normalizeLocalRecord(record, recordType = "personal", index = 0) {
        const createdAt = record.createdAt || record.created_at || record.timestamp || new Date().toISOString();
        const word = record.word || (Array.isArray(record.selectedWords) ? record.selectedWords[0] : null);
        return {
          ...record,
          id: record.id || `${recordType}-${index}`,
          userId: record.userId || record.user_id || (recordType === "personal" ? "self-demo" : "world-demo"),
          record_type: record.record_type || recordType,
          timestamp: record.timestamp || createdAt,
          noiseLevel: record.noiseLevel ?? record.noise_level ?? record.noise,
          turbulence: record.turbulence ?? record.flux,
          mobility: record.mobility || record.movement || "still",
          word,
          selectedWords: Array.isArray(record.selectedWords) && record.selectedWords.length
            ? record.selectedWords
            : (Array.isArray(record.selected_words) && record.selected_words.length ? record.selected_words : (word ? [word] : [])),
          senseVector: record.senseVector || record.sense_vector || {},
          soundVector: record.soundVector || record.sound_vector || {},
          trustScore: record.trustScore ?? record.trust_score,
          zoneId: record.zoneId || record.zone_id,
          noise: record.noise ?? record.noiseLevel ?? record.noise_level,
          flux: record.flux ?? record.turbulence,
          movement: record.movement || record.mobility || "still",
          createdAt
        };
      }

      function uniqueRecords(records) {
        const seen = new Set();
        return records.filter((record, index) => {
          const key = record.id || `${record.createdAt || record.timestamp || "record"}-${index}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }

      function loadLocalPersonalRecords() {
        try {
          const raw = localStorage.getItem(PERSONAL_RECORDS_KEY);
          const records = raw ? JSON.parse(raw) : [];
          if (!Array.isArray(records)) return [];
          return uniqueRecords(records.map((record, index) => normalizeLocalRecord(record, "personal", index)));
        } catch {
          return [];
        }
      }

      function persistLocalPersonalRecords(records = state.personalRecords) {
        try {
          localStorage.setItem(PERSONAL_RECORDS_KEY, JSON.stringify(uniqueRecords(records).slice(-500)));
        } catch {
          // localStorage can fail in private browsing; remote save still runs.
        }
      }

      function serializeRecord(record, deviceId) {
        const hour = Number(record.hour);
        return {
          id:             record.id,
          user_id:        deviceId,
          device_id:      deviceId,
          record_type:    "personal",
          lat:            record.lat,
          lng:            record.lng,
          timestamp:      record.timestamp,
          hour:           Number.isFinite(hour) ? clamp(Math.floor(hour), 0, 23) : null,
          weekday:        record.weekday,
          noise_level:    record.noiseLevel,
          turbulence:     record.turbulence,
          peak:           record.peak,
          mobility:       record.mobility,
          direction:      record.direction,
          duration:       record.duration,
          word:           record.word,
          selected_words: record.selectedWords || [],
          sense_vector:   record.senseVector   || {},
          sound_vector:   record.soundVector   || {},
          trust_score:    record.trustScore,
          zone_id:        record.zoneId,
          source:         record.source,
          noise:          record.noise,
          flux:           record.flux,
          movement:       record.movement,
          distance:       record.distance,
          slot:           record.slot,
          created_at:     record.createdAt || new Date().toISOString()
        };
      }

      async function apiRequest(path, options = {}) {
        try {
          const response = await fetch(`${API_BASE}${path}`, {
            cache: "no-store",
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...(options.headers || {})
            }
          });
          if (!response.ok) return null;
          return await response.json();
        } catch {
          return null;
        }
      }

      async function loadApiRecords(params) {
        const query = new URLSearchParams(params);
        const payload = await apiRequest(`/api/records?${query.toString()}`);
        if (!payload || !Array.isArray(payload.records)) return null;
        return payload.records;
      }

      async function loadPersonalRecords() {
        const deviceId = getDeviceId();
        const localRows = loadLocalPersonalRecords();
        const apiRows = await loadApiRecords({ record_type: "personal", device_id: deviceId });
        if (apiRows) return uniqueRecords([...apiRows.map(deserializeRecord), ...localRows]);
        if (!supabase) return localRows;
        const { data, error } = await supabase
          .from("records")
          .select("*")
          .eq("record_type", "personal")
          .eq("device_id", deviceId);
        if (error) { console.warn("[WorldSkin] load personal records failed", error); return localRows; }
        return uniqueRecords([...(data || []).map(deserializeRecord), ...localRows]);
      }

      const SUPABASE_WORLD_FIELDS = [
        "id", "user_id", "device_id", "record_type",
        "lat", "lng", "timestamp", "hour", "weekday",
        "noise_level", "turbulence", "peak", "mobility", "direction", "duration",
        "word", "selected_words", "sense_vector", "sound_vector", "trust_score",
        "zone_id", "source", "noise", "flux", "movement", "distance", "slot", "created_at"
      ].join(",");

      function remoteWorldLimitForZoom() {
        const zoom = state.mapReady ? state.map.getZoom() : DEFAULT_VIEW.zoom;
        if (zoom < ZOOM_LEVELS.area.max) return 1200;
        if (zoom < ZOOM_LEVELS.neighborhood.max) return 1800;
        if (zoom < ZOOM_LEVELS.street.max) return 2400;
        return 3000;
      }

      function currentViewportBounds(padRatio = 0.18) {
        if (!state.mapReady || !state.map) return null;
        const bounds = state.map.getBounds();
        if (!bounds) return null;
        const south = bounds.getSouth();
        const north = bounds.getNorth();
        const west = bounds.getWest();
        const east = bounds.getEast();
        const latPad = padRatio > 0 ? Math.max(0.002, (north - south) * padRatio) : 0;
        const lngPad = padRatio > 0 ? Math.max(0.002, (east - west) * padRatio) : 0;
        return {
          south: clamp(south - latPad, -90, 90),
          north: clamp(north + latPad, -90, 90),
          west: west - lngPad,
          east: east + lngPad
        };
      }

      function remoteBoundsKey(bounds, limit) {
        if (!bounds) return `latest:${limit}`;
        const precision = 1000;
        return [
          limit,
          Math.round(bounds.south * precision),
          Math.round(bounds.north * precision),
          Math.round(bounds.west * precision),
          Math.round(bounds.east * precision)
        ].join(":");
      }

      async function loadSupabaseWorldRows({ bounds = null, limit = remoteWorldLimitForZoom() } = {}) {
        if (!supabase) return null;
        const pageSize = 1000;
        const rows = [];
        for (let from = 0; from < limit; from += pageSize) {
          const to = Math.min(from + pageSize - 1, limit - 1);
          let query = supabase
            .from("records")
            .select(SUPABASE_WORLD_FIELDS)
            .eq("record_type", "world")
            .order("created_at", { ascending: false });
          if (bounds) {
            query = query
              .gte("lat", bounds.south)
              .lte("lat", bounds.north)
              .gte("lng", bounds.west)
              .lte("lng", bounds.east);
          }
          const { data, error } = await query.range(from, to);
          if (error) {
            console.warn("[WorldSkin] load world records failed", error);
            return [];
          }
          if (!data || !data.length) break;
          rows.push(...data);
          if (data.length < pageSize) break;
        }
        return rows;
      }

      async function loadWorldRecords() {
        const apiRows = await loadApiRecords({ record_type: "world" });
        if (apiRows) return apiRows.map(deserializeRecord);
        const data = await loadSupabaseWorldRows({ limit: 1200 });
        if (!data) return [];
        return data.map(deserializeRecord);
      }

      async function saveRecord(record) {
        const row = serializeRecord(record, getDeviceId());
        const apiResult = await apiRequest("/api/records", {
          method: "POST",
          body: JSON.stringify(row)
        });
        if (apiResult) return;
        if (!supabase) return;
        const { error } = await supabase.from("records").upsert(row);
        if (error) throw error;
      }

      async function clearPersonalRecords() {
        localStorage.removeItem(PERSONAL_RECORDS_KEY);
        const apiResult = await apiRequest(`/api/records?${new URLSearchParams({
          record_type: "personal",
          device_id: getDeviceId()
        }).toString()}`, { method: "DELETE" });
        if (apiResult) return;
        if (!supabase) return;
        const { error } = await supabase
          .from("records")
          .delete()
          .eq("record_type", "personal")
          .eq("device_id", getDeviceId());
        if (error) throw error;
      }

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

      function activeRecords() {
        if (state.view === "world") {
          return state.personalRecords.length
            ? [...state.worldRecords, ...state.personalRecords]
            : state.worldRecords;
        }
        return state.personalRecords;
      }

      function activeOrigin() {
        return state.view === "world" ? WORLD_ORIGIN : state.origin;
      }

      function recordsCenter(records = []) {
        if (!records.length) return null;
        const valid = records.filter(r => Number.isFinite(r.lat) && Number.isFinite(r.lng));
        if (!valid.length) return null;
        return {
          lat: valid.reduce((sum, r) => sum + r.lat, 0) / valid.length,
          lng: valid.reduce((sum, r) => sum + r.lng, 0) / valid.length
        };
      }

      function personalCenter() {
        return state.position || recordsCenter(state.personalRecords) || state.origin || DEFAULT_ORIGIN;
      }

      function recordNoise(record) {
        return clamp(Number(record.noise ?? record.noiseLevel ?? 0.18), 0, 1);
      }

      function recordFlux(record) {
        return clamp(Number(record.flux ?? record.turbulence ?? 0.08), 0, 1);
      }

      function recordMove(record) {
        const move = record.movement ?? record.mobility ?? "still";
        return ["still", "slow", "passing"].includes(move) ? move : "still";
      }

      function recordTime(record) {
        return record.createdAt ?? record.timestamp ?? new Date().toISOString();
      }

      function recordSlot(record) {
        if (record.slot) return record.slot;
        const hour = Number.isFinite(record.hour) ? record.hour : new Date(recordTime(record)).getHours();
        if (hour >= 5 && hour < 11) return "morning";
        if (hour >= 11 && hour < 17) return "day";
        if (hour >= 17 && hour < 22) return "evening";
        return "night";
      }

      // ── v2 record field accessors (safe fallback for old records) ────────
      function getSV(rec) {
        if (rec.senseVector) return rec.senseVector;
        return { spaciousness: 0, gravity: 0, tension: 0, flow: 0 };
      }

      function getTexMod(rec) {
        // Legacy fallback only. New records no longer write or depend on textureModifier.
        if (rec.textureModifier) return rec.textureModifier;
        return { warmth: 0, roughness: 0, clarity: 0, dryness: 0 };
      }

      function getSoundV(rec) {
        if (rec.soundVector) return rec.soundVector;
        const loudness   = clamp(Number(rec.noise ?? rec.noiseLevel ?? 0.18), 0, 1);
        const turbulence = clamp(Number(rec.flux  ?? rec.turbulence  ?? 0.08), 0, 1);
        return { loudness, turbulence, sharpness: 0.3, continuity: 0.8, texture: 0.3 };
      }

      function createDemoPersonalRecords() {
        return LOCAL_PERSONAL_RECORDS.map((record, index) => normalizeLocalRecord(record, "personal", index));
      }

      // ── soundVector computation from mic samples ──────────────────────────
      function _spectralSharpness(freq) {
        if (!freq || !freq.length) return 0.3;
        const n = freq.length, hiStart = Math.floor(n * 0.5);
        let total = 0, hi = 0;
        for (let i = 0; i < n; i++) { total += freq[i]; if (i >= hiStart) hi += freq[i]; }
        return total > 0 ? hi / total : 0.3;
      }

      function _spectralSpread(freq) {
        if (!freq || !freq.length) return 0.3;
        const n = freq.length;
        let sum = 0, sum2 = 0;
        for (let i = 0; i < n; i++) { const v = freq[i] / 255; sum += v; sum2 += v * v; }
        const mean = sum / n;
        return clamp((sum2 / n - mean * mean) * 4, 0, 1);
      }

      function computeSoundVector(samples) {
        if (!samples.length) return { loudness: 0.18, turbulence: 0.08, sharpness: 0.3, continuity: 0.8, texture: 0.3 };
        const vols = samples.map(s => s.volume);
        const loudness   = vols.reduce((a, b) => a + b, 0) / vols.length;
        const turbulence = clamp(Math.max(...vols) - Math.min(...vols), 0, 1);
        const sharpness  = samples.reduce((a, s) => a + (s.sharpness  ?? 0.3), 0) / samples.length;
        const texture    = samples.reduce((a, s) => a + (s.texture    ?? 0.3), 0) / samples.length;
        const continuity = samples.filter(s => s.volume > 0.05).length / samples.length;
        return {
          loudness:   clamp(loudness,   0, 1),
          turbulence: clamp(turbulence, 0, 1),
          sharpness:  clamp(sharpness,  0, 1),
          continuity: clamp(continuity, 0, 1),
          texture:    clamp(texture,    0, 1),
        };
      }

      function senseWordScore(entry, pending, seenWords = []) {
        const sv = entry.sv || {};
        const noise = clamp(pending?.noise ?? 0.38, 0, 1);
        const flux = clamp(pending?.flux ?? 0.2, 0, 1);
        const loudness = clamp(pending?.soundVector?.loudness ?? noise, 0, 1);
        const turbulence = clamp(pending?.soundVector?.turbulence ?? flux, 0, 1);
        const spaciousTarget = 0.55 - noise * 1.1;
        const gravityTarget = noise * 0.9 - 0.35;
        const tensionTarget = turbulence * 1.35 - 0.45;
        const flowTarget = (pending?.movement === "passing" ? 0.72 : pending?.movement === "slow" ? 0.28 : -0.18) + flux * 0.22;
        const dist =
          Math.abs((sv.spaciousness ?? 0) - spaciousTarget) * 0.82 +
          Math.abs((sv.gravity ?? 0) - gravityTarget) * 0.70 +
          Math.abs((sv.tension ?? 0) - tensionTarget) * 0.78 +
          Math.abs((sv.flow ?? 0) - flowTarget) * 0.72;
        const dataBoost = state.personalRecords.some(r => r.word === entry.word || (Array.isArray(r.selectedWords) && r.selectedWords.includes(entry.word))) ? 0.22 : 0;
        const soundBoost = loudness > 0.62 && ["ざらつく", "重い", "詰まる", "硬い", "騒ぐ"].includes(entry.word) ? 0.20 : 0;
        const seenPenalty = seenWords.includes(entry.word) ? -10 : 0;
        return Math.max(0.01, 1.75 - dist + dataBoost + soundBoost + seenPenalty);
      }

      function weightedPick(entries, scoreFn) {
        const scored = entries.map(entry => ({ entry, score: Math.max(0.01, scoreFn(entry)) }));
        const total = scored.reduce((sum, item) => sum + item.score, 0);
        let pick = Math.random() * total;
        for (const item of scored) {
          pick -= item.score;
          if (pick <= 0) return item.entry;
        }
        return scored[scored.length - 1]?.entry;
      }

      function pickRoundWords(seenWords, round = 0) {
        const picked = [];
        let available = SENSE_WORD_LIST.filter(entry => !seenWords.includes(entry.word));
        while (picked.length < 3 && available.length) {
          const chosen = weightedPick(available, entry => {
            const base = senseWordScore(entry, state.pending, seenWords);
            const novelty = round === 0 ? 1 : 0.82 + Math.random() * 0.35;
            return base * novelty;
          });
          if (!chosen) break;
          picked.push(chosen.word);
          available = available.filter(entry => entry.word !== chosen.word);
        }
        return picked;
      }

      function senseLabelDistance(a, b) {
        return Math.hypot(a.left - b.left, (a.top - b.top) * 0.86);
      }

      function sampleSenseLabelPosition(placed, index) {
        const center = { left: SENSE_LABEL_AREA.centerLeft, top: SENSE_LABEL_AREA.centerTop };
        const minPairDistance = SENSE_LABEL_AREA.minPairDistance + (index === 2 ? 18 : 0);
        let best = null;
        let bestScore = -Infinity;

        for (let attempt = 0; attempt < 90; attempt++) {
          const candidate = {
            left: randomRange(SENSE_LABEL_AREA.minLeft, SENSE_LABEL_AREA.maxLeft),
            top: randomRange(SENSE_LABEL_AREA.minTop, SENSE_LABEL_AREA.maxTop)
          };
          const centerDistance = senseLabelDistance(candidate, center);
          const nearestDistance = placed.length
            ? Math.min(...placed.map(point => senseLabelDistance(candidate, point)))
            : Infinity;
          const edgeRoom = Math.min(
            candidate.left - SENSE_LABEL_AREA.minLeft,
            SENSE_LABEL_AREA.maxLeft - candidate.left,
            (candidate.top - SENSE_LABEL_AREA.minTop) * 0.68,
            (SENSE_LABEL_AREA.maxTop - candidate.top) * 0.68
          );
          const score = Math.min(nearestDistance, 230) + Math.min(centerDistance, 190) * 0.35 + edgeRoom * 0.16 + Math.random() * 22;

          if (centerDistance >= SENSE_LABEL_AREA.minCenterDistance && nearestDistance >= minPairDistance) {
            return candidate;
          }
          if (score > bestScore) {
            best = candidate;
            bestScore = score;
          }
        }

        return best || center;
      }

      function createSenseLabelLayout() {
        const anchors = [...SENSE_LABEL_ANCHORS].sort(() => Math.random() - 0.5);
        const placed = anchors.map(anchor => ({
          left: clamp(anchor.left + randomRange(-26, 26), SENSE_LABEL_AREA.minLeft, SENSE_LABEL_AREA.maxLeft),
          top: clamp(anchor.top + randomRange(-28, 28), SENSE_LABEL_AREA.minTop, SENSE_LABEL_AREA.maxTop)
        }));
        return placed.map(position => ({
          left: position.left,
          top: position.top,
          scale: randomRange(0.84, 1.12),
          coreOpacity: randomRange(0.78, 0.94),
          effectOpacity: randomRange(0.62, 0.88)
        }));
      }

      function recordBaseVisual(record) {
        const noise = recordNoise(record);
        const flux = recordFlux(record);
        const peak = clamp(Number(record.peak ?? 0.18), 0, 1);
        const movement = recordMove(record);
        const slot = recordSlot(record);
        const sv = getSV(record);
        const snd = getSoundV(record);
        const legacyTex = getTexMod(record);
        const legacyWarmth = clamp(((legacyTex.warmth ?? 0) - (legacyTex.dryness ?? 0) * 0.35) * 0.035, -0.035, 0.035);
        const flowNorm = clamp(((sv.flow ?? 0) + 1) / 2, 0, 1);
        const soundLoudness = clamp(snd.loudness ?? noise, 0, 1);
        const soundTurbulence = clamp(snd.turbulence ?? flux, 0, 1);
        const soundSharpness = clamp(snd.sharpness ?? 0.3, 0, 1);
        const soundContinuity = clamp(snd.continuity ?? 0.8, 0, 1);
        const soundTexture = clamp(snd.texture ?? 0.3, 0, 1);
        const loudnessBias = clamp((soundLoudness - 0.45) * 0.16, -0.055, 0.095);
        const turbulenceBias = clamp((soundTurbulence - 0.20) * 0.22, -0.09, 0.13);
        const flowBase = movement === "passing"
          ? 0.72 + flowNorm * 0.26
          : movement === "slow"
            ? 0.48 + flowNorm * 0.24
            : 0.15 + flowNorm * 0.10;
        const flowStrength = clamp((flowBase + clamp((snd.turbulence - 0.20) * 0.22, 0, 0.12)) * clamp(Number(record.trustScore ?? 1), 0.45, 1), 0.05, 1);
        const activeSlot = slot === "day" ? 0.08 : slot === "evening" ? 0.02 : slot === "night" ? -0.12 : -0.03;
        const movementFlux = movement === "passing" ? 0.08 : movement === "slow" ? 0.03 : -0.02;
        const movementSpread = movement === "passing" ? 0.08 : movement === "slow" ? 0.03 : -0.02;
        return {
          strength: clamp(0.04 + noise * 0.38 + peak * 0.16 + loudnessBias + (movement === "still" ? 0.03 : 0), 0.04, VISUAL_LIMITS.strength),
          flux: clamp(flux + movementFlux + (sv.flow ?? 0) * 0.10 + turbulenceBias, 0, VISUAL_LIMITS.flux),
          contrast: clamp(flux * 0.2 + peak * 0.14 + soundTurbulence * 0.075 + (noise > 0.65 ? 0.04 : 0), 0, VISUAL_LIMITS.contrast),
          warmth: clamp(activeSlot + (noise - 0.5) * 0.08 + legacyWarmth, -0.35, 0.35),
          spread: clamp(0.9 + noise * 0.16 + movementSpread + sv.spaciousness * 0.18 + (soundContinuity - 0.8) * 0.05, 0.65, 1.35),
          boundary: clamp(flux * 0.16 + (movement === "passing" ? 0.04 : 0) + Math.max(0, sv.flow ?? 0) * 0.035 + soundSharpness * 0.026, 0, VISUAL_LIMITS.boundaryAlpha),
          breathSpeed: clamp(1 - flux * 0.08 + (slot === "night" ? -0.06 : 0), 0.65, 1.2),
          radiusBias: clamp((noise - 0.45) * 0.18 + peak * 0.08, -0.16, 0.28),
          heightBias: clamp((noise - 0.45) * 16 + peak * 8, -12, 18),
          senseSpacious: sv.spaciousness,
          senseGravity:  sv.gravity,
          senseTension:  sv.tension ?? 0,
          senseFlow:     sv.flow ?? 0,
          flowStrength,
          flowPersistence: clamp(flowStrength * (0.35 + Math.max(0, sv.flow ?? 0) * 0.45), 0, 1),
          soundLoudness,
          soundTurbulence,
          soundSharpness,
          soundContinuity,
          soundTexture,
          edgeHardness: clamp((soundSharpness - 0.30) * 0.38, -0.10, 0.22),
        };
      }

      function mixColorInto(color, target, amount) {
        const t = clamp(amount, 0, 1);
        color.r = Math.round(color.r + (target.r - color.r) * t);
        color.g = Math.round(color.g + (target.g - color.g) * t);
        color.b = Math.round(color.b + (target.b - color.b) * t);
        return color;
      }

      function getDotAlpha(params) {
        const s = clamp(params.strength, 0, 1);
        const c = clamp(params.contrast, 0, 1);
        const b = clamp(params.boundary, 0, 1);
        const f = clamp(params.flux, 0, 1);
        const e = clamp(params.edgeHardness ?? 0, -0.16, 0.24);
        const sExp = clamp(0.95 + e * 0.9, 0.78, 1.20);
        const cExp = clamp(0.92 + e * 0.6, 0.78, 1.10);
        if (s < GRID_VISUAL.strengthCutoff) {
          const voidAlpha = clamp(0.016 + c * 0.038 - Math.max(0, e) * 0.012, GRID_VISUAL.minAlpha, 0.058);
          return voidAlpha;
        }
        return clamp(
          0.030 +
          Math.pow(s, sExp) * 0.70 +
          Math.pow(c, cExp) * 0.20 +
          Math.pow(b, 1.05) * 0.16 +
          Math.pow(f, 1.2) * 0.10,
          GRID_VISUAL.minAlpha,
          GRID_VISUAL.maxAlpha
        );
      }

      function getDotRadius(params) {
        const s = clamp(params.strength, 0, 1);
        const f = clamp(params.flux, 0, 1);
        const b = clamp(params.boundary, 0, 1);
        const _sp = params.senseSpacious ?? 0;
        const spBias = _sp >= 0
          ? clamp(-_sp * 0.55, -0.55, 0)
          : clamp(-_sp * 2.8, 0, 2.8);
        // loose(t=-1)→bigger; tense(t=+1)→slightly smaller
        const tBias = clamp(-(params.senseTension ?? 0) * 0.8, -0.3, 0.8);
        return clamp(
          DOT_DENSITY_VISUAL.baseRadiusPx +
          Math.pow(s, 1.0) * 1.85 +
          Math.pow(f, 1.4) * 0.22 +
          b * 0.12 +
          (params.radiusBias || 0) +
          spBias + tBias,
          DOT_DENSITY_VISUAL.minRadiusPx,
          DOT_DENSITY_VISUAL.maxRadiusPx
        );
      }

      function getDotColor(params, out = { r: 0, g: 0, b: 0 }) {
        const s = clamp(params.strength, 0, 1);
        const sp = clamp(params.senseSpacious ?? 0, -1, 1);
        const g = clamp(params.senseGravity ?? 0, -1, 1);
        const t = clamp(params.senseTension ?? 0, -1, 1);
        const fl = clamp(params.senseFlow ?? 0, -1, 1);
        const loud = clamp(params.soundLoudness ?? 0.18, 0, 1);
        const turbulence = clamp(params.soundTurbulence ?? 0.08, 0, 1);
        const sharp = clamp(params.soundSharpness ?? 0.30, 0, 1);
        const continuity = clamp(params.soundContinuity ?? 0.80, 0, 1);
        const texture = clamp(params.soundTexture ?? 0.30, 0, 1);
        const micro = clamp(params.colorMicro ?? 0, -1, 1);
        const grain = clamp(params.soundGrain ?? 0, -1, 1);
        const localContrast = clamp(params.localContrast ?? 0, 0, 1);
        const timeWarmth = clamp(params.warmth ?? 0, -0.35, 0.35);
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

        // 冷暖方向互斥：heatBias > 0 暖色赢，< 0 冷色赢；双方不再同时满载
        const heatBias = clamp(
          (Math.max(0, -sp) + Math.max(0, g) * 1.2) * 0.45
          - (Math.max(0, sp) + Math.max(0, -g)) * 0.45
          + timeWarmth * 0.65
        , -1, 1);
        const coldScale = clamp((-heatBias + 0.18) / 0.68, 0, 1);
        const warmScale = clamp(( heatBias + 0.18) / 0.68, 0, 1);

        const silverRaw     = (-g) * 0.310 + sharp * 0.120 + Math.max(0, sp) * 0.090 + loud * 0.080;
        const coolRaw       = Math.max(0, sp) * 0.240 + Math.max(0, -g) * 0.280 + sharp * 0.100 + Math.max(0, -timeWarmth) * 0.110;
        const cyanRaw       = Math.max(0, sp) * 0.180 + turbulence * 0.072 + Math.max(0, -timeWarmth) * 0.185 + texture * 0.068;
        const warmRaw       = Math.max(0, -sp) * 0.190 + Math.max(0, g) * 0.240 + Math.max(0, timeWarmth) * 0.310;
        const amberRaw      = Math.max(0, timeWarmth) * 0.320 + loud * 0.110 + localContrast * 0.120;
        const rustRaw       = Math.max(0, g) * 0.280 + turbulence * 0.150 + localContrast * 0.110;
        const purpleRaw     = Math.max(0, g) * Math.max(0, -sp) * 0.160 + (1 - continuity) * 0.110;
        const redBrownRaw   = Math.max(0, g) * turbulence * 0.220 + Math.max(0, timeWarmth) * Math.max(0, g) * 0.180;

        const silverAmount   = clamp(silverRaw   * coldScale, 0, 0.60);
        const coolAmount     = clamp(coolRaw     * coldScale, 0, 0.62);
        const cyanAmount     = clamp(cyanRaw     * coldScale, 0, 0.52);
        const warmAmount     = clamp(warmRaw     * warmScale, 0, 0.60);
        const amberAmount    = clamp(amberRaw    * warmScale, 0, 0.52);
        const rustAmount     = clamp(rustRaw     * warmScale, 0, 0.50);
        const purpleAmount   = clamp(purpleRaw   * warmScale, 0, 0.30);
        const redBrownAmount = clamp(redBrownRaw * warmScale, 0, 0.36);
        const darkAmount     = clamp(Math.max(0, g) * 0.035 + (1 - s) * 0.045 - loud * 0.060, 0, 0.10);

        mixColorInto(color, GRID_VISUAL.colors.cold, coolAmount);
        mixColorInto(color, GRID_VISUAL.colors.cyanGray, cyanAmount);
        mixColorInto(color, GRID_VISUAL.colors.silver, silverAmount);
        mixColorInto(color, GRID_VISUAL.colors.warm, warmAmount);
        mixColorInto(color, GRID_VISUAL.colors.amberGray, amberAmount);
        mixColorInto(color, GRID_VISUAL.colors.rust, rustAmount);
        mixColorInto(color, GRID_VISUAL.colors.purpleGray, purpleAmount);
        mixColorInto(color, GRID_VISUAL.colors.redBrown, redBrownAmount);
        mixColorInto(color, GRID_VISUAL.colors.blueBlack, darkAmount);

        // 感知轴组合色加权：非线性放大，组合越强权重越高
        const comboDenseHeavy    = Math.max(0, -sp) * Math.max(0,  g);  // 密集+沉重 → stoneBlue
        const comboSpaciousLight = Math.max(0,  sp) * Math.max(0, -g);  // 空旷+轻盈 → mossTeal
        const comboOpenHeavy     = Math.max(0,  sp) * Math.max(0,  g);  // 空旷+沉重 → concreteBlue
        const comboTenseDense    = Math.max(0,  t)  * Math.max(0, -sp); // 绷紧+密集 → indigoNight
        const comboTenseOpen     = Math.max(0,  t)  * Math.max(0,  sp); // 绷紧+空旷 → hazeWhite
        const comboReleasedOpen  = Math.max(0, -t)  * Math.max(0,  sp); // 松开+空旷 → dustGray
        const comboReleasedHeavy = Math.max(0, -t)  * Math.max(0,  g);  // 松开+沉重 → oliveAsh
        const comboLooseDense    = Math.max(0, -t)  * Math.max(0, -sp); // 松开+密集 → warmEarth
        const comboFlowDense     = Math.max(0,  fl) * Math.max(0, -sp); // 流动+密集 → flowSlate
        const comboStillDense    = Math.max(0, -fl) * Math.max(0, -sp); // 静止+密集 → stoneBlue
        const comboLoudOpen      = clamp((loud - 0.45) / 0.55, 0, 1) * Math.max(0,  sp); // 嘈杂+空旷 → amberGray
        const comboQuietHeavy    = clamp((0.45 - loud) / 0.45, 0, 1) * Math.max(0,  g);  // 安静+沉重 → indigoNight
        const cw = v => Math.pow(clamp(v, 0, 1), 0.4); // 弱组合保持克制，强组合明显放大
        mixColorInto(color, GRID_VISUAL.colors.stoneBlue,   clamp(cw(comboDenseHeavy)    * 0.70, 0, 0.70));
        mixColorInto(color, GRID_VISUAL.colors.mossTeal,    clamp(cw(comboSpaciousLight) * 0.76, 0, 0.76));
        mixColorInto(color, GRID_VISUAL.colors.concreteBlue,clamp(cw(comboOpenHeavy)     * 0.54, 0, 0.54));
        mixColorInto(color, GRID_VISUAL.colors.indigoNight, clamp(cw(comboTenseDense)    * 0.58, 0, 0.58));
        mixColorInto(color, GRID_VISUAL.colors.hazeWhite,   clamp(cw(comboTenseOpen)     * 0.48, 0, 0.48));
        mixColorInto(color, GRID_VISUAL.colors.dustGray,    clamp(cw(comboReleasedOpen)  * 0.42, 0, 0.42));
        mixColorInto(color, GRID_VISUAL.colors.oliveAsh,    clamp(cw(comboReleasedHeavy) * 0.50, 0, 0.50));
        mixColorInto(color, GRID_VISUAL.colors.warmEarth,   clamp(cw(comboLooseDense)    * 0.52, 0, 0.52));
        mixColorInto(color, GRID_VISUAL.colors.flowSlate,   clamp(cw(comboFlowDense)     * 0.52, 0, 0.52));
        mixColorInto(color, GRID_VISUAL.colors.stoneBlue,   clamp(cw(comboStillDense)    * 0.48, 0, 0.48));
        mixColorInto(color, GRID_VISUAL.colors.amberGray,   clamp(cw(comboLoudOpen)      * 0.56, 0, 0.56));
        mixColorInto(color, GRID_VISUAL.colors.indigoNight, clamp(cw(comboQuietHeavy)    * 0.50, 0, 0.50));

        const varianceAmount = clamp(0.082 - t * 0.092 + turbulence * 0.045 + texture * 0.034, 0.004, 0.285);
        const soundFragment = clamp(1.08 - continuity * 0.22, 0.86, 1.08);
        const chromaShift = clamp((micro * varianceAmount + grain * texture * 0.052) * soundFragment, -0.295, 0.320);
        const warmMicroTarget = chromaShift > 0 && g > 0.45 ? GRID_VISUAL.colors.rust : GRID_VISUAL.colors.amberGray;
        const coolMicroTarget = sharp > 0.55 ? GRID_VISUAL.colors.silver : GRID_VISUAL.colors.cyanGray;
        mixColorInto(color, chromaShift < 0 ? coolMicroTarget : warmMicroTarget, Math.abs(chromaShift));
        const brightnessMicro = clamp(micro * varianceAmount * 1.18 + grain * turbulence * 0.030 + loud * 0.030, -0.170, 0.230);
        mixColorInto(color, brightnessMicro < 0 ? GRID_VISUAL.colors.void : GRID_VISUAL.colors.bright, Math.abs(brightnessMicro));
        return color;
      }

      function getDotHeight(params) {
        const g  = clamp(params.senseGravity  ?? 0, -1, 1);
        const sp = clamp(params.senseSpacious ?? 0, -1, 1);
        const base = 60 + Math.pow(clamp(params.strength, 0, 1), 1.25) * 5;
        // 沉重(g=+1)→贴地(×0.15 min)  轻盈(g=-1)→浮起(×2.73 max)
        const gFactor  = clamp(1 - g  * 1.20,  0.15, 2.73);
        // 密集(sp=-1)→下沉(×0.45 min)  空旷(sp=+1)→浮起(×1.50 max)
        const spFactor = clamp(1 + sp * 0.50,  0.45, 1.50);
        return clamp(base * gFactor * spFactor, 4, 160);
      }

      function temporalWeight(record, visual = null) {
        if (state.view !== "world") return 1;
        const date = new Date(recordTime(record));
        const hour = Number.isFinite(record.hour) ? record.hour : date.getUTCHours();
        const day = Math.floor((date.getTime() - Date.UTC(2026, 4, 4)) / 86400000);
        const selectedHour = state.selectedHour;
        const hourDiff = Math.min(Math.abs(hour - selectedHour), 24 - Math.abs(hour - selectedHour));
        const hourSigma = 1.55 + (visual?.flowPersistence || 0) * 0.55;
        const hourWeight = Math.exp(-(hourDiff * hourDiff) / (2 * hourSigma * hourSigma));
        const dayWeight = 1.0;
        const threeDayWeight = day >= 4 ? 1 : 0.45;
        const weekWeight = 1;
        const monthWeight = 0.55;
        const a = state.aggregation;
        return a.hour * hourWeight + a.day * dayWeight + a.threeDay * threeDayWeight + a.week * weekWeight + a.month * monthWeight;
      }

      function showToast(message) {
        toast.textContent = message;
        toast.classList.add("active");
        clearTimeout(showToast.timer);
        showToast.timer = setTimeout(() => toast.classList.remove("active"), 3600);
      }

      function initRealMap() {
        if (!window.maplibregl || !realMap) {
          showToast("地図エンジンを読み込めません。簡易表示に切り替えます。");
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
            layers: [
              {
                id: "aerial-base",
                type: "raster",
                source: "aerial",
                paint: {
                  "raster-opacity": 0.95,
                  "raster-brightness-min": 0,
                  "raster-brightness-max": 1,
                  "raster-contrast": 0.18,
                  "raster-saturation": -0.72
                }
              }
            ]
          },
          center: MAP_VIEW.center,
          zoom: MAP_VIEW.zoom,
          minZoom: 11,
          maxZoom: 17,
          bearing: MAP_VIEW.bearing,
          pitch: MAP_VIEW.pitch,
          maxPitch: 60,
          attributionControl: false,
          interactive: true,
          dragPan: true,
          scrollZoom: true,
          boxZoom: false,
          touchZoomRotate: true,
          dragRotate: true,
          keyboard: true,
          doubleClickZoom: true
        });
        state.map.dragPan.enable();
        state.map.scrollZoom.enable();
        state.map.doubleClickZoom.enable();
        state.map.touchZoomRotate.enable();
        state.map.touchZoomRotate.enableRotation();
        state.map.dragRotate.enable();
        state.map.keyboard.enable();
        state.map.on("load", () => {
          state.mapReady = true;
          app.classList.add("map-ready");
          const initPos = state.position;
          state.map.jumpTo(initPos
            ? { center: [initPos.lng, initPos.lat], zoom: 14.1, pitch: DEFAULT_VIEW.pitch, bearing: DEFAULT_VIEW.bearing }
            : DEFAULT_VIEW);
          applyMapVisualMode();
          applyMapLevel();
          invalidateField(true);
          scheduleViewportWorldRefresh(120);
          const launch = document.getElementById("launchScreen");
          if (launch) {
            // 05 prototype: 00→01 0.5s, 01→02a 1s, 02a→02b 0.2s, hold 0.8s, then dissolve.
            const minHold = 2500;
            const delay = Math.max(minHold - (Date.now() - _bootAt), 600);
            setTimeout(() => {
              launch.classList.add("fade-out");
              launch.addEventListener("transitionend", () => launch.classList.add("hidden"), { once: true });
            }, delay);
          }
        });
        const handleMapFrameChange = () => {
          applyMapLevel();
          requestRender();
        };
        ["move", "zoom", "rotate", "pitch"].forEach(eventName => {
          state.map.on(eventName, handleMapFrameChange);
        });
        state.map.on("zoomend", () => { applyMapVisualMode(); startFieldTransition(); scheduleViewportWorldRefresh(); });
        ["moveend", "rotateend", "pitchend"].forEach(eventName => {
          state.map.on(eventName, () => { invalidateField(false); scheduleViewportWorldRefresh(); });
        });
        state.map.on("resize", () => requestRender());
      }

      function syncMapToActiveCenter(animate = true) {
        if (!state.mapReady) return;
        const center = activeOrigin();
        const useDefaultWorldView = state.view === "world" && !state.position;
        const options = useDefaultWorldView
          ? { ...DEFAULT_VIEW }
          : { center: [center.lng, center.lat], zoom: 14.1, pitch: DEFAULT_VIEW.pitch, bearing: DEFAULT_VIEW.bearing };
        if (animate) state.map.easeTo({ ...options, duration: 650 });
        else state.map.jumpTo(options);
        invalidateField(true);
        scheduleViewportWorldRefresh();
      }

      function centerMapOnCurrentPosition(animate = true) {
        if (!state.mapReady || !state.position) return;
        const options = {
          center: [state.position.lng, state.position.lat],
          zoom: 14.1,
          pitch: DEFAULT_VIEW.pitch,
          bearing: DEFAULT_VIEW.bearing
        };
        if (animate) state.map.easeTo({ ...options, duration: 650 });
        else state.map.jumpTo(options);
        invalidateField(true);
        scheduleViewportWorldRefresh();
      }

      function centerMapOnPersonalCenter(animate = true) {
        if (!state.mapReady) return;
        const center = personalCenter();
        const options = {
          center: [center.lng, center.lat],
          zoom: 14.1,
          pitch: state.map.getPitch(),
          bearing: state.map.getBearing()
        };
        if (animate) state.map.easeTo({ ...options, duration: 650 });
        else state.map.jumpTo(options);
        invalidateField(true);
        scheduleViewportWorldRefresh();
      }

      function resetMapDirection() {
        if (!state.mapReady) return;
        state.map.jumpTo({ bearing: 0 });
        invalidateField(false);
        showToast("向きを正面に戻しました。");
      }

      function resetMapView() {
        if (!state.mapReady) return;
        const center = state.position || activeOrigin();
        const options = {
          center: [center.lng, center.lat],
          zoom: 14.1,
          pitch: DEFAULT_VIEW.pitch,
          bearing: DEFAULT_VIEW.bearing
        };
        state.map.easeTo({ ...options, duration: 520 });
        invalidateField(false);
        showToast("表示を初期位置に戻しました。");
      }

      function getSkinZoomLevel(zoom) {
        if (zoom < ZOOM_LEVELS.area.min) return "region";
        if (zoom < ZOOM_LEVELS.neighborhood.min) return "area";
        if (zoom < ZOOM_LEVELS.street.min) return "neighborhood";
        if (zoom < ZOOM_LEVELS.detail.min) return "street";
        return "detail";
      }

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function smoothstep(edge0, edge1, x) {
        const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
      }

      function getDaylightState(hour) {
        if (hour >= 23 || hour < 4) return "deepNight";
        if (hour >= 4 && hour < 7) return "dawn";
        if (hour >= 7 && hour < 16.5) return "day";
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
          daylight,
          state: getDaylightState(hour)
        };
        const dusk = smoothstep(16.5, 19.5, hour);
        if (dusk > 0 && hour < 19.5) {
          base.brightness *= lerp(1, 0.92, dusk);
          base.overlayDarkness = lerp(base.overlayDarkness, 0.40, dusk * 0.65);
        }
        return base;
      }

      function getZoomLightAmount(zoom) {
        const t = clamp((zoom - 12.0) / (17.0 - 12.0), 0, 1);
        return smoothstep(0, 1, t);
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
        if (zoom <= anchors[0].zoom) {
          return { ...ZOOM_VISUAL_PRESETS[anchors[0].preset], level: getSkinZoomLevel(zoom) };
        }
        if (zoom >= anchors[anchors.length - 1].zoom) {
          return { ...ZOOM_VISUAL_PRESETS[anchors[anchors.length - 1].preset], level: getSkinZoomLevel(zoom) };
        }
        let i = 0;
        while (i < anchors.length - 2 && zoom > anchors[i + 1].zoom) i++;
        const a = anchors[i];
        const b = anchors[i + 1];
        const t = smoothstep(a.zoom, b.zoom, zoom);
        return interpolateZoomPreset(ZOOM_VISUAL_PRESETS[a.preset], ZOOM_VISUAL_PRESETS[b.preset], t, zoom);
      }

      function currentMapLevel() {
        return getSkinZoomLevel(state.mapReady ? state.map.getZoom() : DEFAULT_VIEW.zoom);
      }

      function applyMapLevel() {
        if (!state.mapReady || !state.map.getLayer("aerial-base")) return;
        const level = currentMapLevel();
        if (state.mapLevel === level) return;
        state.mapLevel = level;
        applyMapVisualMode();
      }

      function getMapEdgeOpacityByZoom(zoom) {
        if (zoom < 12.5) return 0.18;
        if (zoom < 14) return 0.26;
        if (zoom < 15.5) return 0.34;
        return 0.42;
      }

      function applyMapVisualMode() {
        if (!realMap) return;
        const visual = MAP_VISUAL_MODES[state.mapVisualMode] || MAP_VISUAL_MODES.balanced;
        const timeVisual = getMapVisualByHour(state.selectedHour);
        const currentZoom = state.mapReady ? state.map.getZoom() : DEFAULT_VIEW.zoom;
        const zoomMod = getZoomVisualModifier(currentZoom);

        const finalBrightness = visual.tileBrightness * timeVisual.brightness * zoomMod.brightnessMul;
        const finalContrast   = visual.tileContrast * timeVisual.contrast;
        const finalSaturation = visual.tileSaturation * timeVisual.saturation;
        const finalOpacity    = timeVisual.opacity * zoomMod.opacityMul;
        const finalOverlay    = clamp(timeVisual.overlayDarkness + zoomMod.overlayAdd, 0.18, 0.58);

        realMap.style.filter = `brightness(${finalBrightness.toFixed(3)}) contrast(${finalContrast.toFixed(3)}) saturate(${finalSaturation.toFixed(3)})`;
        realMap.style.opacity = finalOpacity.toFixed(3);
        document.documentElement.style.setProperty("--map-overlay-darkness", finalOverlay.toFixed(3));

        if (!state.mapReady || !state.map.getLayer("aerial-base")) return;
        const preset = getContinuousZoomPreset();
        const edge = getMapEdgeOpacityByZoom(currentZoom) * visual.edgeBoost;
        state.map.setPaintProperty("aerial-base", "raster-opacity",          clamp(visual.baseOpacity * finalOpacity, 0.48, 0.90));
        state.map.setPaintProperty("aerial-base", "raster-brightness-max",   1);
        state.map.setPaintProperty("aerial-base", "raster-contrast",         preset.rasterContrastBase + edge * 0.10);
      }

      function updateAppScale() {
        const baseWidth = 393;
        const baseHeight = 852;
        const viewportWidth = window.visualViewport?.width || window.innerWidth || baseWidth;
        const viewportHeight = window.visualViewport?.height || window.innerHeight || baseHeight;
        const scale = Math.min(viewportHeight / baseHeight, viewportWidth / baseWidth);
        const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
        document.documentElement.style.setProperty("--app-scale", safeScale.toFixed(4));
        document.documentElement.style.setProperty("--app-frame-w", `${(baseWidth * safeScale).toFixed(2)}px`);
        document.documentElement.style.setProperty("--app-frame-h", `${(baseHeight * safeScale).toFixed(2)}px`);
      }

      function resizeCanvas() {
        state.dpr = Math.min(window.devicePixelRatio || 1, 2);
        state.width = Math.floor(app.clientWidth || 393);
        state.height = Math.floor(app.clientHeight || 852);
        canvas.width = Math.floor(state.width * state.dpr);
        canvas.height = Math.floor(state.height * state.dpr);
        canvas.style.width = state.width + "px";
        canvas.style.height = state.height + "px";
        ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
        state.renderHandle = null;
        if (state.mapReady) state.map.resize();
        rebuildGrids();
        requestRender();
      }

      function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
      }

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

      function screenFlowDirectionForRecord(record, origin) {
        const fallbackAngle = stableSignedNoise(record.mx / 220, record.my / 220, 19) * Math.PI;
        const moving = record.movement === "passing" || record.movement === "slow";
        const v = directionToMeters(moving ? record.direction : null, fallbackAngle);
        const from = metersToLatLng(record.mx, record.my, origin);
        const to = metersToLatLng(record.mx + v.dx * 28, record.my + v.dy * 28, origin);
        const a = state.mapReady ? state.map.project([from.lng, from.lat]) : project(from, origin);
        const b = state.mapReady ? state.map.project([to.lng, to.lat]) : project(to, origin);
        return normalizeVector(b.x - a.x, b.y - a.y);
      }

      function haversine(a, b) {
        const R = 6371000;
        const dLat = (b.lat - a.lat) * Math.PI / 180;
        const dLng = (b.lng - a.lng) * Math.PI / 180;
        const lat1 = a.lat * Math.PI / 180;
        const lat2 = b.lat * Math.PI / 180;
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
      }

      function distanceMeters(a, b) {
        return haversine({ lat: a.lat, lng: a.lng }, { lat: b.lat, lng: b.lng });
      }

      function getMetersPerScreenPixels(pixels = DOT_DENSITY_VISUAL.targetScreenSpacingPx) {
        if (!state.mapReady || !state.map) {
          return pixels * 14;
        }
        const center = state.map.getCenter();
        const p0 = state.map.project([center.lng, center.lat]);
        const p1 = { x: p0.x + pixels, y: p0.y };
        const ll1 = state.map.unproject([p1.x, p1.y]);
        const meters = distanceMeters(
          { lng: center.lng, lat: center.lat },
          { lng: ll1.lng, lat: ll1.lat }
        );
        return Number.isFinite(meters) && meters > 0 ? meters : pixels * 14;
      }

      function getStableDotSpacingMeters() {
        const meters = getMetersPerScreenPixels(DOT_DENSITY_VISUAL.targetScreenSpacingPx);
        return clamp(meters, 18, 180);
      }

      function mapScaleAt(origin) {
        if (!state.mapReady) return null;
        const here = state.map.project([origin.lng, origin.lat]);
        const east = metersToLatLng(1000, 0, origin);
        const there = state.map.project([east.lng, east.lat]);
        return Math.max(0.001, Math.hypot(there.x - here.x, there.y - here.y) / 1000);
      }

      function project(pos, origin = activeOrigin()) {
        if (state.mapReady) {
          const point = state.map.project([pos.lng, pos.lat]);
          return {
            x: point.x,
            y: point.y,
            scale: mapScaleAt(origin)
          };
        }
        const latMeters = (pos.lat - origin.lat) * 111320;
        const lngMeters = (pos.lng - origin.lng) * 111320 * Math.cos(origin.lat * Math.PI / 180);
        const usable = Math.min(state.width, state.height - 140) * 0.42;
        const scale = usable / RADIUS_METERS * state.zoom;
        return {
          x: state.width / 2 + lngMeters * scale + state.centerOffset.x,
          y: state.height / 2 - 18 - latMeters * scale + state.centerOffset.y,
          scale
        };
      }

      function unprojectCell(x, y, scale, origin = activeOrigin()) {
        if (state.mapReady) {
          const lngLat = state.map.unproject([x, y]);
          return latLngToMeters({ lat: lngLat.lat, lng: lngLat.lng }, origin);
        }
        const dx = (x - state.width / 2 - state.centerOffset.x) / scale;
        const dy = -(y - (state.height / 2 - 18) - state.centerOffset.y) / scale;
        return { dx, dy };
      }

      async function initAudio() {
        if (state.audioReady) return;
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const audioCtx = new AudioContext();
          if (audioCtx.state === "suspended") {
            await audioCtx.resume().catch(() => {});
          }
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.82;
          source.connect(analyser);
          state.analyser = analyser;
          state.freq = new Uint8Array(analyser.frequencyBinCount);
          state.audioReady = true;
          state.audioMode = "mic";
        } catch {
          state.audioReady = true;
          state.audioMode = "fallback";
          showToast("マイクを使えないため、仮の音で記録します。");
        }
      }

      function updateAudio() {
        if (state.audioMode === "mic" && state.analyser) {
          state.analyser.getByteFrequencyData(state.freq);
          let sum = 0;
          let peak = 0;
          for (let i = 0; i < state.freq.length; i++) {
            sum += state.freq[i];
            peak = Math.max(peak, state.freq[i]);
          }
          state.volume = sum / state.freq.length / 255;
          state.peak = peak / 255;
        } else {
          const base = 0.13 + Math.sin(state.t * 0.7) * 0.04 + Math.random() * 0.03;
          const pulse = Math.random() > 0.965 ? 0.42 : 0;
          state.volume = clamp(base + pulse, 0, 1);
          state.peak = clamp(base + pulse * 1.45, 0, 1);
          for (let i = 0; i < state.freq.length; i++) {
            const wave = Math.sin(i * 0.18 + state.t * 2.1) * 22;
            state.freq[i] = clamp((state.volume * 210) + wave + Math.random() * 18, 0, 255);
          }
        }
      }

      function initLocation() {
        if (!navigator.geolocation) {
          showToast("位置情報を使えません。東京都付近を表示します。");
          return;
        }
        navigator.geolocation.getCurrentPosition(
          pos => {
            state.position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            state.heading = Number.isFinite(pos.coords.heading) ? pos.coords.heading : state.heading;
            state.origin = state.position;
            centerMapOnCurrentPosition(false);
            rebuildGrids();
          },
          () => {
            showToast("位置情報を使えません。東京都付近を表示します。");
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
        );
        navigator.geolocation.watchPosition(
          pos => {
            state.position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            state.heading = Number.isFinite(pos.coords.heading) ? pos.coords.heading : state.heading;
            state.origin = state.position;
            if (state.recording) state.path.push({ ...state.position, at: Date.now() });
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 3000 }
        );
      }

      function currentPositionWithDrift() {
        const base = state.position || state.origin;
        return {
          lat: base.lat + (Math.random() - 0.5) * 0.00008,
          lng: base.lng + (Math.random() - 0.5) * 0.00008
        };
      }

      function timeSlot(date = new Date()) {
        const hour = date.getHours();
        if (hour >= 5 && hour < 11) return "morning";
        if (hour >= 11 && hour < 17) return "day";
        if (hour >= 17 && hour < 22) return "evening";
        return "night";
      }

      function movementFromPath(path) {
        if (path.length < 2) return { type: "still", distance: 0, speed: 0, angle: 0 };
        const first = path[0];
        const last = path[path.length - 1];
        const distance = haversine(first, last);
        const seconds = Math.max(1, (last.at - first.at) / 1000);
        const speed = distance / seconds;
        const angle = Math.atan2(last.lat - first.lat, last.lng - first.lng);
        if (speed < 0.35) return { type: "still", distance, speed, angle };
        if (speed < 1.4) return { type: "slow", distance, speed, angle };
        return { type: "passing", distance, speed, angle };
      }

      async function startRecording(event) {
        event.preventDefault();
        if (state.view !== "sense") return;
        if (state.recording) return;
        const token = ++state.pressToken;
        state.pressPointerId = Number.isFinite(event.pointerId) ? event.pointerId : null;
        if (state.pressPointerId !== null && pressTarget.setPointerCapture) {
          try { pressTarget.setPointerCapture(state.pressPointerId); } catch (e) {}
        }
        if (state.senseStage !== "ready" || performance.now() < state.senseReadyAt) return;
        await initAudio();
        if (
          token !== state.pressToken ||
          state.view !== "sense" ||
          state.senseStage !== "ready" ||
          state.recording
        ) return;
        if (!state.audioReady) return;
        state.recording = true;
        state.recordStart = performance.now();
        state.samples = [];
        state.path = [{ ...(state.position || state.origin), at: Date.now() }];
        state.lastBreathPhase = "";
        app.style.setProperty("--sense-breath-scale", "0.28");
        app.style.setProperty("--sense-breath-opacity", "0.92");
        setSenseStage("recording");
        pressTarget.classList.add("recording");
        safeVibrate(30);
        requestRender();
      }

      function stopRecording(event) {
        if (event) event.preventDefault();
        state.pressToken++;
        if (state.pressPointerId !== null && pressTarget.releasePointerCapture) {
          try { pressTarget.releasePointerCapture(state.pressPointerId); } catch (e) {}
        }
        state.pressPointerId = null;
        if (state.view !== "sense") {
          cancelRecording();
          return;
        }
        if (!state.recording) return;
        const elapsed = performance.now() - state.recordStart;
        if (elapsed >= DURATION) {
          completeRecording();
        } else {
          cancelRecording();
        }
      }

      function cancelRecording() {
        state.pressToken++;
        state.pressPointerId = null;
        state.recording = false;
        state.samples = [];
        pressTarget.classList.remove("recording");
        pressTarget.style.setProperty("--breath-scale", "1");
        app.style.removeProperty("--sense-breath-scale");
        app.style.removeProperty("--sense-breath-opacity");
        setSenseStage("ready");
        state.senseReadyAt = 0;
        requestRender();
      }

      function completeRecording() {
        state.pressToken++;
        state.pressPointerId = null;
        state.recording = false;
        pressTarget.classList.remove("recording");
        safeVibrate([30, 80, 30]);
        const samples = state.samples.length ? state.samples : [{ volume: state.volume, peak: state.peak }];
        const avg = samples.reduce((acc, s) => acc + s.volume, 0) / samples.length;
        const peaks = samples.map(s => s.peak);
        const flux = clamp(Math.max(...peaks) - Math.min(...samples.map(s => s.volume)), 0, 1);
        const movement = movementFromPath(state.path);
        const date = new Date();
        const pos = currentPositionWithDrift();
        state.pending = {
          id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
          lat: pos.lat,
          lng: pos.lng,
          timestamp: date.toISOString(),
          hour: date.getHours() + date.getMinutes() / 60,
          weekday: date.getDay(),
          noise: clamp(avg, 0, 1),
          noiseLevel: clamp(avg, 0, 1),
          flux: clamp(flux, 0, 1),
          turbulence: clamp(flux, 0, 1),
          peak: clamp(Math.max(...peaks), 0, 1),
          movement: movement.type,
          mobility: movement.type,
          direction: movement.angle,
          duration: DURATION / 1000,
          distance: movement.distance,
          soundVector: computeSoundVector(samples),
          word: null,
          slot: timeSlot(date),
          source: "recorded",
          trustScore: 1,
          createdAt: date.toISOString()
        };
        state.selectedWords = [];
        state.senseRound = 0;
        pressTarget.style.setProperty("--breath-scale", "1");
        app.style.setProperty("--sense-breath-scale", "0.04");
        app.style.setProperty("--sense-breath-opacity", "0");
        setSenseStage("release");
        setTimeout(openRecordModal, 600);
        requestRender();
      }

      function openRecordModal() {
        updateRecordModalStats();
        renderLabelSelect();
        setSenseStage("selecting");
        recordModal.classList.add("active");
      }

      function updateRecordModalStats() {
        if (!state.pending) return;
        const moveLabel = {
          still: "静止",
          slow: "ゆっくり",
          passing: "通過"
        }[state.pending.movement] || "静止";
        document.getElementById("modalMove").textContent = moveLabel;
      }

      function renderLabelSelect() {
        labelSelect.innerHTML = "";
        recordModal.dataset.senseRound = state.senseRound === 0 ? "first" : "second";
        recordModal.classList.add("word-enter");
        requestAnimationFrame(() => recordModal.classList.remove("word-enter"));
        const round = state.senseRound;
        const roundSpec = SENSE_PROTOTYPE_ROUNDS[round] || SENSE_PROTOTYPE_ROUNDS[0];
        const prompt = document.createElement("div");
        prompt.className = "sense-round-prompt";
        prompt.textContent = roundSpec.prompt;
        labelSelect.appendChild(prompt);
        const center = document.createElement("div");
        center.className = "sense-choice-center";
        center.setAttribute("aria-hidden", "true");
        labelSelect.appendChild(center);
        const words = pickRoundWords(state.selectedWords, round);
        const positions = createSenseLabelLayout();
        words.forEach((word, index) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `label-btn label-btn-${index + 1}`;
          const text = document.createElement("span");
          text.className = "label-text";
          text.textContent = word;
          btn.appendChild(text);
          btn.setAttribute("aria-label", word);
          btn.style.left = `${positions[index].left.toFixed(1)}px`;
          btn.style.top = `${positions[index].top.toFixed(1)}px`;
          btn.style.setProperty("--label-scale", positions[index].scale.toFixed(3));
          btn.style.setProperty("--label-core-opacity", positions[index].coreOpacity.toFixed(3));
          btn.style.setProperty("--label-effect-opacity", positions[index].effectOpacity.toFixed(3));
          btn.style.animationDelay = `${index * 140}ms`;
          btn.addEventListener("click", () => onWordSelected(word));
          labelSelect.appendChild(btn);
        });
      }

      function onWordSelected(word) {
        if (word !== null) state.selectedWords.push(word);
        const next = state.senseRound + 1;
        if (next >= SENSE_ROUNDS) { finalizeSense(); return; }
        state.senseRound = next;
        renderLabelSelect();
      }

      function finalizeSense() {
        labelSelect.innerHTML = "";
        recordModal.classList.add("complete");
        delete recordModal.dataset.senseRound;
        setSenseStage("complete");
        const done = document.createElement("div");
        done.className = "sense-round-prompt complete-prompt";
        done.textContent = "記録されました";
        labelSelect.appendChild(done);
        safeVibrate(40);
        setTimeout(savePending, 1100);
      }

      async function savePending() {
        if (!state.pending) return;
        state.pending.word = state.selectedWords[0] || null;
        state.pending.selectedWords = [...state.selectedWords];
        state.pending.senseVector    = aggregateSV(state.selectedWords);
        const record = state.pending;
        state.personalRecords.push(record);
        persistLocalPersonalRecords();
        state.pending = null;
        state.selectedWords = [];
        state.senseRound = 0;
        recordModal.classList.remove("active", "complete");
        delete recordModal.dataset.senseRound;
        refreshDerivedSurfaces();
        switchView("radius");
        saveRecord(record).catch(err => {
          console.warn("[WorldSkin] save record failed", err);
          showToast("記録の保存に失敗しました。");
        });
      }

      function discardPending() {
        state.pending = null;
        state.selectedWords = [];
        state.senseRound = 0;
        recordModal.classList.remove("active", "complete");
        delete recordModal.dataset.senseRound;
      }

      function clearSenseIntroTimers() {
        state.senseIntroTimers.forEach(clearTimeout);
        state.senseIntroTimers = [];
      }

      function setSenseStage(stage) {
        state.senseStage = stage;
        app.dataset.senseStage = stage;
      }

      function prepareSenseIntro() {
        clearSenseIntroTimers();
        labelSelect.innerHTML = "";
        recordModal.classList.remove("active", "complete", "word-enter");
        delete recordModal.dataset.senseRound;
        pressTarget.classList.remove("recording");
        pressTarget.style.setProperty("--breath-scale", "1");
        app.style.removeProperty("--sense-breath-scale");
        app.style.removeProperty("--sense-breath-opacity");
        setSenseStage("contact");
        state.senseReadyAt = performance.now() + 3000;
        state.senseIntroTimers.push(setTimeout(() => setSenseStage("ready"), 20));
      }

      function resetAppScroll() {
        app.scrollTop = 0;
        app.scrollLeft = 0;
      }

      function settleAppFrame(event) {
        if (event) {
          event.preventDefault();
          if (event.currentTarget && event.currentTarget.blur) event.currentTarget.blur();
        }
        resetAppScroll();
        requestAnimationFrame(resetAppScroll);
        setTimeout(resetAppScroll, 80);
      }

      function switchView(view, keepNavOpen = false) {
        resetAppScroll();
        const previousView = state.view;
        if (view === "share") captureShareSnapshot();
        if (!keepNavOpen || view === "sense" || view === "records" || view === "settings" || view === "share") {
          app.classList.remove("nav-open");
        }
        if (state.recording && view !== "sense") cancelRecording();
        if (view === "sense") state.prevView = previousView;
        state.view = view;
        app.dataset.view = view;
        setMarkerVisibility(markerShouldBeVisible(view));
        if (view === "sense") prepareSenseIntro();
        else if (!state.recording && !recordModal.classList.contains("active")) {
          clearSenseIntroTimers();
          setSenseStage("idle");
        }
        views.forEach(el => el.classList.toggle("active", el.dataset.view === view));
        navBtns.forEach(btn => btn.classList.toggle("active", btn.dataset.target === view));
        const hideShellAvatar = view === "sense" || view === "profile" || view === "records" || view === "settings" || view === "share";
        avatarBtn.hidden = hideShellAvatar;
        if (homeShareBtn) homeShareBtn.hidden = view !== "world" && view !== "radius";
        if (view === "world" || view === "radius") {
          applyMapVisualMode();
          if (previousView === "world" || previousView === "radius") startFieldTransition();
          else invalidateField(true);
        }
        if (view === "profile") updateProfileView();
        if (view === "settings") {
          if (settingsPage) settingsPage.scrollTop = 0;
          updateSettingsScrollbar();
        }
        if (view === "share") updateShareView();
        updateStats();
        resetAppScroll();
        requestAnimationFrame(resetAppScroll);
        requestRender();
      }



      function canNavigateMap() {
        return state.view === "world" || state.view === "radius";
      }

      function markerShouldBeVisible(view = state.view) {
        return view === "world" || view === "radius";
      }

      function setMarkerVisibility(visible, immediate = false) {
        const target = visible ? 1 : 0;
        if (immediate) {
          state.markerOpacity = target;
          state.markerTargetOpacity = target;
          state.markerFadeActive = false;
          return;
        }
        if (Math.abs(state.markerTargetOpacity - target) < 0.001 && state.markerFadeActive) return;
        if (Math.abs(state.markerOpacity - target) < 0.001) {
          state.markerOpacity = target;
          state.markerTargetOpacity = target;
          state.markerFadeActive = false;
          return;
        }
        state.markerFadeFrom = state.markerOpacity;
        state.markerTargetOpacity = target;
        state.markerFadeStartedAt = performance.now();
        state.markerFadeActive = true;
        requestRender();
      }

      function updateMarkerFade() {
        if (!state.markerFadeActive) return;
        const progress = clamp((performance.now() - state.markerFadeStartedAt) / state.markerFadeDuration, 0, 1);
        const eased = easeInOutCubic(progress);
        state.markerOpacity = state.markerFadeFrom + (state.markerTargetOpacity - state.markerFadeFrom) * eased;
        if (progress >= 1) {
          state.markerOpacity = state.markerTargetOpacity;
          state.markerFadeActive = false;
        }
      }

      function setZoom(nextZoom, anchorX = state.width / 2, anchorY = state.height / 2) {
        const oldZoom = state.zoom;
        const newZoom = clamp(nextZoom, 0.72, 2.65);
        if (Math.abs(newZoom - oldZoom) < 0.001) return;
        state.centerOffset.x = anchorX - (anchorX - state.centerOffset.x - state.width / 2) * (newZoom / oldZoom) - state.width / 2;
        state.centerOffset.y = anchorY - (anchorY - state.centerOffset.y - (state.height / 2 - 18)) * (newZoom / oldZoom) - (state.height / 2 - 18);
        state.zoom = newZoom;
        rebuildGrids();
      }

      function handleCanvasPointerDown(event) {
        if (!canNavigateMap()) return;
        canvas.setPointerCapture(event.pointerId);
        state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (state.pointers.size === 1) {
          state.dragStart = {
            x: event.clientX,
            y: event.clientY,
            offsetX: state.centerOffset.x,
            offsetY: state.centerOffset.y
          };
        } else if (state.pointers.size === 2) {
          const pts = Array.from(state.pointers.values());
          const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          state.pinchStart = { dist, zoom: state.zoom };
        }
      }

      function handleCanvasPointerMove(event) {
        if (!state.pointers.has(event.pointerId) || !canNavigateMap()) return;
        state.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (state.pointers.size === 1 && state.dragStart) {
          state.centerOffset.x = state.dragStart.offsetX + event.clientX - state.dragStart.x;
          state.centerOffset.y = state.dragStart.offsetY + event.clientY - state.dragStart.y;
        } else if (state.pointers.size === 2 && state.pinchStart) {
          const pts = Array.from(state.pointers.values());
          const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
          const anchorX = (pts[0].x + pts[1].x) / 2;
          const anchorY = (pts[0].y + pts[1].y) / 2;
          setZoom(state.pinchStart.zoom * (dist / Math.max(1, state.pinchStart.dist)), anchorX, anchorY);
        }
      }

      function handleCanvasPointerEnd(event) {
        state.pointers.delete(event.pointerId);
        if (state.pointers.size < 2) state.pinchStart = null;
        if (state.pointers.size === 0) state.dragStart = null;
      }

      function handleCanvasWheel(event) {
        if (!canNavigateMap()) return;
        event.preventDefault();
        const factor = Math.exp(-event.deltaY * 0.0012);
        setZoom(state.zoom * factor, event.clientX, event.clientY);
      }


      function drawBackground() {
        ctx.clearRect(0, 0, state.width, state.height);
        // Map-backed views keep the canvas transparent so the live map remains visible.
        if (state.mapReady) return;

        ctx.fillStyle = "#020304";
        ctx.fillRect(0, 0, state.width, state.height);

        const cx = state.width / 2;
        const cy = state.height / 2 - 18;
        const radius = Math.min(state.width, state.height - 130) * 0.43;

        const glow = ctx.createRadialGradient(cx, cy, radius * 0.06, cx, cy, radius * 1.16);
        glow.addColorStop(0, "rgba(154, 180, 184, 0.16)");
        glow.addColorStop(0.48, "rgba(31, 45, 48, 0.17)");
        glow.addColorStop(1, "rgba(2, 3, 4, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, state.width, state.height);

        ctx.filter = "none";
      }

      function rebuildGrids() {
        if (!state.width || !state.height) return;
        invalidateField(true);
      }

      function requestRender() {
        state.renderDirty = true;
        if (state.renderHandle) return;
        state.renderHandle = requestAnimationFrame(render);
      }

      function invalidateField(immediate = false) {
        state.fieldDirty = true;
        state.fieldTransition = null;
        clearTimeout(state.renderTimer);
        if (immediate) {
          requestRender();
          return;
        }
        state.renderTimer = setTimeout(requestRender, PERF.renderDebounceMs);
      }

      function gridRenderConfig() {
        const zoom = state.mapReady ? state.map.getZoom() : DEFAULT_VIEW.zoom;
        const preset = getContinuousZoomPreset(zoom);
        const baseSigma = state.view === "world" ? 88 : 66;
        const sigmaMeters = baseSigma * preset.sigmaScale;
        const dotSpacingMeters = getStableDotSpacingMeters();
        const isMobile = state.width < 768;
        const maxDots = isMobile ? DOT_DENSITY_VISUAL.maxDotsMobile : DOT_DENSITY_VISUAL.maxDotsDesktop;
        return {
          ...preset,
          level: getSkinZoomLevel(zoom),
          densityMode: DOT_DENSITY_VISUAL.densityMode,
          dotSpacingMeters,
          sigmaMeters,
          cellSize: clamp(sigmaMeters * 0.9, 96, 180),
          gain: state.view === "world" ? 0.58 : 0.72,
          influenceCutoff: GRID_VISUAL.influenceCutoff,
          maxDots,
          minDots: DOT_DENSITY_VISUAL.minDotsVisible,
          maxInfluenceDistance: preset.maxInfluenceDist
        };
      }

      function isValidLngLat(ll) {
        return ll && isFinite(ll.lng) && isFinite(ll.lat);
      }

      function viewBoundsMeters(origin) {
        if (!state.mapReady) {
          const half = RADIUS_METERS / Math.max(1, state.zoom);
          return { minX: -half, maxX: half, minY: -half, maxY: half };
        }
        const pad = 180;
        const corners = [
          [-pad, -pad],
          [state.width + pad, -pad],
          [state.width + pad, state.height + pad],
          [-pad, state.height + pad]
        ].map(([x, y]) => state.map.unproject([x, y]));
        if (!corners.every(isValidLngLat)) {
          const c = state.map.getCenter();
          const cm = latLngToMeters({ lat: c.lat, lng: c.lng }, origin);
          const fallback = 2000;
          return { minX: cm.dx - fallback, maxX: cm.dx + fallback, minY: cm.dy - fallback, maxY: cm.dy + fallback };
        }
        const points = corners.map(ll => latLngToMeters({ lat: ll.lat, lng: ll.lng }, origin));
        return {
          minX: Math.min(...points.map(p => p.dx)),
          maxX: Math.max(...points.map(p => p.dx)),
          minY: Math.min(...points.map(p => p.dy)),
          maxY: Math.max(...points.map(p => p.dy))
        };
      }

      function buildGeoGridField(records) {
        const config = gridRenderConfig();
        const origin = activeOrigin();
        const bounds = viewBoundsMeters(origin);
        const sigmaBase = config.sigmaMeters;
        const maxDistance = config.maxInfluenceDistance;
        const cellSize = config.cellSize;
        const estimatedDots = ((bounds.maxX - bounds.minX) / config.dotSpacingMeters) * ((bounds.maxY - bounds.minY) / config.dotSpacingMeters);
        let spacing = config.dotSpacingMeters;
        if (estimatedDots > config.maxDots) {
          const ratio = estimatedDots / config.maxDots;
          spacing = config.dotSpacingMeters * Math.min(Math.pow(ratio, 0.35), 1.28);
        } else if (estimatedDots > 0 && estimatedDots < config.minDots) {
          spacing = config.dotSpacingMeters * Math.sqrt(estimatedDots / config.minDots);
        }
        spacing = clamp(spacing, 16, 240);
        config.actualDotSpacingMeters = spacing;
        const visibleRecords = [];
        const recordLimit = state.testMode ? records.length : Math.min(records.length, PERF.maxVisibleRecords);
        for (let i = 0; i < recordLimit; i++) {
          const rec = records[i];
          const m = latLngToMeters(rec, origin);
          const visual = recordBaseVisual(rec);
          const tw = temporalWeight(rec, visual);
          if (
            tw <= 0.025 ||
            m.dx < bounds.minX - maxDistance ||
            m.dx > bounds.maxX + maxDistance ||
            m.dy < bounds.minY - maxDistance ||
            m.dy > bounds.maxY + maxDistance
          ) continue;
          const normalized = {
            noise: recordNoise(rec),
            flux: recordFlux(rec),
            movement: recordMove(rec),
            direction: rec.direction,
            mx: m.dx,
            my: m.dy,
            tw,
            visual
          };
          normalized.flowDir = screenFlowDirectionForRecord(normalized, origin);
          visibleRecords.push(normalized);
        }

        const bins = new Map();
        for (const rec of visibleRecords) {
          const bx = Math.floor(rec.mx / cellSize);
          const by = Math.floor(rec.my / cellSize);
          const key = fieldKey(bx, by);
          if (!bins.has(key)) bins.set(key, []);
          bins.get(key).push(rec);
        }

        const cells = [];
        const startX = Math.floor(bounds.minX / spacing) * spacing;
        const endX = Math.ceil(bounds.maxX / spacing) * spacing;
        const startY = Math.floor(bounds.minY / spacing) * spacing;
        const endY = Math.ceil(bounds.maxY / spacing) * spacing;
        let row = 0;
        for (let my = startY; my <= endY; my += spacing, row++) {
          let col = 0;
          for (let mx = startX; mx <= endX; mx += spacing, col++) {
            const ll = metersToLatLng(mx, my, origin);
            const p = state.mapReady ? state.map.project([ll.lng, ll.lat]) : project(ll, origin);
            if (p.x < -120 || p.x > state.width + 120 || p.y < -140 || p.y > state.height + 140) continue;
            let sum = 0;
            let strength = 0;
            let flux = 0;
            let contrast = 0;
            let warmth = 0;
            let boundary = 0;
            let breathSpeed = 0;
            let radiusBias = 0;
            let heightBias = 0;
            let senseSpacious = 0;
            let senseGravity  = 0;
            let senseTension  = 0;
            let senseFlow     = 0;
            let soundLoudness = 0;
            let soundTurbulence = 0;
            let soundSharpness = 0;
            let soundContinuity = 0;
            let soundTexture = 0;
            let edgeHardness = 0;
            let flowX = 0;
            let flowY = 0;
            let flowWeight = 0;
            const bx = Math.floor(mx / cellSize);
            const by = Math.floor(my / cellSize);
            for (let oy = -2; oy <= 2; oy++) {
              for (let ox = -2; ox <= 2; ox++) {
                const nearby = bins.get(fieldKey(bx + ox, by + oy));
                if (!nearby) continue;
                for (const rec of nearby) {
                  const dx = mx - rec.mx;
                  const dy = my - rec.my;
                  const sigma = sigmaBase * rec.visual.spread;
                  const d2 = dx * dx + dy * dy;
                  if (d2 > maxDistance * maxDistance || d2 > sigma * sigma * 9) continue;
                  const influence = Math.exp(-d2 / (2 * sigma * sigma));
                  if (influence < config.influenceCutoff) continue;
                  const w = influence * (0.55 + rec.noise * 0.45) * rec.tw;
                  sum += w;
                  strength += w * rec.visual.strength;
                  flux += w * rec.visual.flux;
                  contrast += w * rec.visual.contrast;
                  warmth += w * rec.visual.warmth;
                  boundary += w * rec.visual.boundary;
                  breathSpeed += w * rec.visual.breathSpeed;
                  radiusBias += w * rec.visual.radiusBias;
                  heightBias += w * rec.visual.heightBias;
                  senseSpacious += w * rec.visual.senseSpacious;
                  senseGravity  += w * rec.visual.senseGravity;
                  senseTension  += w * rec.visual.senseTension;
                  senseFlow     += w * rec.visual.senseFlow;
                  soundLoudness += w * rec.visual.soundLoudness;
                  soundTurbulence += w * rec.visual.soundTurbulence;
                  soundSharpness += w * rec.visual.soundSharpness;
                  soundContinuity += w * rec.visual.soundContinuity;
                  soundTexture += w * rec.visual.soundTexture;
                  edgeHardness += w * rec.visual.edgeHardness;
                  const fw = w * rec.visual.flowStrength;
                  flowX += rec.flowDir.x * fw;
                  flowY += rec.flowDir.y * fw;
                  flowWeight += w;
                }
              }
            }
            const normalizedStrength = sum ? clamp(1 - Math.exp(-strength * config.gain), 0, VISUAL_LIMITS.strength) : 0;
            const normalizedContrast = sum ? clamp((contrast / sum) * config.contrastScale, 0, VISUAL_LIMITS.contrast) : 0;
            const normalizedBoundary = sum && config.showBoundary ? clamp((boundary / sum) * config.boundaryScale, 0, VISUAL_LIMITS.boundaryAlpha) : 0;
            const normalizedHeightBias = sum ? clamp(heightBias / sum, -24, 32) : 0;
            const normalizedSenseGravity  = sum ? clamp(senseGravity  / sum, -1, 1) : 0;
            const normalizedSenseTension  = sum ? clamp(senseTension  / sum, -1, 1) : 0;
            const normalizedSoundLoudness = sum ? clamp(soundLoudness / sum, 0, 1) : 0.18;
            const normalizedSoundTurbulence = sum ? clamp(soundTurbulence / sum, 0, 1) : 0.08;
            const normalizedSoundSharpness = sum ? clamp(soundSharpness / sum, 0, 1) : 0.30;
            const normalizedSoundContinuity = sum ? clamp(soundContinuity / sum, 0, 1) : 0.80;
            const normalizedSoundTexture = sum ? clamp(soundTexture / sum, 0, 1) : 0.30;
            const normalizedEdgeHardness = sum ? clamp(edgeHardness / sum, -0.16, 0.24) : 0;
            const flowDir = normalizeVector(flowX, flowY);
            const flowAmount = flowWeight > 0 ? clamp(flowDir.length / flowWeight, 0, 1) : 0;
            cells.push({
              x: p.x,
              y: p.y,
              mx,
              my,
              row,
              col,
              base: 0.010,
              spacing,
              screenRecords: visibleRecords.length,
              strength: normalizedStrength,
              flux: sum ? clamp(flux / sum, 0, VISUAL_LIMITS.flux) : 0,
              baseContrast: normalizedContrast,
              warmth: sum ? clamp(warmth / sum, -0.35, 0.35) : -0.05,
              boundary: normalizedBoundary,
              breathSpeed: sum ? clamp(breathSpeed / sum, 0.65, 1.2) : 1,
              radiusBias: sum ? clamp(radiusBias / sum, -0.24, 0.44) : 0,
              heightBias: normalizedHeightBias,
              senseSpacious: sum ? clamp(senseSpacious / sum * 1.7, -1, 1) : 0,
              senseGravity:  sum ? clamp(normalizedSenseGravity  * 1.7, -1, 1) : 0,
              senseTension:  sum ? clamp(normalizedSenseTension  * 1.7, -1, 1) : 0,
              senseFlow:     sum ? clamp(senseFlow     / sum * 1.7, -1, 1) : 0,
              soundLoudness: sum ? clamp(normalizedSoundLoudness  * 1.5, 0, 1) : 0.18,
              soundTurbulence: sum ? clamp(normalizedSoundTurbulence * 1.5, 0, 1) : 0.08,
              soundSharpness: sum ? clamp(normalizedSoundSharpness  * 1.5, 0, 1) : 0.30,
              soundContinuity: sum ? clamp(normalizedSoundContinuity * 1.4, 0, 1) : 0.80,
              soundTexture: sum ? clamp(normalizedSoundTexture    * 1.5, 0, 1) : 0.30,
              edgeHardness: normalizedEdgeHardness,
              flowX: flowDir.x,
              flowY: flowDir.y,
              flowRawX: flowDir.x,
              flowRawY: flowDir.y,
              flowRawAmount: flowAmount,
              flowAmount,
              height: getDotHeight({
                strength: normalizedStrength,
                contrast: normalizedContrast,
                boundary: normalizedBoundary,
                heightBias: normalizedHeightBias,
                senseGravity: normalizedSenseGravity,
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
          let neighborCount = 0;
          let strengthTotal = 0;
          let fluxTotal = 0;
          let contrastTotal = 0;
          if (n0) { neighborCount++; strengthTotal += n0.strength; fluxTotal += n0.flux; contrastTotal += n0.baseContrast; }
          if (n1) { neighborCount++; strengthTotal += n1.strength; fluxTotal += n1.flux; contrastTotal += n1.baseContrast; }
          if (n2) { neighborCount++; strengthTotal += n2.strength; fluxTotal += n2.flux; contrastTotal += n2.baseContrast; }
          if (n3) { neighborCount++; strengthTotal += n3.strength; fluxTotal += n3.flux; contrastTotal += n3.baseContrast; }
          if (!neighborCount) return;
          const avg = strengthTotal / neighborCount;
          const fluxAvg = fluxTotal / neighborCount;
          const contrastAvg = contrastTotal / neighborCount;
          cell.contrast = clamp(
            (
              cell.baseContrast * 0.72 +
              Math.abs(cell.strength - avg) * 1.85 +
              Math.abs(cell.flux - fluxAvg) * 0.9 +
              Math.abs(cell.baseContrast - contrastAvg) * 1.1 +
              cell.boundary * 0.72
            ) * config.contrastScale,
            0,
            VISUAL_LIMITS.contrast
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
          const smoothedFlow = normalizeVector(sx, sy);
          cell.flowX = smoothedFlow.x;
          cell.flowY = smoothedFlow.y;
          cell.flowAmount = clamp(smoothedFlow.length / sw, 0, 1);
        });
        return cells;
      }

      function drawGridTexture(cells = state.cachedCells) {
        const config = gridRenderConfig();
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const hourWarmth = state.view === "world" ? Math.cos((state.selectedHour - 14) / 24 * Math.PI * 2) : 0;
        const daylight = getDaylightAmount(state.selectedHour);
        const nightBoost = 1 - daylight;
        const origin = activeOrigin();
        const params = {};
        const color = { r: 0, g: 0, b: 0 };
        const projectedLatLng = { lat: 0, lng: 0 };
        const projectedLngLat = [0, 0];
        const stats = {
          records: activeRecords().length,
          screenRecords: cells[0]?.screenRecords || 0,
          strengthMin: Infinity,
          strengthMax: 0,
          strengthSum: 0,
          contrastMin: Infinity,
          contrastMax: 0,
          contrastSum: 0,
          alphaMin: Infinity,
          alphaMax: 0,
          alphaSum: 0,
          radiusMax: 0,
          cells: cells.length,
          sigma: config.sigmaMeters,
          spacing: cells[0]?.spacing || config.dotSpacingMeters,
          targetScreenSpacing: DOT_DENSITY_VISUAL.targetScreenSpacingPx,
          level: config.level,
          zoom: state.mapReady ? state.map.getZoom() : state.zoom
        };
        for (const cell of cells) {
          let surfaceX = cell.x;
          let surfaceY = cell.y;
          if (state.mapReady && Number.isFinite(cell.mx) && Number.isFinite(cell.my)) {
            const ll = metersToLatLngInto(cell.mx, cell.my, origin, projectedLatLng);
            projectedLngLat[0] = ll.lng;
            projectedLngLat[1] = ll.lat;
            const point = state.map.project(projectedLngLat);
            surfaceX = point.x;
            surfaceY = point.y;
          }
          if (surfaceX < -160 || surfaceX > state.width + 160 || surfaceY < -180 || surfaceY > state.height + 180) continue;
          params.strength = cell.strength;
          params.flux = cell.flux;
          params.contrast = cell.contrast;
          params.warmth = clamp(cell.warmth + hourWarmth * 0.12 + (cell.localContrast || 0) * 0.04, -0.35, 0.35);
          params.boundary = cell.boundary;
          params.breathSpeed = cell.breathSpeed;
          params.radiusBias = cell.radiusBias;
          params.heightBias = cell.heightBias;
          params.senseSpacious = cell.senseSpacious ?? 0;
          params.senseGravity = cell.senseGravity ?? 0;
          params.senseTension = cell.senseTension ?? 0;
          params.senseFlow = cell.senseFlow ?? 0;
          params.soundLoudness = cell.soundLoudness ?? 0.18;
          params.soundTurbulence = cell.soundTurbulence ?? 0.08;
          params.soundSharpness = cell.soundSharpness ?? 0.30;
          params.soundContinuity = cell.soundContinuity ?? 0.80;
          params.soundTexture = cell.soundTexture ?? 0.30;
          params.localContrast = cell.localContrast || 0;
          params.edgeHardness = cell.edgeHardness ?? 0;
          const baseSkinAlpha = 0.012;
          const rawAlpha = cell.strength < GRID_VISUAL.strengthCutoff
            ? baseSkinAlpha + getDotAlpha(params) * 0.34
            : baseSkinAlpha + getDotAlpha(params) * 1.55 + (cell.localContrast || 0) * 0.21;
          const depth = clamp(1.02 - (surfaceY / Math.max(1, state.height)) * 0.16, 0.86, 1.02);
          const aMul = cell.strength >= GRID_VISUAL.strengthCutoff ? DOT_VISUAL_TUNING.activeAlphaMul : DOT_VISUAL_TUNING.alphaMul;
          const nightMul = lerp(1, DOT_VISUAL_TUNING.nightAlphaBoost, nightBoost);
          // spaciousness secondary alpha: spacious(+1)→thinner presence, dense(-1)→thicker
          const spAlphaFactor = clamp(1 - (params.senseSpacious ?? 0) * 0.38, 0.50, 1.42);
          // tension controls static inner variance: loose(-1)→stronger dot-to-dot light/height differences.
          const tension = clamp(params.senseTension ?? 0, -1, 1);
          const micro = stableSignedNoise(cell.mx / Math.max(1, cell.spacing), cell.my / Math.max(1, cell.spacing), 7);
          const activeMicroMul = cell.strength >= GRID_VISUAL.strengthCutoff ? 1 : 0.35;
          const gravity = clamp(params.senseGravity ?? 0, -1, 1);
          const microAlphaAmp = clamp(0.175 - tension * 0.125 - gravity * 0.045, 0.05, 0.44) * activeMicroMul;
          const microHeightAmp = clamp(0.195 - tension * 0.145 - gravity * 0.065, 0.05, 0.34) * activeMicroMul;
          const soundGrain = stableSignedNoise(cell.mx / Math.max(1, cell.spacing), cell.my / Math.max(1, cell.spacing), 23);
          const soundGrainAmp = clamp((cell.soundTexture ?? 0.3) * 0.13 + (cell.soundTurbulence ?? 0.08) * 0.07, 0, 0.17) * activeMicroMul;
          const soundContinuityFactor = clamp(0.92 + (cell.soundContinuity ?? 0.8) * 0.11, 0.92, 1.055);
          params.colorMicro = micro;
          params.soundGrain = soundGrain;
          const microAlphaFactor = clamp(1 + micro * microAlphaAmp + soundGrain * soundGrainAmp, 0.64, 1.38);
          const alpha = clamp(rawAlpha * microAlphaFactor * spAlphaFactor * soundContinuityFactor * aMul * nightMul * depth * config.alphaScale, GRID_VISUAL.minAlpha, DOT_VISUAL_TUNING.maxAlpha);
          const radius = clamp(getDotRadius(params), DOT_DENSITY_VISUAL.minRadiusPx, DOT_DENSITY_VISUAL.maxRadiusPx);
          getDotColor(params, color);
          const heightScale = state.mapReady ? 0.36 * Math.sin(state.map.getPitch() * Math.PI / 180) : 0.2;
          const microHeightFactor = clamp(1 + micro * microHeightAmp + soundGrain * soundGrainAmp * 0.56, 0.62, 1.38);
          const heightOffset = cell.height * microHeightFactor * heightScale * depth * (config.heightLineScale ?? 1.0);
          const hasHeightLine = cell.height > 22 && cell.strength > 0.16;
          const flowVisible = hasHeightLine ? smoothstep(0.12, 0.55, cell.flowAmount || 0) : 0;
          const flowOffset = heightOffset * clamp(flowVisible * 0.35, 0, 0.35);
          const x = surfaceX + (cell.flowX || 0) * flowOffset;
          const y = surfaceY - heightOffset + (cell.flowY || 0) * flowOffset;
          stats.strengthMin = Math.min(stats.strengthMin, cell.strength);
          stats.strengthMax = Math.max(stats.strengthMax, cell.strength);
          stats.strengthSum += cell.strength;
          stats.contrastMin = Math.min(stats.contrastMin, cell.contrast);
          stats.contrastMax = Math.max(stats.contrastMax, cell.contrast);
          stats.contrastSum += cell.contrast;
          stats.alphaMin = Math.min(stats.alphaMin, alpha);
          stats.alphaMax = Math.max(stats.alphaMax, alpha);
          stats.alphaSum += alpha;
          stats.radiusMax = Math.max(stats.radiusMax, radius);
          if (hasHeightLine) {
            const ldx = surfaceX - x, ldy = surfaceY - y;
            const llen = Math.sqrt(ldx * ldx + ldy * ldy);
            const lineEndX = llen > radius ? x + ldx / llen * radius : surfaceX;
            const lineEndY = llen > radius ? y + ldy / llen * radius : surfaceY;
            ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.42})`;
            ctx.lineWidth = 1.30;
            ctx.beginPath();
            ctx.moveTo(surfaceX, surfaceY);
            ctx.lineTo(lineEndX, lineEndY);
            ctx.stroke();
          }
          ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        state.debugStats = {
          ...stats,
          strengthAvg: stats.cells ? stats.strengthSum / stats.cells : 0,
          contrastAvg: stats.cells ? stats.contrastSum / stats.cells : 0,
          alphaAvg: stats.cells ? stats.alphaSum / stats.cells : 0,
          radiusMax: stats.radiusMax,
          strengthMin: Number.isFinite(stats.strengthMin) ? stats.strengthMin : 0,
          contrastMin: Number.isFinite(stats.contrastMin) ? stats.contrastMin : 0,
          alphaMin: Number.isFinite(stats.alphaMin) ? stats.alphaMin : 0
        };
      }

      function renderDebugPanel() {
        if (!debugPanel) return;
        debugPanel.classList.toggle("active", state.debug);
        if (!state.debug) return;
        const s = state.debugStats || {};
        const fixed = value => Number.isFinite(value) ? value.toFixed(3) : "0.000";
        debugPanel.textContent = [
          `記録数: ${s.records || 0}`,
          `画面内記録: ${s.screenRecords || 0}`,
          `強度: ${fixed(s.strengthMin)} / ${fixed(s.strengthMax)} / ${fixed(s.strengthAvg)}`,
          `差分: ${fixed(s.contrastMin)} / ${fixed(s.contrastMax)} / ${fixed(s.contrastAvg)}`,
          `透明度: ${fixed(s.alphaMin)} / ${fixed(s.alphaMax)} / ${fixed(s.alphaAvg)}`,
          `最大半径: ${fixed(s.radiusMax)}`,
          `シグマ: ${fixed(s.sigma)}`,
          `間隔: ${fixed(s.spacing)}`,
          `目標px: ${s.targetScreenSpacing || DOT_DENSITY_VISUAL.targetScreenSpacingPx}`,
          `階層: ${s.level || "-"}`,
          `ズーム: ${fixed(s.zoom)}`,
          `ピッチ: ${state.mapReady ? state.map.getPitch().toFixed(1) : "0.0"}`,
          `方位: ${state.mapReady ? state.map.getBearing().toFixed(1) : "0.0"}`,
          `昼光: ${getDaylightAmount(state.selectedHour).toFixed(2)}`,
          `時間状態: ${getMapVisualByHour(state.selectedHour).state}`,
          `移動中: ${state.mapReady && state.map.isMoving() ? "はい" : "いいえ"}`,
          `Canvas操作: ${getComputedStyle(canvas).pointerEvents}`,
          `地図: ${state.mapVisualMode}`
        ].join("\n");
      }

      function interpolateCells(fromCells, toCells, t) {
        if (!fromCells?.length || fromCells.length !== toCells.length) {
          return toCells.map(c => ({ ...c, strength: c.strength * t, height: c.height * t }));
        }
        return toCells.map((cell, index) => {
          const from = fromCells[index];
          return {
            ...cell,
            strength: from.strength + (cell.strength - from.strength) * t,
            flux: from.flux + (cell.flux - from.flux) * t,
            baseContrast: from.baseContrast + (cell.baseContrast - from.baseContrast) * t,
            contrast: from.contrast + (cell.contrast - from.contrast) * t,
            localContrast: (from.localContrast || 0) + ((cell.localContrast || 0) - (from.localContrast || 0)) * t,
            warmth: from.warmth + (cell.warmth - from.warmth) * t,
            boundary: from.boundary + (cell.boundary - from.boundary) * t,
            radiusBias: from.radiusBias + (cell.radiusBias - from.radiusBias) * t,
            heightBias: from.heightBias + (cell.heightBias - from.heightBias) * t,
            height: from.height + (cell.height - from.height) * t,
            senseSpacious: (from.senseSpacious || 0) + ((cell.senseSpacious || 0) - (from.senseSpacious || 0)) * t,
            senseGravity:  (from.senseGravity  || 0) + ((cell.senseGravity  || 0) - (from.senseGravity  || 0)) * t,
            senseTension:  (from.senseTension  || 0) + ((cell.senseTension  || 0) - (from.senseTension  || 0)) * t,
            senseFlow:     (from.senseFlow     || 0) + ((cell.senseFlow     || 0) - (from.senseFlow     || 0)) * t,
            soundLoudness: (from.soundLoudness || 0) + ((cell.soundLoudness || 0) - (from.soundLoudness || 0)) * t,
            soundTurbulence: (from.soundTurbulence || 0) + ((cell.soundTurbulence || 0) - (from.soundTurbulence || 0)) * t,
            soundSharpness: (from.soundSharpness || 0) + ((cell.soundSharpness || 0) - (from.soundSharpness || 0)) * t,
            soundContinuity: (from.soundContinuity || 0) + ((cell.soundContinuity || 0) - (from.soundContinuity || 0)) * t,
            soundTexture:  (from.soundTexture  || 0) + ((cell.soundTexture  || 0) - (from.soundTexture  || 0)) * t,
            edgeHardness:  (from.edgeHardness  || 0) + ((cell.edgeHardness  || 0) - (from.edgeHardness  || 0)) * t,
            flowX:         (from.flowX         || 0) + ((cell.flowX         || 0) - (from.flowX         || 0)) * t,
            flowY:         (from.flowY         || 0) + ((cell.flowY         || 0) - (from.flowY         || 0)) * t,
            flowAmount:    (from.flowAmount    || 0) + ((cell.flowAmount    || 0) - (from.flowAmount    || 0)) * t,
          };
        });
      }

      function rebuildFieldCache() {
        state.cachedCells = buildGeoGridField(activeRecords());
        state.fieldDirty = false;
        state.fieldTransition = null;
      }



      function startFieldTransition() {
        const from = (state.cachedCells && state.cachedCells.length)
          ? state.cachedCells.slice()
          : null;
        const to = buildGeoGridField(activeRecords());
        if (!from || from.length !== to.length) {
          state.cachedCells = to;
          state.fieldDirty = false;
          invalidateField(true);
          return;
        }
        state.fieldTransition = {
          from,
          to,
          start: performance.now(),
          duration: 420
        };
        state.fieldDirty = false;
        requestRender();
      }

      function drawCurrentMarker() {
        if (state.markerOpacity <= 0.01) return;
        if (!markerShouldBeVisible() && !state.markerFadeActive) return;
        const pos = state.position || activeOrigin();
        const p = project(pos);
        if (p.x < -80 || p.x > state.width + 80 || p.y < -80 || p.y > state.height + 80) return;
        let heading = state.heading;
        if (!Number.isFinite(heading) && state.path.length >= 2) {
          const first = state.path[0];
          const last = state.path[state.path.length - 1];
          const dx = (last.lng - first.lng) * Math.cos(pos.lat * Math.PI / 180);
          const dy = last.lat - first.lat;
          if (Math.hypot(dx, dy) > 0.000001) heading = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;
        }
        if (!Number.isFinite(heading)) heading = 0;
        const rad = heading * Math.PI / 180;
        const dest = metersToLatLng(Math.sin(rad) * 140, Math.cos(rad) * 140, pos);
        const ahead = project(dest);
        const screenAngle = Math.atan2(ahead.y - p.y, ahead.x - p.x);
        const pitch = state.mapReady ? state.map.getPitch() : 0;
        const pitchNorm = pitch / 60;
        const R = 11;

        ctx.save();
        ctx.globalAlpha = clamp(state.markerOpacity, 0, 1);
        ctx.globalCompositeOperation = "screen";
        ctx.translate(p.x, p.y - 6);

        const pulse = 0.5 + Math.sin(state.t * 2.2) * 0.5;
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, 28 + pulse * 6);
        halo.addColorStop(0, "rgba(225, 240, 241, 0.14)");
        halo.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.rotate(screenAngle);

        const tipDist = R * (1.55 - pitchNorm * 0.45);
        const cosTheta = Math.min(R / tipDist, 0.995);
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
        const theta = Math.acos(cosTheta);
        const tx = R * cosTheta;
        const ty = R * sinTheta;

        ctx.beginPath();
        ctx.moveTo(tipDist, 0);
        ctx.lineTo(tx, -ty);
        ctx.arc(0, 0, R, -theta, theta, true);
        ctx.closePath();

        const grad = ctx.createRadialGradient(-R * 0.15, -R * 0.38, R * 0.05, R * 0.25, R * 0.1, R * 1.45);
        grad.addColorStop(0, "rgba(246, 248, 250, 1.00)");
        grad.addColorStop(0.52, "rgba(225, 234, 240, 0.97)");
        grad.addColorStop(1, "rgba(185, 208, 225, 0.82)");
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.restore();

        ctx.restore();
      }

      function drawTestLabels() {
        if (!state.testMode || !state.mapReady) return;
        // top-left zoom info
        const zoom = state.map.getZoom();
        const level = getSkinZoomLevel(zoom);
        const config = gridRenderConfig();
        ctx.save();
        ctx.font = "11px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        const hud = `z${zoom.toFixed(2)}  ${level}  σ${config.sigmaMeters.toFixed(0)}m`;
        const hw = ctx.measureText(hud).width + 12;
        ctx.fillStyle = "rgba(0,0,0,0.62)";
        ctx.fillRect(10, 10, hw, 20);
        ctx.fillStyle = "rgba(140,210,255,0.92)";
        ctx.fillText(hud, 16, 14);
        ctx.restore();

        const labels = state.testMode === "t1" ? TEST_LABELS_1 : TEST_LABELS_2;
        ctx.save();
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const PAD = 6, LH = 14, H = LH * 2 + PAD * 2;
        for (const { lng, lat, id, name } of labels) {
          const pt = state.map.project([lng, lat]);
          const x = pt.x, y = pt.y;
          if (x < -80 || x > state.width + 80 || y < -30 || y > state.height + 30) continue;
          const w = Math.max(ctx.measureText(id).width, ctx.measureText(name).width) + PAD * 2;
          ctx.fillStyle = "rgba(0,0,0,0.74)";
          ctx.beginPath();
          ctx.roundRect(x - w/2, y - H/2, w, H, 3);
          ctx.fill();
          ctx.fillStyle = "rgba(160,200,255,0.92)";
          ctx.fillText(id, x, y - LH / 2);
          ctx.fillStyle = "rgba(255,255,255,0.88)";
          ctx.fillText(name, x, y + LH / 2);
        }
        ctx.restore();
      }

      function updateRecordingProgress() {
        if (!state.recording) return;
        const elapsed = performance.now() - state.recordStart;
        const pct = clamp(elapsed / DURATION, 0, 1);
        let scale = 1;
        let opacity = 1;
        let phase = "expand";
        if (elapsed < BREATH_VISUAL.growMs) {
          const p = clamp(elapsed / BREATH_VISUAL.growMs, 0, 1);
          scale = lerp(BREATH_VISUAL.minScale, BREATH_VISUAL.maxScale, easeInOutCubic(p));
          opacity = lerp(0.72, 0.98, easeInOutCubic(p));
        } else if (elapsed < BREATH_VISUAL.growMs + BREATH_VISUAL.floatMs) {
          const p = clamp((elapsed - BREATH_VISUAL.growMs) / BREATH_VISUAL.floatMs, 0, 1);
          scale = 1 + Math.sin(p * Math.PI * 2) * 0.025;
          opacity = 0.95 + Math.sin(p * Math.PI * 2 + Math.PI * 0.35) * 0.025;
          phase = "float";
        } else {
          const p = clamp((elapsed - BREATH_VISUAL.growMs - BREATH_VISUAL.floatMs) / BREATH_VISUAL.shrinkMs, 0, 1);
          scale = lerp(1, 0.035, easeInOutCubic(p));
          opacity = Math.pow(1 - p, 1.35);
          phase = "collapse";
        }
        app.style.setProperty("--sense-breath-scale", scale.toFixed(3));
        app.style.setProperty("--sense-breath-opacity", clamp(opacity, 0, 1).toFixed(3));
        pressTarget.style.setProperty("--breath-scale", scale.toFixed(3));
        if (phase !== state.lastBreathPhase) {
          state.lastBreathPhase = phase;
          safeVibrate(phase === "expand" ? 20 : [20, 60, 20]);
        }
        state.samples.push({ volume: state.volume, peak: state.peak, at: Date.now(), sharpness: _spectralSharpness(state.freq), texture: _spectralSpread(state.freq) });
        if (pct >= 1) completeRecording();
      }

      function visibleVoidCount() {
        if (state.personalRecords.length === 0) return "--";
        const center = project(state.origin, state.origin);
        const scale = center.scale;
        let voids = 0;
        for (let x = center.x - 240; x <= center.x + 240; x += 80) {
          for (let y = center.y - 240; y <= center.y + 240; y += 80) {
            const cell = unprojectCell(x, y, scale, state.origin);
            if (Math.hypot(cell.dx, cell.dy) > RADIUS_METERS) continue;
            const nearest = state.personalRecords.reduce((min, rec) => {
              const rp = project(rec, state.origin);
              return Math.min(min, Math.hypot(x - rp.x, y - rp.y));
            }, Infinity);
            if (nearest > 96) voids++;
          }
        }
        return String(voids);
      }

      function updateProfileView() {
        const records = state.personalRecords;
        pvCount.textContent = String(records.length);
        const wordCounts = new Map();
        for (const r of records) {
          const ws = Array.isArray(r.selectedWords) && r.selectedWords.length ? r.selectedWords : (r.word ? [r.word] : []);
          for (const w of ws) wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
        }
        const topWords = [...wordCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w);
        pvTrend.textContent = topWords.length ? topWords.join(" · ") : "—";
        pvTrendTime.textContent = records.length ? dominantTimeDescription(records) : "—";
        if (records.length) {
          const last = records[records.length - 1];
          const d = new Date(recordTime(last));
          const hhmm = `${d.getHours()}:${String(d.getMinutes()).padStart(2,"0")}`;
          const lastWord = last.word || (Array.isArray(last.selectedWords) ? last.selectedWords[0] : null) || "記録";
          pvRecent.textContent = `${last.area || "国分寺駅周辺"} · ${hhmm} · ${lastWord}`;
        } else {
          pvRecent.textContent = "—";
        }
      }

      function dominantTimeDescription(records) {
        const ranges = {
          morning: "朝に多い",
          day: "昼に多い",
          evening: "18:00–20:00 に多い",
          night: "夜に多い"
        };
        const counts = new Map();
        for (const record of records) {
          const slot = record.slot || recordSlot(record);
          counts.set(slot, (counts.get(slot) || 0) + 1);
        }
        const [slot] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0] || ["evening"];
        return ranges[slot] || "18:00–20:00 に多い";
      }

      function topSenseWords(records, limit = 3) {
        const wordCounts = new Map();
        for (const r of records) {
          const ws = Array.isArray(r.selectedWords) && r.selectedWords.length ? r.selectedWords : (r.word ? [r.word] : []);
          for (const w of ws) wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
        }
        return [...wordCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([w]) => w);
      }

      function recordInBounds(record, bounds) {
        if (!bounds || !Number.isFinite(record.lat) || !Number.isFinite(record.lng)) return false;
        return record.lat >= bounds.south && record.lat <= bounds.north && record.lng >= bounds.west && record.lng <= bounds.east;
      }

      function currentRangeRecords() {
        const records = uniqueRecords([...state.worldRecords, ...state.personalRecords]);
        const bounds = state.view === "share" && state.shareSnapshot?.bounds
          ? state.shareSnapshot.bounds
          : currentViewportBounds(0);
        if (!bounds) return records;
        return records.filter(record => recordInBounds(record, bounds));
      }

      function shareBoundsForRecords(records) {
        const viewportBounds = currentViewportBounds(0);
        if (viewportBounds) return viewportBounds;
        if (!records.length) return {
          south: DEFAULT_ORIGIN.lat - 0.012,
          north: DEFAULT_ORIGIN.lat + 0.012,
          west: DEFAULT_ORIGIN.lng - 0.018,
          east: DEFAULT_ORIGIN.lng + 0.018
        };
        let south = 90;
        let north = -90;
        let west = 180;
        let east = -180;
        records.forEach(record => {
          if (!Number.isFinite(record.lat) || !Number.isFinite(record.lng)) return;
          south = Math.min(south, record.lat);
          north = Math.max(north, record.lat);
          west = Math.min(west, record.lng);
          east = Math.max(east, record.lng);
        });
        const latPad = Math.max(0.001, (north - south) * 0.08);
        const lngPad = Math.max(0.001, (east - west) * 0.08);
        return { south: south - latPad, north: north + latPad, west: west - lngPad, east: east + lngPad };
      }

      function shareViewportTransform(cssWidth, cssHeight) {
        const sourceWidth = Math.max(1, state.width || cssWidth);
        const sourceHeight = Math.max(1, state.height || cssHeight);
        const scale = Math.max(cssWidth / sourceWidth, cssHeight / sourceHeight);
        return {
          scale,
          offsetX: (cssWidth - sourceWidth * scale) / 2,
          offsetY: (cssHeight - sourceHeight * scale) / 2,
          sourceWidth,
          sourceHeight
        };
      }

      function drawShareMapSnapshot(c, cssWidth, cssHeight) {
        if (!state.mapReady || !state.map) return false;
        const mapCanvas = state.map.getCanvas && state.map.getCanvas();
        if (!mapCanvas) return false;
        const sourceWidth = Math.max(1, mapCanvas.width);
        const sourceHeight = Math.max(1, mapCanvas.height);
        const sourceAspect = sourceWidth / sourceHeight;
        const targetAspect = cssWidth / cssHeight;
        let sx = 0;
        let sy = 0;
        let sw = sourceWidth;
        let sh = sourceHeight;
        if (sourceAspect > targetAspect) {
          sw = sourceHeight * targetAspect;
          sx = (sourceWidth - sw) / 2;
        } else {
          sh = sourceWidth / targetAspect;
          sy = (sourceHeight - sh) / 2;
        }
        try {
          c.drawImage(mapCanvas, sx, sy, sw, sh, 0, 0, cssWidth, cssHeight);
          return true;
        } catch (error) {
          return false;
        }
      }

      function drawShareFallbackBackground(c, cssWidth, cssHeight) {
        const bg = c.createLinearGradient(0, 0, cssWidth, cssHeight);
        bg.addColorStop(0, "#202323");
        bg.addColorStop(0.58, "#17191a");
        bg.addColorStop(1, "#0e1011");
        c.fillStyle = bg;
        c.fillRect(0, 0, cssWidth, cssHeight);

        c.save();
        c.globalAlpha = 0.18;
        c.strokeStyle = "rgba(121, 132, 138, 0.18)";
        c.lineWidth = 1;
        for (let i = -4; i < 14; i++) {
          const y = i * 24;
          c.beginPath();
          c.moveTo(-30, y);
          c.lineTo(cssWidth + 30, y + Math.sin(i * 0.9) * 18);
          c.stroke();
        }
        for (let i = -5; i < 14; i++) {
          const x = i * 31;
          c.beginPath();
          c.moveTo(x, -28);
          c.lineTo(x + Math.cos(i * 0.7) * 22, cssHeight + 28);
          c.stroke();
        }
        c.restore();
      }

      function captureShareSnapshot() {
        if (!state.width || !state.height) return;
        const hero = state.position || activeOrigin();
        const anchor = { x: state.width * 0.70, y: state.height * 0.34 };
        const savedCamera = state.mapReady && state.map
          ? {
              center: state.map.getCenter(),
              zoom: state.map.getZoom(),
              pitch: state.map.getPitch(),
              bearing: state.map.getBearing()
            }
          : null;
        if (state.mapReady && state.map) {
          state.map.jumpTo({
            center: [hero.lng, hero.lat],
            zoom: 14.45,
            pitch: DEFAULT_VIEW.pitch,
            bearing: DEFAULT_VIEW.bearing,
            offset: [anchor.x - state.width / 2, anchor.y - state.height / 2]
          });
        }
        const pixelRatio = Math.min(window.devicePixelRatio || state.dpr || 1, 2);
        const snapshot = document.createElement("canvas");
        snapshot.width = Math.max(1, Math.round(state.width * pixelRatio));
        snapshot.height = Math.max(1, Math.round(state.height * pixelRatio));
        const c = snapshot.getContext("2d");
        if (!c) return;
        c.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        c.fillStyle = "#080a0b";
        c.fillRect(0, 0, state.width, state.height);

        if (state.mapReady && state.map) {
          const mapCanvas = state.map.getCanvas && state.map.getCanvas();
          if (mapCanvas) {
            try {
              c.drawImage(mapCanvas, 0, 0, state.width, state.height);
            } catch (error) {
              c.fillStyle = "#111415";
              c.fillRect(0, 0, state.width, state.height);
            }
          }
        }

        const originalView = state.view;
        const originalOpacity = state.markerOpacity;
        const originalFadeActive = state.markerFadeActive;
        state.view = "world";
        state.markerOpacity = 1;
        state.markerFadeActive = false;
        ctx.clearRect(0, 0, state.width, state.height);
        drawGridTexture(state.cachedCells);
        drawCurrentMarker();
        state.view = originalView;
        state.markerOpacity = originalOpacity;
        state.markerFadeActive = originalFadeActive;

        c.drawImage(canvas, 0, 0, state.width, state.height);
        const point = state.mapReady && state.map
          ? state.map.project([hero.lng, hero.lat])
          : project(hero);
        const bounds = currentViewportBounds(0);
        state.shareSnapshot = {
          canvas: snapshot,
          width: state.width,
          height: state.height,
          pixelRatio,
          bounds,
          point: {
            x: Number.isFinite(point.x) ? point.x : state.width / 2,
            y: Number.isFinite(point.y) ? point.y : state.height / 2
          }
        };
        if (savedCamera && state.mapReady && state.map) {
          state.map.jumpTo({
            center: [savedCamera.center.lng, savedCamera.center.lat],
            zoom: savedCamera.zoom,
            pitch: savedCamera.pitch,
            bearing: savedCamera.bearing
          });
          requestRender();
        }
      }

      function drawCapturedShareSnapshot(c, cssWidth, cssHeight) {
        const snapshot = state.shareSnapshot;
        if (!snapshot || !snapshot.canvas) return false;
        const shareScale = 1.30;
        const anchorX = cssWidth * 0.70;
        const anchorY = cssHeight * 0.34;
        const drawWidth = snapshot.width * shareScale;
        const drawHeight = snapshot.height * shareScale;
        const minX = Math.min(0, cssWidth - drawWidth);
        const minY = Math.min(0, cssHeight - drawHeight);
        const dx = clamp(anchorX - snapshot.point.x * shareScale, minX, 0);
        const dy = clamp(anchorY - snapshot.point.y * shareScale, minY, 0);
        c.drawImage(
          snapshot.canvas,
          0,
          0,
          snapshot.width * snapshot.pixelRatio,
          snapshot.height * snapshot.pixelRatio,
          dx,
          dy,
          drawWidth,
          drawHeight
        );
        return true;
      }

      function drawShareCard(records) {
        const canvasEl = document.getElementById("shareCardCanvas");
        if (!canvasEl) return;
        const cssWidth = Math.max(1, Math.round(canvasEl.clientWidth || 395));
        const cssHeight = Math.max(1, Math.round(canvasEl.clientHeight || 274));
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.round(cssWidth * pixelRatio);
        const height = Math.round(cssHeight * pixelRatio);
        if (canvasEl.width !== width || canvasEl.height !== height) {
          canvasEl.width = width;
          canvasEl.height = height;
        }
        const c = canvasEl.getContext("2d");
        if (!c) return;
        c.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        c.clearRect(0, 0, cssWidth, cssHeight);

        const bounds = shareBoundsForRecords(records);
        const usedSnapshot = drawCapturedShareSnapshot(c, cssWidth, cssHeight);
        if (!usedSnapshot && !drawShareMapSnapshot(c, cssWidth, cssHeight)) {
          drawShareFallbackBackground(c, cssWidth, cssHeight);
        }
        const maxDots = 1400;
        const stride = Math.max(1, Math.floor(records.length / maxDots));
        const palette = {
          morning: "119, 143, 216",
          day: "140, 174, 166",
          evening: "150, 139, 190",
          night: "88, 104, 174"
        };

        const viewport = shareViewportTransform(cssWidth, cssHeight);
        if (!usedSnapshot) {
          c.save();
          c.globalCompositeOperation = "screen";
          records.forEach((record, index) => {
            if (index % stride !== 0 || !recordInBounds(record, bounds)) return;
            const point = state.mapReady && state.map
              ? state.map.project([record.lng, record.lat])
              : project(record);
            const x = point.x * viewport.scale + viewport.offsetX;
            const y = point.y * viewport.scale + viewport.offsetY;
            if (x < -8 || x > cssWidth + 8 || y < -8 || y > cssHeight + 8) return;
            const noise = recordNoise(record);
            const flux = recordFlux(record);
            const slot = recordSlot(record);
            const color = palette[slot] || palette.evening;
            const radius = (1.0 + noise * 2.7 + flux * 1.0) * Math.max(0.78, viewport.scale);
            c.fillStyle = `rgba(${color}, ${0.24 + noise * 0.26})`;
            c.beginPath();
            c.arc(x, y, radius, 0, Math.PI * 2);
            c.fill();
          });
          c.restore();
        }

        const veil = c.createRadialGradient(cssWidth * 0.48, cssHeight * 0.42, cssWidth * 0.1, cssWidth * 0.48, cssHeight * 0.42, cssWidth * 0.65);
        veil.addColorStop(0, "rgba(255, 255, 255, 0.04)");
        veil.addColorStop(0.55, "rgba(18, 20, 21, 0)");
        veil.addColorStop(1, "rgba(4, 5, 6, 0.54)");
        c.fillStyle = veil;
        c.fillRect(0, 0, cssWidth, cssHeight);
      }

      function updateShareView() {
        const records = currentRangeRecords();
        const words = topSenseWords(records, 3);
        const fallback = ["澄む", "ほどける", "流れる"];
        const chosen = words.length ? words : fallback;
        const shareMainWords = document.getElementById("shareMainWords");
        if (shareMainWords) {
          shareMainWords.textContent = "";
          chosen.forEach((word, index) => {
            if (index) shareMainWords.append(document.createTextNode(" / "));
            const span = document.createElement("span");
            span.textContent = word;
            shareMainWords.appendChild(span);
          });
        }
        const avgNoise = records.length ? records.reduce((acc, r) => acc + recordNoise(r), 0) / records.length : 0.38;
        const shareCardMeta = document.getElementById("shareCardMeta");
        if (shareCardMeta) {
          shareCardMeta.textContent = `${records.length} records・${avgNoise.toFixed(2)} layers`;
        }
        drawShareCard(records);
      }

      function refreshDerivedSurfaces() {
        state.origin = recordsCenter(state.personalRecords) || DEFAULT_ORIGIN;
        rebuildGrids();
        updateStats();
        updateProfileView();
        updateShareView();
        updateSettingsScrollbar();
      }

      function applyRemoteWorldRecords(rows) {
        WORLD_RECORDS = rows;
        if (!state.testMode) state.worldRecords = WORLD_RECORDS;
        rebuildGrids();
        updateStats();
        if (state.view === "share") updateShareView();
        requestRender();
      }

      async function refreshViewportWorldRecords() {
        if (!supabase || state.testMode) return;
        const bounds = currentViewportBounds();
        const limit = remoteWorldLimitForZoom();
        const key = remoteBoundsKey(bounds, limit);
        if (key === state.remoteRecordsKey) return;
        state.remoteRecordsKey = key;
        const requestId = ++state.remoteRecordsRequestId;
        const rows = await loadSupabaseWorldRows({ bounds, limit });
        if (requestId !== state.remoteRecordsRequestId || !rows) return;
        applyRemoteWorldRecords(rows.map(deserializeRecord));
      }

      function scheduleViewportWorldRefresh(delay = 360) {
        clearTimeout(state.remoteRecordsTimer);
        state.remoteRecordsTimer = setTimeout(() => {
          refreshViewportWorldRecords().catch(error => {
            console.warn("[WorldSkin] viewport record refresh failed", error);
          });
        }, delay);
      }

      function updateSettingsScrollbar() {
        if (!settingsPage || !settingsScrollbarThumb) return;
        const trackHeight = 828;
        const thumbHeight = 120;
        const scrollRange = Math.max(1, settingsPage.scrollHeight - settingsPage.clientHeight);
        const top = clamp(settingsPage.scrollTop / scrollRange, 0, 1) * (trackHeight - thumbHeight);
        settingsScrollbarThumb.style.transform = `translateY(${top.toFixed(2)}px)`;
      }

      const RECORD_WORD_LAYOUT = [
        { word:"速い",    dotLeft:147.8, dotTop:437.7,  dotW:6, txtLeft:161,  txtTop:430.34, color:"rgba(143,175,208,0.92)", size:15, weight:400 },
        { word:"澄む",    dotLeft: 74.8, dotTop:452.87, dotW:6, txtLeft: 88,  txtTop:445.5,  color:"rgba(183,208,215,0.92)", size:15, weight:400 },
        { word:"ほどける",dotLeft:234.8, dotTop:452.87, dotW:6, txtLeft:248,  txtTop:445.5,  color:"rgba(200,200,176,0.92)", size:15, weight:400 },
        { word:"詰まる",  dotLeft: 28.8, dotTop:485.37, dotW:6, txtLeft: 42,  txtTop:478.01, color:"rgba(184,138,116,0.92)", size:15, weight:400 },
        { word:"流れる",  dotLeft:276.8, dotTop:487.54, dotW:6, txtLeft:290,  txtTop:480.17, color:"rgba(127,167,183,0.92)", size:15, weight:400 },
        { word:"ざらつく",dotLeft: 94.8, dotTop:504.87, dotW:6, txtLeft:108,  txtTop:497.51, color:"rgba(168,139,124,0.92)", size:15, weight:400 },
        { word:"浮く",    dotLeft:206.8, dotTop:509.21, dotW:5, txtLeft:220,  txtTop:501.84, color:"rgba(175,197,216,0.7)",  size:13, weight:400 },
        { word:"静まる",  dotLeft: 48.8, dotTop:537.38, dotW:5, txtLeft: 62,  txtTop:530.01, color:"rgba(159,176,184,0.7)",  size:13, weight:400 },
        { word:"重い",    dotLeft:254.8, dotTop:537.38, dotW:5, txtLeft:268,  txtTop:530.01, color:"rgba(142,127,115,0.7)",  size:13, weight:400 },
        { word:"沈む",    dotLeft:146.8, dotTop:556.88, dotW:5, txtLeft:160,  txtTop:549.51, color:"rgba(126,140,160,0.7)",  size:13, weight:400 },
        { word:"薄い",    dotLeft: 94.8, dotTop:582.88, dotW:4, txtLeft:108,  txtTop:575.51, color:"rgba(197,202,208,0.7)",  size:13, weight:400 },
        { word:"遠い",    dotLeft:200.8, dotTop:582.88, dotW:4, txtLeft:214,  txtTop:575.51, color:"rgba(147,160,178,0.7)",  size:13, weight:400 },
      ];

      function updateStats() {
        const records = state.personalRecords;
        const avgNoise = records.length ? records.reduce((acc, r) => acc + recordNoise(r), 0) / records.length : 0;
        document.getElementById("recordCount").textContent = `世界 ${state.worldRecords.length} / 自分 ${records.length}`;

        // Time chart — dot-matrix rows (Figma layout)
        const recordTimeEl = document.getElementById("recordTime");
        recordTimeEl.innerHTML = "";
        const DOT_MAX = 30;
        const SLOT_LABEL = { morning:"朝", day:"昼", evening:"夕", night:"夜" };
        TIME_SLOTS.forEach(slot => {
          const count = records.filter(r => (r.slot || recordSlot(r)) === slot).length;
          const row = document.createElement("div");
          row.className = "rec-time-row";
          const lbl = document.createElement("span");
          lbl.className = "rec-time-lbl";
          lbl.textContent = SLOT_LABEL[slot] || slot;
          row.appendChild(lbl);
          const dotsWrap = document.createElement("span");
          dotsWrap.className = "rec-time-dots";
          for (let i = 0; i < DOT_MAX; i++) {
            const d = document.createElement("span");
            d.className = "rec-dot " + (i < count ? "rec-dot-on" : "rec-dot-off");
            dotsWrap.appendChild(d);
          }
          row.appendChild(dotsWrap);
          const cnt = document.createElement("span");
          cnt.className = "rec-time-cnt";
          cnt.textContent = String(count);
          row.appendChild(cnt);
          recordTimeEl.appendChild(row);
        });

        // Word counts
        const wordCounts = new Map();
        for (const r of records) {
          const ws = Array.isArray(r.selectedWords) && r.selectedWords.length ? r.selectedWords : (r.word ? [r.word] : []);
          for (const w of ws) wordCounts.set(w, (wordCounts.get(w) || 0) + 1);
        }
        const maxCount = Math.max(1, ...[...wordCounts.values()]);
        const rankedWords = [...wordCounts.entries()].sort((a, b) => b[1] - a[1]);

        // Word cloud — Figma positions
        const recordWords = document.getElementById("recordWords");
        recordWords.innerHTML = "";
        RECORD_WORD_LAYOUT.forEach(({ word: fallbackWord, dotLeft, dotTop, dotW, txtLeft, txtTop, color, size, weight }, index) => {
          const word = rankedWords[index]?.[0] || fallbackWord;
          const count = wordCounts.get(word) || 0;
          const opacity = count ? Math.min(1, 0.55 + (count / maxCount) * 0.45) : 0.18;
          const dotEl = document.createElement("span");
          dotEl.className = "rec-word-dot";
          dotEl.style.cssText = `left:${dotLeft}px;top:${dotTop}px;width:${dotW}px;height:${dotW}px;background:${color};opacity:${opacity};`;
          recordWords.appendChild(dotEl);
          const txtEl = document.createElement("p");
          txtEl.className = "rec-word-text";
          txtEl.textContent = word;
          txtEl.style.cssText = `left:${txtLeft}px;top:${txtTop}px;font-size:${size}px;font-weight:${weight};color:${color};opacity:${opacity};`;
          recordWords.appendChild(txtEl);
        });

        document.getElementById("recordsTotal").textContent = String(records.length);
        document.getElementById("recordsVoid").textContent = visibleVoidCount();
        document.getElementById("recordsNoise").textContent = avgNoise.toFixed(2);

        const subtitleEl = document.getElementById("recSubtitle");
        if (subtitleEl) {
          const valid = records.filter(r => Number.isFinite(r.lat) && Number.isFinite(r.lng));
          if (valid.length >= 2) {
            const center = recordsCenter(valid);
            const maxDist = valid.reduce((max, r) => Math.max(max, haversine(center, r)), 0);
            subtitleEl.textContent = "国分寺 あたり";
          } else {
            subtitleEl.textContent = "国分寺 あたり";
          }
        }
      }

      function render() {
        state.renderHandle = null;
        state.t += 1 / Math.max(1, PERF.targetFPS);
        if (state.recording) updateAudio();
        if (state.recording) updateRecordingProgress();
        updateMarkerFade();
        if (state.fieldDirty && canNavigateMap()) rebuildFieldCache();
        drawBackground();
        if (state.view === "world" || state.view === "radius" || state.view === "sense" || state.view === "profile" || state.view === "records" || state.view === "settings" || state.view === "share") {
          let cells = state.cachedCells;
          if (state.fieldTransition) {
            const progress = clamp((performance.now() - state.fieldTransition.start) / state.fieldTransition.duration, 0, 1);
            cells = interpolateCells(state.fieldTransition.from, state.fieldTransition.to, easeInOutCubic(progress));
            if (progress >= 1) {
              state.cachedCells = state.fieldTransition.to;
              state.fieldTransition = null;
            }
          }
          drawGridTexture(cells);
          drawCurrentMarker();
          drawTestLabels();
        }
        renderDebugPanel();
        state.renderDirty = false;
        if (state.recording || state.fieldTransition || state.markerFadeActive) requestRender();
      }

      function bindEvents() {
        window.addEventListener("resize", () => {
          updateAppScale();
          resizeCanvas();
        });
        app.addEventListener("scroll", () => {
          if (app.scrollTop || app.scrollLeft) requestAnimationFrame(resetAppScroll);
        }, { passive: true });
        navBtns.forEach(btn => btn.addEventListener("click", event => {
          settleAppFrame(event);
          event.stopPropagation();
          const target = btn.dataset.target;
          if (target === "sense") {
            app.classList.add("nav-open", "nav-sense-open");
            settleAppFrame();
            window.setTimeout(() => {
              app.classList.remove("nav-sense-open");
              switchView("sense");
              settleAppFrame();
            }, 320);
            return;
          }
          app.classList.remove("nav-sense-open");
          app.classList.add("nav-open");
          switchView(target, true);
          settleAppFrame();
        }));
        pressTarget.addEventListener("pointerdown", startRecording);
        pressTarget.addEventListener("pointerup", stopRecording);
        pressTarget.addEventListener("pointercancel", stopRecording);
        pressTarget.addEventListener("pointerleave", stopRecording);
        document.getElementById("saveBtn").addEventListener("click", savePending);
        document.getElementById("discardBtn").addEventListener("click", discardPending);
        avatarBtn.addEventListener("click", event => {
          settleAppFrame(event);
          if (state.view === "world" || state.view === "radius") state.prevView = state.view;
          app.classList.add("profile-entering");
          switchView("profile");
          window.setTimeout(() => app.classList.remove("profile-entering"), 760);
        });
        profileBack.addEventListener("click", () => switchView(state.prevView || "world"));
        document.getElementById("senseBack").addEventListener("click", () => switchView(state.prevView || "world"));
        profileOpenSettings.addEventListener("click", () => switchView("settings"));
        if (profileOpenShare) profileOpenShare.addEventListener("click", () => {
          state.prevView = "profile";
          switchView("share");
        });
        if (homeShareBtn) homeShareBtn.addEventListener("click", () => {
          state.prevView = state.view;
          switchView("share");
        });
        if (shareBack) shareBack.addEventListener("click", () => switchView(state.prevView || "profile"));
        if (settingsPage) settingsPage.addEventListener("scroll", updateSettingsScrollbar, { passive: true });
        const personalRecordsBtn = document.getElementById("personalRecordsBtn");
        if (personalRecordsBtn) personalRecordsBtn.addEventListener("click", () => switchView("records"));
        document.querySelectorAll("[data-back]").forEach(btn => btn.addEventListener("click", () => switchView(btn.dataset.back)));
        timeSlider.addEventListener("input", () => {
          const offset = Number(timeSlider.value);
          state.selectedHour = getTimelineHour(offset);
          if (offset === 0) {
            timeAxisLabel.textContent = "現在";
          } else {
            const h = Math.round(state.selectedHour);
            timeAxisLabel.textContent = `${String(h).padStart(2, "0")}:00`;
          }
          applyMapVisualMode();
          startFieldTransition();
        });
        canvas.addEventListener("pointerdown", handleCanvasPointerDown);
        canvas.addEventListener("pointermove", handleCanvasPointerMove);
        canvas.addEventListener("pointerup", handleCanvasPointerEnd);
        canvas.addEventListener("pointercancel", handleCanvasPointerEnd);
        canvas.addEventListener("wheel", handleCanvasWheel, { passive: false });
        document.getElementById("centerBtn").addEventListener("click", event => {
          event.preventDefault();
          event.currentTarget.blur();
          resetAppScroll();
          if (state.mapReady && canNavigateMap()) {
            resetMapDirection();
            resetAppScroll();
            requestAnimationFrame(resetAppScroll);
            return;
          }
          showToast("向きを正面に戻しました。");
          resetAppScroll();
          requestAnimationFrame(resetAppScroll);
        });
        document.getElementById("clearBtn").addEventListener("click", event => {
          event.preventDefault();
          event.currentTarget.blur();
          resetAppScroll();
          if (state.mapReady && canNavigateMap()) {
            centerMapOnPersonalCenter();
            showToast("自分の中心へ戻りました。");
            resetAppScroll();
            requestAnimationFrame(resetAppScroll);
            return;
          }
          state.centerOffset = { x: 0, y: 0 };
          rebuildGrids();
          showToast("現在地へ戻りました。");
          resetAppScroll();
          requestAnimationFrame(resetAppScroll);
        });
        // 遮罩点击 → 展开/收起导航
        document.querySelector(".nav-overlay").addEventListener("click", event => {
          settleAppFrame(event);
          app.classList.toggle("nav-open");
          settleAppFrame();
        });
        // footer-nav 点击空白区域（展开态）→ 收起
        document.querySelector(".footer-nav").addEventListener("click", (e) => {
          if (!app.classList.contains("nav-open")) return;
          if (!e.target.closest(".nav-btn") && !e.target.closest(".nav-overlay")) {
            settleAppFrame(e);
            app.classList.remove("nav-open");
            settleAppFrame();
          }
        });
        window.addEventListener("contextmenu", event => event.preventDefault());
        window.addEventListener("keydown", event => {
          const key = event.key.toLowerCase();
          if (key === "d") {
            state.debug = !state.debug;
            renderDebugPanel();
            requestRender();
          }
          if (key === "m") {
            const modes = ["dark", "balanced", "bright"];
            const next = modes[(modes.indexOf(state.mapVisualMode) + 1) % modes.length];
            state.mapVisualMode = next;
            applyMapVisualMode();
            const modeLabel = { dark: "暗め", balanced: "標準", bright: "明るめ" }[next] || next;
            showToast(`地図表示 ${modeLabel}`);
            requestRender();
          }
          if (key === "r") resetMapView();
          if (key === "t") {
            state.testMode = state.testMode === "t1" ? false : "t1";
            state.worldRecords = state.testMode === "t1" ? TEST_RECORDS : WORLD_RECORDS;
            rebuildGrids();
            showToast(state.testMode === "t1" ? "テストデータ1 ON（T で解除）" : "通常データ に切り替え");
          }
          if (key === "y") {
            state.testMode = state.testMode === "t2" ? false : "t2";
            state.worldRecords = state.testMode === "t2" ? TEST_RECORDS_2 : WORLD_RECORDS;
            rebuildGrids();
            showToast(state.testMode === "t2" ? "テストデータ2 ON（Y で解除）" : "通常データ に切り替え");
          }
        });
      }

      function startLaunchAnimation() {
        // Animation is CSS-driven (@keyframes launch-logo-in).
      }

      const _bootAt = Date.now();

      async function hydrateRemoteRecords() {
        try {
          const personalData = await loadPersonalRecords();
          if (personalData?.length) {
            state.personalRecords = personalData;
            if (!state.position) state.origin = recordsCenter(state.personalRecords) || DEFAULT_ORIGIN;
          }
          refreshDerivedSurfaces();
          invalidateField(true);
        } catch (error) {
          console.warn("[WorldSkin] remote record hydration failed", error);
        }
      }

      async function boot() {
        WORLD_RECORDS = [];
        state.worldRecords = WORLD_RECORDS;
        state.personalRecords = [];
        state.origin = recordsCenter(state.personalRecords) || DEFAULT_ORIGIN;
        initRealMap();
        updateAppScale();
        resizeCanvas();
        bindEvents();
        initLocation();
        refreshDerivedSurfaces();
        invalidateField(true);
        startLaunchAnimation();
        hydrateRemoteRecords();
      }

      boot().catch(err => console.error("[WorldSkin] boot failed", err));
    })();
