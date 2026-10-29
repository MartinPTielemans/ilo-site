import { useEffect, useRef, useState } from "react";
import { paint, startField } from "../ascii";
import { PLATFORM_LIST, SOURCE } from "../downloads";
import { Download } from "./download";
import { type DemoSpaces, type Tab, startLive } from "../live";

const icon = (site: string) => `/media/fav-${site}.png`;
const WIKIPEDIA = icon("wikipedia");

// In the order of ilo's own Spaces, so ⌃1 is the first; each one's pictures are named for it. The
// live interface opens the same Spaces with pages that let other sites frame them, near the
// stills' own.
const SPACES: {
  id: string;
  name: string;
  color: string;
  alt: string;
  pinned: Tab[];
  today: Tab[];
  selected?: string;
}[] = [
  {
    id: "work",
    name: "Work",
    color: "#0E9F55",
    alt: "ilo in a Space called Work: a green sidebar with ilo's own repository pinned, and this site's page on what the word ilo means open: Esperanto for a tool, and the browser that keeps going.",
    pinned: [
      {
        title: "MartinPTielemans/browser",
        url: "https://github.com/MartinPTielemans/browser",
        icon: icon("github"),
      },
    ],
    today: [
      { title: "What ilo means", url: "/ilo", icon: icon("ilo") },
      {
        title: "The Rust Programming Language",
        url: "https://doc.rust-lang.org/book/",
        icon: icon("rust"),
      },
      { title: "Lobsters", url: "https://lobste.rs/", icon: icon("lobsters") },
    ],
    // Open on what the word means, as the still does, not on the pinned repository, which GitHub
    // won't let another site frame.
    selected: "/ilo",
  },
  {
    id: "lisbon",
    name: "Lisbon",
    color: "#BF8355",
    alt: "ilo in a Space called Lisbon: a warm brown sidebar with a map pinned, three tabs for the trip, and Wikivoyage's guide to Lisbon open.",
    pinned: [
      {
        title: "OpenStreetMap",
        url: "https://www.openstreetmap.org/export/embed.html?bbox=-9.144%2C38.7065%2C-9.124%2C38.7165&layer=mapnik",
        icon: icon("osm"),
      },
    ],
    today: [
      {
        title: "Lisbon – Wikivoyage",
        url: "https://en.wikivoyage.org/wiki/Lisbon",
        icon: icon("wikivoyage"),
      },
      { title: "Alfama – Wikipedia", url: "https://en.wikipedia.org/wiki/Alfama", icon: WIKIPEDIA },
      {
        title: "Pastel de nata – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Pastel_de_nata",
        icon: WIKIPEDIA,
      },
    ],
  },
  {
    id: "reading",
    name: "Reading",
    color: "#5583BF",
    alt: "ilo in a Space called Reading: a blue sidebar with Hacker News and Wikipedia's Bauhaus article waiting, and The Public Domain Review open.",
    pinned: [],
    today: [
      { title: "Project Gutenberg", url: "https://www.gutenberg.org/", icon: icon("gutenberg") },
      {
        title: "Bauhaus – Wikipedia",
        url: "https://en.wikipedia.org/wiki/Bauhaus",
        icon: WIKIPEDIA,
      },
      {
        title: "Wikisource",
        url: "https://en.wikisource.org/wiki/Main_Page",
        icon: icon("wikisource"),
      },
    ],
  },
];

const FAVORITES: Tab[] = [
  { title: "Wikipedia", url: "https://en.wikipedia.org/wiki/Main_Page", icon: WIKIPEDIA },
  { title: "Internet Archive", url: "https://archive.org/", icon: icon("archive") },
  {
    title: "Wikimedia Commons",
    url: "https://commons.wikimedia.org/wiki/Main_Page",
    icon: icon("commons"),
  },
];

// A Space the visitor makes in the live interface has no colour of ours; the field goes neutral.
const NEUTRAL = "#6b665d";

/** The Spaces as the live interface takes them, with this site's own pages at its own address. */
function demoSpaces(): DemoSpaces {
  const here = (tab: Tab) => ({
    ...tab,
    url: new URL(tab.url, location.origin).href,
    ...(tab.icon && { icon: new URL(tab.icon, location.origin).href }),
  });
  return {
    favorites: FAVORITES.map(here),
    spaces: SPACES.map((space) => ({
      name: space.name,
      color: Number.parseInt(space.color.slice(1), 16),
      pinned: space.pinned.map(here),
      today: space.today.map(here),
      ...(space.selected && { selected: new URL(space.selected, location.origin).href }),
    })),
  };
}

// The first screen: the claim and the download beside a globe drawn in characters, then ilo's whole
// window standing on a land that keeps going, all in the colour of the Space the window shows, open
// first at what the word ilo means. The frame
// scrolls sideways between three Spaces, as ilo's do under two fingers. Without script the frame
// still scrolls and the dots still jump. Once the live interface has drawn, it takes the stills'
// place and the land follows its Spaces.
export function Spaces() {
  const reel = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const land = useRef<HTMLCanvasElement>(null);
  const [shown, setShown] = useState(0);
  const before = useRef(0);
  // Once the live interface has drawn: the key that opens its command bar, and a way to open it
  // from the caption when the demo offers one.
  const [live, setLive] = useState<{ key: string; openBar?: () => void } | null>(null);

  // The land, the wordmark's dot and the letter's dot take the colour of the Space shown, as the dot
  // in ilo's Dock icon does. The new colour comes in from the side the Spaces moved toward.
  useEffect(() => {
    const color = SPACES[shown]?.color ?? NEUTRAL;
    document.documentElement.style.setProperty("--dot", color);
    paint(color, shown >= before.current ? 1 : -1);
    before.current = shown;
  }, [shown]);

  // The hills meet the sky at the window's top edge, so the window stands on them, and the dot of
  // the wordmark rises as a globe beside the headline, cropped by the screen's right edge.
  useEffect(() => {
    if (!land.current) return;
    const style = getComputedStyle(document.documentElement);
    return startField(land.current, {
      ground: style.getPropertyValue("--ink"),
      hot: style.getPropertyValue("--paper"),
      stars: true,
      lamp: true,
      scene: (width, height) => {
        const top = stage.current?.offsetTop ?? height * 0.4;
        const screen = Math.min(innerHeight, height);
        // Below the desktop's width the words take the whole screen, so the globe rises behind the
        // window's right shoulder instead.
        if (width < 900) {
          const r = width * 0.3;
          return { horizon: (top - 48) / height, globe: { x: width * 0.76, y: top + r * 0.3, r } };
        }
        return {
          horizon: (top - 112) / height,
          globe: { x: width * 0.8, y: screen * 0.5, r: Math.min(screen * 0.4, width * 0.27) },
        };
      },
    });
  }, []);

  useEffect(() => {
    if (!stage.current) return;
    return startLive(stage.current, demoSpaces(), {
      space: setShown,
      // The visitor's browser keeps ⌘T for itself, so the demo's bar opens on ⌘K.
      ready: (openBar) =>
        setLive({ key: /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘K" : "Ctrl K", openBar }),
    });
  }, []);

  function go(index: number) {
    const frame = reel.current;
    if (!frame) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    frame.scrollTo({ left: index * frame.clientWidth, behavior: still ? "auto" : "smooth" });
  }

  return (
    <section className="hero" id="top">
      <div className="scene">
        <canvas className="land" ref={land} aria-hidden="true" />
        <div className="intro">
          <h1>
            The browser <br />
            that keeps going.
          </h1>
          <p className="lede">
            Every part of your life in its own Space, a sidebar that tidies itself, and one bar for
            every command. Free and <a href={SOURCE}>open source</a>, on Chromium.
          </p>
          <div className="act">
            <Download className="button big" />
            <p className="note">Now in beta for {PLATFORM_LIST}.</p>
          </div>
        </div>
        <div className="stage" ref={stage}>
          <div
            ref={reel}
            className="reel"
            data-ui
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label="ilo with three Spaces. Scroll sideways to switch between them."
            onScroll={(event) => {
              const frame = event.currentTarget;
              const index = Math.round(frame.scrollLeft / frame.clientWidth);
              setShown(Math.min(Math.max(index, 0), SPACES.length - 1));
            }}
          >
            {SPACES.map((space, index) => (
              <figure className="space" id={space.id} key={space.id}>
                <picture>
                  <source
                    media="(max-width: 599px)"
                    srcSet={`/media/space-${space.id}-s.webp 2x`}
                  />
                  <img
                    src={`/media/space-${space.id}-1x.webp`}
                    srcSet={`/media/space-${space.id}-1x.webp 1x, /media/space-${space.id}.webp 2x`}
                    width={1280}
                    height={800}
                    fetchPriority={index ? "low" : "high"}
                    alt={space.alt}
                  />
                </picture>
              </figure>
            ))}
          </div>
        </div>
      </div>
      {live ? (
        // A window that looks like a picture has to say it isn't one, or nobody clicks it.
        <div className="caption">
          <p className="claim">That's ilo itself, running in this tab.</p>
          <p>
            Its own interface, compiled from{" "}
            <a href={import.meta.env.ILO_DEMO_SOURCE}>its Rust code</a> to WebAssembly, with real
            sites inside. Click a tab, switch Spaces with the dots at the bottom, or press{" "}
            {live.openBar ? (
              <button
                type="button"
                className="key"
                aria-label={`Open the command bar (${live.key})`}
                onClick={live.openBar}
              >
                {live.key}
              </button>
            ) : (
              <kbd>{live.key}</kbd>
            )}
            .
          </p>
        </div>
      ) : (
        <div className="switch">
          {SPACES.map((space, index) => (
            <a
              key={space.id}
              href={`#${space.id}`}
              aria-label={space.name}
              aria-current={index === shown}
              onClick={(event) => {
                event.preventDefault();
                go(index);
              }}
            />
          ))}
          <span className="name" aria-live="polite">
            {SPACES[shown]?.name}
          </span>
        </div>
      )}
    </section>
  );
}
