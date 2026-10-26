import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MdExpandLess,
  MdExpandMore,
  MdOpenInNew,
  MdOutlinePlace,
} from "react-icons/md";
import { GlassCard, GlassSection } from "./Glass";
import { Award, awards } from "../data/portfolioContent";
import { smoother } from "./Navbar";
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

  return (
    <GlassCard
      className={`awards-card ${isNew ? "awards-card-new" : ""}`}
      as="article"
    >
      <div className="awards-photo">
        {award.image ? (
          <img src={award.image} alt={award.title} loading="lazy" />
        ) : (
          <span>Add image</span>
        )}
      </div>
      <div className="awards-body">
        <div className="awards-badges">
          <span
            className={`awards-level ${
              award.level === "International" ? "awards-level-intl" : ""
            }`}
          >
            {award.level}
          </span>
          {placeOf(award) && (
            <span className="awards-pill">
              <MdOutlinePlace /> {placeOf(award)}
            </span>
          )}
        </div>
        <h3>
          {award.title} at {award.event}
        </h3>
        <p
          ref={descRef}
          className={`awards-desc ${open ? "awards-desc-open" : ""}`}
        >
          {award.highlight && `${award.highlight}. `}
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
        {award.links.length > 0 && (
          <div className="awards-media">
            <p className="awards-media-label">Media & Verification</p>
            <div className="awards-links">
              {award.links.map((link, i) => (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="disable"
                  key={i}
                >
                  {link.name} <MdOpenInNew />
                </a>
              ))}
            </div>
          </div>
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
      className="awards-section"
      title={
        <>
          Awards & <span>Recognition</span>
        </>
      }
      subtitle="International medals, national titles and the teams I've led and mentored."
    >
      <div className="awards-grid">
        {shown.map((award, index) => (
          <AwardCard
            award={award}
            isNew={index >= PREVIEW_COUNT}
            key={index}
          />
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
