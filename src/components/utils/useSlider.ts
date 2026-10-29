import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// A row of cards that slides sideways with arrows, shared by Featured in
// Media and Certificates. `cardSelector` names the cards the arrows step
// between.
export const useSlider = (cardSelector: string) => {
  const track = useRef<HTMLDivElement>(null);
  const glide = useRef<gsap.core.Tween>();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Grey out an arrow once the row can't scroll further that way
  const update = () => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Each arrow moves the row to the next or previous card. Animated here
  // rather than with the browser's smooth scrolling, which the row's
  // snapping cancelled (the back arrow never moved); snapping is paused
  // for the glide and lands exactly on a card anyway
  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const starts = Array.from(
      el.querySelectorAll<HTMLElement>(cardSelector),
      (card) => card.offsetLeft - el.offsetLeft - el.clientLeft,
    );
    const max = el.scrollWidth - el.clientWidth;
    const now = el.scrollLeft;
    // The track's side padding sits before the first card
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const target =
      dir > 0
        ? (starts.find((x) => x - pad > now + 1) ?? max)
        : ([...starts].reverse().find((x) => x - pad < now - 1) ?? 0);
    // A plain number is tweened and copied across (scrollLeft isn't CSS)
    const pos = { x: now };
    el.style.scrollSnapType = "none";
    glide.current?.kill();
    glide.current = gsap.to(pos, {
      x: Math.max(0, Math.min(target - pad, max)),
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        el.scrollLeft = pos.x;
      },
      onComplete: () => {
        el.style.scrollSnapType = "";
      },
    });
  };

  return { track, atStart, atEnd, update, slide };
};
