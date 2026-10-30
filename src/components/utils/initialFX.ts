import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { scrollToSection, smoother } from "../Navbar";
import { prefersReducedMotion } from "./reducedMotion";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother?.paused(false);
  // Arriving from a project page (/#projects): jump back to that section
  if (window.location.hash) {
    const target = window.location.hash;
    setTimeout(() => {
      if (document.querySelector(target)) {
        scrollToSection(target, false);
      }
    }, 100);
  }
  document.getElementsByTagName("main")[0].classList.add("main-active");

  // Reduced motion: no intro, and the first role stays put (the roles are
  // stacked, so the rest are hidden rather than rotated in)
  if (prefersReducedMotion()) {
    gsap.set(gsap.utils.toArray(".landing-role").slice(1), {
      visibility: "hidden",
    });
    return;
  }

  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      y: 0,
      stagger: 0.02,
      delay: 0.2,
    }
  );

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  const split = (selector: string) =>
    gsap.utils
      .toArray<HTMLElement>(selector)
      .map((el) => new SplitText(el, TextProps));
  const roles = split(".landing-role");
  // Every role but the first waits below the line until its turn
  roles.slice(1).forEach((word) => gsap.set(word.chars, { yPercent: 110 }));

  gsap.fromTo(
    roles[0].chars,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      y: 0,
      stagger: 0.02,
      delay: 0.2,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  rotateRoles(roles);
}

// Cycles through every role: each one holds, then slides up and out while
// the next slides up into place. Loops back to the first after the last.
function rotateRoles(words: SplitText[]) {
  if (words.length < 2) return;
  const hold = 4;
  const swap = 1.2;
  const tween = {
    duration: swap,
    ease: "power3.inOut",
    stagger: 0.1,
    immediateRender: false,
  };
  const tl = gsap.timeline({ repeat: -1 });
  words.forEach((word, k) => {
    const next = words[(k + 1) % words.length];
    const at = hold + k * (hold + swap + 1);
    tl.fromTo(word.chars, { yPercent: 0 }, { yPercent: -110, ...tween }, at).fromTo(
      next.chars,
      { yPercent: 110 },
      { yPercent: 0, ...tween },
      at
    );
  });
}
