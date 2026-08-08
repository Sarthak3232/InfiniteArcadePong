# Infinite Arcade Pong

A Chrome extension that turns your toolbar into a neon arcade Pong machine. Click the icon, get a game.

**v1.0 is live on the Chrome Web Store** with 2.65k installs:
https://chromewebstore.google.com/detail/infinite-arcade-pong/njfeembanlhghknbkgaeechjmdndgmoi?hl=en

This repo is the ground-up rebuild for v2.0 — same idea, cleaner codebase, more polish (neon glow aesthetic, better controls, difficulty settings, persistent high scores).

## Project structure

```
/
├── manifest.json       # Manifest V3 config
├── package.json        # sass build scripts
├── README.md
├── src/
│   ├── popup.html      # Popup markup: canvas + status bar
│   ├── styles.scss     # Theme variables + neon glow utility (source)
│   ├── styles.css      # Compiled CSS, linked from popup.html
│   ├── main.js         # Entry point (game logic lives here)
│   └── lib/
│       └── jquery.min.js  # Vendored locally, MV3 CSP blocks CDN scripts
├── assets/
│   ├── img/            # Sprites, backgrounds, UI art
│   └── sfx/            # Sound effects
└── icons/              # Extension icons (16/48/128)
```

## Tech

HTML, SCSS, JS, jQuery, and `<canvas>`. SCSS needs a compile step; everything else loads as-is with no bundler.

## Development

```
npm install
npm run build:css   # compile src/styles.scss -> src/styles.css once
npm run watch:css    # recompile on save while you work
```

Run `build:css` before loading the unpacked extension in `chrome://extensions` so `styles.css` is up to date with your SCSS changes.

## Theme

Navy background, neon green accents, white ball/paddles, red status bar. Theme colors are SCSS variables in `src/styles.scss`, also exposed as CSS custom properties so `main.js` can read them at runtime for canvas colors.
