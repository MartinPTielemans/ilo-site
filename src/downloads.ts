// What ilo is offered for, in the order the site names them. Each platform's file has one name in
// every release, so GitHub always serves the newest release's at the same address. Taking a
// platform out of this list takes it out of the buttons and the copy.
export const PLATFORMS = [
  { id: "mac", name: "Mac", file: "ilo-mac-arm64.dmg", note: "Apple silicon" },
  { id: "windows", name: "Windows", file: "ilo-windows-x64.exe", note: "64-bit" },
  { id: "linux", name: "Linux", file: "ilo-linux-x64.AppImage", note: "x64" },
] as const;

export type Platform = (typeof PLATFORMS)[number];

const RELEASES = "https://github.com/MartinPTielemans/browser/releases";

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
