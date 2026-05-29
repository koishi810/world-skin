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

For the hosted database:

1. Run `supabase_schema.sql` in Supabase SQL Editor.
2. `supabase-config.js` contains the project URL and publishable key used by the frontend.
3. Create a local `.env` file from `.env.example`.
4. Put the service role secret in `.env`. Never commit or publish it.
5. Run the bulk seed script from this folder:

```bash
node scripts/seed_supabase.js --records 300000 --reset-world
```

Use a smaller first run when estimating free-tier size:

```bash
node scripts/seed_supabase.js --records 10000 --reset-world
```

Then check table size in Supabase SQL Editor:

```sql
select
  pg_size_pretty(pg_total_relation_size('records')) as records_size,
  count(*) as rows
from records;
```

The app uses Supabase when configured. Otherwise it falls back to the local API when served by `server.js`, then to bundled static seed data.

`seed.html` remains available for small manual tests, but the Node script is the intended path for hundreds of thousands of rows.
