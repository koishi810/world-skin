#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const WORLD_DATA_FILE = path.join(ROOT, "data", "world_data.js");
const DEFAULT_BATCH_SIZE = 500;

function parseArgs(argv) {
  const options = {
    records: 300000,
    batchSize: DEFAULT_BATCH_SIZE,
    resetWorld: false
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--records") options.records = Number(argv[++i]);
    else if (arg === "--batch-size") options.batchSize = Number(argv[++i]);
    else if (arg === "--reset-world") options.resetWorld = true;
    else if (arg === "--help" || arg === "-h") {
      console.log([
        "Usage: node scripts/seed_supabase.js [--records 300000] [--batch-size 500] [--reset-world]",
        "",
        "Required env:",
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
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function loadWorldData() {
  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(WORLD_DATA_FILE, "utf8"), context, { filename: WORLD_DATA_FILE });
  return context.window.WORLD_SKIN_DATA;
}

function rowFromRecord(record, index) {
  return {
    id: `tokyo-final-${String(index).padStart(7, "0")}`,
    user_id: record.userId || record.user_id || null,
    device_id: null,
    record_type: "world",
    lat: record.lat,
    lng: record.lng,
    timestamp: record.timestamp,
    hour: record.hour,
    weekday: record.weekday,
    noise_level: record.noiseLevel ?? record.noise_level ?? record.noise,
    turbulence: record.turbulence ?? record.flux,
    peak: record.peak,
    mobility: record.mobility || record.movement,
    direction: record.direction,
    duration: record.duration,
    word: record.word,
    selected_words: record.selectedWords || record.selected_words || [],
    sense_vector: record.senseVector || record.sense_vector || {},
    sound_vector: record.soundVector || record.sound_vector || {},
    trust_score: record.trustScore ?? record.trust_score,
    zone_id: record.zoneId || record.zone_id,
    source: "tokyo-prefecture-bulk-seed-v1",
    noise: record.noise ?? record.noiseLevel ?? record.noise_level,
    flux: record.flux ?? record.turbulence,
    movement: record.movement || record.mobility,
    distance: record.distance,
    slot: record.slot,
    created_at: record.createdAt || record.created_at || record.timestamp
  };
}

function createBulkRecords(seedRecords, targetCount) {
  const rows = [];
  const baseTime = Date.UTC(2026, 4, 15, 0, 0, 0);
  for (let index = 0; index < targetCount; index++) {
    const base = seedRecords[index % seedRecords.length];
    const cycle = Math.floor(index / seedRecords.length);
    const phase = ((index * 9301 + 49297) % 233280) / 233280;
    const latJitter = (Math.sin(index * 12.9898) * 0.5 + Math.cos(index * 0.071) * 0.5) * 0.0018;
    const lngJitter = (Math.cos(index * 78.233) * 0.5 + Math.sin(index * 0.053) * 0.5) * 0.0018;
    const hour = (Number(base.hour || 0) + cycle + Math.floor(phase * 3)) % 24;
    const timestamp = new Date(baseTime + (index % 28) * 86400000 + hour * 3600000 + Math.floor(phase * 3600000)).toISOString();
    const varied = {
      ...base,
      lat: Number((base.lat + latJitter).toFixed(7)),
      lng: Number((base.lng + lngJitter).toFixed(7)),
      timestamp,
      createdAt: timestamp,
      hour,
      weekday: index % 7,
      noiseLevel: Number(Math.max(0.02, Math.min(0.98, (base.noiseLevel ?? base.noise ?? 0.4) + (phase - 0.5) * 0.08)).toFixed(3)),
      turbulence: Number(Math.max(0.02, Math.min(0.96, (base.turbulence ?? base.flux ?? 0.3) + (0.5 - phase) * 0.07)).toFixed(3)),
      direction: Number((((base.direction || 0) + cycle * 17 + phase * 28) % 360).toFixed(1)),
      duration: Math.round(Math.max(6, Math.min(22, (base.duration || 12) + (phase - 0.5) * 5)))
    };
    varied.noise = varied.noiseLevel;
    varied.flux = varied.turbulence;
    rows.push(rowFromRecord(varied, index));
  }
  return rows;
}

function zoneRows(worldData) {
  return (worldData.clusters || []).map(zone => ({
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

function corridorRows(worldData) {
  return (worldData.corridors || []).map(corridor => ({
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

function voidRows(worldData) {
  return (worldData.voids || []).map(voidZone => ({
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
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${method} ${table}: ${response.status} ${text}`);
  }
}

async function upsertTable(table, rows, batchSize) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    await requestSupabase("POST", table, chunk, "?on_conflict=id");
    const done = Math.min(i + batchSize, rows.length);
    process.stdout.write(`\r${table}: ${done}/${rows.length}`);
  }
  process.stdout.write("\n");
}

async function main() {
  loadEnvFile(path.join(ROOT, ".env"));
  const options = parseArgs(process.argv.slice(2));
  if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("sb_secret_")) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY should be the secret service role key, not the publishable key");
  }

  const worldData = loadWorldData();
  if (!worldData?.records?.length) throw new Error("No world records found in data/world_data.js");

  console.log(`Source seed: ${worldData.records.length} records`);
  console.log(`Target world records: ${options.records}`);
  await upsertTable("zones", zoneRows(worldData), options.batchSize);
  await upsertTable("corridors", corridorRows(worldData), options.batchSize);
  await upsertTable("voids", voidRows(worldData), options.batchSize);

  if (options.resetWorld) {
    console.log("Deleting existing world records...");
    await requestSupabase("DELETE", "records", null, "?record_type=eq.world");
  }

  const rows = createBulkRecords(worldData.records, options.records);
  await upsertTable("records", rows, options.batchSize);
  console.log("Done.");
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
