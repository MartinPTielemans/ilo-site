import { readFileSync } from "node:fs";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [
    // Every page is rendered to HTML at build time, so the site is static files any host can serve.
    tanstackStart({ prerender: { enabled: true, crawlLinks: true } }),
    viteReact(),
  ],
  // The live interface is the browser repo's build in public/demo. Its SOURCE file names the commit
  // it was built from, and the hero's caption links there, as the GPL asks of a site that serves it.
  define: {
    "import.meta.env.ILO_DEMO_SOURCE": JSON.stringify(
      readFileSync(new URL("./public/demo/SOURCE", import.meta.url), "utf8").match(
        /https:\/\/\S+/,
      )?.[0],
    ),
  },
  // The router plugin writes the route tree on every build, and public/demo is the browser repo's
  // build of the live interface.
  fmt: { ignorePatterns: ["src/routeTree.gen.ts", "public/demo/**"] },
  lint: {
    ignorePatterns: ["src/routeTree.gen.ts", "public/demo/**"],
    options: { typeAware: true, typeCheck: true },
  },
});
