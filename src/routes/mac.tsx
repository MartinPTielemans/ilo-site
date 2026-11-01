import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, platformHead } from "../components/platform-page";

export const Route = createFileRoute("/mac")({
  head: () => platformHead("mac"),
  component: () => <PlatformPage id="mac" />,
});
