import { PLATFORMS, SOURCE, downloadUrl } from "./downloads";

// What search engines and link previews read. Scrapers (Facebook, LinkedIn, Slack, iMessage…)
// take only absolute URLs, so everything here names the site's origin.
export const SITE = "https://ilobrowser.com";

/** The picture every shared link shows: a real capture of ilo, 1200 × 630. */
export const SHARE_IMAGE = {
  url: `${SITE}/media/og.jpg`,
  width: 1200,
  height: 630,
  alt: "ilo with Wikivoyage's Lisbon guide open, its tabs in a sidebar on the left",
};

/**
 * A page's own head: its title and description for search results, the same for link previews,
 * and its one canonical address. The root route gives what every page shares.
 */
export function pageHead({
  path,
  title,
  description,
}: {
  /** The page's path, as "/help"; "/" for home. */
  path: string;
  title: string;
  description: string;
}) {
  const url = path === "/" ? `${SITE}/` : `${SITE}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/** The meta every page shares, whatever it's about. */
export const SITE_META = [
  { property: "og:site_name", content: "ilo" },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "en_US" },
  { property: "og:image", content: SHARE_IMAGE.url },
  { property: "og:image:type", content: "image/jpeg" },
  { property: "og:image:width", content: String(SHARE_IMAGE.width) },
  { property: "og:image:height", content: String(SHARE_IMAGE.height) },
  { property: "og:image:alt", content: SHARE_IMAGE.alt },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:image", content: SHARE_IMAGE.url },
  { name: "twitter:image:alt", content: SHARE_IMAGE.alt },
];

/** Each platform as schema.org's operatingSystem names it. */
const OS: Record<(typeof PLATFORMS)[number]["id"], string> = {
  mac: "macOS",
  windows: "Windows",
  linux: "Linux",
};

/**
 * What ilo is, as structured data search engines read: the site's name, so results say "ilo",
 * and the browser as free software for each platform it's offered for.
 */
export function structuredData(description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        name: "ilo",
        alternateName: "ilo browser",
        url: `${SITE}/`,
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        name: "ilo",
        alternateName: "ilo browser",
        description,
        url: `${SITE}/`,
        image: SHARE_IMAGE.url,
        screenshot: SHARE_IMAGE.url,
        applicationCategory: "BrowserApplication",
        operatingSystem: PLATFORMS.map((platform) => OS[platform.id]).join(", "),
        downloadUrl: PLATFORMS.map(downloadUrl),
        featureList: [
          "Spaces, each with its own tabs and colour",
          "Profiles that keep logins apart",
          "A sidebar whose tabs archive themselves",
          "One command bar for addresses, searches, tabs and commands",
          "Split view",
          "Chrome Web Store extensions",
          "uBlock Origin built in",
          "No account needed, and no ads",
        ],
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        license: "https://www.gnu.org/licenses/gpl-3.0.html",
        sameAs: [SOURCE],
        author: {
          "@type": "Person",
          name: "Martin P. Tielemans",
          url: "https://github.com/MartinPTielemans",
        },
      },
    ],
  };
}
