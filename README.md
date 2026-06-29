# Badrikanath Praharaj — personal website

A hand-built static site (plain HTML/CSS/JS — no framework, no build step).
Dark "robotics" theme. Everything in this `site/` folder is what gets published.

## Preview locally
```bash
cd site
python3 -m http.server 8000   # → http://localhost:8000
```

## Deploy to GitHub Pages (recommended: user site)
1. Create a repo named **`Badri1401.github.io`**.
2. Push the **contents of this `site/` folder** to the repo root:
   ```bash
   cd site
   git init && git add . && git commit -m "Personal website"
   git branch -M main
   git remote add origin https://github.com/Badri1401/Badri1401.github.io.git
   git push -u origin main
   ```
3. Live at **https://Badri1401.github.io** in a minute or two.
   `.nojekyll` is included so files are served as-is.

## Affiliations shown (correct if wrong)
- MineXplore / SENTINEL / CADENCE / Subterra → "Independent research"
- ROSMASTER → "Personal build" · HexaGrip & WeedSense → "VIT Bhopal"
- Multi-robot coordination & Event-Triggered Lyapunov-Safe RL → "IISc Bengaluru"
- REVEAL → "Co-author"

## Still to add
- Demo videos: four `▶ Demo soon` slots reserved (MineXplore, SENTINEL, CADENCE, Subterra) — drop in screen recordings.
- Optional arXiv links for MineXplore / CADENCE / Subterra (none found on Scholar yet).

## Links
Set in `js/main.js` → `CONFIG` (GitHub, Scholar, LinkedIn — already filled in).

## Structure of `index.html` (top → bottom)
Nav · Hero · Now · Research focus · Publications · Projects ·
Experience · Skills + Education · Leadership & service · Beyond research · Footer.
