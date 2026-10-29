import { createFileRoute } from "@tanstack/react-router";
import { TextPage } from "../components/text-page";
import { SOURCE } from "../downloads";

export const Route = createFileRoute("/whats-new")({
  head: () => ({
    meta: [
      { title: "What's new · ilo" },
      { name: "description", content: "What changed in each version of ilo." },
    ],
  }),
  component: WhatsNew,
});

type Release = {
  version: string;
  /** The day it was published, as "29 October 2026"; none while it's still to come. */
  date?: string;
  summary: string;
  notes: string[];
};

// Newest first. A release's notes go here when it's published, with its date, as the app's
// What's New opens this page.
const RELEASES: Release[] = [
  {
    version: "0.1.0",
    summary: "The first beta, for people ready to live in it and tell us what breaks.",
    notes: [
      "Spaces, each with its own colour and its own tabs, and profiles that keep logins apart.",
      "A sidebar with favorites, pinned tabs, folders and Today tabs that archive themselves.",
      "The command bar on ⌘T, for addresses, searches, open tabs and every command.",
      "Split view, find in page, downloads, DevTools and the Library's archive.",
      "Chrome's extensions, from the Chrome Web Store.",
      "Ads and trackers blocked from the first page, with uBlock Origin built in.",
      "Updates that install themselves, and crash reports only if you choose to send them.",
    ],
  },
];

function WhatsNew() {
  return (
    <TextPage
      title="What's new"
      lead={
        <>
          What changed in each version of ilo. Every change is in{" "}
          <a href={`${SOURCE}/releases`}>the releases on GitHub</a>.
        </>
      }
    >
      {RELEASES.map((release) => (
        <section key={release.version} className="release" id={release.version}>
          <h2>
            {release.version} <span>{release.date ?? "Coming soon"}</span>
          </h2>
          <p>{release.summary}</p>
          <ul>
            {release.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ))}
    </TextPage>
  );
}
