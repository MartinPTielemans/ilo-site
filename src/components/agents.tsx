import { useEffect, useRef, useState, type CSSProperties } from "react";

const STEPS = [
  {
    say: "First, your agent gets a Space of its own.",
    detail:
      "Claude Code, Codex or any MCP client works in tabs there while you keep working in yours.",
  },
  {
    say: "Then it asks before it pays, and never sees a password.",
    detail:
      "It acts inside your logged-in sessions. Passwords, cookies and autofill stay out of its reach.",
  },
  {
    say: "At a sign-in, it stops and hands you the tab.",
    detail:
      "Sign-ins, 2FA and CAPTCHAs are yours to do, and every step it took is in the activity log.",
  },
];

// Agents: the fragment holds its place while the three steps pass, and takes the state of the step
// at the middle of the screen.
export function Agents() {
  const steps = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const middle = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setStep(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const node of steps.current?.children ?? []) middle.observe(node);
    return () => middle.disconnect();
  }, []);

  return (
    <section className="agents" id="agents" aria-labelledby="agents-title">
      <h2 id="agents-title">Agent Spaces</h2>
      <div className="steps" ref={steps}>
        {STEPS.map(({ say, detail }, index) => (
          <div className={index + 1 === step ? "step on" : "step"} data-step={index + 1} key={say}>
            <p className="say">{say}</p>
            <p>{detail}</p>
          </div>
        ))}
      </div>
      <div className="pin">
        <div className="agent" data-ui data-state={step} aria-hidden="true">
          <div className="sb">
            <div className="sb-lights">
              <i />
              <i />
              <i />
            </div>
            <div className="sb-title">
              <span className="ring" />
              Claude Code
            </div>
            <div className="sb-row fares">
              <span className="fav">S</span>Fares CPH → LIS
              <span className="spin" />
            </div>
            <div className="sb-row hotel">
              <span className="fav">H</span>Hotel Alfama
            </div>
            <div className="sb-row">
              <span className="fav">S</span>Booking SK-4821
            </div>
            <div className="sb-dots">
              {["lisbon", "work", "reading"].map((space) => (
                <i key={space} style={{ "--c": `var(--${space})` } as CSSProperties} />
              ))}
              <i className="me" />
            </div>
          </div>
          <div className="page">
            <div className="site fares">
              <p className="host">skylark.travel</p>
              <p className="head">Copenhagen → Lisbon</p>
              <p className="sub">Fri 13 Nov · 1 adult</p>
              <ol className="flights">
                <li className="pick">
                  <b>07:05 – 09:50</b>
                  <span>Direct · 3h 45m</span>
                  <b>$412</b>
                </li>
                <li>
                  <b>10:20 – 15:35</b>
                  <span>1 stop · 6h 15m</span>
                  <b>$389</b>
                </li>
                <li className="more">
                  <b>13:10 – 18:05</b>
                  <span>1 stop · 5h 55m</span>
                  <b>$402</b>
                </li>
                <li>
                  <b>18:40 – 21:25</b>
                  <span>Direct · 3h 45m</span>
                  <b>$455</b>
                </li>
                <li className="more">
                  <b>21:00 – 23:45</b>
                  <span>Direct · 3h 45m</span>
                  <b>$498</b>
                </li>
              </ol>
              <span className="pay">Pay $412</span>
            </div>
            <div className="site signin">
              <p className="host">hotelbook.io</p>
              <p className="head">Sign in to book</p>
              <p className="sub">Hotel Alfama · 13–17 Nov</p>
              <span className="field-box">Email</span>
              <span className="field-box">Password</span>
              <span className="pay">Sign in</span>
            </div>
          </div>
          <div className="card ask">
            <p className="who">Claude Code</p>
            <p className="what">Click “Pay $412” on skylark.travel</p>
            <div className="acts">
              <span className="btn">Deny</span>
              <span className="btn main">Allow</span>
            </div>
          </div>
          <div className="card hand">
            <p className="who">Claude Code needs you</p>
            <p className="what">Sign in to hotelbook.io</p>
            <div className="acts">
              <span className="btn main">Show Tab</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
