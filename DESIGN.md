# DESIGN.md — Pixel-Art Game Design Spec

> **For Claude Code:** This file describes **how the site looks, moves, and feels**. `INSTRUCTIONS.md` says *what* to build and in what order; the `content/` files say *what it says*. When this file and a content file disagree about wording, **the content file wins**. When they disagree about visuals, **this file wins**.

---

## 1. The Big Idea

**ROOTS & BRANCHES** is a vertical, scrolling, **16-bit pixel-art world shaped like one giant tree**. The visitor explores it like a retro platformer, but it's still a website: scrolling, clicking, and tapping all work, and nothing is locked behind "game skill."

```
                ☁️  CANOPY (conclusion)  ☁️
                 ╲   THE TANGLE (1&2 vs 3)  ╱
              THE GRAFT (1 vs 2)         ╲
          🌿 BRANCH 1   🌍 BRANCH 2   🔥 BRANCH 3
          Body & Mind   Ethics & Earth  Meat & Might
                ╲          │  🌵Bramble   ╱
                 ╲─────────┼─────────╱
                       TRUNK  (1806 → 2026, climbs UP)
                   4 vines: green / gold / pink / red
   ════════════════ GROUND / SURFACE (INTRO, 2026) ════════════════
              ROOTS (time goes BACK as you dig DOWN)
         🇮🇳 INDIA ROOT              🏛️ GREECE ROOT
      (Jains, Buddha, yogis)     (Pythagoras, Plutarch)
                 ╲                    ╱
                   ╲── TAPROOT ──╱
            Human evolution (3.4 million years ago)
```

### The journey (narrative order)
1. **Surface (Intro)**: the visitor lands at the base of the tree in 2026. "They Say" signposts, thesis, Who Cares, So What.
2. **Dig ↓ (Background, part 1: Roots)**: scroll/dig *down* through soil layers. **Deeper = older** (like real archaeology). Two roots side by side at the same depth (India & Greece, both ~500 BCE), then the deepest **Taproot** (human evolution).
3. **⚡ Time-warp elevator**: at the bottom of the taproot, a glowing root-vine button `▲ GROW!` whisks the visitor back up to the surface in a fast **time-lapse** (the year counter spins forward from 3,400,000 BCE to 1806 with soil layers flashing past). This is a showcase moment; make it feel great.
4. **Climb ↑ (Background, part 2: Trunk)**: climb the trunk *up* from **1806 → 2026**. Four colored vines spiral up it (green/gold/pink/red storylines).
5. **Branch out (Positions 1, 2, 3)**: the trunk splits into three branches. Visitor can explore in any order.
6. **The Graft (1 vs 2)**: Branches 1 & 2 fuse; comparison platform.
7. **The Tangle (1&2 vs 3)**: VS showdown, 4 rounds, "NO K.O."
8. **Canopy (Conclusion)**: summit view, final line, links to Works Cited.

> **Layout note:** The page is one tall vertical world. The **page should load scrolled to the Surface**, which sits about **40% of the way down** the page (roots below, tree above). Scrolling **down** = digging into roots; scrolling **up** = climbing the trunk. On first visit, the dig prompt leads down first (Intro → Roots → elevator → Trunk → Branches), but a visitor who scrolls up first should still have a good time.
> **If the bidirectional layout is too complex or janky, use this fallback:** a single top-to-bottom page in narrative order (Intro → Roots going down → elevator transition → Trunk → Branches → Canopy) where the "climb" is simulated with a parallax background that moves upward. Pick whichever you can make smooth; smooth beats clever.

---

## 2. Art Direction

### Style
- **16-bit era** (SNES / Game Boy Advance feel), not 8-bit. Readable, colorful, detailed.
- **Base pixel unit:** draw sprites and tiles at native size (characters **16×16** or **16×24**, tiles **16×16**) and scale up by an integer (**×3 or ×4**) with `image-rendering: pixelated`. Never blur, never use fractional scaling for pixel art.
- **Everything is original.** Create all sprites/tiles yourself in code (see §7). No downloaded sprite packs unless they're explicitly **CC0** and credited in a `CREDITS.md`.

### Palette
Use one shared **32-color palette** defined as CSS custom properties and a JS array, so the whole world feels unified. Suggested zones:

| Zone | Mood | Key colors |
|---|---|---|
| Sky / Canopy | Dawn, hopeful | `#1b1f3b` night top → `#f6a96b` peach → `#ffe8a3` glow |
| Surface | Meadow, present day | `#3e8948` grass, `#8fd16a` highlights, `#6b4226` dirt |
| Taproot | Deep time, mysterious | `#2b1d14` soil, `#5a3a22` clay, `#c9a66b` fossil-glow |
| India root | Warm, spiritual | `#e07a1f` saffron, `#b5452a` terracotta, `#2f6b4f` banyan green, `#f2d16b` gold |
| Greece root | Bright, classical | `#f4efe6` marble, `#3c7dbf` Aegean, `#7a8b3a` olive, `#c95b3b` pottery red |
| Trunk | Bark | `#5b3a29`, `#7c5136`, `#a0714f` |
| Vines | Storylines | green `#5bd16a`, gold `#f2c14e`, pink `#f28ab2`, red `#e04a3f` |
| Branch 1 | Granite & sun | `#9aa3ad` granite, `#5fb0e8` sky, `#f2c14e` sun |
| Branch 2 | Lush forest & earth | `#2f8f4e`, `#1f5f3a`, `#4aa3df` water |
| Bramble | Thorny, sour | `#4b3b47` thorn purple, `#8a2f45` dark red |
| Branch 3 | Autumn ember | `#d9622b` ember, `#8c2f1c` deep red, `#4a2a1a` leather, `#6b4fa0` dusk |

Validate **text contrast** (≥ 4.5:1) for every dialog box.

### Typography
- **Headings / UI / HUD:** a pixel font. Use **"Press Start 2P"** for big titles only (it's hard to read at length) and **"Pixelify Sans"** or **"Silkscreen"** for buttons and labels (Google Fonts).
- **Body text in dialog boxes:** must be **easy to read for a long time**. Use **"VT323"** at a large size (≥ 22px), *or* a clean readable font like "Atkinson Hyperlegible" inside pixel-framed boxes. Test both and choose the more readable one. **Readability beats retro.**

### UI chrome
- **Dialog boxes:** classic RPG style: dark navy box, 2px light border with a pixel "notch" corner, text that **types out** letter by letter (skippable instantly by click/Enter/Space, and disabled under reduced motion). Box shows: Leaf title, text, citation chips, and a "◀ PREV  NEXT ▶" if the text is paged.
- **Citation chips:** small pixel "tags" like `[POORE 2018]` at the bottom of each dialog. Clicking opens the Works Cited page at that source's anchor (`works-cited.html#src-poore2018`) in a new tab. Hover/focus shows a mini tooltip with the full title.
- **Leaves (clickable objects):** leaves, fossils, scrolls, fruit. They **gently bob** and have a subtle sparkle so visitors know they're interactive. Visited leaves change to a slightly different shade (collected).

---

## 3. HUD (Heads-Up Display)

Fixed overlay, pixel-styled, unobtrusive:

- **Top-left: Year counter / altimeter.** Shows the era for wherever the camera is: `YEAR: 1847`, `~500 BCE`, `3,390,000 YEARS AGO`. Animates (odometer roll) as the visitor scrolls.
- **Top-right: Leaves collected** `🍃 12 / N` (N = total number of leaves, computed from the data). Saves progress in `localStorage` (wrapped in try/catch; the site must work if storage is blocked).
- **Right edge: Minimap.** A tiny pixel silhouette of the whole tree with a blinking dot for the visitor's position. Click any zone to fast-travel there (smooth scroll). Zones labeled on hover.
- **Bottom: Time Scrubber (toggle).** A horizontal timeline bar built from `content/timeline.md`. Dragging the scrubber flies the camera to that moment on the tree. Markers are colored by zone. On mobile, this collapses into a "🕰️ Timeline" button that opens a full-screen list.
- **Bottom-right: Settings gear.** Toggles: 🔊 Sound (OFF by default) · ✨ Motion (respects `prefers-reduced-motion`; user can override) · 📖 **Read Mode** (see §6) · 🎨 Climber color.
- **Vine filter (trunk zone only):** 4 colored buttons to show/hide the green/gold/pink/red storylines.

---

## 4. Zone-by-Zone Visual Spec

> Ambient animations should be **loops of 2–8 frames** at 6–10 fps, the classic pixel-art cadence. Parallax: 3 layers (far background slow, midground, foreground fast).

### Surface (Intro)
- Meadow at the base of a massive trunk. Sunrise sky. Grass sways. A couple of undecided "crowd" NPCs wander.
- Three wooden **signposts** ("THEY SAY…") + **The Map** signpost (thesis) + **Who Cares** & **So What** signposts.
- Title screen overlays this on first load: big `ROOTS & BRANCHES` logo built from pixel leaves, `▶ PRESS START` blinking.
- After all signposts are opened, a shovel appears: `▼ DIG INTO THE ROOTS`.

### Underground (Roots)
- Visible **soil strata** (horizontal bands) labeled with eras at the left edge like a museum cross-section. Roots snake through them.
- Small buried details: pottery shards (Greece), coins, a fossil ammonite, an arrowhead.
- **India root (left)** and **Greece root (right)** at the same depth, each opening into a cave-like "diorama chamber" lit warmly where its scene plays.
- **Taproot (bottom center)**: darkest, most mysterious; firelight glow from the hominin campfire.
- Particles: falling dirt specks when scrolling fast.

### Trunk
- Bark texture with **tree rings** visible in a cutaway section. Each decade is a ring labeled on the side.
- Four vines spiral upward; leaves along each vine are the events.
- Knots/holes in the bark open into mini-scenes (Sandow's stage, a 1928 candy shop, a 1968 billboard, a smartphone feed).

### Branch 1: Body & Mind
- Branch grows along a vertical **granite cliff face**. The climber sprite scales it (hero animation).
- A ledge with the meditating yogi; prayer flags at the tip. Hawk circles. A van parked in pine trees on a lower ledge.

### Branch 2: Ethics & Earth
- Lush leaves, birds, butterflies, a small pond (fish/shrimp/octopus), a grazing cow, a deer. A big **globe-fruit** hangs at the center (hero leaf).
- **The Bramble** thorny offshoot with megaphone figure and NPC push-away mechanic.

### Branch 3: Meat & Might
- Sunset autumn palette. A **treehouse podcast studio** ("ON AIR"), a campfire grill, hillside pasture with cattle, an elk on a ridge, a combine harvester on a field.
- Arm-wrestling table (steak vs. broccoli) mini-interaction.

### The Graft
- A fused wooden platform between Branches 1 & 2: two-color planks. Venn diagram of two overlapping leaves.

### The Tangle
- Retro fighting-game screen: "VS" splash, two health bars, round cards ("ROUND 1: HEALTH"). Background: knotted branches at sunset. **No winner**: final "NO K.O. — THE JUDGES DISAGREE."

### Canopy
- Above the clouds at sunrise. Climber sits at the top. Fireflies drift. Final text and buttons.

---

## 5. Interaction Model

| Input | Behavior |
|---|---|
| **Scroll / swipe** | Moves the camera through the world (primary navigation). The climber sprite auto-walks/climbs to follow the camera. |
| **Click / tap a leaf** | Opens its dialog box. |
| **Keyboard** | `↑ ↓` or `W S` scroll the world · `← →` or `A D` move between leaves in the current zone · `Enter`/`Space` open/advance dialog · `Esc` close · `M` minimap · `T` timeline · `R` Read Mode. Show a small key legend on first visit. |
| **Minimap / Timeline** | Fast travel. |
| **Hover / focus** | Leaves glow and show their title. All interactive things are reachable by `Tab` with a visible pixel focus ring. |

**Never trap the visitor.** All content is reachable by plain scrolling. Mini-games (arm wrestling, bar-chart toggle, VS rounds) are optional flourishes.

---

## 6. Read Mode (required: accessibility + grading)

A toggle that switches the whole site into a **clean, printable article view**: same content, in order (Intro → Background → Position 1 → Position 2 → 1 vs 2 → Position 3 → 1&2 vs 3 → Conclusion), with headings, normal text, and inline citation links. No animation. This is what a teacher, screen-reader user, or someone on a slow phone will use.
- Also auto-enable a reduced version (no typing effect, no parallax, no auto-animations) when `prefers-reduced-motion: reduce` is set.
- Read Mode must also be reachable at its own URL (e.g., `read.html` or `?mode=read`) so the student can submit it directly if needed.

---

## 7. How to Make the Pixel Art (technical approach)

Because everything must be original, **draw sprites in code**:
- Define each sprite as a **text grid** (one character per pixel) plus a palette map, e.g.:
  ```js
  // 'climber_idle_0': 16x16, '.' = transparent
  const climber = [
    "......RRRR......",
    ".....RRRRRR.....",
    // ...
  ];
  const palette = { R: "#d9622b", S: "#f2c9a0", K: "#1b1f3b", ... };
  ```
- Render grids to offscreen `<canvas>` once at load (or build-time to PNG sprite sheets with a small Node script), then draw/scale with `imageSmoothingEnabled = false`.
- Animations = arrays of frames. A tiny shared animation loop (`requestAnimationFrame`) ticks all visible sprites at 8 fps; pause anything off-screen (use `IntersectionObserver`).
- Backgrounds/tiles: same method, repeated with CSS or canvas patterns.
- Keep a `src/sprites/` folder with one file per character, so the student can tweak art later.

---

## 8. Sound (optional, OFF by default)
- Tiny chiptune sound effects made with the Web Audio API (no audio files needed): blip when text types, chime when a leaf is collected, whoosh for the time-warp elevator, "round bell" for the VS screen.
- Optional ambient loop per zone. Always **off** until the visitor turns it on.

---

## 9. Performance & Responsiveness
- Target **60 fps** scrolling on a mid-range phone. Only animate on-screen sprites.
- **Mobile (≤ 640px):** the tree narrows; branches stack vertically (Branch 1, then 2, then 3) instead of spreading sideways; minimap becomes a floating button; dialog boxes go full-width at the bottom of the screen; 16px side gutters; no horizontal page scroll.
- Total page weight goal: **< 3 MB**. No giant images.
