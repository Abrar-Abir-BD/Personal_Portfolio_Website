import { MdArrowForward } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import { GlassSection } from "./Glass";
import { Project, projects } from "../data/portfolioContent";
import "./styles/Sections.css";

// "Category · Status · Year", skipping any left blank
const metaOf = (project: Project) =>
  [project.category, project.status, project.year].filter(Boolean).join(" · ");

const Projects = () => {
  return (
    <GlassSection
      id="projects"
      title={
        <>
          My <span>Projects</span>
        </>
      }
      subtitle="Selected work you have built, designed or contributed to."
    >
      <div className="projects-grid">
        {projects.map((project, index) => (
          <article
            // Every other row puts the text first, like a checkerboard
            className={`projects-item ${
              Math.floor(index / 2) % 2 ? "projects-item-flip" : ""
            }`}
            key={index}
          >
            <div className="projects-media">
              {project.image ? (
                <img src={project.image} alt={project.title} loading="lazy" />
              ) : (
                <span>Add image</span>
              )}
            </div>
            <div className="projects-info">
              {metaOf(project) && (
                <p className="projects-meta">{metaOf(project)}</p>
              )}
              <h3>{project.title}</h3>
              <p className="projects-desc">{project.summary}</p>
              <div className="projects-tags">
                {project.tags.map((tag, i) => (
                  <span className="glass-chip" key={i}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="projects-links">
                {project.links.map((link, i) => (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="disable"
                    key={i}
                  >
                    {link.name} <MdArrowForward />
                  </a>
                ))}
                {project.code ? (
                  <a
                    href={project.code}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="disable"
                  >
                    <FaGithub /> Code
                  </a>
                ) : (
                  // No repo yet: show the button greyed out instead of a dead link
                  <span
                    className="projects-link-disabled"
                    title="Code coming soon"
                    aria-disabled="true"
                  >
                    <FaGithub /> Code
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </GlassSection>
  );
};

export default Projects;
