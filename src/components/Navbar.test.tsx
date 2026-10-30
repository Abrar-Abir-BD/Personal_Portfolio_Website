// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import Navbar from "./Navbar";

// The scroll plugins need the real page layout; the menu doesn't use them
vi.mock("gsap", () => ({ gsap: { registerPlugin: vi.fn() } }));
vi.mock("gsap/ScrollSmoother", () => ({
  ScrollSmoother: { create: () => ({ scrollTop: vi.fn(), paused: vi.fn() }) },
}));
vi.mock("gsap/ScrollTrigger", () => ({
  ScrollTrigger: { create: () => ({ kill: vi.fn() }) },
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<Navbar />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const burger = () => container.querySelector<HTMLButtonElement>(".nav-burger")!;
const isOpen = () => burger().getAttribute("aria-expanded") === "true";
const openMenu = () => act(() => burger().click());
const press = (target: Element, key: string) =>
  act(() => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  });
const pointerDown = (target: Element) =>
  act(() => {
    target.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  });

test("Escape from a focused menu link closes the menu and refocuses the button", () => {
  openMenu();
  const link = container.querySelector<HTMLAnchorElement>("#nav-links a")!;
  link.focus();
  press(link, "Escape");
  expect(isOpen()).toBe(false);
  expect(document.activeElement).toBe(burger());
});

test("other keys inside the menu leave it open", () => {
  openMenu();
  press(container.querySelector("#nav-links a")!, "Tab");
  expect(isOpen()).toBe(true);
});

test("pointerdown inside the menu leaves it open, outside closes it", () => {
  openMenu();
  pointerDown(container.querySelector(".nav-glass")!);
  expect(isOpen()).toBe(true);
  pointerDown(document.body);
  expect(isOpen()).toBe(false);
});
