import { Fragment, type MouseEvent, useEffect, useRef, useState } from "react";
import { PLATFORMS, type Platform, downloadUrl, platformFor, runsIlo } from "../downloads";
import { SEND, SEND_LABEL, mailFor } from "../send";

/**
 * What the visitor is on: the platform to offer them, and whether ilo runs on their device at all.
 * The prerendered page offers the first platform, as if it did.
 */
function useVisitor() {
  const [platform, setPlatform] = useState<Platform>(PLATFORMS[0]);
  const [runs, setRuns] = useState(true);
  useEffect(() => {
    setPlatform(platformFor(navigator.userAgent));
    setRuns(runsIlo(navigator.userAgent, navigator.maxTouchPoints));
  }, []);
  return { platform, setPlatform, runs };
}

/** Opens the phone's share sheet where there is one; without it the link's mail opens instead. */
function share(event: MouseEvent<HTMLAnchorElement>) {
  if (!("share" in navigator)) return;
  event.preventDefault();
  // A visitor who closes the sheet has chosen, so its refusal is no error.
  navigator.share(SEND).catch(() => {});
}

/** The button on a phone: ilo's address, sent to the visitor's computer. */
function Send({ className, brief }: { className: string; brief?: boolean }) {
  return (
    <a className={className} href={mailFor(SEND)} onClick={share}>
      {brief ? SEND_LABEL.brief : SEND_LABEL.full}
    </a>
  );
}

/**
 * The download for the visitor's computer, named for it, and with `others` the rest after it. On a
 * phone it sends ilo to their computer instead, in fewer words where `brief` says there's little
 * room.
 */
export function Download({
  className,
  others,
  brief,
}: {
  className: string;
  others?: boolean;
  brief?: boolean;
}) {
  const { platform, runs } = useVisitor();
  if (!runs) return <Send className={className} brief={brief} />;
  return (
    <>
      <a className={className} href={downloadUrl(platform)}>
        Download for {platform.name}
      </a>
      {others && <Others platform={platform} />}
    </>
  );
}

/**
 * The download on a page with no React in the browser: the first platform's, which the page's
 * script (src/reading.ts) makes the visitor's, or `platform`'s alone on that platform's page.
 */
export function DownloadLink({ className, platform }: { className: string; platform?: Platform }) {
  const one = platform ?? PLATFORMS[0];
  return (
    <a className={className} href={downloadUrl(one)} data-get={platform?.id ?? ""}>
      {`Download for ${one.name}`}
    </a>
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

/** Each platform's page, as a sentence lists them: where a phone's visitor reads what ilo needs. */
function Pages() {
  return (
    <p className="others">
      For{" "}
      {PLATFORMS.map((one, index) => (
        <Fragment key={one.id}>
          {index === 0 ? "" : index === PLATFORMS.length - 1 ? " and " : ", "}
          <a href={`/${one.id}`}>{one.name}</a>
        </Fragment>
      ))}
      .
    </p>
  );
}

// The close: one sentence whose blank is the computer, already filled in with the visitor's, and
// the button under it fetching that one. The blank opens a short list of the computers at the
// page's reading size, not the heading's. Without script the sentence names the first platform and
// the line under the button links the rest. On a phone the sentence has no blank: it says to get
// ilo on a computer, and the button sends it there.
export function GetIlo() {
  const { platform, setPlatform, runs } = useVisitor();
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
          {runs ? (
            <>
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
            </>
          ) : (
            "Get ilo on your computer."
          )}
        </h2>
        {runs && (
          <div
            ref={menu}
            className={open ? "menu open" : "menu"}
            id="computers"
            style={{ left: at }}
          >
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
        )}
      </div>
      <div className="get">
        {runs ? (
          <>
            <a className="button big" href={downloadUrl(platform)}>
              Download for {platform.name}
            </a>
            <Others platform={platform} />
          </>
        ) : (
          <>
            <Send className="button big" />
            <Pages />
          </>
        )}
      </div>
    </>
  );
}
