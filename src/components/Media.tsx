import { MdArrowOutward } from "react-icons/md";
import { GlassCard, GlassSection } from "./Glass";
import { media } from "../data/portfolioContent";
import "./styles/Sections.css";

const Media = () => {
  return (
    <GlassSection
      id="media"
      title={
        <>
          Featured in <span>Media</span>
        </>
      }
      subtitle="Articles, interviews and features about me and my work."
    >
      <div className="media-grid">
        {media.map((item, index) => (
          <GlassCard className="media-card" as="article" key={index}>
            <div className="media-top">
              <span className="glass-chip glass-chip-accent">{item.type}</span>
              <span className="media-date">{item.date}</span>
            </div>
            <h4>{item.outlet}</h4>
            <h3>{item.headline}</h3>
            {item.link && (
              <a
                className="glass-button"
                href={item.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                Read feature <MdArrowOutward />
              </a>
            )}
          </GlassCard>
        ))}
      </div>
    </GlassSection>
  );
};

export default Media;
