import type { ReactNode } from "react";
import { PLATFORMS, type Platform, downloadUrl } from "../downloads";
import { pageHead } from "../seo";
import { TextPage } from "./text-page";

type Id = Platform["id"];

/** What each platform's page says beyond what every one does: how to install, and what differs. */
const COPY: Record<Id, { install: ReactNode; differs: ReactNode; stage: string }> = {
  mac: {
    stage: "in beta",
    install: <p>Open the download and drag ilo into Applications.</p>,
    differs: (
      <p>
        Netflix and other protected video play in macOS's own web engine, so ilo downloads nothing
        for them.
      </p>
    ),
  },
  windows: {
    stage: "in alpha",
    install: (
      <p>
        Run the installer, which installs ilo for you alone and asks for no administrator. The
        alpha's installer isn't signed yet, so Windows may say it protected your PC: choose More
        info, then Run anyway.
      </p>
    ),
    differs: (
      <p>
        Netflix and other protected video play with Windows' own PlayReady, so ilo downloads nothing
        for them.
      </p>
    ),
  },
  linux: {
    stage: "in beta",
    install: (
      <>
        <p>
          ilo is a Flatpak. Open the download with your software centre, or run{" "}
          <code>flatpak install --user ilo-linux-x86_64.flatpak</code> where you saved it. Flatpak
          fetches the runtime ilo runs on from Flathub if you don't have it.
        </p>
        <p>ilo runs natively on Wayland.</p>
      </>
    ),
    differs: (
      <p>
        Netflix and other protected video need Google's Widevine module, which ilo doesn't ship.
        Once you allow protected video, ilo downloads it for you, and Settings removes it again.
      </p>
    ),
  },
};

const platform = (id: Id) => PLATFORMS.find((one) => one.id === id)!;

/** The head of `id`'s page, named for what people search: ilo for Linux. */
export const platformHead = (id: Id) => {
  const { name, needs } = platform(id);
  return pageHead({
    path: `/${id}`,
    title: `ilo for ${name}: a free, open-source browser`,
    description: `Download ilo for ${name}, a free, open-source browser on Chromium (${needs.charAt(0).toLowerCase() + needs.slice(1)}): every part of your life in its own Space, a sidebar that tidies itself, one bar for every command and uBlock Origin built in.`,
  });
};

/** A platform's page: what ilo needs there, its download, and how to install and update it. */
export function PlatformPage({ id }: { id: Id }) {
  const one = platform(id);
  const copy = COPY[id];
  const updates =
    id === "linux"
      ? "Flatpak updates ilo with your other Flatpak apps."
      : "ilo updates itself. To look now, choose Check for Updates… in the ilo menu, or type “update” in the command bar.";
  return (
    <TextPage
      title={`ilo for ${one.name}`}
      lead={
        <>
          A free, open-source browser, {copy.stage} for {one.name}: every part of your life in its
          own Space, a sidebar that tidies itself and one bar for every command, on Chromium, so
          your sites and Chrome's extensions work.
        </>
      }
    >
      <p>
        <a className="button" href={downloadUrl(one)}>
          Download for {one.name}
        </a>
      </p>

      <section>
        <h2>What it needs</h2>
        <p>{one.needs}.</p>
      </section>

      <section>
        <h2>Installing</h2>
        {copy.install}
        <p>
          To bring your tabs, bookmarks and history from another browser, choose Import from Other
          Browsers… in the ilo menu, or type “import” in the command bar.
        </p>
      </section>

      <section>
        <h2>Updates</h2>
        <p>
          {updates} What changed is in the <a href="/changelog">changelog</a>.
        </p>
      </section>

      <section>
        <h2>Privacy</h2>
        <p>
          ilo blocks ads and trackers with uBlock Origin, built in, has no account and no analytics,
          and sends crash reports only if you say so. <a href="/privacy">Privacy</a> lists every
          service it talks to.
        </p>
        {copy.differs}
      </section>

      <section>
        <h2>Learning it</h2>
        <p>
          <a href="/help">Help</a> is the short version of how ilo works: Spaces, tabs, the command
          bar, split view and extensions.
        </p>
      </section>
    </TextPage>
  );
}
