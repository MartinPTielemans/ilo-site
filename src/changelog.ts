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
    version: "0.1.2",
    date: "2 November 2026",
    summary:
      "Little ilo for quick pages and links from other apps, Peek for any link, sidebar backups and more fixes.",
    notes: [
      {
        text: "Little ilo: a small window for a quick page, from ⌥⌘N (Ctrl+Alt+N on Windows and Linux), ⌥⌘-click on a tab, the Dock's menu or an optional menu bar button. It opens where the pointer is, at the size the last one closed at, and its bar picks the page's profile. ⌘O moves its page to the main window, and ⇧⌘T reopens one you closed.",
        clip: "little-ilo",
      },
      "Links from other apps can open in Little ilo, chosen in Settings › Links. The same link brings back the window it opened.",
      {
        text: "⇧-click a link, or choose Open Link in Peek from its menu, to open it in Peek over the page you're on. Peek's page is now the card, with its site and buttons floating over a lighter dim.",
        clip: "peek",
      },
      {
        text: "ilo keeps backups of your sidebar: Help › Restore Earlier Sidebar, or the command bar, brings one back.",
        clip: "sidebar-backups",
      },
      "A pinned folder moves to another Space from its menu, the command bar or a drag.",
      "An unloaded pinned tab's row has a button that removes it from the pinned tabs.",
      "Updates download in the background and say when they're ready, on every OS. Their notes and What's New open the release's entry here.",
      "Windows: shortcuts keep working after a window is minimized and restored.",
      "Windows: a link from another app opens once, and opening ilo again brings its window forward.",
      "Windows: a window closed maximized opens maximized again.",
      "Windows: quitting after a browser window closed under Little ilo no longer crashes.",
      "Windows: menus, the command bar and other overlays stay under another app's window in front of ilo.",
      "A long note at the top of the page shortens its words instead of running past the window's edge.",
      "A sidebar name field keeps what's typed when it loses the keyboard.",
      "Connect finds Claude Code wherever it was installed.",
    ],
  },
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
