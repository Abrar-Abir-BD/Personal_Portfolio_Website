import { MdArrowOutward } from "react-icons/md";
import { GlassCard, GlassSection } from "./Glass";
import { publications } from "../data/portfolioContent";
import "./styles/Sections.css";

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
              <div className="research-chips">
                <span className="glass-chip glass-chip-accent">
                  {paper.type}
                </span>
                {paper.role && (
                  <span className="research-role">{paper.role}</span>
                )}
                {paper.year && (
                  <span className="glass-chip">{paper.year}</span>
                )}
              </div>
              <h3>{paper.title}</h3>
              <p className="research-venue">
                {paper.venueLabel && (
                  <span className="research-label">{paper.venueLabel}: </span>
                )}
                {paper.venue}
                {paper.location && (
                  <span className="research-where"> · {paper.location}</span>
                )}
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
                      className="glass-button"
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
                      className="glass-button"
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
