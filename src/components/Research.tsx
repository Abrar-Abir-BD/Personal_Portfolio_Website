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
      subtitle="Peer-reviewed research Abrar has authored, turning his engineering work into published findings."
    >
      <div className="research-list">
        {publications.map((paper, index) => (
          <GlassCard className="research-card" as="article" key={index}>
            <span className="research-year">{paper.year}</span>
            <div className="research-body">
              <div className="research-chips">
                <span className="glass-chip glass-chip-accent">
                  {paper.type}
                </span>
                {paper.role && (
                  <span className="research-role">{paper.role}</span>
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
              {paper.highlight && (
                <p className="research-highlight">{paper.highlight}</p>
              )}
              {paper.overview && (
                <p className="research-overview">{paper.overview}</p>
              )}
            </div>
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
          </GlassCard>
        ))}
      </div>
    </GlassSection>
  );
};

export default Research;
