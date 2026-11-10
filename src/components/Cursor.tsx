import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

// The glowing dot that trails the mouse. Mounted once at the app's root so it
// shows on every page (the portfolio and the pages opened over it), and it
// watches hovers on the whole document, so elements that appear later, such
// as a newly opened page's links, still change it through data-cursor.
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let hover = false;
    const cursor = cursorRef.current!;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    // Setting the position directly each frame; a new tween per frame piled
    // up work for nothing
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");
    let frame = 0;
    const loop = () => {
      const dx = mousePos.x - cursorPos.x;
      const dy = mousePos.y - cursorPos.y;
      if (hover) {
        frame = 0;
        return;
      }
      cursorPos.x += dx / 6;
      cursorPos.y += dy / 6;
      setX(cursorPos.x);
      setY(cursorPos.y);
      // Rest once caught up; the next mouse move starts it again
      frame =
        Math.abs(dx) + Math.abs(dy) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    // Hidden until the mouse first moves; before that it has no real position
    // and would sit in the corner of the screen
    let moved = false;
    cursor.style.opacity = "0";
    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      if (!moved) {
        moved = true;
        cursorPos.x = e.clientX;
        cursorPos.y = e.clientY;
        cursor.style.opacity = "";
      }
      if (!frame) frame = requestAnimationFrame(loop);
    };

    // The data-cursor element the mouse is over, if any
    let current: HTMLElement | null = null;
    const leave = () => {
      cursor.classList.remove("cursor-disable", "cursor-icons");
      current = null;
      if (hover) {
        hover = false;
        if (!frame) frame = requestAnimationFrame(loop);
      }
    };
    const onMouseOver = (e: MouseEvent) => {
      const element = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (element === current) return;
      leave();
      if (!element) return;
      current = element;
      if (element.dataset.cursor === "icons") {
        const rect = element.getBoundingClientRect();
        cursor.classList.add("cursor-icons");
        gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        hover = true;
      }
      if (element.dataset.cursor === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };
    // Off the window entirely, or onto something removed from the page
    // (a page closing under the mouse): back to normal
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) leave();
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
