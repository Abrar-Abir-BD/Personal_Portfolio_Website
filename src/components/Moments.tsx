import { GlassCard, GlassImage, GlassSection } from "./Glass";
import { moments } from "../data/portfolioContent";
import "./styles/Sections.css";

const Moments = () => {
  return (
    <GlassSection
      id="moments"
      title={
        <>
          Moments from <span>Life</span>
        </>
      }
      subtitle="Snapshots of the people, places and events along my way."
    >
      <div className="art-grid moments-grid">
        {moments.map((moment, index) => (
          <GlassCard className="art-card" key={index}>
            <GlassImage src={moment.image} alt={moment.caption} />
            <div className="art-info">
              <h3>{moment.caption}</h3>
              <p>{moment.date}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </GlassSection>
  );
};

export default Moments;
