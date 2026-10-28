# ilo-site

The website for ilo, the open-source Arc-style browser. The browser itself is
[MartinPTielemans/browser](https://github.com/MartinPTielemans/browser); its `AGENTS.md`
doesn't apply here, and nothing here is built into the browser.

The site is plain static files: HTML and CSS, with JavaScript only where an interaction needs
it. There's no build step, so `public/` is what gets served. Open `public/index.html` in a
browser, or run `python3 -m http.server -d public`, to see it.

## What we never compromise on

1. **The site is as fast as the browser claims to be.** No framework, no client-side rendering,
   no web fonts it can do without, and no third-party scripts: no analytics, trackers or chat
   widgets. Video is lazy and muted, and loads only when it's on screen.
2. **Native scrolling.** No smooth-scroll libraries and no scroll-jacking. Everything that moves
   can be interrupted: a click during an animation acts at once.
3. **One goal per page.** The home page exists to get people to download ilo. Every section
   leads there or one layer deeper, and nothing competes with the download button.
4. **Show the real product.** Real captures of ilo, never mockups passed off as the app, and
   never Arc's or Dia's icons, fonts, images or names.

## Brand

- The name is **ilo**, lowercase everywhere, even at the start of a sentence. The tagline is
  "a good tool."
- Palette: Paper `#F3F0E8`, Ink `#16140F`, Signal green `#0E9F55`.

## Commits and pull requests

- Commit only when asked, with `git commit -s`. The `Signed-off-by` line is the owner's DCO
  certification.
- Authorship is human only: no `Co-Authored-By` trailers and no "Generated with" lines.
- Conventional commit titles in plain language, describing the outcome.
- Never open a PR unless asked. The body follows `.github/pull_request_template.md`. A visual
  change carries before-and-after captures, and motion a short video.
