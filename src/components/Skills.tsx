import { GlassCard, GlassSection } from "./Glass";
import { skills } from "../data/portfolioContent";
import { categoryIcons, skillIcons } from "./skillIcons";
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
    >
      <div className="skills-grid">
        {skills.map((group, index) => {
          const header = categoryIcons[group.icon];
          return (
            <GlassCard className="skills-card" key={index}>
              <div className="skills-head">
                {header && (
                  <span
                    className="skills-head-icon"
                    style={{ color: header.color }}
                    aria-hidden="true"
                  >
                    <header.Icon />
                  </span>
                )}
                <h3>{group.category}</h3>
              </div>
              <ul className="skills-tiles">
                {group.skills.map((skill, i) => {
                  const logo = skillIcons[skill.icon];
                  return (
                    <li className="skills-tile" key={i}>
                      <span className="skills-tile-logo" aria-hidden="true">
                        {logo && <logo.Icon style={{ color: logo.color }} />}
                      </span>
                      <span className="skills-tile-name">{skill.name}</span>
                    </li>
                  );
                })}
              </ul>
            </GlassCard>
          );
        })}
      </div>
    </GlassSection>
  );
};

export default Skills;
