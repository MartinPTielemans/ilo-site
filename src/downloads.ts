// What ilo is offered for, in the order the site names them, worded as the browser's README.md
// says under Install. Each `file` is one the browser's release.yml uploads to every release under
// the same name, so GitHub always serves the newest release's at the same address; downloads.test.ts
// holds the list. Taking a platform out of this list takes it out of the buttons and the copy.
// `note` is the short word the list of computers gives it, `needs` what the line under the download
// button says it takes, and `command` the line to install it from a terminal instead.
export const PLATFORMS = [
  {
    id: "mac",
    name: "Mac",
    file: "ilo-mac-arm64.dmg",
    note: "Apple silicon",
    needs: "macOS 15 (Sequoia) or later, on Apple silicon",
    command: undefined,
  },
  {
    id: "windows",
    name: "Windows",
    file: "ilo-windows-x64-setup.exe",
    note: "x64",
    needs: "Windows 10 (1809) or later, on x64",
    command: "winget install ilo.ilo",
  },
  {
    // The repository's entry, which a software centre installs in one click, and which adds ilo's
    // Flatpak repository (flatpak.ilobrowser.com), so ilo updates with the other Flatpaks.
    id: "linux",
    name: "Linux",
    file: "ilo.flatpakref",
    note: "x86-64",
    needs: "x86-64, as a Flatpak",
    command:
      "flatpak install --user https://github.com/MartinPTielemans/browser/releases/latest/download/ilo.flatpakref",
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
