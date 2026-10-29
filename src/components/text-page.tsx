import type { ReactNode } from "react";
import { Download } from "./download";
import { Foot } from "./foot";
import { Wordmark } from "./wordmark";

/**
 * A page of reading, as the app's Help menu and Settings open them: the wordmark home, the other
 * reading pages and the download, then `title`, `lead` under it, and the page's sections.
 */
export function TextPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <header className="top">
        <a className="brand" href="/" aria-label="ilo, home">
          <Wordmark />
        </a>
        <nav className="links" aria-label="Pages">
          <a href="/help">Help</a>
          <a href="/whats-new">What's new</a>
          <a href="/privacy">Privacy</a>
          <Download className="button" />
        </nav>
      </header>
      <main className="text">
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {children}
      </main>
      <Foot />
    </>
  );
}
