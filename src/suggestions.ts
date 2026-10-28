// ilo's command bar with the Lisbon Space's tabs, ranked as app/src/command_bar.rs ranks them: the
// open tab whose name has a word that two letters or more typed start goes first, with Switch to
// Tab, then the search, then pages from history. The Space's own shown tab is never offered.

export const ICONS = {
  wikipedia: "/media/fav-wikipedia.png",
  wikivoyage: "/media/fav-wikivoyage.png",
  github: "/media/fav-github.png",
  osm: "/media/fav-osm.png",
};

type Tab = { title: string; url: string; site: string; icon: keyof typeof ICONS };
type Page = { title: string; url: string };

export type Suggestion =
  | { kind: "tab"; text: string; detail: string; icon: keyof typeof ICONS; url: string }
  | { kind: "search" | "page"; text: string; detail: string };

// The favorites, then the pinned tab, then Today's tabs, as the bar lists them before any typing.
const TABS: Tab[] = [
  {
    title: "Wikipedia, the free encyclopedia",
    url: "en.wikipedia.org/wiki/Main_Page",
    site: "en.wikipedia.org",
    icon: "wikipedia",
  },
  {
    title: "GitHub · Build and ship software on a single, collaborative platform · GitHub",
    url: "github.com",
    site: "github.com",
    icon: "github",
  },
  {
    title: "OpenStreetMap",
    url: "www.openstreetmap.org/#map=15/38.7115/-9.1340",
    site: "www.openstreetmap.org",
    icon: "osm",
  },
  {
    title: "Alfama - Wikipedia",
    url: "en.wikipedia.org/wiki/Alfama",
    site: "en.wikipedia.org",
    icon: "wikipedia",
  },
  {
    title: "Pastel de nata - Wikipedia",
    url: "en.wikipedia.org/wiki/Pastel_de_nata",
    site: "en.wikipedia.org",
    icon: "wikipedia",
  },
];
// Every page the profile behind the captures has visited.
const HISTORY: Page[] = [
  { title: "Alfama - Wikipedia", url: "en.wikipedia.org/wiki/Alfama" },
  { title: "Pastel de nata - Wikipedia", url: "en.wikipedia.org/wiki/Pastel_de_nata" },
  { title: "Lisbon – Travel guide at Wikivoyage", url: "en.wikivoyage.org/wiki/Lisbon" },
  { title: "OpenStreetMap", url: "www.openstreetmap.org/#map=15/38.7115/-9.1340" },
  { title: "Bauhaus - Wikipedia", url: "en.wikipedia.org/wiki/Bauhaus" },
  { title: "The Rust Programming Language", url: "doc.rust-lang.org/book/" },
  { title: "GitHub - MartinPTielemans/browser", url: "github.com/MartinPTielemans/browser" },
  { title: "GitHub - zed-industries/zed", url: "github.com/zed-industries/zed" },
  { title: "The Public Domain Review", url: "publicdomainreview.org" },
  { title: "Hacker News", url: "news.ycombinator.com" },
  { title: "Wikipedia, the free encyclopedia", url: "en.wikipedia.org/wiki/Main_Page" },
  {
    title: "GitHub · Build and ship software on a single, collaborative platform · GitHub",
    url: "github.com",
  },
];
const ROWS_SHOWN = 5;

const wordsOf = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const namesTab = (tab: Tab, typed: string) =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${escape(typed)}`, "u").test(
    `${tab.title} ${tab.site}`.toLowerCase(),
  );
const matches = (page: Page, terms: string[]) => {
  const words = wordsOf(`${page.title} ${page.url}`);
  return terms.every((term) => words.some((word) => word.startsWith(term)));
};
const tabRow = (tab: Tab): Suggestion => ({
  kind: "tab",
  text: tab.title,
  detail: tab.site,
  icon: tab.icon,
  url: tab.url,
});

export function suggestionsFor(text: string): Suggestion[] {
  const typed = text.trim().toLowerCase();
  if (!typed) return TABS.map(tabRow).slice(0, ROWS_SHOWN);
  const found: Suggestion[] = [];
  const urlish = /[.:/]/.test(typed);
  const first = typed.length >= 2 && !urlish ? TABS.find((tab) => namesTab(tab, typed)) : undefined;
  if (first) found.push(tabRow(first));
  if (urlish && !/\s/.test(typed)) found.push({ kind: "page", text: text.trim(), detail: "" });
  found.push({ kind: "search", text: text.trim(), detail: "DuckDuckGo Search" });
  const terms = wordsOf(typed);
  for (const page of HISTORY) {
    if (found.length >= ROWS_SHOWN) break;
    if (first && page.url === first.url) continue;
    if (!terms.length || !matches(page, terms)) continue;
    const tab = TABS.find((open) => open.url === page.url);
    found.push(tab ? tabRow(tab) : { kind: "page", text: page.title, detail: page.url });
  }
  return found;
}
