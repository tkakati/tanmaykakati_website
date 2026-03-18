# Product Portfolio (Static)

This is a lightweight, single-page product portfolio with a “seasoned AI Product Manager” vibe.

## Run locally

- Open `portfolio/index.html` in your browser
- Or serve it:

```bash
cd "portfolio"
python3 -m http.server 5173
```

Then visit `http://localhost:5173`.

## Hero portrait (square crop)

The hero uses `hero-portrait.png` with CSS to show a square, top-centered crop. To generate a 1200×1200 square export (hat, face, shoulders):

```bash
cd portfolio
pip install Pillow
python3 crop_hero_square.py
```

Then in `index.html` set the hero image `src` to `./hero-portrait-square.jpg`.

## Customize

- Update contact links and email in `portfolio/index.html`
- Replace project copy in `portfolio/index.html` and case studies in `portfolio/script.js`
- Add more projects by duplicating a project card in `#projectsGrid`

