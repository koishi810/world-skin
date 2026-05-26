# Figma Import Spec

## Source
- Local baseline: `test0.3/`
- Target: `test0.4/`
- Figma reference assets: `test0.4/assets/figma/`
- Rule source: `UI_skill/components_and_icons.md`, `UI_skill/layout_and_layers.md`, `UI_skill/state_machine.md`

## Decision
- Rebuild `test0.4` from `test0.3` instead of patching the previous partial `0.4`.
- Preserve the complete `0.3` interaction model: world, sense, radius, profile, records, settings, modal, storage, and map controls.
- Remove whole-frame Figma exports such as `home-closed.svg`, `radius-closed.svg`, and `sense.svg` from `test0.4/assets/figma/` so they cannot be rendered as UI layers by mistake.

## Web Mapping
- HTML: restore `test0.3` view structure and modal structure into `test0.4`.
- CSS: restore `test0.3` mobile shell, profile/records/settings, and full staged sense visual system; update bottom nav overlay to the `素材3.0` closed/open coordinates.
- JS: restore `test0.3` state machine and recording flow.
- Assets: restore split interactive assets from `test0.3/assets/figma/`; replace bottom nav icons with extracted `素材3.0` paths for world, sense, and personal.

## Verification
- Check JS syntax.
- Check all referenced local assets load from `test0.4`.
- Run a static server and inspect `test0.4`.
