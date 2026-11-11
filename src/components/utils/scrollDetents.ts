import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ScrollSmoother } from "gsap/ScrollSmoother";
import { isAway } from "../../router";

// Sections the wheel can't carry the page past in one go. The smooth scroller
// moves fast enough that a single flick used to fly from the hero straight
// into Projects, with About and What I Do only a blur on the way.
//
// Each is a detent: scrolling into one, the page glides to rest with the
// section filling the screen, and further scrolling in the same direction is
// swallowed until it has sat there for a moment. Only wheel and keyboard
// scrolling is held; nav links, the scrollbar and Home/End pass freely.
const SECTIONS = [".about-section", ".whatIDO"];

// The page counts as resting on a section while within this share of the
// screen height of it...
const NEAR = 0.08;
// ...and the section as seen once it has rested there this long (ms)
const DWELL = 210;
// A seen section holds again only after the page has moved this far from it
const REARM = 0.45;
// Once seen, the hold lets go at the first pause in the wheel this long (so
// the tail of a trackpad fling can't carry the page on), or after PATIENCE
// for a wheel that never pauses
const QUIET = 72;
const PATIENCE = 540;
// A scroll counts as the visitor's while this soon after a wheel or key
// event, or after another scroll that did: the browser spreads one wheel
// notch or key press over many frames
const INPUT_WINDOW = 600;
const CHAIN = 200;
const SCROLL_KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp"]);

let release: (() => void) | undefined;

// Call before scrolling the page from code, so the jump isn't held
export const allowJump = () => release?.();

export function createScrollDetents(smoother: ScrollSmoother, speed: number) {
  const stops = SECTIONS.map((trigger) => ({
    // Only measures where the section fills the screen, and keeps that
    // right across refreshes
    trigger: ScrollTrigger.create({ trigger, start: "center center" }),
    // The direction (1 down, -1 up) of the scroll being held here, if any
    caught: 0,
    seen: false,
    nearSince: 0,
    seenAt: 0,
  }));
  type Stop = (typeof stops)[number];
  // In the window's own scroll units: the page moves `speed` pixels for each
  const at = (stop: Stop) => Math.round(stop.trigger.start / speed);

  let lastInput = -Infinity;
  let lastWheel = -Infinity;
  let lastDriven = -Infinity;
  let prev = window.scrollY;
  // Events arrive with the frames, so on a slow machine the gap between two
  // frames alone would pass for a pause: every wait covers a few frames
  let frame = 16;
  let lastTick = performance.now();
  const atLeast = (ms: number) => Math.max(ms, frame * 3);

  // The phone/tablet layout has no full-screen sections to rest on, and
  // touch devices scroll natively (smooth() is 0)
  const active = () =>
    window.innerWidth > 1024 &&
    !isAway() &&
    !smoother.paused() &&
    smoother.smooth() > 0;

  release = () => {
    lastInput = lastDriven = -Infinity;
    stops.forEach((stop) => (stop.caught = 0));
  };

  const onScroll = () => {
    const y = window.scrollY;
    const from = prev;
    prev = y;
    const now = performance.now();
    const driven =
      now - lastInput <= atLeast(INPUT_WINDOW) ||
      now - lastDriven <= atLeast(CHAIN);
    if (!driven || !active()) return;
    lastDriven = now;
    // Nearest first, so a scroll crossing both in one frame stops at the first
    const ahead = y > from ? stops : [...stops].reverse();
    for (const stop of ahead) {
      const s = at(stop);
      const dir = y > s + 1 ? 1 : y < s - 1 ? -1 : 0;
      if (!dir) continue;
      const crossing = !stop.seen && (dir > 0 ? from < s - 1 : from > s + 1);
      const pushing = stop.caught === dir && Math.abs(from - s) <= 1;
      if (crossing || pushing) {
        stop.caught = dir;
        prev = s;
        // The window's position is only the smooth scroller's target, so
        // this is never seen as a jump: the page just glides to rest here
        window.scrollTo(0, s);
        return;
      }
    }
  };

  const onWheel = (e: WheelEvent) => {
    lastInput = lastWheel = performance.now();
    // Ctrl+wheel zooms
    if (e.ctrlKey || !e.deltaY || !e.cancelable || !active()) return;
    const dir = Math.sign(e.deltaY);
    const y = window.scrollY;
    // Swallowed outright while held, so the browser never starts a scroll
    // that would have to be undone
    if (stops.some((stop) => stop.caught === dir && Math.abs(y - at(stop)) <= 1)) {
      e.preventDefault();
    }
  };

  const onKey = (e: KeyboardEvent) => {
    if (SCROLL_KEYS.has(e.key)) lastInput = performance.now();
    // Asking for the very top or bottom: go there
    else if (e.key === "Home" || e.key === "End") release?.();
  };

  const tick = () => {
    const now = performance.now();
    frame = now - lastTick;
    lastTick = now;
    const page = smoother.scrollTop();
    const screen = window.innerHeight;
    for (const stop of stops) {
      const gap = Math.abs(page - at(stop) * speed);
      if (gap <= NEAR * screen) {
        stop.nearSince ||= now;
        if (!stop.seen && now - stop.nearSince >= DWELL) {
          stop.seen = true;
          stop.seenAt = now;
        }
      } else {
        stop.nearSince = 0;
        if (gap >= REARM * screen) stop.seen = false;
      }
      if (
        stop.caught &&
        stop.seen &&
        (now - lastWheel >= atLeast(QUIET) || now - stop.seenAt >= PATIENCE)
      ) {
        stop.caught = 0;
      }
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKey);
  gsap.ticker.add(tick);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
    gsap.ticker.remove(tick);
    stops.forEach((stop) => stop.trigger.kill());
    release = undefined;
  };
}
