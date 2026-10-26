import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoother } from "../Navbar";

// Desktop only: when scrolling stops close to one of the 3D character's
// resting poses, glide the rest of the way so it always settles in the same
// spot instead of stopping half-way through a move.
//   About:     the landing has scrolled away (character turned, slid left)
//   What I Do: the section reaches the top (character seated at the desk)

// How close counts as "near", as a share of the screen height
const SNAP_RANGE = 0.25;

let cleanup: (() => void) | null = null;

export default function setSectionSnap() {
  // Rebuilt whenever the character timeline is (load and resize)
  cleanup?.();
  cleanup = null;
  if (window.innerWidth <= 1024) return;

  // Same triggers as the character's scroll timeline, so the points match
  // its poses exactly and are re-measured on every refresh
  const about = ScrollTrigger.create({
    trigger: ".landing-section",
    start: "top top",
    end: "bottom top",
  });
  const whatIDo = ScrollTrigger.create({
    trigger: ".whatIDO",
    start: "top top",
  });

  const onScrollEnd = () => {
    if (!smoother || smoother.paused()) return;
    // Where the page is heading: this fires when the wheel/trackpad stops,
    // while the smooth glide is still catching up, so use the native scroll
    // position (the glide's destination), not the glide's current position
    const y = window.scrollY;
    const range = window.innerHeight * SNAP_RANGE;
    const target = [about.end, whatIDo.start]
      .filter((point) => Math.abs(point - y) < range)
      .sort((a, b) => Math.abs(a - y) - Math.abs(b - y))[0];
    // Already there (this also stops the snap from re-triggering itself)
    if (target === undefined || Math.abs(target - y) < 2) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    smoother.scrollTo(target, !reduceMotion);
  };

  ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);
  cleanup = () => {
    ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
    about.kill();
    whatIDo.kill();
  };
}
