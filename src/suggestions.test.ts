import { describe, expect, it } from "vite-plus/test";
import { suggestionsFor } from "./suggestions";

const shown = (text: string) => suggestionsFor(text).map((row) => `${row.kind}: ${row.text}`);

describe("suggestionsFor", () => {
  it("puts the open tab a word names first, then the search, then history", () => {
    expect(shown("wiki")).toEqual([
      "tab: Wikipedia, the free encyclopedia",
      "search: wiki",
      "tab: Alfama - Wikipedia",
      "tab: Pastel de nata - Wikipedia",
      "page: Lisbon – Travel guide at Wikivoyage",
    ]);
  });

  it("never offers the Space's shown tab, which is only history", () => {
    expect(shown("lis")).toEqual(["search: lis", "page: Lisbon – Travel guide at Wikivoyage"]);
  });

  it("matches a tab only from two letters", () => {
    expect(shown("p")[0]).toBe("search: p");
    expect(shown("pa")[0]).toBe("tab: Pastel de nata - Wikipedia");
  });

  it("opens what looks like an address before searching for it", () => {
    expect(shown("github.com/zed")).toEqual([
      "page: github.com/zed",
      "search: github.com/zed",
      "page: GitHub - zed-industries/zed",
    ]);
  });

  it("lists the open tabs when nothing is typed", () => {
    expect(shown("")).toHaveLength(5);
    expect(shown("").every((row) => row.startsWith("tab: "))).toBe(true);
  });
});
