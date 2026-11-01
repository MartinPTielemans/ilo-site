// ilo's release notes, read from the browser repo's releases on GitHub when the site is built, as
// the module `virtual:releases` (src/releases.d.ts). Each release's body is its version's section of
// the browser's CHANGELOG.md, which its release.yml puts there; GitHub renders it to HTML, so the
// site never holds a copy of the notes and needs no Markdown of its own. A build without them fails
// rather than deploy a page missing a release; `vp dev` goes on without them, and says so.
import type { Plugin } from "vite-plus";

export type Release = {
  /** "0.1.0", which is also the section's anchor: /releases#0.1.0. */
  version: string;
  /** The day it was published, as "31 October 2026". */
  date: string;
  /** The notes as GitHub renders them, sanitized by GitHub. */
  html: string;
};

/** What GitHub's API gives for a release, of what the page uses. */
export type GitHubRelease = {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  body_html?: string | null;
};

const REPO = "MartinPTielemans/browser";
const ID = "virtual:releases";

/**
 * ilo's published releases, newest first: tags v<version> only, since the repo's other release is
 * the updates feed's.
 */
export function releasesOf(list: GitHubRelease[]): Release[] {
  return list
    .filter((release) => !release.draft && release.published_at && /^v\d/.test(release.tag_name))
    .sort((a, b) => Date.parse(b.published_at!) - Date.parse(a.published_at!))
    .map((release) => ({
      version: release.tag_name.slice(1),
      date: new Date(release.published_at!).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
      html: release.body_html ?? "",
    }));
}

async function fetchReleases(): Promise<Release[]> {
  // GitHub allows few requests without a token, and CI's runners share addresses.
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const list: GitHubRelease[] = [];
  for (let page = 1; ; page++) {
    const response = await fetch(
      `https://api.github.com/repos/${REPO}/releases?per_page=100&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github.html+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );
    if (!response.ok) throw new Error(`GitHub's releases of ${REPO}: ${response.status}`);
    const batch = (await response.json()) as GitHubRelease[];
    list.push(...batch);
    if (batch.length < 100) return releasesOf(list);
  }
}

/** The plugin serving `virtual:releases`, fetched once a build. */
export function releases(): Plugin {
  let serving = false;
  let read: Promise<Release[]> | undefined;
  return {
    name: "ilo-releases",
    configResolved(config) {
      serving = config.command === "serve";
    },
    resolveId: (id) => (id === ID ? `\0${ID}` : undefined),
    async load(id) {
      if (id !== `\0${ID}`) return;
      read ??= fetchReleases().catch((error: Error) => {
        if (!serving) throw error;
        this.warn(`${error.message}, so /releases is empty.`);
        return [];
      });
      return `export default ${JSON.stringify(await read)};`;
    },
  };
}
