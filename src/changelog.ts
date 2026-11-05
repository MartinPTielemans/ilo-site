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
    version: "0.1.8",
    date: "5 November 2026",
    summary:
      "A click in an agent's page takes it over, and an agent's tabs open muted. Keys typed fast after a dialog closes, or after Ctrl+F on Windows, land where you meant them.",
    notes: [
      'A click in the page an agent works in takes it over, and the click goes on to the page. The strip under it then reads "You\'re driving", with Hand Back. ⌘↩ still takes over and hands back.',
      "An agent's tabs open muted. A crossed speaker shows on its tile and its strip while it plays, and a click there unmutes it. Open, which moves a finished task's page to your Space, unmutes it.",
      "On the Mac and Windows, a key typed while a dialog is closing reaches the browser window instead of being lost with the dialog.",
      "On Windows, the keys typed right after Ctrl+F reach the find bar, whether the page or ilo's own controls had the keyboard.",
    ],
  },
  {
    version: "0.1.7",
    date: "5 November 2026",
    summary:
      "Little ilo grows into a full window, with its own command bar, its pinned extensions and full screen, and sends its page to any Space. The agent surfaces say what needs you and how far the agent has got.",
    notes: [
      "Little ilo opens its command bar inside its window, from ⌘L and ⌘T. Open in <Space> and its Spaces menu send its page to any Space. On the Mac it grows in from under the pointer.",
      "Little ilo's bar has your pinned extensions at its title's end, with their popups and menus, and a page's video goes full screen in the Little ilo window. Esc leaves full screen and keeps the window.",
      'The agent surfaces say what needs you. An agent\'s card has one primary button, Allow Once, Show Tab or Hand Back, and says how far the agent has got: "Step 5 · Clicking …", "Stopped after 6 steps", or "Needs you" and why. The conversation\'s header counts steps and pages.',
      'A ⌘T task\'s Always Allow and Never answers belong to its CLI, Claude or Codex. Settings › Agents lists them under "What Claude may do from ⌘T", each with Revoke. Answers an earlier version kept for a single task are cleared at launch.',
      "The import reads at a glance, in Settings and on the first launch: one line for each kind of data with its count, fewer words at each step, and one row with the counts when it's done.",
      "Screen readers (VoiceOver, Narrator and Orca) name the controls in Settings' Sync, Links, About and import views, by what each one does.",
      "A desktop app's sign-in that opens in Little ilo hands back to the app when it's done.",
      'The open-app dialog\'s "Always allow" line wraps inside the dialog instead of running past its edge.',
    ],
  },
  {
    version: "0.1.6",
    date: "5 November 2026",
    summary:
      "Settings you can use from the keyboard alone, a media player that stacks in the sidebar, a switch for automatic update checks, and, on the Mac, scripts that can read and open ilo's windows, Spaces and tabs once you let them.",
    notes: [
      "Settings works from the keyboard alone. ⇥ and ⇧⇥ move through it in reading order, ↑ and ↓ move along its column, and Space or ↩ acts. Typing a letter starts a search, and ⌘F goes to the search field. ⌘W, Esc and ⌘Z still do what they did.",
      'Settings › About has "Check for updates automatically", on the Mac and on Windows. Turned off, ilo asks for no updates until you choose Check for Updates.',
      "The sidebar's media player is a stack. The newest player shows, with up to two older ones peeking behind it. Point at it and they all open, each with its title, a close button, and Picture in Picture where the page allows it.",
      "Edit Theme Color… opens its picker at the window's top corner.",
      "With one Space that has no name or icon of yours, its name row hides. Show Space Header, in the Space's menu, brings it back.",
      "Mac: scripts can read ilo's windows, Spaces and tabs, show a Space or a tab, and open windows and tabs, once you turn on \"Let scripts control the browser\" in Settings › Agents. It's off at first. Scripts never see private windows or agents' Spaces, and nothing they can ask reads a page. Every script's request goes in the agents' activity log, and Settings shows them under \"What scripts did\".",
      "Mac: VoiceOver names the controls in Settings' sections, including Shortcuts' keys, and the tab rows' buttons, the delete dialog, the find bar and its count, Site Controls, the icon picker and New Space.",
      "Mac and Windows: closing a Little ilo window that's over another app's window leaves that app in front.",
      "Linux: on Wayland, holding Esc to close the command bar no longer sends Esc on to the page.",
      "Linux: on Wayland, a click on the page that closes the command bar gives the page the keyboard. A click outside a menu over the command bar closes both.",
      "Linux: on Wayland, a page takes clicks as soon as what covered it goes, rather than after its next frame.",
      "Linux: on Wayland, going in or out of full screen lays the page out again, even when the window's size stays the same.",
    ],
  },
  {
    version: "0.1.5",
    date: "5 November 2026",
    summary:
      "A security update to Chromium 156.0.8078.79, with Settings in a window of its own you can search, an import that shows what each browser holds, tabs you can drag to another window, and a quiet banner for updates.",
    notes: [
      "The engine is on Chromium 156.0.8078.79, a security point release.",
      "Mac: ilo no longer answers Chromium's AppleScript commands, which let a script read and change tabs outside ilo's rules for agents.",
      "Settings is a window of its own, its twelve sections in a column beside a card. Search every section from the top, or find a setting from the command bar.",
      "Settings has new rows for Appearance, the Dock icon, the edge reveal and agent tasks.",
      "Drag a tab's row out of its window to move it to another window, or to a window of its own.",
      "The import reads a browser as you pick it, says how much of each thing will come, and brings Spaces in as cards in their own colours.",
      "Agents from other apps get the same task card as ⌘T's tasks, and their Spaces stay out of every list.",
      "A task with two pages or more opens on Pages, a grid of them, and an outside agent's session ends on a receipt.",
      "A task that waits for you badges the Dock or the taskbar.",
      "A ready update waits in a small banner at the sidebar's foot. Point at it to see it, click to restart into it.",
      "A new download flies into the Library button, where the recent downloads show.",
      "The command bar puts the commands you pick and the tabs you switch to first, learned per profile on this computer only.",
      "The command bar has Mute All Tabs, Enter Full Screen and New Profile, and ⌘N's window opens with it.",
      "Window › Stay On Top keeps a window over the others.",
      "Esc in full screen goes to the page first; press it twice, or hold it, to leave.",
      "Rest the pointer on a link and its whole address shows.",
      "A Google Meet link from another app opens in the Space you're in.",
      "Until a page paints, it shows black or white to match the appearance, so a dark site no longer flashes white.",
      "Only the tabs scroll in the sidebar, under the Space's name.",
      "With the sidebar hidden, a pointer flung to the window's edge no longer brings it out.",
      "The mouse's back and forward buttons go to the Library and a new Space, as the swipe does.",
      "Close and Keep Pinned shows the tab you used before, and a pinned tab that has left its site names that site.",
      "Opening ilo with a link shows the link's page, and a two-colour Space's swatch reads as its main colour.",
      "A shortcut pressed right after you switch windows acts on the window you switched to.",
      'Link rules: "is equal to" compares the host and path, and "contains" ignores the scheme and www.',
      "Mac: a display going away under a full-screen window leaves ilo the active app.",
      "Windows: the caption no longer shows under the sidebar, ilo can quit with a file dialog open, and the sidebar's list no longer shows its edge.",
      "Windows: Ctrl and the other modifier keys no longer seem stuck after a menu or the command bar takes the keyboard.",
      "Linux: on Wayland, a save or open panel no longer closes ilo.",
    ],
  },
  {
    version: "0.1.4",
    date: "3 November 2026",
    summary:
      "Agents on Windows: tasks start without flashing windows and find Claude Code and Codex however you installed them.",
    notes: [
      "Windows: agents no longer flash console windows.",
      "Windows: tasks find Claude Code and Codex however each was installed, and Claude tasks start through npm's claude.cmd.",
      "Quitting while a task runs no longer crashes.",
      "Linux: a ⌃Tab walk that starts in the page keeps going while ⌃ is held, on Wayland.",
    ],
  },
  {
    version: "0.1.3",
    date: "3 November 2026",
    summary:
      "Hand a task to Claude or Codex from ⌘T, a reworked sidebar, text fields that move by words, and a crash fix for pages that ask for a device.",
    notes: [
      "⇥ in ⌘T hands Claude or Codex a task. Its card sits at the foot of the sidebar while it works.",
      "The Space's name row lights like a tab row. Pressing it folds the pinned tabs, and its menu is reordered.",
      "Favorites are larger tiles, at most four to a row.",
      "With more Spaces than fit, they share the switcher, and the Library's Space cards scroll sideways.",
      "The sidebar's list ends with room to spare and a foot line, and glides to the row you go to.",
      "Split view: drag a tab to either side, ⌥ on a pane's ✕, add a favorite to a split, and a split's row has its own menu. ⌘W closes a pinned split whole, and ⌘Z brings a closed split back.",
      "Text fields move, select and delete by words, and a double- or triple-click selects a word or the line.",
      "Tooltips show after the pointer rests, and name a button's keyboard shortcut, in the find bar, the command bar and the save-password offer.",
      "Removing a pinned tab offers Undo, and deleting a Space says its tabs go with it and that ⌘Z brings them back.",
      "Settings: each profile can be renamed and says why it can't be deleted, the Widevine row offers to restart ilo once it's downloaded, and Settings and Site Controls work from the keyboard.",
      "Imports count what comes in as it comes, can be cancelled, and offer favorites worked out from your history.",
      "Under Reduce Motion nothing moves or scales; fades stay.",
      "Pages no longer flash blank when you switch Spaces or tabs on the Mac.",
      "Settings › About can take nightly builds.",
      "What's New opens as a tab in the main window after an update, on every OS.",
      "Windows: the windows over a page survive Alt+F4, keep the keyboard and move with their window.",
      "Windows: a click on a site's notification reaches the page.",
      "Windows: Claude Code and Codex keep working with the Microsoft Store copy, across its updates.",
      "Linux: menus look right with no compositor, and a menu item that opens the command bar keeps it open.",
      "Quitting no longer crashes while a window is closing.",
      "A page that asks for a USB, HID, serial or Bluetooth device no longer crashes ilo.",
      "Windows: a minimized window's page is hidden, as on the Mac.",
      "Agents: back and forward say the page's title, tabs an agent closes stay out of your archive, a link to an app stops in the agent's tab, and a click in another site's frame reaches it.",
      "The command bar puts the open tabs your typing names first, a renamed tab before the rest, and shows one row per title for web apps like Figma and Notion.",
      "A Space swipe's detent comes while your fingers are still down.",
      "Windows: the zoom readout sits under the find bar.",
      "A page's full screen in a window that already fills its screen no longer leaves the page over the Library's list.",
      "Linux: a floating call moves by its top bar and sizes from its corner, and the Cast, permission and agent cards share one ink.",
    ],
  },
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
