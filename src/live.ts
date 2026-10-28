// ilo's own interface, built for the web from the browser repo's preview (GPL), takes the hero's
// place once it has drawn. It's the app's UI code with made-up tabs and no engine: the pages it
// shows are iframes this page keeps where the demo says the page goes, as the app's host keeps
// Chromium's view there. Without the demo, on a phone or on a connection saving data, the stills
// stay.

export type Tab = { title: string; url: string; icon?: string };
// `selected` is the tab the Space shows first.
export type DemoSpace = {
  name: string;
  color: number;
  pinned: Tab[];
  today: Tab[];
  selected?: string;
};
export type DemoSpaces = { favorites: Tab[]; spaces: DemoSpace[] };

// The demo's interface (the brief in the browser orchestrator thread, 2026-10-28).
type Host = {
  layOut(x: number, y: number, width: number, height: number, radius: number): void;
  show(url: string | null): void;
  cover(covered: boolean): void;
  space(index: number): void;
  ready(): void;
};

const DEMO = "/demo/ilo_demo.js";

// Sites whose headers let another site frame them, checked 2026-10-28. Any other page gets a note
// and a link instead of the browser's refusal.
const FRAMABLE = [
  /(^|\.)wikipedia\.org$/,
  /(^|\.)wikivoyage\.org$/,
  /(^|\.)wikisource\.org$/,
  /^commons\.wikimedia\.org$/,
  /^doc\.rust-lang\.org$/,
  /^www\.rust-lang\.org$/,
  /^www\.gutenberg\.org$/,
  /^lobste\.rs$/,
  /^archive\.org$/,
];

/** Whether a page at `url` can be shown in a frame on a page from `origin`. */
export function framable(url: string, origin: string) {
  let page: URL;
  try {
    page = new URL(url);
  } catch {
    return false;
  }
  if (page.protocol !== "https:" && page.protocol !== "http:") return false;
  if (page.origin === origin) return true;
  // OpenStreetMap lets only its embed be framed.
  if (page.hostname === "www.openstreetmap.org") return page.pathname === "/export/embed.html";
  return FRAMABLE.some((host) => host.test(page.hostname));
}

// Pages kept loaded, so going back to a tab is as quick as in ilo; the oldest hidden one goes.
const KEPT = 10;

/** Starts the demo over `stage` once it's near the screen and the page is idle. Returns a stop. */
export function startLive(
  stage: HTMLElement,
  spaces: DemoSpaces,
  on: { space(index: number): void; ready(openBar?: () => void): void },
): () => void {
  const wanted =
    import.meta.env.ILO_DEMO &&
    matchMedia("(min-width: 1024px) and (pointer: fine)").matches &&
    !(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData &&
    ("gpu" in navigator || !!document.createElement("canvas").getContext("webgl2"));
  if (!wanted) return () => {};

  const layer = document.createElement("div");
  layer.className = "live";
  const pages = document.createElement("div");
  pages.className = "pages";
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "ilo's interface, running in this page");
  layer.append(pages, canvas);

  const frames = new Map<string, HTMLElement>();
  const tabs = new Map(
    [
      ...spaces.favorites,
      ...spaces.spaces.flatMap((space) => [...space.pinned, ...space.today]),
    ].map((tab) => [tab.url, tab]),
  );

  function page(url: string) {
    const tab = tabs.get(url);
    if (framable(url, location.origin)) {
      const frame = document.createElement("iframe");
      frame.src = url;
      frame.title = tab?.title ?? new URL(url).hostname;
      // No top navigation: a page in the demo can't take this one away.
      frame.setAttribute(
        "sandbox",
        "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox",
      );
      frame.referrerPolicy = "no-referrer";
      // This site's own pages hand ⌘K to the demo too; another site's keep their keys.
      if (new URL(url).origin === location.origin) {
        frame.addEventListener("load", () => frame.contentWindow?.addEventListener("keydown", key));
      }
      return frame;
    }
    // The page as a card a visitor can act on, so a site that won't be framed doesn't read as the
    // demo failing.
    let host = url;
    try {
      host = new URL(url).hostname.replace(/^www\./, "");
    } catch {}
    const note = document.createElement("div");
    note.className = "refused";
    if (tab?.icon) {
      const icon = document.createElement("img");
      icon.src = tab.icon;
      icon.width = icon.height = 32;
      icon.alt = "";
      note.append(icon);
    }
    const title = document.createElement("p");
    title.className = "title";
    title.textContent = tab?.title ?? host;
    const text = document.createElement("p");
    text.textContent = `${host} doesn't let other sites show its pages, so this one can't open here. In ilo it opens like any other.`;
    note.append(title, text);
    if (/^https?:/.test(url)) {
      const link = document.createElement("a");
      link.className = "button";
      link.textContent = `Open ${host}`;
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      note.append(link);
    }
    return note;
  }

  let stopped = false;
  let gaveUp = 0;
  let openBar: (() => void) | undefined;

  // The hint under the demo says to press ⌘K, so it works wherever the visitor's keyboard is, as
  // long as the demo is on screen; in a text field the key stays the field's.
  function key(event: KeyboardEvent) {
    if (!openBar || !stage.hasAttribute("data-live")) return;
    if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
    if (event.altKey || event.shiftKey) return;
    const target = event.target as HTMLElement;
    if (target.isContentEditable || target.closest?.("input, textarea, select")) return;
    const box = stage.getBoundingClientRect();
    if (box.bottom <= 0 || box.top >= innerHeight) return;
    event.preventDefault();
    openBar();
  }
  const host: Host = {
    layOut(x, y, width, height, radius) {
      Object.assign(pages.style, {
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${radius}px`,
      });
    },
    show(url) {
      for (const [shown, frame] of frames) frame.hidden = shown !== url;
      if (!url || frames.has(url)) return;
      if (frames.size >= KEPT) {
        const [oldest, frame] = [...frames].find(([, kept]) => kept.hidden) ?? [];
        if (oldest && frame) {
          frame.remove();
          frames.delete(oldest);
        }
      }
      const shown = page(url);
      frames.set(url, shown);
      pages.append(shown);
    },
    // While the bar, a menu or a dialog is drawn over the page, the page goes under the canvas and
    // shows through it, so a click outside them reaches the demo, as in ilo.
    cover(covered) {
      layer.toggleAttribute("data-covered", covered);
    },
    space(index) {
      on.space(index);
    },
    ready() {
      clearTimeout(gaveUp);
      stage.toggleAttribute("data-live", true);
      on.ready(openBar);
    },
  };

  async function begin() {
    if (stopped) return;
    try {
      const demo = await import(/* @vite-ignore */ DEMO);
      await demo.default();
      if (stopped) return;
      stage.append(layer);
      // A demo that hasn't drawn in ten seconds won't; the stills stay.
      gaveUp = window.setTimeout(() => layer.remove(), 10_000);
      openBar = demo.openBar;
      demo.start(canvas, spaces, host);
      addEventListener("keydown", key);
    } catch (error) {
      layer.remove();
      console.warn("ilo's live interface didn't start; the pictures stay.", error);
    }
  }

  const near = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      near.disconnect();
      // After the page's own work, so the first screen is never held up by the demo.
      if ("requestIdleCallback" in window) requestIdleCallback(begin, { timeout: 1500 });
      else setTimeout(begin, 200);
    },
    { rootMargin: "50% 0px" },
  );
  const watch = () => near.observe(stage);
  if (document.readyState === "complete") watch();
  else addEventListener("load", watch, { once: true });

  return () => {
    stopped = true;
    near.disconnect();
    removeEventListener("load", watch);
    removeEventListener("keydown", key);
    clearTimeout(gaveUp);
    layer.remove();
  };
}
