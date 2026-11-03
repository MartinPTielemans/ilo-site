import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "../seo";
import { TextPage } from "../components/text-page";
import { SOURCE } from "../downloads";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      path: "/privacy",
      title: "Privacy · ilo",
      description:
        "What leaves your computer when you use ilo, and every service and address it talks to.",
    }),
  component: Privacy,
});

// The services, each with the hosts it reaches, as the browser's code on main names them: the
// branding files (app/branding/update-feed, app/branding/crash-reports), core/crash_reports.cc's
// traffic annotation, core/search.cc and core/suggest.h, engine/README.md › What reaches Google,
// core/widevine.cc, tools/flatpak-repo.sh's runtime repository, and uBlock Origin's own
// assets.json for the lists, and for sync core/sync_guard.h, app/src/account.rs and ilo-server's
// README › What the server can see. It says no more than the code does.

// The services below in a line each, as the page tells them: what, when and to whom. A change to a
// service changes its row too.
const GLANCE = [
  {
    id: "pages",
    what: "The pages you open",
    when: "As you browse and search",
    to: "Each site, and your search engine",
  },
  {
    id: "chrome-web-store",
    what: "Extensions",
    when: "When you use the store, and about every five hours with one installed",
    to: "Google",
  },
  {
    id: "security-updates",
    what: "Security updates",
    when: "A minute after launch, then every five hours",
    to: "Google",
  },
  {
    id: "widevine",
    what: "Protected video",
    when: "On Linux, once you allow it",
    to: "Google",
  },
  {
    id: "ad-block-lists",
    what: "Ad block lists",
    when: "About once a week",
    to: "The lists' hosts",
  },
  {
    id: "updates",
    what: "ilo's updates",
    when: "Every 8 hours on a Mac and Windows; with Flatpak on Linux",
    to: "GitHub, or your Flatpak remote",
  },
  {
    id: "crash-reports",
    what: "Crash reports",
    when: "Only those you send",
    to: "Sentry, in the EU",
  },
  {
    id: "sync",
    what: "Sync",
    when: "Only while you're signed in, end-to-end encrypted",
    to: "ilo's sync server, or your own",
  },
];
function Privacy() {
  return (
    <TextPage
      title="Privacy"
      lead={
        <>
          ilo needs no account, has no analytics and no ads, and sells nothing about you. It sends
          no record of how you use it. What leaves your computer is the pages you open and the few
          checks below, each with where it goes.
        </>
      }
    >
      <section id="at-a-glance">
        <h2>At a glance</h2>
        <table className="glance">
          <thead>
            <tr>
              <th scope="col">What</th>
              <th scope="col">When</th>
              <th scope="col">To</th>
            </tr>
          </thead>
          <tbody>
            {GLANCE.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <a href={`#${row.id}`}>{row.what}</a>
                </th>
                <td>{row.when}</td>
                <td>{row.to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="pages">
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
          <dt id="chrome-web-store">The Chrome Web Store, from Google</dt>
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

          <dt id="security-updates">Chromium's security updates, from Google</dt>
          <dd>
            <p>
              ilo is built on ungoogled-chromium, which cuts Chromium's calls to Google. ilo brings
              one back, for safety: a check for three components that keep the browser from trusting
              what's known to be bad. They're the list of revoked certificates (CRLSet), the
              certificate authorities and logs Chromium trusts (PKI Metadata), and the certificate
              error helper. It runs a minute after launch, then every five hours.
            </p>
            <p className="hosts">
              <code className="path">update.googleapis.com/service/update2/json</code>, with
              downloads only from <code>dl.google.com</code>, <code>*.gvt1.com</code> and{" "}
              <code>www.google.com/dl/</code>
            </p>
          </dd>

          <dt id="widevine">Widevine, for protected video on Linux</dt>
          <dd>
            <p>
              On Linux, Netflix and other protected video need Google's Widevine module, which ilo
              doesn't ship. Once you allow protected video, ilo downloads it, and keeps it up to
              date, from the same Google hosts as the security updates. Removing it in Settings
              stops that. On a Mac, protected video plays in macOS's own web engine, and on Windows
              with Windows' own PlayReady, so ilo fetches nothing for it there.
            </p>
          </dd>

          <dt id="ad-block-lists">Ad block lists</dt>
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

          <dt id="updates">ilo's updates</dt>
          <dd>
            <p>
              Only a copy that updates itself checks. On a Mac and on Windows, ilo reads its update
              feed every 8 hours, sending no profile of your system, and downloads an update from
              ilo's releases on GitHub.
            </p>
            <p className="hosts">
              <code className="path">
                github.com/MartinPTielemans/ilo/releases/download/updates/appcast.xml
              </code>
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

          <dt id="crash-reports">Crash reports, only the ones you send</dt>
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

          <dt id="sync">Sync, only if you sign in</dt>
          <dd>
            <p>
              Sync is off until you sign in to an ilo account, in Settings › Sync or when ilo first
              opens. Signing in sends your email address, then a code mailed to you or a passkey, to
              the account's server: ilo's, unless you give ilo the address of one you run yourself
              from <a href="https://github.com/MartinPTielemans/ilo-server">its source</a>. It needs
              no Google account.
            </p>
            <p>
              Signed in, ilo syncs your Spaces and your first profile's bookmarks, passwords and
              open tabs. They're encrypted on your computer with your 24 recovery words, which only
              your devices have, and the server keeps them encrypted and turns away anything that
              arrives unencrypted. Even which site and username a password is for stays hidden.
            </p>
            <p>
              What the server can see is your email address; each device by its kind, such as "ilo
              on Mac", with its operating system and when it was last active; a few of Chromium's
              settings it keeps unencrypted; and, for the rest, which kinds of data you sync, how
              many items, how large, when they change and how bookmarks nest, but not their names,
              addresses or contents. When your devices message each other through it, it sees when
              and how much, not what they say. Signing out stops it all.
            </p>
            <p className="hosts">
              <code>sync.ilobrowser.com</code>
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
        <h2>Someone else's build of ilo</h2>
        <p>
          ilo is open source, so anyone can build their own. Official builds differ from such a fork
          only in their name and logo, their signing keys and a few addresses: the update feed,
          where crash reports go, where ad block lists come from and this site. A fork chooses its
          own. What a fork sends is up to whoever makes it, so read theirs.
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
          . Last changed 3 November 2026.
        </p>
      </section>
    </TextPage>
  );
}
