import { useEffect, useRef, useState } from "react";
import { ICONS } from "../suggestions";

// Arc's ideas that ilo has, each one a thing the window below does.
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

const CARDS = [
  { id: "work", name: "Work" },
  { id: "lisbon", name: "Lisbon" },
  { id: "reading", name: "Reading" },
];

// What Arc taught you: ilo's window on the Lisbon Space, sized from the app's design/tokens.toml,
// doing whichever of Arc's ideas is picked. Once in view it shows them in turn by itself, until the
// visitor picks one.
export function Habits() {
  const section = useRef<HTMLElement>(null);
  const [move, setMove] = useState<Move>("archive");
  // Each pick plays its move again from the start, even the one already shown.
  const [run, setRun] = useState(0);
  const [yours, setYours] = useState(false);
  // Moves play only once the window is in view, so the first isn't over before it's seen.
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (yours || !section.current) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let index = 0;
    const next = () => {
      index = (index + 1) % MOVES.length;
      setMove(MOVES[index].id);
      setRun((run) => run + 1);
      timer = window.setTimeout(next, 5200);
    };
    const seen = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (!entry?.isIntersecting) return;
      setSeen(true);
      if (!still) timer = window.setTimeout(next, 5200);
    });
    seen.observe(section.current);
    return () => {
      seen.disconnect();
      window.clearTimeout(timer);
    };
  }, [yours]);

  return (
    <section className="habits" id="arc" ref={section} aria-labelledby="habits-title">
      <div className="say-habits">
        <h2 id="habits-title">What Arc taught you still works.</h2>
        <p className="lead">ilo is laid out like Arc, so your habits come with you.</p>
      </div>
      <ul className="moves">
        {MOVES.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={item.id === move}
              onClick={() => {
                setYours(true);
                setMove(item.id);
                setRun(run + 1);
              }}
            >
              <strong>{item.name}</strong> {item.why}
            </button>
          </li>
        ))}
      </ul>
      <div className={seen ? `win ${move} on` : `win ${move}`} key={run} data-ui aria-hidden="true">
        <div className="side">
          <div className="lights">
            <i />
            <i />
            <i />
          </div>
          <div className="url">en.wikivoyage.org</div>
          <div className="tiles">
            {(["wikipedia", "github", "osm"] as const).map((icon) => (
              <span key={icon}>
                <img src={ICONS[icon]} alt="" width={16} height={16} />
              </span>
            ))}
          </div>
          <div className="tabs">
            <p className="space-name">Lisbon</p>
            <div className="folder">
              <Row icon="folder" title="Trip" />
              <div className="kids">
                <Row icon="osm" title="OpenStreetMap" />
                <Row icon="wikipedia" title="Tram 28 – Wikipedia" />
              </div>
            </div>
            <div className="divider">
              <span className="clear">Clear</span>
            </div>
            <Row icon="plus" title="New Tab" />
            <div className="today">
              <div className="r sel">
                <span className="seg">
                  <img src={ICONS.wikivoyage} alt="" width={16} height={16} />
                  <span>Lisbon – Wikivoyage</span>
                </span>
                <span className="seg other">
                  <img src="/media/fav-pdr.png" alt="" width={16} height={16} />
                  <span>The Public Domain Review</span>
                </span>
              </div>
              <Row icon="wikipedia" title="Alfama – Wikipedia" className="old" />
              <Row icon="wikipedia" title="Pastel de nata – Wikipedia" className="old" />
            </div>
          </div>
          <div className="sections">
            <p className="library-name">Library</p>
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
            <span className="section">
              <svg viewBox="0 0 20 20">
                <path d="M10 3v10M5.5 8.5 10 13l4.5-4.5M4 16.5h12" />
              </svg>
              Downloads
            </span>
          </div>
          <div className="dots">
            <i className="work" />
            <i className="lisbon" />
            <i className="reading" />
          </div>
        </div>
        <div className="view">
          <img className="page" src="/media/page-lisbon.webp" alt="" width={1032} height={780} />
          <img
            className="page two"
            src="/media/page-reading.webp"
            alt=""
            width={1032}
            height={780}
          />
          <div className="cards">
            {CARDS.map((card) => (
              <span className={`card ${card.id}`} key={card.id}>
                <img src={`/media/space-${card.id}-s.webp`} alt="" width={520} height={390} />
                {card.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  icon,
  title,
  className,
}: {
  icon: keyof typeof ICONS | "folder" | "plus";
  title: string;
  className?: string;
}) {
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
        <img src={ICONS[icon]} alt="" width={16} height={16} />
      )}
      <span>{title}</span>
    </div>
  );
}
