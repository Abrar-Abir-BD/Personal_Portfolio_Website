import { GlassCard, GlassSection } from "./Glass";
import { skills } from "../data/portfolioContent";
import "./styles/Sections.css";

const Skills = () => {
  return (
    <GlassSection
      id="skills"
      title={
        <>
          Skills & <span>Expertise</span>
        </>
      }
      subtitle="A short introduction to the areas you work in."
    >
      <div className="skills-grid">
        {skills.map((group, index) => (
          <GlassCard className="skills-card" key={index}>
            <h3>{group.category}</h3>
            <p>{group.description}</p>
            <div className="skills-chips">
              {group.skills.map((skill, i) => (
                <span className="glass-chip" key={i}>
                  {skill}
                </span>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </GlassSection>
  );
};

export default Skills;
