// What ilo is offered for, in the order the site names them. Each platform's file has one name in
// every release (the browser repo's release.yml names them), so GitHub always serves the newest
// release's at the same address. Taking a platform out of this list takes it out of the buttons and
// the copy. `note` is the short word the list of computers gives it, and `needs` what the line
// under the download button says it takes.
export const PLATFORMS = [
  {
    id: "mac",
    name: "Mac",
    file: "ilo-mac-arm64.dmg",
    note: "Apple silicon",
    needs: "macOS 15 Sequoia or later, on Apple silicon",
  },
  {
    id: "windows",
    name: "Windows",
    file: "ilo-windows-x64-setup.exe",
    note: "64-bit",
    needs: "64-bit Windows 10 or later",
  },
  {
    id: "linux",
    name: "Linux",
    file: "ilo-linux-x86_64.flatpak",
    note: "x64",
    needs: "A Flatpak, for x64",
  },
] as const;

export type Platform = (typeof PLATFORMS)[number];

// The browser's source, where its releases are published.
export const SOURCE = "https://github.com/MartinPTielemans/browser";
const RELEASES = `${SOURCE}/releases`;

export const downloadUrl = (platform: Platform) => `${RELEASES}/latest/download/${platform.file}`;

/** The platforms as a sentence names them: "Mac, Windows and Linux". */
export const PLATFORM_LIST = PLATFORMS.map((platform) => platform.name)
  .join(", ")
  .replace(/, ([^,]*)$/, " and $1");

/**
 * The platform a visitor's browser runs on, from its user agent; the first one for a phone or
 * anything else ilo isn't made for, since the prerendered page offers that one too.
 */
export function platformFor(agent: string): Platform {
  const id = /Android|iPhone|iPad|CrOS/.test(agent)
    ? undefined
    : /Windows/.test(agent)
      ? "windows"
      : /Linux|X11/.test(agent)
        ? "linux"
        : /Mac/.test(agent)
          ? "mac"
          : undefined;
  return PLATFORMS.find((platform) => platform.id === id) ?? PLATFORMS[0];
}
