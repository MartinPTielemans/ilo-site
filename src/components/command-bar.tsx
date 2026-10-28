import { useState } from "react";
import { ICONS, suggestionsFor, type Suggestion } from "../suggestions";

const glass = (
  <>
    <circle cx="7.6" cy="7.6" r="5.6" />
    <path d="M11.8 11.8 16 16" />
  </>
);

// ⌘T: what you type on the dark half, what ilo's bar makes of it on the light one. The bar is built
// from its constants in app/src/command_bar.rs.
export function CommandBar() {
  const [query, setQuery] = useState("wiki");
  const [selected, setSelected] = useState(0);
  const rows = suggestionsFor(query);

  return (
    <section className="bar" id="bar" aria-labelledby="bar-title">
      <div className="field dark">
        <div className="typing">
          <label className="keys" htmlFor="query">
            Press ⌘T and type
          </label>
          <input
            id="query"
            className="query"
            type="text"
            value={query}
            autoComplete="off"
            spellCheck={false}
            aria-controls="rows"
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            onKeyDown={(event) => {
              const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
              if (!step) return;
              event.preventDefault();
              setSelected((selected + step + rows.length) % rows.length);
            }}
          />
          <p>
            The open tab your word names comes first, with search and history under it, as in Arc.
            Try another word: these are the Lisbon Space's tabs.
          </p>
        </div>
      </div>
      <div className="field light">
        <div className="cmd" data-ui>
          <div className="cmd-input">
            <svg className="glass" viewBox="0 0 18 18" aria-hidden="true">
              {glass}
            </svg>
            <span className="cmd-text">{query}</span>
            <span className="caret" aria-hidden="true" />
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
      </div>
      <h2 id="bar-title" className="split">
        <span className="l">One word</span> <span className="r">finds the tab.</span>
      </h2>
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
