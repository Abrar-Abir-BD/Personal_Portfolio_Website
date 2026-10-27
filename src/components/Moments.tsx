import { GlassCard, GlassImage, GlassSection } from "./Glass";
import { moments } from "../data/portfolioContent";
import "./styles/Sections.css";

// Only moments with a photo are shown, and the section stays hidden until
// moments.json has at least one
const shown = moments.filter((moment) => moment.image);

const Moments = () => {
  if (!shown.length) return null;
  return (
    <GlassSection
      id="moments"
      title={
        <>
          Moments from <span>Life</span>
        </>
      }
    >
      <div className="art-grid moments-grid">
        {shown.map((moment, index) => (
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
