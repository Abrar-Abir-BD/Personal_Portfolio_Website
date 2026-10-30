// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test } from "vitest";
import CertificatesPage from "./CertificatesPage";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<CertificatesPage />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const viewer = () => container.querySelector('[role="dialog"]');
const press = (key: string, shiftKey = false) =>
  act(() => {
    document.activeElement!.dispatchEvent(
      new KeyboardEvent("keydown", { key, shiftKey, bubbles: true })
    );
  });

test("the viewer takes focus, keeps Tab inside, and returns focus on close", () => {
  const card = container.querySelector<HTMLButtonElement>(".certs-item")!;
  card.focus();
  act(() => card.click());

  const buttons = viewer()!.querySelectorAll("button");
  expect(document.activeElement).toBe(buttons[0]);
  press("Tab", true);
  expect(document.activeElement).toBe(buttons[buttons.length - 1]);
  press("Tab");
  expect(document.activeElement).toBe(buttons[0]);

  press("Escape");
  expect(viewer()).toBeNull();
  expect(document.activeElement).toBe(card);
});
