import { useEffect, useRef, useState } from "react";

// What ilo does to keep a day's tabs in order, each one a thing the window beside them does.
const MOVES = [
  {
    id: "archive",
    name: "Today tabs tidy themselves.",
    why: "A tab you haven't looked at in 12 hours moves to the archive. Pin what you want to keep.",
  },
  {
    id: "folder",
    name: "Pinned tabs stay.",
    why: "Above the line, in folders if you like, the same every morning.",
  },
  {
    id: "split",
    name: "Split view.",
    why: "Two tabs side by side, kept together as one in the sidebar.",
  },
  {
    id: "library",
    name: "The Library.",
    why: "Every Space, the tabs you archived and your downloads, a swipe left of your first Space.",
  },
] as const;
type Move = (typeof MOVES)[number]["id"];
// How long each move has the window when they take turns, in milliseconds; the line under the
// playing one fills in the same time (--turn in styles.css).
const TURN = 5200;

const fav = (site: string) => `/media/fav-${site}.png`;

// The Library's Spaces section: each Space as a card of its tabs, pinned above the line. These are
// the hero's three Spaces.
const SPACES = [
  {
    id: "work",
    name: "Work",
    pinned: [["github", "MartinPTielemans/browser"]],
    today: [
      ["ilo", "What ilo means"],
      ["rust", "The Rust Programming Language"],
      ["lobsters", "Lobsters"],
    ],
  },
  {
    id: "lisbon",
    name: "Lisbon",
    pinned: [["folder", "Trip"]],
    today: [
      ["wikivoyage", "Lisbon – Wikivoyage"],
      ["wikipedia", "Alfama – Wikipedia"],
      ["wikipedia", "Pastel de nata – Wikipedia"],
    ],
  },
  {
    id: "reading",
    name: "Reading",
    pinned: [],
    today: [
      ["gutenberg", "Project Gutenberg"],
      ["wikipedia", "Bauhaus – Wikipedia"],
      ["wikisource", "Wikisource"],
    ],
  },
];

// Order without the effort, on a sheet of paper: the moves down one side, and beside them ilo's
// window on the Lisbon Space, sized from the app's design/tokens.toml and doing whichever move is
// pointed at or picked. Once in view it shows them in turn by itself, the one playing filling its
// line as it goes, until the visitor points at one.
export function Habits() {
  const section = useRef<HTMLElement>(null);
  const [move, setMove] = useState<Move>("archive");
  // Each pick plays its move again from the start, even the one already shown.
  const [run, setRun] = useState(0);
  const [yours, setYours] = useState(false);
  // Moves play only once the window is in view, so the first isn't over before it's seen.
  const [seen, setSeen] = useState(false);
  // Whether the moves are taking turns on screen right now, which draws the playing one's line.
  const [playing, setPlaying] = useState(false);
  const hover = useRef(0);
  useEffect(() => () => window.clearTimeout(hover.current), []);

  function pick(id: Move) {
    setYours(true);
    setMove(id);
    setRun((run) => run + 1);
  }

  useEffect(() => {
    if (yours || !section.current) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let index = 0;
    const next = () => {
      index = (index + 1) % MOVES.length;
      setMove(MOVES[index].id);
      setRun((run) => run + 1);
      timer = window.setTimeout(next, TURN);
    };
    const seen = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      const shown = !!entry?.isIntersecting;
      setPlaying(shown && !still);
      if (!shown) return;
      setSeen(true);
      if (!still) timer = window.setTimeout(next, TURN);
    });
    seen.observe(section.current);
    return () => {
      seen.disconnect();
      window.clearTimeout(timer);
      setPlaying(false);
    };
  }, [yours]);

  return (
    <section className="habits" id="features" ref={section} aria-labelledby="habits-title">
      <div className="sheet">
        <h2 id="habits-title">
          It keeps itself <br />
          in order.
        </h2>
        <div className="shot">
          <div
            className={seen ? `win ${move} on` : `win ${move}`}
            key={run}
            data-ui
            aria-hidden="true"
          >
            <div className="side">
              <Lights />
              <div className="url">en.wikivoyage.org</div>
              <div className="tiles">
                {["wikipedia", "github", "osm"].map((site) => (
                  <span key={site}>
                    <img src={fav(site)} alt="" width={16} height={16} />
                  </span>
                ))}
              </div>
              <p className="space-name">Lisbon</p>
              <Row icon="folder" title="Trip" />
              <div className="kids">
                <Row icon="osm" title="OpenStreetMap" />
                <Row icon="wikipedia" title="Tram 28 – Wikipedia" />
              </div>
              <Divider />
              <Row icon="plus" title="New Tab" />
              <div className="today">
                <div className="r sel">
                  <span className="seg">
                    <img src={fav("wikivoyage")} alt="" width={16} height={16} />
                    <span>Lisbon – Wikivoyage</span>
                  </span>
                  <span className="seg other">
                    <img src={fav("pdr")} alt="" width={16} height={16} />
                    <span>The Public Domain Review</span>
                  </span>
                </div>
                <Row icon="wikipedia" title="Alfama – Wikipedia" className="old" />
                <Row icon="wikipedia" title="Pastel de nata – Wikipedia" className="old" />
              </div>
              <div className="dots">
                <i />
                <i className="shown" />
                <i />
              </div>
            </div>
            <div className="lib">
              <div className="column">
                <Lights />
                <p className="library-name">Library</p>
                <div className="sections">
                  <span className="section">
                    <svg viewBox="0 0 20 20">
                      <path d="M10 3v10M5.5 8.5 10 13l4.5-4.5M4 16.5h12" />
                    </svg>
                    Downloads
                  </span>
                  <span className="section sel">
                    <svg viewBox="0 0 20 20">
                      <rect x="2.5" y="3.5" width="6" height="13" rx="2" />
                      <rect x="11.5" y="3.5" width="6" height="13" rx="2" />
                    </svg>
                    Spaces
                  </span>
                  <span className="section">
                    <svg viewBox="0 0 20 20">
                      <rect x="2.5" y="3.5" width="15" height="4" rx="1.2" />
                      <path d="M4 7.5v7.5a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V7.5M8 11h4" />
                    </svg>
                    Archived Tabs
                  </span>
                </div>
                <svg className="back" viewBox="0 0 16 16">
                  <path d="M13 8H3M7 4 3 8l4 4" />
                </svg>
              </div>
              {SPACES.map((space) => (
                <div className={`space-card ${space.id}`} key={space.id}>
                  <p className="card-name">
                    <i />
                    {space.name}
                    <svg className="brush" viewBox="0 0 16 16">
                      <path d="M10.5 2.5 13.5 5.5 8 11 5 8zM5 8l-1.5 1.5c-1 1-1 3-2 4 2 0 3.5-.5 4.5-1.5L7.5 10.5" />
                    </svg>
                  </p>
                  {space.pinned.map(([icon, title]) => (
                    <Row icon={icon} title={title} key={title} />
                  ))}
                  <Divider />
                  {space.today.map(([icon, title]) => (
                    <Row icon={icon} title={title} key={title} />
                  ))}
                </div>
              ))}
              <span className="add">
                <svg viewBox="0 0 16 16">
                  <path d="M8 4v8M4 8h8" />
                </svg>
              </span>
            </div>
            <div className="view">
              <img
                className="page"
                src="/media/page-lisbon.webp"
                alt=""
                width={1032}
                height={780}
              />
              <img
                className="page two"
                src="/media/page-reading.webp"
                alt=""
                width={1032}
                height={780}
              />
            </div>
          </div>
        </div>
        <ul className="moves" data-playing={playing && !yours ? "" : undefined}>
          {MOVES.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={item.id === move}
                onClick={() => pick(item.id)}
                // Pointing at a move plays it; a mouse that only passes over doesn't.
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse" || item.id === move) return;
                  window.clearTimeout(hover.current);
                  hover.current = window.setTimeout(() => pick(item.id), 120);
                }}
                onPointerLeave={() => window.clearTimeout(hover.current)}
              >
                <strong>{item.name}</strong>
                <span>{item.why}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Lights() {
  return (
    <div className="lights">
      <i />
      <i />
      <i />
    </div>
  );
}

function Divider() {
  return (
    <div className="divider">
      <span className="clear">Clear</span>
    </div>
  );
}

function Row({ icon, title, className }: { icon: string; title: string; className?: string }) {
  return (
    <div className={className ? `r ${className}` : "r"}>
      {icon === "folder" ? (
        <svg className="glyph" viewBox="0 0 16 16">
          <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h3l1.5 1.5h4.5A1.5 1.5 0 0 1 14 6v5.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5z" />
        </svg>
      ) : icon === "plus" ? (
        <svg className="glyph" viewBox="0 0 16 16">
          <path d="M8 3v10M3 8h10" />
        </svg>
      ) : (
        <img src={fav(icon)} alt="" width={16} height={16} />
      )}
      <span>{title}</span>
    </div>
  );
}
