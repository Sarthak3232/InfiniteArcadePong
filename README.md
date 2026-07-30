# Infinite Arcade Pong

A Chrome extension that turns your toolbar into a neon arcade Pong machine. Click the icon, get a game.

**v1.0 is live on the Chrome Web Store** with 2.65k installs:
https://chromewebstore.google.com/detail/infinite-arcade-pong/njfeembanlhghknbkgaeechjmdndgmoi?hl=en

This repo is the ground-up rebuild for v2.0 — same idea, cleaner codebase, more polish (neon glow aesthetic, better controls, difficulty settings, persistent high scores).

## Project structure

```
/
├── manifest.json       # Manifest V3 config
├── README.md
├── src/
│   ├── popup.html      # Popup markup: canvas + status bar
│   ├── style.css       # Theme variables + neon glow utility
│   └── main.js         # Entry point (game logic goes here)
├── assets/
│   ├── img/            # Sprites, backgrounds, UI art
│   └── sfx/            # Sound effects
└── icons/              # Extension icons (16/48/128)
```

## Tech

HTML, CSS, JS, jQuery, and `<canvas>` — no build step.

## Theme

Navy background, neon green accents, white ball/paddles, red status bar. Colors are defined as CSS custom properties in `src/style.css` so they're easy to reuse or retheme.
