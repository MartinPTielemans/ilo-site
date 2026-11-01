// ilo's releases, newest first, from GitHub when the site is built (tools/releases.ts).
declare module "virtual:releases" {
  const releases: import("../tools/releases").Release[];
  export default releases;
}
