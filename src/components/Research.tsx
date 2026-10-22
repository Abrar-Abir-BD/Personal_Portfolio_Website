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
      subtitle="Papers you have authored or co-authored, and talks you have given."
    >
      <div className="research-list">
        {publications.map((paper, index) => (
          <GlassCard className="research-card" as="article" key={index}>
            <span className="research-year">{paper.year}</span>
            <div className="research-body">
              <span className="glass-chip glass-chip-accent">{paper.type}</span>
              <h3>{paper.title}</h3>
              <p className="research-authors">{paper.authors}</p>
              <p className="research-venue">{paper.venue}</p>
            </div>
            {paper.link && (
              <a
                className="glass-button"
                href={paper.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                Read <MdArrowOutward />
              </a>
            )}
          </GlassCard>
        ))}
      </div>
    </GlassSection>
  );
};

export default Research;
