import { existsSync } from "node:fs";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [
    // Every page is rendered to HTML at build time, so the site is static files any host can serve.
    tanstackStart({ prerender: { enabled: true, crawlLinks: true } }),
    viteReact(),
  ],
  // The live interface is asked for only once its build is in public/demo (src/live.ts).
  define: {
    "import.meta.env.ILO_DEMO": JSON.stringify(
      existsSync(new URL("./public/demo/ilo_demo.js", import.meta.url)),
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
