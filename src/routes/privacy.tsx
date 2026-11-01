import { createFileRoute } from "@tanstack/react-router";
import { TextPage } from "../components/text-page";
import { SOURCE } from "../downloads";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy · ilo" },
      {
        name: "description",
        content:
          "What leaves your computer when you use ilo, and every service and address it talks to.",
      },
    ],
  }),
  component: Privacy,
});

// The services, each with the hosts it reaches, as the browser's code on main names them: the
// branding files (app/branding/update-feed, app/branding/crash-reports), core/crash_reports.cc's
// traffic annotation, core/search.cc and core/suggest.h, engine/README.md › What reaches Google,
// core/widevine.cc, app/platform/windows/updates.cc, app/src/agents/server.rs, tools/flatpak-repo.sh's
// runtime repository, uBlock Origin's own assets.json for the lists, and for sync, ilo-server's
// README › What the server can see and app/branding/sync-server. It says no more than the code does.
function Privacy() {
  return (
    <TextPage
      title="Privacy"
      lead={
        <>
          ilo has no analytics and no ads, and sells nothing about you. It sends no record of how
          you use it, and nothing beyond what's below: the pages you open, a few checks, and crash
          reports and sync only if you turn them on.
        </>
      }
    >
      <section>
        <h2>The pages you open</h2>
        <p>
          A page you open, or preview with Peek, gets what any browser sends it: your IP address,
          the page you asked for and the cookies it set before. ilo blocks ads and trackers on every
          site unless you turn that off.
        </p>
        <p>
          A search goes to your search engine: DuckDuckGo (<code>duckduckgo.com</code>) unless you
          choose another. Nothing you type in the command bar leaves your computer before you
          search: ilo asks no search engine for suggestions, and has no setting that would.
        </p>
      </section>

      <section>
        <h2>Every service ilo talks to</h2>
        <dl className="services">
          <dt>The Chrome Web Store, from Google</dt>
          <dd>
            <p>
              Extensions come from the Chrome Web Store. When you visit the store, it sees which
              extensions you have, as it does in Chrome. Installing one you've confirmed fetches its
              icon from Google's image host, and the extension from Google.
            </p>
            <p>
              With a store extension installed, ilo checks for its updates soon after launch, then
              about every five hours. The check sends each extension's id and version, and ilo's
              version, system and language, without cookies.
            </p>
            <p className="hosts">
              <code>chromewebstore.google.com</code> <code>clients2.google.com</code>{" "}
              <code>clients2.googleusercontent.com</code>
            </p>
          </dd>

          <dt>Chromium's security updates, from Google</dt>
          <dd>
            <p>
              ilo is built on ungoogled-chromium, which cuts Chromium's calls to Google. ilo brings
              one back, for safety: a check for three components that keep the browser from trusting
              what's known to be bad. They're the list of revoked certificates (CRLSet), the
              certificate authorities and logs Chromium trusts (PKI Metadata), and the certificate
              error helper. It runs a minute after launch, then every five hours.
            </p>
            <p className="hosts">
              <code>update.googleapis.com/service/update2/json</code>, with downloads only from{" "}
              <code>dl.google.com</code>, <code>*.gvt1.com</code> and{" "}
              <code>www.google.com/dl/</code>
            </p>
          </dd>

          <dt>Widevine, for protected video on Linux</dt>
          <dd>
            <p>
              On Linux, Netflix and other protected video need Google's Widevine module, which ilo
              doesn't ship. Once you allow protected video, ilo downloads it, and keeps it up to
              date, from the same Google hosts as the security updates. Removing it in Settings
              stops that. On a Mac, protected video plays in macOS's own web engine, and on Windows
              with Windows' own PlayReady, so ilo fetches nothing for it there.
            </p>
          </dd>

          <dt>Ad block lists</dt>
          <dd>
            <p>
              ilo blocks ads with uBlock Origin, built in. It ships with its lists, so it blocks
              from the first page, and fetches new ones about once a week from the hosts the lists
              come from. uBlock Origin may also add a list for your language.
            </p>
            <p className="hosts">
              <code>ublockorigin.github.io</code> <code>ublockorigin.pages.dev</code>{" "}
              <code>cdn.jsdelivr.net</code> <code>raw.githubusercontent.com</code>{" "}
              <code>publicsuffix.org</code> <code>pgl.yoyo.org</code>{" "}
              <code>malware-filter.gitlab.io</code> <code>malware-filter.pages.dev</code>{" "}
              <code>curbengh.github.io</code>
            </p>
          </dd>

          <dt>ilo's updates</dt>
          <dd>
            <p>
              On a Mac, and on Windows when installed with winget or the installer, ilo reads its
              update feed every 8 hours, sending no profile of your system, and downloads an update
              from ilo's releases on GitHub. A copy from the Microsoft Store doesn't: the Store
              updates it.
            </p>
            <p className="hosts">
              <code>github.com/MartinPTielemans/browser/releases/download/updates/appcast.xml</code>
            </p>
            <p>
              On Linux, only the Flatpak updates, through Flatpak's own remote, as your other
              Flatpak apps do. Installing it fetches the runtime it runs on from Flathub, if you
              don't have it yet.
            </p>
            <p className="hosts">
              <code>dl.flathub.org</code>
            </p>
          </dd>

          <dt>Crash reports, only the ones you send</dt>
          <dd>
            <p>
              When ilo crashes it writes a report on your computer, and the report leaves it only if
              you say so. The next time ilo opens, it asks whether to send that one. Settings ›
              Privacy › Send crash reports, off unless you turn it on, sends each one without
              asking, and turning it off deletes those not yet sent.
            </p>
            <p>
              A report is what the crashed part of ilo was doing: its threads and their stacks,
              which can hold bits of what it was working on, the code it had loaded, and ilo's
              version, its switches, your graphics chip and your extensions' ids. Switches naming
              your folders are left out. It goes to Sentry, in the EU, told to keep no IP address
              with it, and carries no cookies.
            </p>
            <p className="hosts">
              <code>o4512341293334528.ingest.de.sentry.io</code>
            </p>
          </dd>

          <dt>Sync, only if you sign in</dt>
          <dd>
            <p>
              ilo works fully without an account. If you sign in to sync, ilo encrypts what it syncs
              on your computer, with a key the server never sees, so the server keeps only encrypted
              data. It goes to <code>sync.ilobrowser.com</code>, or to your own server if you run
              one (<a href="https://github.com/MartinPTielemans/ilo-server">ilo-server</a>
              ). Under that encryption, history isn't synced at all.
            </p>
            <p>
              The server does see your email address, which it sends your sign-in codes to, your
              devices' names, systems and ilo versions and when they were last active, which kinds
              of data you sync, how many items and how large, and when they change. It doesn't see
              what they are. Signing out stops sync, and deleting your account deletes everything
              the server holds for it.
            </p>
            <p className="hosts">
              <code>sync.ilobrowser.com</code>
            </p>
          </dd>

          <dt>Agents, only if you turn them on</dt>
          <dd>
            <p>
              Agents are off until you turn them on. An agent such as Claude Code reaches ilo
              through a connection on your computer that only your user account can open, never over
              the network. What it then opens is a page like any other. ilo never gives an agent
              your passwords or cookies; what the agent's own maker does with what it sees is up to
              them.
            </p>
          </dd>
        </dl>
      </section>

      <section>
        <h2>What ilo never sends</h2>
        <p>
          No usage data, no analytics, nothing for advertisers. Of Google's services, ilo brings
          back only those above: no Safe Browsing, no Google sync and no Google metrics.
        </p>
      </section>

      <section>
        <h2>Turning things off</h2>
        <p>
          Crash reports and sync are off until you turn them on: Settings › Privacy › Send crash
          reports, and signing out of your account. Ad blocking turns off with Settings › General ›
          Block ads and trackers. Store extensions check for updates only while you have one
          installed, and Widevine only once you've allowed protected video. The security updates
          above stay on, as they keep ilo from trusting certificates known to be bad.
        </p>
      </section>

      <section>
        <h2>Someone else's build of ilo</h2>
        <p>
          ilo is open source, so anyone can build their own. Official builds differ from such a fork
          only in their name and logo, their signing keys and a few addresses: the update feed,
          where crash reports go, the sync server, where ad block lists come from and this site. A
          fork chooses its own. What a fork sends is up to whoever makes it, so read theirs.
        </p>
      </section>

      <section>
        <h2>This site</h2>
        <p>
          ilobrowser.com sets no cookies and runs no analytics or third-party scripts. Cloudflare
          serves it, and sees each request as any host does.
        </p>
      </section>

      <section>
        <h2>Questions and changes</h2>
        <p>
          Ask on <a href={`${SOURCE}/issues`}>GitHub</a>. Every change to this page is in{" "}
          <a href="https://github.com/MartinPTielemans/ilo-site/commits/main/src/routes/privacy.tsx">
            the site's history
          </a>
          . Last changed 1 November 2026.
        </p>
      </section>
    </TextPage>
  );
}
