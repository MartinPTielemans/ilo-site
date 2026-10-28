import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { startField } from "../ascii";
import { Agents } from "../components/agents";
import { CommandBar } from "../components/command-bar";
import { Download } from "../components/download";
import { Spaces } from "../components/spaces";
import { Wordmark } from "../components/wordmark";
import { PLATFORM_LIST } from "../downloads";
import { useEntrances } from "../entrances";

export const Route = createFileRoute("/")({ component: Home });

const GITHUB = "https://github.com/MartinPTielemans/browser";

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
          <a href="#speed">Speed</a>
          <a href="#agents">Agents</a>
          <a href={GITHUB}>Source</a>
          <Download className="button" />
        </nav>
      </header>

      <main>
        <Spaces />
        <CommandBar />

        <section className="speed" id="speed" aria-labelledby="speed-title">
          <h2 id="speed-title">Measured, not imitated.</h2>
          <div className="mosaic">
            <figure className="shot">
              <picture>
                <source media="(max-width: 599px)" srcSet="/media/work-s.webp 2x" />
                <img
                  src="/media/work-1x.webp"
                  srcSet="/media/work-1x.webp 1x, /media/work.webp 2x"
                  width={1280}
                  height={800}
                  loading="lazy"
                  alt="The whole ilo window at its real size, in the Work Space: the sidebar with its favorites, pinned tab and Today tabs, beside the Rust book."
                />
              </picture>
            </figure>
            <div className="tile ink">
              <p className="figure">
                110<span>ms</span>
              </p>
              {/* The figure in frames of the 60 fps recordings it was timed from. */}
              <p className="frames">
                <span aria-hidden="true">######:</span> 6.6 frames at 60 fps
              </p>
              <p>
                ⌘S hides the sidebar as fast as Arc's, timed from 60 fps recordings of Arc itself.
              </p>
            </div>
            <div className="tile blue">
              <p className="figure">
                16<span>ms</span>
              </p>
              <p className="frames">
                <span aria-hidden="true">#</span> 1 frame at 60 fps
              </p>
              <p>
                The slowest a tab switch may be: one frame. Launch, memory and idle may cost no more
                than Chrome.
              </p>
            </div>
          </div>
        </section>

        <Agents />

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
              So ilo is GPL, all of it that runs on your computer. No ads, no selling data, no paid
              features and no licence checks.{" "}
              <mark>If I ever stop, anyone can carry on from the code.</mark>
            </p>
            <p>
              Underneath is Chromium, so your sites and extensions work. On top is a native
              interface instead of a web page, so it can be as quick as Chrome, and every motion is
              timed against Arc's.
            </p>
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
            Free, and in beta for {PLATFORM_LIST}. Your Spaces and tabs come over from Arc or
            Chrome.
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
