# test0.4

`test0.4` is the Figma-synced mobile branch of the World Skin prototype.

## Run

Use the local backend when testing record persistence:

```bash
node server.js
```

Then open `http://localhost:8767/`.

The server has no external dependencies. It serves the static app and provides:

- `GET /api/records?record_type=world`
- `GET /api/records?record_type=personal&device_id=...`
- `POST /api/records`
- `DELETE /api/records?record_type=personal&device_id=...`

The JSON store is created at `.data/records.json` on first run and is ignored by git.

## What stays separate

- `../test0.2.html` remains the previous single-file prototype and is not used as the runtime entry for `test0.4`.
- `test0.4/` is an independent package so the mobile UI can evolve without destabilizing older prototypes.

## Current package structure

- `index.html` — document structure and mobile screen layout
- `styles.css` — visual system and mobile shell styling
- `app.js` — map, sensing, state, API persistence, and interaction logic
- `server.js` — simple local HTTP/API backend
- `data/` — local copies of the existing world/personal/test data files

## Current integration direction

`test0.4` keeps the `test0.2` map/data engine, but replaces the old desktop-like shell with the newer mobile UI language:

- phone-sized viewport and iPhone-style system bar
- bottom navigation for map / record / personal
- personal sheet
- record summary page
- settings page
- existing sensing and word-selection logic retained as the first bridge layer
