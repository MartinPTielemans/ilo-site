import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, platformHead } from "../components/platform-page";

export const Route = createFileRoute("/linux")({
  head: () => platformHead("linux"),
  component: () => <PlatformPage id="linux" />,
});
