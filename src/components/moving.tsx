// What a visitor brings from the browser they use now, on a panel of the Reading Space's colour:
// the questions people ask before they switch, each answered in a line. Every answer says no more
// than Help and its questions do (src/faq.ts).
const BRINGS = [
  {
    what: "Your tabs, bookmarks and history.",
    how: "Import from Other Browsers… brings them from the browser you use now.",
  },
  {
    what: "Your extensions.",
    how: "Chrome's extensions work in ilo. Install them from the Chrome Web Store.",
  },
  {
    what: "No ads.",
    how: "uBlock Origin is built in, and blocks ads and trackers from the first page.",
  },
  {
    what: "Your other computers.",
    how: "Sync is end-to-end encrypted with 24 recovery words only your devices have, and needs no Google account.",
  },
];

export function Moving() {
  return (
    <section className="moving" aria-labelledby="moving-title">
      <div className="crate">
        <h2 id="moving-title">
          Move in without <br />
          starting over.
        </h2>
        <ul className="brings">
          {BRINGS.map((item) => (
            <li key={item.what}>
              <strong>{item.what}</strong>
              <span>{item.how}</span>
            </li>
          ))}
        </ul>
        <p className="more">
          <a href="/help">More answers in Help</a>
        </p>
      </div>
    </section>
  );
}
