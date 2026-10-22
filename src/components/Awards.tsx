import { MdEmojiEvents } from "react-icons/md";
import { GlassCard, GlassSection } from "./Glass";
import { awards } from "../data/portfolioContent";
import "./styles/Sections.css";

const Awards = () => {
  return (
    <GlassSection
      id="awards"
      title={
        <>
          Awards & <span>Recognition</span>
        </>
      }
      subtitle="Honours, competitions and recognition you have received."
    >
      <div className="awards-grid">
        {awards.map((award, index) => (
          <GlassCard className="awards-card" key={index}>
            <div className="awards-top">
              <span className="awards-icon">
                <MdEmojiEvents />
              </span>
              <span className="awards-year">{award.year}</span>
            </div>
            <h3>{award.title}</h3>
            <h4>{award.issuer}</h4>
            <p>{award.description}</p>
          </GlassCard>
        ))}
      </div>
    </GlassSection>
  );
};

export default Awards;
