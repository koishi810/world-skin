const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8767);
const DATA_DIR = path.join(ROOT, ".data");
const DATA_FILE = path.join(DATA_DIR, "records.json");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...headers
  });
  res.end(body);
}

function sendJson(res, status, payload) {
  send(res, status, JSON.stringify(payload), {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
}

function toDbRow(record, recordType, deviceId) {
  const createdAt = record.created_at || record.createdAt || record.timestamp || new Date().toISOString();
  return {
    id: record.id || crypto.randomUUID(),
    user_id: record.user_id || record.userId || deviceId || "seed",
    device_id: record.device_id || deviceId || null,
    record_type: record.record_type || recordType,
    lat: record.lat,
    lng: record.lng,
    timestamp: record.timestamp || createdAt,
    hour: record.hour,
    weekday: record.weekday,
    noise_level: record.noise_level ?? record.noiseLevel ?? record.noise,
    turbulence: record.turbulence ?? record.flux,
    peak: record.peak,
    mobility: record.mobility || record.movement,
    direction: record.direction,
    duration: record.duration,
    word: record.word,
    selected_words: record.selected_words || record.selectedWords || (record.word ? [record.word] : []),
    sense_vector: record.sense_vector || record.senseVector || {},
    sound_vector: record.sound_vector || record.soundVector || {},
    trust_score: record.trust_score ?? record.trustScore,
    zone_id: record.zone_id || record.zoneId,
    source: record.source || (recordType === "world" ? "seed-world" : "seed-personal"),
    noise: record.noise ?? record.noiseLevel,
    flux: record.flux ?? record.turbulence,
    movement: record.movement || record.mobility,
    distance: record.distance,
    slot: record.slot,
    created_at: createdAt
  };
}

function loadScriptData(fileName, getter) {
  const filePath = path.join(ROOT, "data", fileName);
  if (!fs.existsSync(filePath)) return [];
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, "utf8"), context, { filename: filePath });
  return getter(context.window) || [];
}

function seedStore() {
  const world = loadScriptData("world_data.js", win => win.WORLD_SKIN_DATA && win.WORLD_SKIN_DATA.records);
  const personal = loadScriptData("my_data.js", win => win.MY_SKIN_DATA && win.MY_SKIN_DATA.records);
  return {
    version: 1,
    seeded_at: new Date().toISOString(),
    records: [
      ...world.map(record => toDbRow(record, "world", null)),
      ...personal.map(record => toDbRow(record, "personal", "local-demo"))
    ]
  };
}

function readStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const seeded = seedStore();
    fs.writeFileSync(DATA_FILE, JSON.stringify(seeded, null, 2));
    return seeded;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeStore(store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        reject(new Error("Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

async function handleRecords(req, res, url) {
  if (req.method === "GET") {
    const store = readStore();
    const recordType = url.searchParams.get("record_type");
    const deviceId = url.searchParams.get("device_id");
    const limit = Number(url.searchParams.get("limit") || 0);
    let records = store.records;
    if (recordType) records = records.filter(record => record.record_type === recordType);
    if (deviceId) records = records.filter(record => record.device_id === deviceId);
    records = records.slice().sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
    sendJson(res, 200, { records: limit > 0 ? records.slice(-limit) : records });
    return;
  }

  if (req.method === "POST") {
    const raw = await readBody(req);
    const payload = JSON.parse(raw || "{}");
    const row = toDbRow(payload, payload.record_type || "personal", payload.device_id || payload.user_id);
    const store = readStore();
    const index = store.records.findIndex(record => record.id === row.id);
    if (index >= 0) store.records[index] = { ...store.records[index], ...row };
    else store.records.push(row);
    writeStore(store);
    sendJson(res, index >= 0 ? 200 : 201, { record: row });
    return;
  }

  if (req.method === "DELETE") {
    const recordType = url.searchParams.get("record_type");
    const deviceId = url.searchParams.get("device_id");
    if (!recordType || !deviceId) {
      sendJson(res, 400, { error: "record_type and device_id are required" });
      return;
    }
    const store = readStore();
    const before = store.records.length;
    store.records = store.records.filter(record => !(record.record_type === recordType && record.device_id === deviceId));
    writeStore(store);
    sendJson(res, 200, { deleted: before - store.records.length });
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }
    send(res, 200, data, {
      "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (req.method === "OPTIONS") {
      send(res, 204, "");
    } else if (url.pathname === "/api/health") {
      sendJson(res, 200, { ok: true });
    } else if (url.pathname === "/api/records") {
      await handleRecords(req, res, url);
    } else {
      serveStatic(req, res, url);
    }
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: error.message || "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`World Skin test0.4 running at http://localhost:${PORT}/`);
  console.log(`Record store: ${DATA_FILE}`);
});
