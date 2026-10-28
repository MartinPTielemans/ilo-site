import { useEffect, useRef, useState } from "react";
import { ICONS, suggestionsFor, type Suggestion } from "../suggestions";

const glass = (
  <>
    <circle cx="7.6" cy="7.6" r="5.6" />
    <path d="M11.8 11.8 16 16" />
  </>
);

// Words the bar types by itself, each finding a different tab of the Lisbon Space.
const WORDS = ["wiki", "nata", "git", "alfama", "open"];

// ⌘T on the Lisbon Space's colour: ilo's bar, built from its constants in app/src/command_bar.rs,
// typing words of its own until the visitor types one.
export function CommandBar() {
  const section = useRef<HTMLElement>(null);
  const [query, setQuery] = useState(WORDS[0]);
  const [selected, setSelected] = useState(0);
  // Once the visitor reaches for the bar, it's theirs, and it stops typing for good.
  const [yours, setYours] = useState(false);
  const rows = suggestionsFor(query);

  useEffect(() => {
    if (yours || !section.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let word = 0;
    let typed = WORDS[0].length;
    // A word is typed a key at a time, held while it's read, then cleared for the next.
    const tick = () => {
      const next = WORDS[word];
      if (typed < next.length) {
        typed++;
        setQuery(next.slice(0, typed));
        timer = window.setTimeout(tick, 90 + Math.random() * 70);
      } else if (typed === next.length) {
        typed++;
        timer = window.setTimeout(tick, 2200);
      } else {
        word = (word + 1) % WORDS.length;
        typed = 0;
        setQuery("");
        timer = window.setTimeout(tick, 450);
      }
      setSelected(0);
    };
    const seen = new IntersectionObserver(([entry]) => {
      window.clearTimeout(timer);
      if (entry?.isIntersecting) timer = window.setTimeout(tick, 1200);
    });
    seen.observe(section.current);
    return () => {
      seen.disconnect();
      window.clearTimeout(timer);
    };
  }, [yours]);

  return (
    <section className="bar" id="bar" ref={section} aria-labelledby="bar-title">
      <div className="say-bar">
        <h2 id="bar-title">One word finds the tab.</h2>
        <p>
          Press ⌘T in ilo and type. The open tab your word names comes first, with search and
          history under it, as in Arc. These are the Lisbon Space's tabs; try a word of your own.
        </p>
      </div>
      <div
        className="cmd"
        data-ui
        onPointerDown={() => setYours(true)}
        onFocus={() => setYours(true)}
      >
        <div className="cmd-input">
          <svg className="glass" viewBox="0 0 18 18" aria-hidden="true">
            {glass}
          </svg>
          <span className="cmd-text" aria-hidden="true">
            {query}
          </span>
          <span className="caret" aria-hidden="true" />
          {/* The real field sits over the drawn text, so typing goes to it and the bar draws it. */}
          <input
            className="query"
            type="text"
            value={query}
            aria-label="Type a word into ilo's command bar"
            aria-controls="rows"
            autoComplete="off"
            spellCheck={false}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={(event) => {
              const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
              if (!step || !rows.length) return;
              event.preventDefault();
              setSelected((selected + step + rows.length) % rows.length);
            }}
          />
        </div>
        <ol className="rows" id="rows" aria-label="Suggestions">
          {rows.map((row, index) => (
            <Row
              key={index}
              row={row}
              selected={index === selected}
              onSelect={() => setSelected(index)}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Row({
  row,
  selected,
  onSelect,
}: {
  row: Suggestion;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li
      className={selected ? "row sel" : "row"}
      onPointerDown={(event) => {
        event.preventDefault();
        onSelect();
      }}
    >
      {row.kind === "tab" ? (
        <img src={ICONS[row.icon]} alt="" width={16} height={16} />
      ) : row.kind === "search" ? (
        <span className="glyph">
          <svg viewBox="0 0 18 18" aria-hidden="true">
            {glass}
          </svg>
        </span>
      ) : (
        <svg className="clock" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="8" r="6.2" />
          <path d="M8 4.6V8l2.3 1.5" />
        </svg>
      )}
      <span className="t">{row.text}</span>
      {row.detail && <span className="d">— {row.detail}</span>}
      {row.kind === "tab" && (
        <>
          <span className="go">Switch to Tab</span>
          <span className="arrow" />
        </>
      )}
    </li>
  );
}
