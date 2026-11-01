import { createFileRoute } from "@tanstack/react-router";
import { PlatformPage, platformHead } from "../components/platform-page";

export const Route = createFileRoute("/windows")({
  head: () => platformHead("windows"),
  component: () => <PlatformPage id="windows" />,
});
