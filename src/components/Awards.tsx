import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaEarthAmericas } from "react-icons/fa6";
import {
  MdArrowOutward,
  MdExpandLess,
  MdExpandMore,
  MdVerified,
} from "react-icons/md";
import { GlassCard, GlassSection } from "./Glass";
import { Award, awards } from "../data/portfolioContent";
import { scrollToSection } from "./Navbar";
import { countryOf, flags } from "./utils/flags";
import "./styles/Sections.css";

// How many awards show before "View all"
const PREVIEW_COUNT = 6;

// "Location · Year", skipping any left blank
const placeOf = (award: Award) =>
  [award.location, award.year].filter(Boolean).join(" · ");

const AwardCard = ({ award, isNew }: { award: Award; isNew: boolean }) => {
  const [open, setOpen] = useState(false);
  // Only offer "Read more" when the clamped text is actually cut off
  const descRef = useRef<HTMLParagraphElement>(null);
  const [clamped, setClamped] = useState(false);
  useEffect(() => {
    const measure = () => {
      const el = descRef.current;
      if (el && !open) setClamped(el.scrollHeight > el.clientHeight + 1);
    };
    measure();
    // Web fonts can change the text height once they load
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open]);

  const toggle = () => {
    setOpen(!open);
    // The card changed height: let smooth scrolling re-measure the page
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  const country = countryOf(award.location);
  const Flag = flags[country];

  return (
    <GlassCard
      className={`awards-card ${isNew ? "awards-card-new" : ""}`}
      as="article"
    >
      <div className="awards-photo">
        {award.image ? (
          <img src={award.image} alt={award.title} loading="lazy" />
        ) : (
          <span className="awards-photo-empty">Add image</span>
        )}
        {/* International / National floats on the photo's corner */}
        <span
          className={`awards-tag ${
            award.level === "International" ? "awards-tag-intl" : ""
          }`}
        >
          {award.level === "International" && (
            <FaEarthAmericas aria-hidden="true" />
          )}
          {award.level}
        </span>
      </div>
      <div className="awards-body">
        {/* Flag and place as plain text */}
        {placeOf(award) && (
          <p className="awards-place">
            {Flag && (
              <span className="awards-flag">
                <Flag title={country} />
              </span>
            )}
            {placeOf(award)}
          </p>
        )}
        {/* What was won, then the competition */}
        <div className="awards-head">
          <p className="awards-position">{award.title}</p>
          <h3>{award.event}</h3>
        </div>
        <p
          ref={descRef}
          className={`awards-desc ${open ? "awards-desc-open" : ""}`}
        >
          {award.description}
        </p>
        {(clamped || open) && (
          <button
            type="button"
            className="awards-more"
            onClick={toggle}
            aria-expanded={open}
            data-cursor="disable"
          >
            {open ? "Read less" : "Read more"}
          </button>
        )}
        {/* Press and official results at the foot of the card:
            "✓ Verified: The Daily Star · Jago News 24" */}
        {award.links.length > 0 && (
          <p className="awards-proof">
            <MdVerified className="awards-proof-icon" aria-hidden="true" />
            <span className="awards-proof-label">Verified: </span>
            {award.links.map((link, i) => (
              <span key={i}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="disable"
                >
                  {link.name} <MdArrowOutward />
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
    </GlassCard>
  );
};

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
        scrollToSection("#awards");
      }
    });
  };

  return (
    <GlassSection
      id="awards"
      className="awards-section"
      title={
        <>
          Awards & <span>Recognition</span>
        </>
      }
    >
      <div className="awards-grid">
        {shown.map((award, index) => (
          <AwardCard award={award} isNew={index >= PREVIEW_COUNT} key={index} />
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
                View all awards <MdExpandMore />
              </>
            )}
          </button>
        </div>
      )}
    </GlassSection>
  );
};

export default Awards;
