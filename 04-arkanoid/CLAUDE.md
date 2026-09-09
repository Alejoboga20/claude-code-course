# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Arkanoid/Breakout clone built with plain HTML, CSS, and JS — no dependencies, no build tool, no package.json. There is no bundler, linter, or test runner configured, so there are no build/lint/test commands to run.

The project is currently in early scaffolding: only the sprite assets and the spritesheet-loading module exist. There is no `index.html`, no game loop, and no paddle/ball/block gameplay code yet. When implementing gameplay, it should render to a `<canvas>` and pull sprites via the API in `assets/spritesheet.js` described below, since that module already encodes the coordinate layout of `assets/spritesheet-breakout.png`.

## Assets

- `assets/spritesheet-breakout.png` — the single sprite sheet image for all visual elements (paddle, ball, blocks, explosions).
- `assets/spritesheet.js` — loader and coordinate map for the sprite sheet. Key pieces:
  - `SPRITES` — pixel rects (`sx, sy, sw, sh`) for `paddle`, `ball`, and `blocks.<color>` (gray/red/yellow/cyan/magenta/hotpink/green).
  - `EXPLOSION_FRAMES` — per-color 4-frame explosion animations, each frame a pixel rect; `EXPLOSION_DURATION` (150ms) is the total playback time to divide across frames.
  - `loadSpritesheet(cb)` — loads the PNG onto an offscreen canvas once and queues callbacks until ready; safe to call multiple times before load completes.
  - `drawSprite(ctx, name, x, y, w, h)` — draws a static sprite by name onto `ctx` at the given position/size, scaling from its source rect. Block sprites use the `block_<color>` naming convention (e.g. `block_red`), which this function strips the `block_` prefix from to look up `SPRITES.blocks[<color>]`.
  - `drawFrame(ctx, frame, x, y, w, h)` — draws a single explicit frame rect (used for stepping through `EXPLOSION_FRAMES`).
  - Both draw functions no-op silently if the sheet hasn't finished loading (`ssLoaded` is false), so callers don't need to gate every draw call on load state themselves.
- `assets/sounds/ball-bounce.mp3`, `assets/sounds/break-sound.mp3` — sound effects for paddle/wall bounces and block breaks, not yet wired into any code.

## Formatting conventions

Existing JS in `assets/spritesheet.js` uses spaces inside parentheses (`loadSpritesheet( cb )`, `ctx.drawImage( ... )`) and object literals spread across aligned lines for the sprite/frame tables. Match this style in new code within this file rather than reformatting it to a different convention.
