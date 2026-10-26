import { useEffect } from "react";
import { MdArrowBack, MdArrowOutward } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import { GlassCard } from "./Glass";
import { landing, projects } from "../data/portfolioContent";
import "./styles/ProjectPage.css";

// "Category · Status · Year", skipping any left blank
const metaOf = (parts: string[]) => parts.filter(Boolean).join(" · ");

const ProjectPage = ({ slug }: { slug: string }) => {
  const project = projects.find((p) => p.slug === slug);
  const name = `${landing.firstName} ${landing.lastName}`;

  useEffect(() => {
    // The portfolio locks body scrolling until its intro runs; this page has
    // no intro, so scroll normally
    document.body.style.overflowY = "auto";
    document.title = project ? `${project.title} | ${name}` : name;
    window.scrollTo(0, 0);
  }, [project, name]);

  return (
    <div className="project-page">
      <header className="project-page-bar">
        <a href="/" className="project-page-name" data-cursor="disable">
          {name}
        </a>
        <a href="/#projects" className="glass-button" data-cursor="disable">
          <MdArrowBack /> All projects
        </a>
      </header>

      {!project ? (
        <main className="project-page-main project-page-missing">
          <h1>Project not found</h1>
          <p>This project may have moved. See all projects instead.</p>
        </main>
      ) : (
        <main className="project-page-main">
          {metaOf([project.category, project.status, project.year]) && (
            <p className="project-page-meta">
              {metaOf([project.category, project.status, project.year])}
            </p>
          )}
          <h1>{project.title}</h1>
          <p className="project-page-summary">{project.summary}</p>

          {/* Floating photo on a soft glow, like the cards on the main page */}
          <div className="project-page-media">
            {project.image ? (
              <img src={project.image} alt={project.title} />
            ) : (
              <span>Add image</span>
            )}
          </div>

          {project.description.length > 0 ? (
            <section className="project-page-body">
              {project.description.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </section>
          ) : (
            // Filled in later from "description" in projects.json
            <GlassCard className="project-page-soon">
              <h2>More details coming soon</h2>
              <p>
                A full write-up of this project, covering the problem, how it
                was built and the results, will be added here.
              </p>
            </GlassCard>
          )}

          {(project.links.length > 0 || project.code) && (
            <div className="project-page-links">
              {project.links.map((link, i) => (
                <a
                  href={link.url}
                  className="glass-button"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="disable"
                  key={i}
                >
                  {link.name} <MdArrowOutward />
                </a>
              ))}
              {project.code && (
                <a
                  href={project.code}
                  className="glass-button"
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="disable"
                >
                  <FaGithub /> Code
                </a>
              )}
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default ProjectPage;
