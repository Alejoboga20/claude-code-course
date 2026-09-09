# SPEC 01 — Arkanoid MVP

> **Status:** Draft
> **Depends on:** none
> **Date:** 2026-09-09
> **Objective:** Build a playable single-level Arkanoid MVP where the player moves a paddle to bounce a ball, breaks blocks to score points, and either clears the level to win or loses all lives, with sound, a live HUD, and win/game-over overlays that let the player restart.

---

## Scope

**In:**

- One fixed, hardcoded block layout (single level).
- Paddle movement via keyboard (arrow keys or A/D) and via mouse move, both active simultaneously.
- Ball physics: constant speed, reflects off left/right/top walls and off the paddle, with paddle bounce angle depending on hit position (not a plain vertical reflect).
- Block collision: ball breaks a block on contact, block disappears, flat +10 score per block regardless of color.
- Live HUD (score, remaining lives) rendered on the canvas.
- 3 lives; missing the paddle loses a life and resets the ball to rest on the paddle awaiting relaunch.
- "Waiting to start" state: ball rests on the paddle until the player triggers launch (key/click); no movement before that.
- Game Over overlay (all lives lost) and You Win overlay (all blocks cleared), each with a restart control.
- Restart resets score, lives, blocks, ball, and paddle, returning directly to a playable (ball-resting) state.
- Sound effects: `assets/sounds/ball-bounce.mp3` on wall/paddle bounce, `assets/sounds/break-sound.mp3` on block break.
- Fixed canvas size, 480x640.
- Rendering via the existing `assets/spritesheet.js` API (`loadSpritesheet`, `drawSprite`).

**Out of scope (for future specs):**

- Multiple levels / level progression.
- Power-ups (multi-ball, paddle size change, etc.).
- Pause/resume control.
- High-score persistence (localStorage or otherwise).
- Mobile/touch controls.
- Difficulty ramping (ball speed increasing over time).
- Automated tests (no test runner exists in this repo yet).

---

## Data model

```js
// Game state, held in main.js
const state = {
  phase: 'waiting', // 'waiting' | 'playing' | 'game-over' | 'win'
  score: 0,
  lives: 3,
};

const paddle = { x, y, width, height, speed };

const ball = { x, y, radius, dx, dy, speed };

// Block grid: fixed rows x cols matrix, one entry per cell.
// null = already broken / no block. String = SPRITES.blocks color key.
const blocks = [
  ['red', 'red', 'yellow', 'yellow', 'cyan', 'cyan'],
  // ...more rows, hardcoded
];
```

Conventions:

- Coordinates: origin top-left, matching canvas and `assets/spritesheet.js` sprite rect conventions.
- Velocities in pixels/frame, applied inside the `requestAnimationFrame` loop.
- Block colors must be one of the keys already defined in `SPRITES.blocks` in `assets/spritesheet.js` (gray/red/yellow/cyan/magenta/hotpink/green), since `drawSprite('block_<color>', ...)` looks them up directly.

---

## Implementation plan

1. Create `index.html` with a `480x640` `<canvas>`, link `style.css`, and load `assets/spritesheet.js` then `main.js` (in that order) via `<script>` tags.
2. Add `style.css`: center the canvas on the page, dark background. Manual test: open `index.html`, see an empty centered canvas.
3. In `main.js`, get the canvas 2D context, call `loadSpritesheet`, and start a `requestAnimationFrame` loop that draws a "Click or press a key to start" message once the sheet is loaded. Manual test: message appears after load.
4. Add the paddle: draw it via `drawSprite('paddle', ...)`, implement keyboard (ArrowLeft/ArrowRight or A/D) and `mousemove` control, clamped to canvas width. Manual test: paddle moves both ways with keyboard and mouse.
5. Add the ball: draw it via `drawSprite('ball', ...)`, resting centered on the paddle while `state.phase === 'waiting'`. Manual test: ball follows paddle before launch.
6. Implement launch: a key press or click while `waiting` sets `state.phase = 'playing'` and gives the ball its initial fixed velocity. Manual test: ball leaves the paddle on trigger, not before.
7. Implement wall and paddle collision: bounce off left/right/top walls; on paddle hit, compute rebound angle from hit position relative to paddle center; play `ball-bounce.mp3` on every such bounce. Manual test: ball bounces convincingly off walls and paddle, sound plays.
8. Implement the block grid: draw all blocks from the hardcoded matrix via `drawSprite('block_' + color, ...)`; add AABB collision between ball and each live block; on hit, set that cell to `null`, add 10 to `state.score`, play `break-sound.mp3`. Manual test: hitting a block removes it and plays a sound.
9. Render the HUD: draw current score and lives as text on the canvas each frame. Manual test: score/lives update live during play.
10. Implement life loss: when the ball passes below the paddle, decrement `state.lives`; if `lives > 0`, reset the ball to `waiting` on the paddle; if `lives === 0`, set `state.phase = 'game-over'`. Manual test: losing 3 times ends the run.
11. Implement the win check: when every cell in `blocks` is `null`, set `state.phase = 'win'`. Manual test: clearing all blocks ends the run as a win.
12. Implement the Game Over and You Win overlays, each with a restart control that resets `state`, `paddle`, `ball`, and `blocks` and returns to `waiting`. Manual test: both overlays show at the right time and restart fully resets the game.

---

## Acceptance criteria

- [ ] `index.html` loads the canvas, spritesheet, and sounds with no console errors.
- [ ] Before the first launch action, the ball rests on the paddle and does not move on its own.
- [ ] The paddle moves via ArrowLeft/ArrowRight (or A/D) and via mouse move, clamped within the canvas bounds.
- [ ] A launch action (key/click) starts the ball moving at a fixed speed.
- [ ] The ball bounces off the left, right, and top walls, and off the paddle, with the paddle bounce angle changing based on where the ball hit the paddle.
- [ ] `ball-bounce.mp3` plays on wall and paddle bounces.
- [ ] Hitting a block removes it, adds 10 to the score, and plays `break-sound.mp3`.
- [ ] Score and remaining lives are visible on screen and update live during play.
- [ ] The ball passing below the paddle decrements lives by 1 and resets the ball to rest on the paddle awaiting a new launch.
- [ ] Losing all 3 lives shows a Game Over overlay with a restart control.
- [ ] Clearing every block shows a You Win overlay with a restart control.
- [ ] Using the restart control resets score, lives, blocks, ball, and paddle, and returns to the waiting-to-launch state.
- [ ] Reloading the page does not preserve score or lives from the previous run (no persistence is used).

---

## Decisions

- **Yes:** single hardcoded block layout. Fastest path to a playable MVP; multi-level adds a level-progression data model this spec doesn't need yet.
- **Yes:** flat 10 points per block regardless of color. Avoids designing a color-to-points table before there's a reason to; easy to change later.
- **Yes:** keyboard and mouse both drive the paddle simultaneously, no exclusivity switch. Simpler input code, and having both active is not a real conflict for a single local player.
- **Yes:** paddle bounce angle depends on hit position. Matches classic Arkanoid feel and was an explicit preference over a plain vertical reflect.
- **Yes:** fixed 480x640 canvas. Matches the sprite sheet's coordinate space and avoids resize/scaling logic in the collision math.
- **No:** pause/resume. Descoped to keep the MVP tight; candidate for its own follow-up spec.
- **No:** high-score persistence. No storage/versioning needed for a first playable version.
- **No:** power-ups. Each one (multi-ball, paddle resize, etc.) carries its own state-machine considerations and deserves a dedicated spec.
- **No:** automated tests. No test runner exists in this repo; verification is a manual browser playtest per the acceptance criteria above.

---

## Risks

| Risk                                                                 | Mitigation                                                                                          |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Browser autoplay policies can block audio before any user gesture     | Sounds only ever trigger after the player's launch action or during active play, which already counts as user interaction. |
| `loadSpritesheet` is asynchronous; drawing before it resolves no-ops silently | Game loop only starts real rendering/collision logic inside the `loadSpritesheet` callback, matching the pattern already used in `assets/spritesheet.js`. |

---

## What is **not** in this spec

- Multiple levels or level progression.
- Power-ups of any kind.
- Pause/resume control.
- High-score persistence.
- Mobile/touch controls.
- Ball speed increasing over time.
- Automated test coverage.

Each one of those, if it lands, goes in its own spec.
