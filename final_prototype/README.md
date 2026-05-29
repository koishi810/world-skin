# final_prototype

Final World Skin mobile prototype based on `test0.4`.

## Run locally

```bash
node server.js
```

Open `http://localhost:8768/`.

The local backend has no external dependencies. On first run it creates:

```text
final_prototype/.data/records.json
```

The generated database is seeded automatically from `data/world_data.js` with:

- Tokyo-wide world records, generated from wards, Tama municipalities, major stations, parks, waterways, industrial areas, and island towns
- zones, corridors, and voids metadata
- demo personal records from `data/my_data.js`

## API

- `GET /api/health`
- `GET /api/records?record_type=world`
- `GET /api/records?record_type=personal&device_id=...`
- `POST /api/records`
- `DELETE /api/records?record_type=personal&device_id=...`
- `POST /api/seed` forces a fresh local reseed from `data/world_data.js`

## Supabase option

For a hosted database:

1. Run `supabase_schema.sql` in Supabase SQL Editor.
2. Fill `supabase-config.js` with the project URL and anon key.
3. Open `seed.html` and run the seeder once.

The app uses Supabase when configured. Otherwise it falls back to the local API when served by `server.js`, then to bundled static seed data.
