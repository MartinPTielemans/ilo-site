import { Fragment, useEffect, useRef, useState } from "react";
import { PLATFORMS, type Platform, downloadUrl, platformFor } from "../downloads";

/** The platform the visitor's computer runs; the prerendered page offers the first. */
function usePlatform() {
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0]);
  useEffect(() => setPlatform(platformFor(navigator.userAgent)), []);
  return [platform, setPlatform] as const;
}

/** The download for the visitor's computer, named for it, and with `others` the rest after it. */
export function Download({ className, others }: { className: string; others?: boolean }) {
  const [platform] = usePlatform();
  return (
    <>
      <a className={className} href={downloadUrl(platform)}>
        Download for {platform.name}
      </a>
      {others && <Others platform={platform} />}
    </>
  );
}

function Others({ platform }: { platform: Platform }) {
  const rest = PLATFORMS.filter((other) => other !== platform);
  return (
    <p className="others">
      {platform.needs}
      {rest.length > 0 && ". Also for "}
      {rest.map((other, index) => (
        <Fragment key={other.id}>
          {index === 0 ? "" : index === rest.length - 1 ? " and " : ", "}
          <a href={downloadUrl(other)}>{other.name}</a>
        </Fragment>
      ))}
      .
    </p>
  );
}

// The close: one sentence whose blank is the computer, already filled in with the visitor's, and
// the button under it fetching that one. The blank opens a short list of the computers at the
// page's reading size, not the heading's. Without script the sentence names the first platform and
// the line under the button links the rest.
export function GetIlo() {
  const [platform, setPlatform] = usePlatform();
  const [open, setOpen] = useState(false);
  // How far along the heading the list hangs: under the blank, or as far as fits.
  const [at, setAt] = useState(0);
  const ask = useRef<HTMLDivElement>(null);
  const pick = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // A press anywhere else closes the list.
  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      if (!ask.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  function toggle() {
    if (!open && ask.current && pick.current && menu.current) {
      const left =
        pick.current.getBoundingClientRect().left - ask.current.getBoundingClientRect().left;
      setAt(Math.max(0, Math.min(left, ask.current.clientWidth - menu.current.offsetWidth)));
    }
    setOpen(!open);
  }

  function choose(one: Platform) {
    setPlatform(one);
    setOpen(false);
    pick.current?.focus();
  }

  return (
    <>
      {/* The heading reads "Get ilo for Mac.", with the computer chosen as its blank, and the list
          of computers hangs under it, outside the heading. */}
      <div
        className="ask"
        ref={ask}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !open) return;
          setOpen(false);
          pick.current?.focus();
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        <h2 className="get-line" id="get-title">
          Get ilo for{" "}
          <button
            ref={pick}
            type="button"
            className="pick"
            aria-expanded={open}
            aria-controls="computers"
            onClick={toggle}
          >
            {platform.name}
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
          .
        </h2>
        <div ref={menu} className={open ? "menu open" : "menu"} id="computers" style={{ left: at }}>
          {PLATFORMS.map((one) => (
            <button
              key={one.id}
              type="button"
              aria-pressed={one === platform}
              onClick={() => choose(one)}
            >
              {one.name}
              <small>{one.note}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="get">
        <a className="button big" href={downloadUrl(platform)}>
          Download for {platform.name}
        </a>
        <Others platform={platform} />
      </div>
    </>
  );
}
