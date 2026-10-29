import { ReactNode } from "react";
import { MdArrowOutward } from "react-icons/md";
import { SiIeee, SiTed } from "react-icons/si";
import { GlassCard, GlassSection } from "./Glass";
import { publications } from "../data/portfolioContent";
import { countryOf, flags } from "./utils/flags";
import "./styles/Sections.css";

// Brand marks at the start of the credit line
const logos: Record<string, { label: string; mark: ReactNode }> = {
  ieee: { label: "IEEE", mark: <SiIeee /> },
  tedx: {
    label: "TEDx",
    mark: (
      <>
        <SiTed />
        <span className="research-logo-x">x</span>
      </>
    ),
  },
};

// "Bandung, Indonesia" with the flag before it
const Place = ({ location }: { location: string }) => {
  const country = countryOf(location);
  const Flag = flags[country];
  return (
    <span className="research-where">
      {" · "}
      <span className="awards-place-name">
        {Flag && (
          <span className="awards-flag">
            <Flag title={country} />
          </span>
        )}
        {location}
      </span>
    </span>
  );
};

const Research = () => {
  return (
    <GlassSection
      id="research"
      title={
        <>
          Publications & <span>Talks</span>
        </>
      }
    >
      <div className="research-list">
        {publications.map((paper, index) => (
          <GlassCard
            className={`research-card ${
              paper.imageFit === "cover" ? "research-card-photo" : ""
            }`}
            as="article"
            key={index}
          >
            <div className="research-body">
              {/* Plain text, like the awards: "IEEE First Author" then
                  "Conference Paper · 2026" */}
              <p className="research-credit">
                {logos[paper.logo] && (
                  <span
                    className={`research-logo research-logo-${paper.logo}`}
                    role="img"
                    aria-label={logos[paper.logo].label}
                  >
                    {logos[paper.logo].mark}
                  </span>
                )}
                {paper.role && (
                  <span className="research-role">{paper.role}</span>
                )}
                <span className="research-type">
                  {[paper.type, paper.year].filter(Boolean).join(" · ")}
                </span>
              </p>
              <h3>{paper.title}</h3>
              <p className="research-venue">
                {paper.venueLabel && (
                  <span className="research-label">{paper.venueLabel}: </span>
                )}
                {paper.venue}
                {paper.location && <Place location={paper.location} />}
              </p>
              {paper.publisher && (
                <p className="research-venue">
                  <span className="research-label">Publisher: </span>
                  {paper.publisher}
                </p>
              )}
              {paper.overview && (
                <p className="research-overview">{paper.overview}</p>
              )}
              {(paper.link || paper.moreLinks.length > 0) && (
                <div className="research-links">
                  {paper.link && (
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noreferrer"
                      data-cursor="disable"
                    >
                      {paper.linkLabel || "Read"} <MdArrowOutward />
                    </a>
                  )}
                  {paper.moreLinks.map((link, i) => (
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
            {/* Floating photo on a soft glow, like the project photos */}
            <div className="research-photo">
              {paper.video ? (
                <video
                  src={paper.video}
                  poster={paper.image || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={paper.title}
                />
              ) : paper.image ? (
                <img src={paper.image} alt={paper.title} loading="lazy" />
              ) : (
                <span>Add image</span>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </GlassSection>
  );
};

export default Research;
