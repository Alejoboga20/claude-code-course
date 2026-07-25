# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Asteroids arcade clone in pure HTML5 canvas + vanilla ES6 JS. No build tools, no bundler, no dependencies, no package.json.

## Running

Open `index.html` directly in browser, or serve locally:

```bash
npx serve .
```

No build/lint/test commands exist — there is no test suite or linter configured.

## Architecture

Everything lives in `game.js` (single file, no modules). `index.html` just mounts an 800x600 canvas and loads it.

- **Entity classes**: `Bullet`, `Asteroid`, `Ship`, `Particle` — each has `update(dt)` and `draw()`.
- **Game loop**: `loop(ts)` (via `requestAnimationFrame`) → `update(dt)` → `draw()`. `dt` is clamped to 0.05s max.
- **Game state machine**: global `state` var is `"playing"` / `"dead"` / `"gameover"`, branched at the top of `update()`.
- **Toroidal space**: all entities wrap position via `wrap(v, max)` — screen edges connect (asteroids/bullets/ship reappear on the opposite side).
- **Asteroid sizes**: size `3` (large) → `2` (medium) → `1` (small), splitting into two smaller ones on hit via `Asteroid.split()`. Per-size constants: `RADII`, `SPEEDS`, `POINTS` arrays (index = size).
- **Collision**: brute-force O(n*m) distance checks each frame (bullets vs asteroids, ship vs asteroids) using `dist()`.
- **Input**: raw `keys` map for held keys, `justPressed`/`pressed()` for single-press edge detection (used for shoot and restart).
- Global mutable state (`ship`, `bullets`, `asteroids`, `particles`, `score`, `lives`, `level`) is reassigned directly by `initGame()` / `nextLevel()` / `killShip()` — no encapsulation, no classes wrapping game state.

## Notes

- Comments and README are in Spanish; code identifiers are in English.
- README/overview mention power-ups and a "shooting star" asteroid type — these are **not** implemented in `game.js` as it currently stands. Don't assume they exist without checking the code first.
