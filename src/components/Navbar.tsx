import { useEffect, useState } from "react";
import { MdClose, MdDarkMode, MdLightMode, MdMenu } from "react-icons/md";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

// Where a section's content (below its top padding) lands: just under the
// floating bar
const CONTENT_TOP = 110;
// ScrollSmoother's speed: the page moves this many pixels per pixel of
// native scroll (touch devices scroll natively, at 1)
const SCROLL_SPEED = 1.7;
let settleCheck: (() => void) | undefined;

const currentScroll = () => (smoother ? smoother.scrollTop() : window.scrollY);
const stopSectionJump = () => {
  if (settleCheck) gsap.ticker.remove(settleCheck);
  settleCheck = undefined;
};

// Scrolls to a section with the smooth scroller's own glide. Once the glide
// settles, it re-measures and glides again if anything above changed height
// on the way (scroll animations, late images, fonts), so the page never
// stops short with the previous section filling the top of the screen
export const scrollToSection = (selector: string, smooth = true) => {
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;
  const target = () => {
    const padding = parseFloat(getComputedStyle(el).paddingTop) || 0;
    const content = document.getElementById("smooth-content");
    const max = content ? content.clientHeight - window.innerHeight : Infinity;
    const y =
      currentScroll() + el.getBoundingClientRect().top + padding - CONTENT_TOP;
    return Math.max(0, Math.min(y, max));
  };
  stopSectionJump();
  if (!smoother || !smoother.smooth()) {
    window.scrollTo({ top: target(), behavior: smooth ? "smooth" : "auto" });
    return;
  }
  if (!smooth) {
    smoother.scrollTop(target());
    return;
  }
  // A number passed to scrollTo is a native scroll position
  const aim = () => smoother.scrollTo(target() / SCROLL_SPEED, true);
  aim();
  let last = currentScroll();
  let stillFrames = 0;
  let retries = 2;
  settleCheck = () => {
    const now = currentScroll();
    stillFrames = Math.abs(now - last) < 0.5 ? stillFrames + 1 : 0;
    last = now;
    if (stillFrames < 6) return;
    if (Math.abs(target() - now) > 2 && retries-- > 0) {
      aim();
      stillFrames = 0;
    } else {
      stopSectionJump();
    }
  };
  gsap.ticker.add(settleCheck);
};

const navLinks = [
  // The hero section's id
  { id: "landingDiv", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "research", label: "PUBLICATIONS" },
  { id: "awards", label: "AWARDS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "skills", label: "SKILLS" },
  { id: "art", label: "ART" },
  { id: "contact", label: "CONTACT" },
];

type Theme = "dark" | "light";

const Navbar = () => {
  // index.html sets the saved theme before first paint; read it from there
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark"
  );
  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked (private mode): the choice just isn't remembered
    }
    setTheme(next);
  };

  // Phones: the links live in a dropdown opened by the menu button
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e.target instanceof Element && e.target.closest(".nav-glass")) return;
      setMenuOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [menuOpen]);

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: SCROLL_SPEED,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    // Scrolling by hand takes over from a nav jump in progress
    const stopJump = () => stopSectionJump();
    window.addEventListener("wheel", stopJump, { passive: true });
    window.addEventListener("touchstart", stopJump, { passive: true });

    // Highlight the link of the section currently in view
    const triggers = navLinks.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          document
            .querySelector(`.header ul a[data-href="#${id}"]`)
            ?.classList.toggle("nav-active", self.isActive);
        },
      })
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      window.removeEventListener("wheel", stopJump);
      window.removeEventListener("touchstart", stopJump);
    };
  }, []);
  return (
    <>
      <div className="header">
        <nav className="nav-glass">
          <a href="/#" className="navbar-title" data-cursor="disable">
            Abrar Abir
          </a>
          <ul id="nav-links" className={menuOpen ? "nav-open" : ""}>
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <a
                  data-href={`#${id}`}
                  href={`#${id}`}
                  onClick={(e) => {
                    // A plain anchor jump fights the smooth scroller at
                    // every width, so all clicks go through it
                    e.preventDefault();
                    setMenuOpen(false);
                    scrollToSection(`#${id}`);
                  }}
                >
                  <HoverLinks text={label} />
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            role="switch"
            aria-checked={theme === "light"}
            aria-label="Light theme"
            className="theme-chip"
            onClick={toggleTheme}
            data-cursor="disable"
          >
            <MdDarkMode
              className={`theme-icon ${theme === "dark" ? "theme-icon-on" : ""}`}
            />
            <span
              className={`theme-switch ${
                theme === "light" ? "theme-switch-on" : ""
              }`}
            >
              <span className="theme-knob"></span>
            </span>
            <MdLightMode
              className={`theme-icon ${theme === "light" ? "theme-icon-on" : ""}`}
            />
          </button>
          <button
            type="button"
            className="nav-burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="nav-links"
            onClick={() => setMenuOpen(!menuOpen)}
            data-cursor="disable"
          >
            {menuOpen ? <MdClose /> : <MdMenu />}
          </button>
        </nav>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
    </>
  );
};

export default Navbar;
