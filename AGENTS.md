# ilo-site

The website for ilo, the open-source Arc-style browser. The browser itself is
[MartinPTielemans/browser](https://github.com/MartinPTielemans/browser); its `AGENTS.md`
doesn't apply here, and nothing here is built into the browser.

The site is [TanStack Start](https://tanstack.com/start) (React) on
[Vite+](https://viteplus.dev/guide), whose `vp` CLI runs everything: `vp install`, `vp dev`,
`vp test`, `vp check` (Oxfmt, Oxlint and the type check; `--fix` formats), `vp build` and
`vp preview`. `vp build` prerenders every page, so `dist/client` is static files any host can
serve.

## What we never compromise on

1. **The site is as fast as the browser claims to be.** Every page is prerendered HTML that reads
   in full before any script runs; script only adds the interactions. Nothing renders on the
   client alone, nothing joins the client bundle the page can do without, and there are no web
   fonts it can do without and no third-party scripts: no analytics, trackers or chat widgets.
   Video is lazy and muted, and loads only when it's on screen.
2. **Native scrolling.** No smooth-scroll libraries and no scroll-jacking. Everything that moves
   can be interrupted: a click during an animation acts at once.
3. **One goal per page.** The home page exists to get people to download ilo. Every section
   leads there or one layer deeper, and nothing competes with the download button.
4. **Show the real product.** Real captures of ilo, never mockups passed off as the app, and
   never Arc's or Dia's icons, fonts, images or names.

## Traps

- A component's first render is the prerendered page, so its starting state is what a visitor
  sees before hydration, and what React expects to find. Read the window, the scroll or media
  queries in effects and handlers only.
- `src/entrances.ts` adds its classes outside React, which keeps them only on elements whose
  `className` React never changes. Listing one whose class follows state loses its entrance.
- `src/routeTree.gen.ts` is written by the router plugin on every `vp dev` and `vp build`.
  Commit it, or a fresh clone fails the type check before its first build.
- Files in `public/` are served from the root, so they're referenced as `/media/…`.

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
