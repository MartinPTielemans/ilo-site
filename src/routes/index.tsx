import { createFileRoute } from "@tanstack/react-router";
import { type RefObject, useEffect, useRef } from "react";
import { type FieldOptions, startField } from "../ascii";
import { CommandBar } from "../components/command-bar";
import { Download, GetIlo } from "../components/download";
import { Foot } from "../components/foot";
import { Habits } from "../components/habits";
import { Spaces } from "../components/spaces";
import { Wordmark } from "../components/wordmark";
import { SOURCE as GITHUB } from "../downloads";
import { useEntrances } from "../entrances";

export const Route = createFileRoute("/")({ component: Home });

/** Starts a character field on `canvas` once the page has its colours. */
function useField(
  canvas: RefObject<HTMLCanvasElement | null>,
  options: (style: CSSStyleDeclaration) => FieldOptions,
) {
  useEffect(() => {
    if (!canvas.current) return;
    return startField(canvas.current, options(getComputedStyle(document.documentElement)));
    // The options are read once, when the field starts.
  }, []);
}

function Home() {
  useEntrances();
  // The close's land: the hero's, still going, under the stars.
  const land = useRef<HTMLCanvasElement>(null);
  useField(land, (style) => ({
    ground: style.getPropertyValue("--ink"),
    hot: style.getPropertyValue("--paper"),
    stars: true,
    lamp: true,
    // The land begins just under the button and the line beneath it.
    scene: (_, height) => {
      const get = land.current?.parentElement?.querySelector<HTMLElement>(".get");
      return { horizon: get ? (get.offsetTop + get.offsetHeight + 40) / height : 0.5 };
    },
  }));

  return (
    <>
      <header className="top">
        <a className="brand" href="#top" aria-label="ilo, back to the top">
          <Wordmark />
        </a>
        <nav className="links" aria-label="Sections">
          <a href="#features">Features</a>
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

        {/* What it costs, what's open and where it runs, on tiles that step down. */}
        <section className="figures" aria-labelledby="figures-title">
          <h2 id="figures-title">Yours to keep.</h2>
          <div className="tile free">
            <p className="figure">$0</p>
            <p>For the whole browser, on every computer it runs on.</p>
          </div>
          <div className="tile open">
            <p className="figure">100%</p>
            <p>
              Of what runs on your computer is <a href={`${GITHUB}/blob/main/LICENSE`}>GPL-3.0</a>.
            </p>
          </div>
          <div className="tile where">
            <p className="figure">3</p>
            <p>Mac, Windows and Linux, on Chromium, so your sites and extensions work.</p>
          </div>
        </section>

        {/* Why ilo is open, in the first person. */}
        <section className="letter" id="why" aria-labelledby="why-title">
          <h2 id="why-title">
            Nobody can <br />
            take it back.
          </h2>
          <div className="letter-body">
            <div>
              <h3>Why it's open</h3>
              <p>
                A browser you live in shouldn't be something a company can take back. So ilo is GPL,
                all of it that runs on your computer, with no ads, no selling your data and no
                licence checks.
              </p>
            </div>
            <div>
              <h3>How it pays</h3>
              <p>
                Paid features will come later. I'll host them for a price, and you can host every
                one of them yourself.{" "}
                <mark>If I ever stop, anyone can carry on from the code.</mark>
              </p>
            </div>
            <p className="sign">
              Martin <span>Building ilo</span>
            </p>
          </div>
        </section>

        <section className="close" aria-labelledby="get-title">
          <canvas className="land" ref={land} aria-hidden="true" />
          <GetIlo />
        </section>
      </main>

      <Foot>
        The captures show Wikivoyage and Wikipedia (CC BY-SA), the Rust book (MIT or Apache 2.0) and
        The Public Domain Review.
      </Foot>
    </>
  );
}
