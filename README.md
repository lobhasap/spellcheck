# Spellcheck

Spellcheck is a browser-based spelling game. Listen to spoken word prompts, type your answer, and practice spelling at different difficulty levels.

## Play

Open `index.html` in a browser, choose a game mode, and follow the on-screen prompts. For the most reliable audio and clipboard behavior, run the project from a local web server or host it as a static site (for example, with GitHub Pages).

There is no build step or package installation required.

## Game modes

- **Daily challenge** — a new set of words each day, with results you can copy and share. Completion is remembered in the browser for that puzzle.
- **Practice** — choose easy, medium, or hard and keep playing until you run out of lives.
- **Spell Off** — a longer spelling challenge.
- **YouTube words** — practice with the project's YouTube word list.

Unfinished games save progress in the current browser tab and can be restored after a reload. Closing the tab clears that session progress. Theme preference (light or dark) and daily completion are stored locally in the browser; they are not synced between devices.

## Run locally

From the repository root, start any static web server. For example, with Python:

```sh
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Project structure

- `index.html`, `mode_select.html` — welcome and mode selection screens
- `solo_game.html`, `practice_game.html`, `spelloff.html`, `youtube.html` — game screens
- `results.html`, `practice_results.html`, `spelloff_results.html` — result screens
- `assets/scripts/` — game logic, word selection, progress storage, and theme preference
- `assets/styles/` — desktop and mobile stylesheets
- `assets/audio/` — spoken word prompts by difficulty

## Notes

- The interface supports light and dark themes and responsive desktop/mobile layouts.
- Font Awesome and Google Fonts are loaded from external CDNs, so those enhancements require an internet connection.
- Audio pronunciations and word-list spelling/dialect consistency should be reviewed by a human; the presence of an audio file does not guarantee its content has been verified.
