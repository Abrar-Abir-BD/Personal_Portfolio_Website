import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const navLinks = [
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "research", label: "PUBLICATIONS" },
  { id: "awards", label: "AWARDS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "skills", label: "SKILLS" },
  { id: "art", label: "ART" },
  { id: "media", label: "MEDIA" },
  { id: "moments", label: "MOMENTS" },
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
          <ul>
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <a data-href={`#${id}`} href={`#${id}`}>
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
        </nav>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
    </>
  );
};

export default Navbar;
