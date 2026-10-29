// Moves between the portfolio and its own pages (a project, the art
// portfolio, the certificates) without loading a new document. The portfolio
// stays mounted, hidden, while one of them is open, so going back to it is
// instant: no reload, no intro, the 3D scene and scroll position as they were

export type Route =
  | { page: "main" }
  | { page: "project"; slug: string }
  | { page: "art" }
  | { page: "certificates" };

export const parseRoute = (pathname: string): Route => {
  const project = pathname.match(/^\/projects\/([^/]+)\/?$/)?.[1];
  if (project) return { page: "project", slug: decodeURIComponent(project) };
  if (/^\/art\/?$/.test(pathname)) return { page: "art" };
  if (/^\/certificates\/?$/.test(pathname)) return { page: "certificates" };
  return { page: "main" };
};

const isMain = (pathname: string) => parseRoute(pathname).page === "main";

const navigateListeners = new Set<() => void>();
const notify = () => navigateListeners.forEach((listener) => listener());
export const onNavigate = (listener: () => void) => {
  navigateListeners.add(listener);
  return () => {
    navigateListeners.delete(listener);
  };
};

// The portfolio keeps its own scroll position; the browser restoring one on
// Back would fight it
history.scrollRestoration = "manual";
window.addEventListener("popstate", notify);

// Set when a link (rather than Back) returns to the portfolio, so it jumps to
// the section the link names (/#projects) instead of staying where it was
let jumpToHash = false;

const go = (href: string, fromMain: boolean) => {
  history.pushState({ fromMain }, "", href);
  notify();
};

// Plain clicks on links to these pages are handled here; new-tab clicks and
// links elsewhere work as usual
document.addEventListener("click", (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }
  const link = (event.target as Element | null)?.closest?.("a");
  if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download")) {
    return;
  }
  if (link.target && link.target !== "_self") return;
  const url = new URL(link.href);
  if (url.origin !== window.location.origin) return;

  const onMain = isMain(window.location.pathname);
  if (isMain(url.pathname)) {
    // A link within the portfolio itself works as it always has
    if (onMain) return;
    event.preventDefault();
    if (history.state?.fromMain && mainSeen) {
      // Opened from the portfolio: step back to it, right where it was. (Not
      // after a reload here: the portfolio before it is gone, and stepping
      // back would load it as a new document)
      history.back();
    } else {
      jumpToHash = true;
      go(url.pathname + url.hash, false);
    }
    return;
  }
  event.preventDefault();
  go(url.pathname + url.search + url.hash, onMain);
});

// Whether one of the pages is open over the (hidden) portfolio, and whether
// the portfolio has been shown (and so is loaded) in this document
let away = !isMain(window.location.pathname);
let mainSeen = !away;
export const isAway = () => away;

const awayListeners = new Set<(away: boolean, jumpToHash: boolean) => void>();
export const onAwayChange = (
  listener: (away: boolean, jumpToHash: boolean) => void
) => {
  awayListeners.add(listener);
  return () => {
    awayListeners.delete(listener);
  };
};

export const setAway = (value: boolean) => {
  const jump = jumpToHash;
  jumpToHash = false;
  if (value === away) return;
  away = value;
  if (!away) mainSeen = true;
  awayListeners.forEach((listener) => listener(value, jump));
};

// The element a page scrolls in while it is open over the portfolio
export const SUBPAGE_ID = "subpage";
export const subpageScroller = () => document.getElementById(SUBPAGE_ID);
