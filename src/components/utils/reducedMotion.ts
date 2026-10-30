// The visitor asked their system for less motion. Read at call time, so a
// change takes effect on the next load. (No matchMedia in tests: full motion)
export const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
