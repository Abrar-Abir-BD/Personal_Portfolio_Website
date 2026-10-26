import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowOutward, MdExpandLess, MdExpandMore } from "react-icons/md";
import { GlassCard, GlassImage, GlassSection } from "./Glass";
import { Award, awards } from "../data/portfolioContent";
import { smoother } from "./Navbar";
import "./styles/Sections.css";

// How many awards show before "View all"
const PREVIEW_COUNT = 6;

// "Location · Year", skipping any left blank
const metaOf = (award: Award) =>
  [award.location, award.year].filter(Boolean).join(" · ");

const Awards = () => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? awards : awards.slice(0, PREVIEW_COUNT);

  // Runs only on a click, never on page load
  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    requestAnimationFrame(() => {
      // The page changed height: let smooth scrolling re-measure it
      ScrollTrigger.refresh();
      // After collapsing, bring the section back into view
      if (!next) {
        if (window.innerWidth > 1024 && smoother) {
          smoother.scrollTo("#awards", true, "top 90px");
        } else {
          document.getElementById("awards")?.scrollIntoView();
        }
      }
    });
  };

  return (
    <GlassSection
      id="awards"
      title={
        <>
          Awards & <span>Recognition</span>
        </>
      }
      subtitle="International medals, national titles and the teams Abrar has led and mentored."
    >
      <div className="awards-grid">
        {shown.map((award, index) => (
          <GlassCard
            className={`awards-card ${
              index >= PREVIEW_COUNT ? "awards-card-new" : ""
            }`}
            as="article"
            key={index}
          >
            <div className="awards-media">
              <GlassImage src={award.image} alt={award.title} />
              <span
                className={`awards-level ${
                  award.level === "International" ? "awards-level-intl" : ""
                }`}
              >
                {award.level}
              </span>
            </div>
            <div className="awards-body">
              {metaOf(award) && <p className="awards-meta">{metaOf(award)}</p>}
              <h3>{award.title}</h3>
              <h4>{award.event}</h4>
              <p className="awards-highlight">{award.highlight}</p>
              <p className="awards-desc">{award.description}</p>
              <div className="awards-foot">
                <span className="awards-role">{award.role}</span>
                {award.links.length > 0 && (
                  <div className="awards-links">
                    {award.links.map((link, i) => (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="disable"
                        key={i}
                      >
                        {link.name} <MdArrowOutward />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      {awards.length > PREVIEW_COUNT && (
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
                View all awards ({awards.length}) <MdExpandMore />
              </>
            )}
          </button>
        </div>
      )}
    </GlassSection>
  );
};

export default Awards;
