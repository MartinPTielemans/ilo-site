import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import css from "../styles.css?url";

const title = "ilo: the browser that keeps going";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      {
        name: "description",
        content:
          "ilo is a free, open-source browser with the Spaces, sidebar and command bar you know from Arc, on Chromium. Pre-alpha, Mac first.",
      },
      { name: "theme-color", content: "#F3F0E8" },
      { property: "og:title", content: title },
      {
        property: "og:description",
        content:
          "A free, open-source browser with the Spaces, sidebar and command bar you know from Arc, on Chromium.",
      },
      { property: "og:image", content: "/media/og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "preload",
        href: "/fonts/outfit.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: css },
    ],
  }),
  shellComponent: Document,
});

function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
