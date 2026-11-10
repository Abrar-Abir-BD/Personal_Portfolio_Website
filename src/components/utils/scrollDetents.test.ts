// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import type { ScrollSmoother } from "gsap/ScrollSmoother";
import { allowJump, createScrollDetents } from "./scrollDetents";

// Where each section fills a 900px screen, in page pixels
const { ticks, starts } = vi.hoisted(() => ({
  ticks: new Set<() => void>(),
  starts: { ".about-section": 900, ".whatIDO": 1800 } as Record<string, number>,
}));
vi.mock("gsap", () => ({
  gsap: {
    ticker: {
      add: (fn: () => void) => ticks.add(fn),
      remove: (fn: () => void) => ticks.delete(fn),
    },
  },
}));
vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: {
    create: ({ trigger }: { trigger: string }) => ({
      start: starts[trigger],
      kill: () => {},
    }),
  },
}));

// The page moves 1.7px per pixel of window scroll, so the sections rest at
// window positions 529 and 1059
const SPEED = 1.7;
const ABOUT = 529;
const WHAT_I_DO = 1059;

let clock = 0;
// The window's scroll position, and where the smooth scroller has the page
let native = 0;
let page = 0;
let remove: () => void;

const smoother = {
  paused: () => false,
  smooth: () => 1.7,
  scrollTop: () => page,
} as unknown as ScrollSmoother;

beforeEach(() => {
  clock = 10_000;
  native = 0;
  page = 0;
  vi.spyOn(performance, "now").mockImplementation(() => clock);
  Object.defineProperty(window, "scrollY", { configurable: true, get: () => native });
  window.scrollTo = ((_x: number, y: number) => {
    native = y;
  }) as typeof window.scrollTo;
  window.innerWidth = 1440;
  window.innerHeight = 900;
  remove = createScrollDetents(smoother, SPEED);
});

afterEach(() => {
  remove();
  vi.restoreAllMocks();
});

const scrolled = () => window.dispatchEvent(new Event("scroll"));
// One wheel event and the scroll it causes, unless the page swallows it
const wheel = (delta: number) => {
  const event = new WheelEvent("wheel", { deltaY: delta, cancelable: true });
  window.dispatchEvent(event);
  if (event.defaultPrevented) return;
  native = Math.max(0, native + delta);
  scrolled();
};
// Time passing, the page gliding after the window's position
const wait = (ms: number) => {
  for (let t = 0; t < ms; t += 16) {
    clock += 16;
    page += (native * SPEED - page) * 0.12;
    ticks.forEach((tick) => tick());
  }
};
const fling = (distance: number, events = 20) => {
  for (let i = 0; i < events; i++) {
    wheel(distance / events);
    wait(16);
  }
};
// Somewhere down the page, arrived at without the wheel
const startAt = (y: number) => {
  native = y;
  page = y * SPEED;
  scrolled();
};

test("flings from the hero rest on About, then What I Do, then run free", () => {
  fling(3000);
  wait(2000);
  expect(native).toBe(ABOUT);
  fling(3000);
  wait(2000);
  expect(native).toBe(WHAT_I_DO);
  fling(3000);
  expect(native).toBe(WHAT_I_DO + 3000);
});

test("flings back up rest on What I Do, then About, then reach the top", () => {
  startAt(3000);
  fling(-3000);
  wait(2000);
  expect(native).toBe(WHAT_I_DO);
  fling(-3000);
  wait(2000);
  expect(native).toBe(ABOUT);
  fling(-3000);
  expect(native).toBe(0);
});

test("a second flick while the page is still gliding in is held too", () => {
  fling(1500, 8);
  wait(500);
  fling(1500, 8);
  wait(2000);
  expect(native).toBe(ABOUT);
});

test("a wheel that never pauses is held for a while, then let through", () => {
  let heldFor = 0;
  for (let t = 0; t < 8000; t += 16) {
    wheel(40);
    wait(16);
    if (native === ABOUT) heldFor += 16;
  }
  expect(heldFor).toBeGreaterThan(1000);
  expect(heldFor).toBeLessThan(2500);
  expect(native).toBeGreaterThan(WHAT_I_DO);
});

test("a slow reader never has a notch of the wheel swallowed", () => {
  for (let i = 0; i < 20; i++) {
    const before = native;
    wheel(100);
    expect(native).toBeGreaterThan(before);
    wait(600);
  }
  expect(native).toBeGreaterThan(WHAT_I_DO);
});

test("turning back from a held section is free", () => {
  fling(3000);
  expect(native).toBe(ABOUT);
  wheel(-200);
  expect(native).toBe(ABOUT - 200);
});

test("PageDown stops on each section; End goes to the end", () => {
  const press = (key: string, distance: number) => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key }));
    native += distance;
    scrolled();
  };
  press("PageDown", 800);
  wait(2000);
  expect(native).toBe(ABOUT);
  press("PageDown", 800);
  wait(2000);
  expect(native).toBe(WHAT_I_DO);
  startAt(0);
  wheel(50);
  press("End", 6000);
  expect(native).toBe(6050);
});

test("a jump made from code passes straight through", () => {
  wheel(50);
  allowJump();
  native = 2000;
  scrolled();
  expect(native).toBe(2000);
});

test("the phone and tablet layout scrolls freely", () => {
  window.innerWidth = 1000;
  fling(3000);
  expect(native).toBe(3000);
});
