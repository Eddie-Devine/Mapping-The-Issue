# INSTRUCTIONS.md — Build "Roots & Branches"
### An interactive pixel-art website that maps the vegetarian debate

> **Read this file first, then read every file it links to before writing any code.**

---

## 0. Your role, Claude Code

You are the **builder**, not the researcher. All research, facts, quotes, and sources have already been gathered and checked. Your job is to take that content and present it as an **unforgettable, interactive, pixel-art website shaped like a giant tree**, then deploy it to **GitHub Pages**.

The site replaces a school paper for a **"Mapping the Issue"** assignment. It has to be **fun and impressive** *and* meet every academic requirement (listed in §3). A teacher will grade it.

### Ground rules (non-negotiable)
1. **Don't invent facts, numbers, quotes, or sources.** Use only what's in `content/` and `SOURCES.md`. If something seems missing, leave a visible `TODO` and list it in your final report. Don't fill gaps from your own knowledge.
2. **Keep the wording.** You may split text into dialog-box pages and fix obvious typos, but don't change meaning, soften claims, or add opinions.
3. **Every fact keeps its citation.** Each `[src:id]` tag in the content becomes a clickable citation chip linked to the Works Cited page.
4. **Stay fair.** This is a *map*, not an argument. All three positions get the same visual care, polish, and screen space. Branch 3 (pro-meat) is **not** the villain branch.
5. **Real people: no likenesses, no photos, no logos.** Real people appear as generic pixel sprites with name labels, or as icons (see `content/cast.md`). No brand logos (TikTok, Netflix, JRE, Virginia Slims, Lucky Strike, etc.). Don't embed or reproduce ads or video clips; link to sources instead.
6. **All art is original**, drawn in code (see `DESIGN.md` §7).
7. **Sensitive content:** never spell out the slur mentioned in That Vegan Teacher sources. The disordered-eating mention gets the gentle support line specified in `05-trunk-modern-history.md`.

---

## 1. File map (read all of these)

| File | What it is |
|---|---|
| **`INSTRUCTIONS.md`** | This file: what to build, tech stack, build order, checklist |
| **[`DESIGN.md`](DESIGN.md)** | Visual & interaction spec: the tree world, pixel-art style, palette, fonts, HUD, zones, Read Mode |
| **[`SOURCES.md`](SOURCES.md)** | Master bibliography in MLA 9 with IDs. Source of truth for the Works Cited page |
| **[`content/01-intro.md`](content/01-intro.md)** | Surface: title, "They Say," thesis, Who Cares, So What |
| **[`content/02-roots-evolution.md`](content/02-roots-evolution.md)** | Taproot: human evolution & diet |
| **[`content/03-roots-ancient-india.md`](content/03-roots-ancient-india.md)** | India root: Vedic → Jain → Buddhist → yogis; Yogananda, Gandhi, Sherpas, Dalai Lama |
| **[`content/04-roots-ancient-greece.md`](content/04-roots-ancient-greece.md)** | Greece root: Pythagoras, Seneca, Ovid, Plutarch, Porphyry, the word "vegetarian" |
| **[`content/05-trunk-modern-history.md`](content/05-trunk-modern-history.md)** | Trunk 1806→2026: 4 vines (movement, fitness industry, women & thinness, meat & masculinity) |
| **[`content/06-branch-1-body-and-mind.md`](content/06-branch-1-body-and-mind.md)** | Position 1: health/performance/mind. Alex Honnold, climbers, yogis |
| **[`content/07-branch-2-ethics-and-earth.md`](content/07-branch-2-ethics-and-earth.md)** | Position 2: animals & environment, plus **The Bramble** (That Vegan Teacher) |
| **[`content/08-branch-3-meat-and-might.md`](content/08-branch-3-meat-and-might.md)** | Position 3: the case for meat. Joe Rogan, masculinity, grazing, health risks |
| **[`content/09-crossroads-1-vs-2.md`](content/09-crossroads-1-vs-2.md)** | The Graft: Position 1 vs. 2 analysis |
| **[`content/10-crossroads-12-vs-3.md`](content/10-crossroads-12-vs-3.md)** | The Tangle: Positions 1 & 2 vs. 3, 4-round VS showdown |
| **[`content/11-canopy-conclusion.md`](content/11-canopy-conclusion.md)** | Canopy: conclusion |
| **[`content/timeline.md`](content/timeline.md)** | Timeline data for the Time Scrubber |
| **[`content/cast.md`](content/cast.md)** | Every sprite/character and how to depict real people |
| `docs/original-draft-instructions.md` | The student's first rough draft (for context only; superseded by this file) |
| `Paper.docx` | The student's earlier paper (context only; all usable content is already in `content/`) |

---

## 2. The concept in one paragraph

A visitor lands at the **base of a giant pixel-art tree** in the present day. Signposts tell them what "they say" about vegetarianism. They **dig down into the roots**, where deeper soil means older history: ancient India and ancient Greece side by side (little Greek people walking around the agora, a Jain monk sweeping ants out of his path, a levitating yogi), and at the very bottom, early humans around a fire. A **time-warp vine** shoots them back up, and they **climb the trunk** from 1806 to 2026 while four colored vines (the vegetarian movement, the fitness industry, diet pressure on women, and meat & masculinity) twist upward. The trunk splits into **three branches**, one per position: a granite cliff with a tiny free-soloing climber (Body & Mind), a lush forest with a thorny bramble (Ethics & Earth), and a sunset ranch with a podcast treehouse (Meat & Might). Branches 1 & 2 **graft** together; then everything **tangles** in a retro fighting-game showdown with **no winner**. At the canopy, the climber looks out over the whole map.

Full detail: **`DESIGN.md`**.

---

## 3. Assignment requirements → where they live (must all be present)

| Assignment requirement | Where on the site | Content file |
|---|---|---|
| **Intro: "They say"** (situate in the conversation) | Surface signposts A/B/C | `01-intro.md` |
| **Thesis** promising to describe the most significant positions | "The Map" signpost | `01-intro.md` |
| **Who cares? / So what?** | Signposts 3 & 4 | `01-intro.md` |
| **Background**: what caused the issue, what prompted past and present interest, who's interested and why | Roots + Trunk | `02`–`05` |
| **Position 1**: claim, reasons, warrants, evidence, sources | Branch 1 + Position Card | `06` |
| **Position 2**: claim, reasons, warrants, evidence, sources | Branch 2 + Position Card | `07` |
| **Position 1 vs. 2**: intersection & divergence, and *why* (competing interests? different focus? different evidence? same evidence read differently?) | The Graft | `09` |
| **Position 3**: claim, reasons, warrants, evidence, sources | Branch 3 + Position Card | `08` |
| **Positions 1 & 2 vs. 3**: same analysis | The Tangle | `10` |
| **Hyperlinks** for digital submission | Every citation chip links to Works Cited; Works Cited entries link to sources | `SOURCES.md` |
| **Separate Works Cited page** (MLA) | `works-cited.html` | `SOURCES.md` |

**Position Cards:** Each branch must have a **"stats card"** (like an RPG character sheet) showing **CLAIM / REASONS / WARRANTS / WHERE IT'S WEAK** from the content file's `POSITION CARD` section, with each section collapsible. Use the **identical layout** for all three so they can be compared side by side. Also add a **"Compare all 3"** button that shows the three cards next to each other (stacked on mobile).

---

## 4. Tech stack

Keep it simple, static, and free to host.

- **Build tool:** [Vite](https://vitejs.dev/) (latest stable), **vanilla JavaScript (ES modules)**, HTML, CSS. No React needed. (TypeScript optional.)
- **Rendering:** DOM + CSS for layout and dialog boxes; `<canvas>` for sprites and animated scenes (`image-rendering: pixelated`, `imageSmoothingEnabled = false`).
- **Scrolling/animation:** native scroll + `IntersectionObserver` + one shared `requestAnimationFrame` loop. GSAP + ScrollTrigger are allowed if they make the time-warp and parallax smoother; pin an exact version.
- **Content pipeline:** the `content/*.md` files are the **source of truth**. Write a small build script (`scripts/build-content.mjs`) that parses them into `src/data/*.json` using the consistent structure:
  - `### LEAF <id> — <title>` starts a leaf
  - `- **Type:**`, `- **Text:**`, `- **Pixel scene:**`, `- **Sources:**`, `- **Note…**` are fields
  - `## POSITION CARD` sections → position-card data
  - Markdown tables in `09`/`10`/`timeline.md` → structured data
  - `[src:id]` → citation objects (fail the build with a clear error if an ID isn't in `SOURCES.md`)
  - Lines inside `> **For Claude Code:** …` blockquotes, `**Accuracy note:**` lines, and `**Note for Claude Code:**` lines are **instructions to you**. Never display them on the site.
  - Use a markdown parser (e.g., `marked`) for inline bold/italics. If a parser is overkill for some section, hand-convert it, but keep wording verbatim.
- **Pages:** `index.html` (the tree world), `works-cited.html` (generated from `SOURCES.md`), and Read Mode at `read.html` (or `index.html?mode=read`).
- **Fonts:** Google Fonts (Press Start 2P, Pixelify Sans or Silkscreen, VT323 or Atkinson Hyperlegible). See `DESIGN.md` §2.
- **No backend, no database, no API keys, no analytics/trackers.** `localStorage` only for leaf-collection progress and settings, always inside `try/catch`.
- **Hosting:** GitHub Pages via GitHub Actions (§7).

### Suggested project structure
```
/ (repo root)
├─ INSTRUCTIONS.md  DESIGN.md  SOURCES.md
├─ content/                 ← source of truth (markdown)
├─ docs/original-draft-instructions.md
├─ scripts/build-content.mjs
├─ public/                  ← favicon (pixel leaf), og-image
├─ src/
│  ├─ main.js               ← boots the world
│  ├─ world/                ← camera, zones, parallax, time-warp
│  ├─ sprites/              ← one file per character (text-grid pixel art)
│  ├─ scenes/               ← one file per zone scene
│  ├─ ui/                   ← dialog box, HUD, minimap, timeline, position cards, VS screen
│  ├─ data/                 ← generated JSON (git-ignored or committed, your call)
│  ├─ styles/               ← palette.css, ui.css, read-mode.css
│  └─ audio/                ← Web Audio sfx (optional)
├─ index.html  works-cited.html  read.html
├─ vite.config.js           ← set `base` for GitHub Pages
└─ .github/workflows/deploy.yml
```

---

## 5. Citations & Works Cited

- In dialog boxes, render each `[src:id]` as a small pixel chip, e.g., **`[POORE & NEMECEK 2018]`**: author last name(s) + year, derived from `SOURCES.md`.
- Chip → opens `works-cited.html#src-<id>` in a new tab. Tooltip on hover/focus shows the full title.
- **`works-cited.html`:** heading "Works Cited," entries **alphabetized**, **MLA 9 format** exactly as written in `SOURCES.md`, **hanging indent** (0.5in), double-spaced feel, each URL clickable, each entry with `id="src-<id>"`. Style it to match the site (pixel header, readable body) but keep it clean and printable (`@media print`).
- **Don't show the ✅/📄/⚠️ status icons** or the "Research leads" / "need fixing" sections on the website. Those are notes for the student.
- Add a "Back to the tree 🌳" link at the top.

---

## 6. Build order (work in phases; check in after each)

After each phase, run the site locally, take a screenshot, and summarize what's done and what's next. Don't move on with broken basics.

**Phase 1: Skeleton & content pipeline**
- Vite project, folder structure, palette & fonts, `build-content.mjs` producing JSON, `works-cited.html` generated and working.
- **Read Mode** working end-to-end with ALL content in assignment order. (This guarantees the assignment is complete before any art exists.)

**Phase 2: The world**
- The vertical world with all zones laid out (placeholder colored blocks are fine): Canopy, Tangle, Graft, 3 Branches, Trunk, Surface, India/Greece roots, Taproot.
- Camera/scroll, page loads at the Surface, dig-down flow, time-warp elevator, climbing up.
- Minimap + year counter HUD.

**Phase 3: Content in the world**
- Leaves placed in each zone; dialog box with typewriter text, paging, citation chips.
- Position Cards + "Compare all 3."
- The Graft comparison platform and The Tangle VS rounds.
- Timeline scrubber from `timeline.md`.

**Phase 4: Pixel art & life**
- Sprites and scenes from `content/cast.md` and the "Pixel scene" notes. **Priority order:** (1) the Climber avatar, (2) Honnold's free-solo wall, (3) the Greek agora with walking citizens, (4) the Jain monk & yogi, (5) the hominin campfire, (6) Rogan's podcast treehouse, (7) the Bramble megaphone + NPC push-away, (8) everything else.
- Parallax backgrounds, ambient loops, leaf sparkle, collection counter.

**Phase 5: Polish**
- Time-warp time-lapse effect, title screen, sound effects (off by default), Easter eggs (optional), mobile layout, reduced motion.

**Phase 6: Ship**
- Accessibility & performance pass (§8), GitHub Pages deploy (§7), final report (§9).

---

## 7. Deploy to GitHub Pages

1. Initialize git, commit, and (with the student) create a **public** GitHub repo, e.g., `roots-and-branches`.
2. In `vite.config.js`, set `base: '/roots-and-branches/'` (match the repo name). Make sure `works-cited.html` and `read.html` are included as build inputs (`build.rollupOptions.input`).
3. Add `.github/workflows/deploy.yml` using the official **GitHub Pages Actions** (`actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`) to build with Node LTS and deploy `dist/`.
4. In the repo: **Settings → Pages → Source: GitHub Actions**.
5. Push to `main`. The site will be at `https://<username>.github.io/roots-and-branches/`.
6. Verify the live site: all three pages load, citation links work, no 404s for assets.

Explain each step to the student in plain language. They may not have used GitHub before. Ask them for their GitHub username before creating anything.

---

## 8. Quality checklist (definition of done)

**Assignment**
- [ ] Every row in §3 is present and easy to find (Read Mode in order; minimap labels in the world).
- [ ] Every fact on screen has a working citation chip. Build fails on unknown `[src:id]`.
- [ ] `works-cited.html` is MLA 9, alphabetized, hanging indent, all links clickable.

**Fairness & accuracy**
- [ ] All wording matches `content/`. No invented facts, quotes, or numbers.
- [ ] The three branches get equal visual polish and size.
- [ ] Real people are generic sprites/icons with labels. No logos, ads, or photos.

**Fun**
- [ ] Greek citizens walk around the agora. The climber free-solos the wall. The yogi levitates. The time-warp feels great.
- [ ] Leaves bob/sparkle; collection counter works; VS showdown works; Bramble pushes NPCs away.

**Accessibility**
- [ ] Fully usable by keyboard with a visible focus ring; dialog boxes trap focus while open and return it on close.
- [ ] Canvas scenes have text alternatives (`aria-label` or visually hidden descriptions); every leaf is a real `<button>`.
- [ ] `prefers-reduced-motion` respected; Read Mode available at its own URL.
- [ ] Text contrast ≥ 4.5:1; body text ≥ 18px (≥ 22px for pixel fonts).

**Performance & devices**
- [ ] Smooth on a phone; works at 375px width with no horizontal scroll; off-screen animations paused.
- [ ] Lighthouse: Performance ≥ 85, Accessibility ≥ 95.
- [ ] Works when `localStorage` is blocked (private browsing).

---

## 9. Final report (when done)

Tell the student, in plain language:
1. The live URL (and Read Mode + Works Cited URLs).
2. How to edit text later (edit `content/*.md`, then push; explain the content build).
3. Any `TODO`s you left and why.
4. Reminder: **open every ⚠️ source in `SOURCES.md` and confirm its details before submitting.**

---

## 10. If you're unsure, ask the student

Good reasons to stop and ask: GitHub username/repo name; whether to include sound at all; if a design idea here turns out to be technically impractical (propose an alternative); anything that would require adding new facts. **Don't** ask about things already decided in these files.
