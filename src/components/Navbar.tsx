import { useEffect, useState } from "react";
import { MdClose, MdDarkMode, MdLightMode, MdMenu } from "react-icons/md";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

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
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          // Land just below the floating bar instead of under it
          smoother.scrollTo(section, true, "top 90px");
        }
      });
    });

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

    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
    return () => triggers.forEach((trigger) => trigger.kill());
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
                  onClick={() => setMenuOpen(false)}
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
