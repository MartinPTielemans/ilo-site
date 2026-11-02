/** A change, in a sentence, and the clip that shows it, if it has one. */
export type Note = string | { text: string; clip: string };

export type Release = {
  version: string;
  /** The day it was published, as "29 October 2026"; none while it's still to come. */
  date?: string;
  summary: string;
  notes: Note[];
};

/** Where a clip's files are: NAME.mp4, NAME.webp (its first frame) and NAME-still.webp. */
export const CLIPS = "/media/changelog";

// Newest first. A release's notes go here when it's published, with its date: the app's What's New
// and the notes each update shows link to /changelog#<version>. A clip is the files
// tools/clip.sh makes from a recording and its name here, on the note it shows.
export const RELEASES: Release[] = [
  {
    version: "0.1.1",
    date: "2 November 2026",
    summary: "Fixes for the 0.1.0 beta, most of them on Windows.",
    notes: [
      "Windows: ilo no longer quits when a window moves to another monitor, or is resized after its last tab closed.",
      "Windows: no empty boxes left over the page after a window is minimized and restored.",
      "Windows: the app, its windows and their taskbar thumbnails show ilo's icon.",
      "Windows: Microsoft sign-ins that need a compliant device work on PCs joined to a work or school account.",
      "A window no longer shows a leftover page after its last tab closes.",
      "A pinned tab in a split view keeps its pin, and closing its pane only takes it out of the split.",
      "The command bar always takes the keyboard when it opens.",
      "Onboarding offers an ilo account, so sync is found on the first run.",
      "A key an agent presses goes to the page only, never to ilo's shortcuts.",
    ],
  },
  {
    version: "0.1.0",
    date: "1 November 2026",
    summary: "The first beta, for people ready to live in it and tell us what breaks.",
    notes: [
      {
        text: "Spaces, each with its own colour and its own tabs. Swipe with two fingers to move between them.",
        clip: "spaces",
      },
      {
        text: "The command bar on ⌘T, for addresses, searches, open tabs and every command.",
        clip: "command-bar",
      },
      "A sidebar with favorites, pinned tabs, folders and Today tabs, which move to the Library's archive when you leave them alone.",
      "Profiles that keep logins, cookies and extensions apart.",
      "Bring your tabs, bookmarks and history in from the other browsers on your computer, and passwords from a file you export.",
      "Sync with an ilo account, end-to-end encrypted, so the server can't read what it keeps. You can run your own.",
      "Passwords saved and filled in.",
      "Split view, find in page, downloads and DevTools.",
      "Extensions from the Chrome Web Store, and ads and trackers blocked with uBlock Origin built in.",
      "Protected video, such as Netflix.",
      "Updates that install themselves, and crash reports only if you choose to send them.",
    ],
  },
];
