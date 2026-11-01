import { expect, test } from "vite-plus/test";
import { type GitHubRelease, releasesOf } from "./releases";

const release = (tag: string, published: string | null, more: Partial<GitHubRelease> = {}) => ({
  tag_name: tag,
  draft: false,
  prerelease: false,
  published_at: published,
  body_html: `<p>${tag}</p>`,
  ...more,
});

test("ilo's published releases come newest first, each named by its version", () => {
  const list = releasesOf([
    release("v0.0.1", "2026-10-31T23:54:20Z"),
    release("updates", "2026-11-01T09:57:49Z", { prerelease: true }),
    release("v0.2.0", null, { draft: true }),
    release("v0.1.0", "2026-12-01T10:00:00Z"),
  ]);
  expect(list).toEqual([
    { version: "0.1.0", date: "1 December 2026", html: "<p>v0.1.0</p>" },
    { version: "0.0.1", date: "31 October 2026", html: "<p>v0.0.1</p>" },
  ]);
});
