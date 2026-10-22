import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowForward, MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import { GlassSection } from "./Glass";
import { Project, projects } from "../data/portfolioContent";
import { smoother } from "./Navbar";
import "./styles/Sections.css";

// How many projects show before "View all projects"
const PREVIEW_COUNT = 6;

// "Category · Status · Year", skipping any left blank
const metaOf = (project: Project) =>
  [project.category, project.status, project.year].filter(Boolean).join(" · ");

const Projects = () => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? projects : projects.slice(0, PREVIEW_COUNT);

  // Runs only on a click, never on page load (a load-time effect would
  // scroll the page away from the hero)
  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    // Next frame, once React has added or removed the cards
    requestAnimationFrame(() => {
      // The page got taller or shorter: let smooth scrolling and the scroll
      // animations measure it again
      ScrollTrigger.refresh();
      // After collapsing, bring the section back into view instead of
      // leaving the reader stranded further down the page
      if (!next) {
        if (window.innerWidth > 1024 && smoother) {
          smoother.scrollTo("#projects", true, "top 90px");
        } else {
          document.getElementById("projects")?.scrollIntoView();
        }
      }
    });
  };

  return (
    <GlassSection
      id="projects"
      className="projects-section"
      title={
        <>
          My <span>Projects</span>
        </>
      }
      subtitle="Selected work you have built, designed or contributed to."
    >
      <div className="projects-grid">
        {shown.map((project, index) => (
          <article
            // Every other row puts the text first, like a checkerboard
            className={`projects-item ${
              Math.floor(index / 2) % 2 ? "projects-item-flip" : ""
            } ${index >= PREVIEW_COUNT ? "projects-item-new" : ""}`}
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
      {projects.length > PREVIEW_COUNT && (
        <div className="projects-more">
          <button
            type="button"
            className="glass-button"
            onClick={toggle}
            aria-expanded={expanded}
            data-cursor="disable"
          >
            {expanded ? (
              <>
                Show less <MdExpandLess />
              </>
            ) : (
              <>
                View all projects ({projects.length}) <MdExpandMore />
              </>
            )}
          </button>
        </div>
      )}
    </GlassSection>
  );
};

export default Projects;
