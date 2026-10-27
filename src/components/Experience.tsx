import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdExpandLess, MdExpandMore, MdOpenInNew } from "react-icons/md";
import { GlassCard, GlassSection } from "./Glass";
import { Experience as Role, experience } from "../data/portfolioContent";
import { scrollToSection } from "./Navbar";
import "./styles/Sections.css";

// How many roles show before "View all"
const PREVIEW_COUNT = 6;

// "Debaters Community of Bangladesh" -> "DC": shown when there's no logo
const initialsOf = (name: string) =>
  name
    .replace(/\(.*?\)|[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && word[0] === word[0].toUpperCase())
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

const Logo = ({ role }: { role: Role }) =>
  role.logo ? (
    <span className="experience-logo">
      <img src={role.logo} alt="" loading="lazy" />
    </span>
  ) : (
    <span className="experience-logo experience-logo-initials">
      {initialsOf(role.organization)}
    </span>
  );

// A glass card per role, LinkedIn style: logo and role up top, then the
// story of the role and its results
const Experience = () => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? experience : experience.slice(0, PREVIEW_COUNT);

  // Runs only on a click, never on page load
  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    requestAnimationFrame(() => {
      // The page changed height: let smooth scrolling re-measure it
      ScrollTrigger.refresh();
      // After collapsing, bring the section back into view
      if (!next) {
        scrollToSection("#experience");
      }
    });
  };

  return (
    <GlassSection
      id="experience"
      className="experience-section"
      title={
        <>
          Experience & <span>Leadership</span>
        </>
      }
    >
      <div className="experience-grid">
        {shown.map((item, index) => (
          <GlassCard
            className={`experience-card ${
              index >= PREVIEW_COUNT ? "experience-card-new" : ""
            }`}
            as="article"
            key={index}
          >
            <div className="experience-top">
              <Logo role={item} />
              <div className="experience-titles">
                <div className="experience-head">
                  <h3>{item.role}</h3>
                  {item.year && (
                    <span className="experience-year">{item.year}</span>
                  )}
                </div>
                <p className="experience-org">
                  {item.organization}
                  {item.location && <span> · {item.location}</span>}
                </p>
                {item.link.url && (
                  <a
                    className="experience-link"
                    href={item.link.url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="disable"
                  >
                    {item.link.name || "Website"} <MdOpenInNew />
                  </a>
                )}
              </div>
            </div>
            {item.description && (
              <p className="experience-desc">{item.description}</p>
            )}
            <ul className="experience-points">
              {item.highlights.map((highlight, i) => (
                <li key={i}>{highlight}</li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
      {experience.length > PREVIEW_COUNT && (
        <div className="projects-more">
          <button
            type="button"
            className="glass-button"
            onClick={toggle}
            aria-expanded={expanded}
            data-cursor="disable"
          >
            {expanded ? (
              <>
                Show less <MdExpandLess />
              </>
            ) : (
              <>
                View all experience <MdExpandMore />
              </>
            )}
          </button>
        </div>
      )}
    </GlassSection>
  );
};

export default Experience;
