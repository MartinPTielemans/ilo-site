import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Cloudflare serves the prerendered /404 page at whatever address had no file. The router data in
// it is /404's, so the router reads the address it came at as /404 too, or hydration finds nothing
// it rendered and starts over.
const served =
  typeof document !== "undefined" && document.querySelector("[data-not-found]")
    ? location.pathname
    : undefined;

export function getRouter() {
  return createRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => {
        if (url.pathname !== served) return undefined;
        url.pathname = "/404";
        return url;
      },
    },
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
