import { MdArrowOutward } from "react-icons/md";
import { GlassCard, GlassSection } from "./Glass";
import { landing, publications } from "../data/portfolioContent";
import "./styles/Sections.css";

// Abrar's own name is emphasised in each author list
const ownName = `${landing.firstName} ${landing.lastName}`.toLowerCase();

const Research = () => {
  return (
    <GlassSection
      id="research"
      title={
        <>
          Publications & <span>Talks</span>
        </>
      }
      subtitle="Research I've published and talks I've given on the future of robotics and AI."
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
              <p className="research-authors">
                {paper.authors.map((author, i) => (
                  <span key={i}>
                    {i > 0 && ", "}
                    {author.toLowerCase() === ownName ? (
                      <strong className="research-me">{author}</strong>
                    ) : (
                      author
                    )}
                  </span>
                ))}
              </p>
              <p className="research-venue">
                {paper.venue}
                {paper.location && (
                  <span className="research-where"> · {paper.location}</span>
                )}
              </p>
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
              {paper.image ? (
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
