# Project Overview

Asteroids clone, plain HTML5 canvas + vanilla JS, no build/deps.

## Files

- `index.html` — canvas mount, 800x600, dark bg
- `game.js` (423 lines) — whole engine, single file
- `README.md` — Spanish docs
- `favicon.svg`

## Structure (game.js)

- Classes: `Bullet`, `Asteroid`, `Ship`, `Particle`
- Core loop: `update(dt)` → `draw()` → `loop(ts)` (rAF)
- Game states: `playing` / `dead` / `gameover`
- Helpers: `wrap` (toroidal space), `dist`, `rand`, `randInt`

## Mechanics

- Ship rotate/thrust/shoot, 3 lives w/ blink invincibility on respawn
- Asteroids split large→medium→small on hit (sizes via `RADII`/`SPEEDS`/`POINTS` arrays)
- Scoring: large 20, medium 50, small 100
- Explosion particles, level progression (`nextLevel`)
- Power-ups + shooting-star asteroid type (per README)

## Run

Double-click `index.html`, or:

```bash
npx serve .
```
