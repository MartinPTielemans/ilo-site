import { createFileRoute } from "@tanstack/react-router";
import releases from "virtual:releases";
import { TextPage } from "../components/text-page";
import { SOURCE } from "../downloads";

export const Route = createFileRoute("/releases")({
  head: () => ({
    meta: [
      { title: "What's new · ilo" },
      { name: "description", content: "The release notes for each version of ilo." },
    ],
  }),
  component: Releases,
});

// Every release's notes, newest first, as GitHub has them when the site is built: the browser's
// release.yml makes them from its CHANGELOG.md, and this site's release workflow rebuilds it when
// one is published. Each version is an anchor, which the app's update prompts open.
function Releases() {
  return (
    <TextPage
      title="What's new"
      lead={
        <>
          The release notes for each version of ilo, newest first. They're also on{" "}
          <a href={`${SOURCE}/releases`}>GitHub</a>, with each version's downloads.
        </>
      }
    >
      {releases.map((release) => (
        <section key={release.version} className="release" id={release.version}>
          <h2>
            <a href={`#${release.version}`}>{release.version}</a> <span>{release.date}</span>
          </h2>
          <div className="notes" dangerouslySetInnerHTML={{ __html: release.html }} />
        </section>
      ))}
    </TextPage>
  );
}
