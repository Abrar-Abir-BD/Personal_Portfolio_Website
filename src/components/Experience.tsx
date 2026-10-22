import { GlassCard } from "./Glass";
import { experience } from "../data/portfolioContent";
import "./styles/Career.css";
import "./styles/Sections.css";

const Experience = () => {
  return (
    <div className="career-section experience-section section-container" id="experience">
      <div className="glass-orb glass-orb-1"></div>
      <div className="glass-orb glass-orb-2"></div>
      <div className="career-container">
        <h2>
          Experience <span>&</span>
          <br /> Leadership
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {experience.map((item, index) => (
            <div className="career-info-box" key={index}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{item.role}</h4>
                  <h5>{item.organization}</h5>
                  <span className="experience-location">{item.location}</span>
                </div>
                <h3>{item.year}</h3>
              </div>
              <GlassCard className="experience-glass">
                <p>{item.description}</p>
                <ul>
                  {item.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
