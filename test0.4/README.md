# test0.3

`test0.3` is the mobile-oriented branch of the World Skin prototype.

## What stays separate

- `../test0.2.html` remains the previous single-file prototype and is not used as the runtime entry for `test0.3`.
- `test0.3/` is an independent package so the mobile UI can evolve without destabilizing the older prototype.

## Current package structure

- `index.html` — document structure and mobile screen layout
- `styles.css` — visual system and mobile shell styling
- `app.js` — map, sensing, state, and interaction logic copied forward from `test0.2`
- `data/` — local copies of the existing world/personal/test data files

## Current integration direction

`test0.3` keeps the `test0.2` map/data engine, but begins replacing the old desktop-like shell with the newer mobile UI language:

- phone-sized viewport and iPhone-style system bar
- bottom navigation for map / record / personal
- personal sheet
- record summary page
- settings page
- existing sensing and word-selection logic retained as the first bridge layer
