import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { startField } from "../ascii";
import { CommandBar } from "../components/command-bar";
import { Download } from "../components/download";
import { Habits } from "../components/habits";
import { Spaces } from "../components/spaces";
import { Wordmark } from "../components/wordmark";
import { PLATFORM_LIST, SOURCE as GITHUB } from "../downloads";
import { useEntrances } from "../entrances";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  useEntrances();
  // The close's land: the hero's, still going, in the colour of the Space last shown.
  const land = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!land.current) return;
    const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink");
    return startField(land.current, { ground: ink, horizon: 0.3, strength: 0.7 });
  }, []);

  return (
    <>
      <header className="top">
        <a className="brand" href="#top" aria-label="ilo, back to the top">
          <Wordmark />
        </a>
        <nav className="links" aria-label="Sections">
          <a href="#arc">From Arc</a>
          <a href="#why">Why</a>
          {/* The source is the proof that ilo is open, so it gets a button, not a word. */}
          <a className="button quiet" href={GITHUB} aria-label="ilo on GitHub">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>GitHub</span>
          </a>
          <Download className="button" />
        </nav>
      </header>

      <main>
        <Spaces />
        <CommandBar />

        <Habits />

        <section className="letter" id="why" aria-labelledby="why-title">
          <div className="letter-head">
            <span className="portrait" aria-hidden="true" />
            <h2 id="why-title">Why ilo</h2>
          </div>
          <div className="letter-body">
            <p>
              Arc changed how I use a computer. Spaces, the sidebar and ⌘T turned a mess of tabs
              into something I could hold in my head.
            </p>
            <p>
              On December 22 it stops, and everyone who lives in it has to move. A browser you live
              in shouldn't be something a company can take back.
            </p>
            <p>
              So ilo is GPL, all of it that runs on your computer, with no ads, no selling data and
              no licence checks. Paid features will come later: I'll host them for a price, and you
              can host every one of them yourself.{" "}
              <mark>If I ever stop, anyone can carry on from the code.</mark>
            </p>
            <p>Underneath is Chromium, so your sites and extensions work.</p>
            <p>The beta is out. Bring your Spaces over from Arc, and tell me what you miss.</p>
            <p className="sign">Martin</p>
            <p className="role">Building ilo</p>
          </div>
        </section>

        <section className="close" aria-labelledby="close-title">
          <canvas className="land" ref={land} aria-hidden="true" />
          <h2 id="close-title">
            Further than <br />
            it got.
          </h2>
          <p>
            Free, <a href={GITHUB}>open source</a>, and in beta for {PLATFORM_LIST}. Your Spaces and
            tabs come over from Arc or Chrome.
          </p>
          <div className="get">
            <Download className="button big" others />
          </div>
        </section>
      </main>

      <footer className="foot">
        <p className="what">
          <a href="/ilo">ilo, a good tool.</a>
        </p>
        <p className="where">
          <a href={GITHUB}>GitHub</a>
          <a href={`${GITHUB}/blob/main/LICENSE`}>GPL-3.0</a>
          <a href="https://github.com/MartinPTielemans/ilo-site">This site's code</a>
        </p>
        <p className="when">2026 · No cookies, no tracking</p>
        <p className="fine">
          Arc is a trademark of The Browser Company, and ilo isn't affiliated with it. The captures
          show Wikivoyage and Wikipedia (CC BY-SA), the Rust book (MIT or Apache 2.0) and The Public
          Domain Review.
        </p>
      </footer>
    </>
  );
}
