import { type ReactNode, useEffect, useRef } from "react";
import type { ProjectSection } from "../data/portfolioContent";
import "./styles/ProjectFlow.css";

// A project's write-up: every section on the page, one under the other, each
// laid out as a numbered heading beside its points or photos.

const num = (i: number) => String(i + 1).padStart(2, "0");

// "Measured: each user's limb…" splits into a label and the rest
const split = (text: string) => {
  const at = text.indexOf(": ");
  if (at > 1 && at < 40 && !text.slice(0, at).includes(".")) {
    const rest = text.slice(at + 2);
    return { label: text.slice(0, at), rest: rest[0].toUpperCase() + rest.slice(1) };
  }
  return { label: "", rest: text };
};

// A section's bullets as small tiles
const Points = ({ bullets, compact }: { bullets: string[]; compact?: boolean }) => (
  <ul className={compact ? "flow-points is-compact" : "flow-points"}>
    {bullets.map((bullet, i) => {
      const { label, rest } = split(bullet);
      return (
        <li key={i}>
          {label && <strong>{label}</strong>}
          <span>{rest}</span>
        </li>
      );
    })}
  </ul>
);

type Props = {
  sections: ProjectSection[];
  // The section's photos, laid out and opening in the page's photo viewer
  renderGallery: (section: ProjectSection) => ReactNode;
};

const ProjectFlow = ({ sections, renderGallery }: Props) => {
  const list = useRef<HTMLDivElement>(null);

  // Sections ease in as they reach the screen
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    el.classList.add("can-reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    el.querySelectorAll(".flow-panel").forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <section className="project-flow" aria-label="Project details">
      <div className="flow-list" ref={list}>
        {sections.map((section, i) => {
          const paragraphs = section.paragraphs ?? [];
          const bullets = section.bullets ?? [];
          const images = section.images ?? [];
          const hasText = paragraphs.length + bullets.length > 0;
          // Many photos, phone screens, or photos alone: words above, photos below
          const stacked =
            images.length > 0 && (images.length >= 5 || Boolean(section.phone) || !hasText);
          // What sits in the right-hand column beside the heading
          const side = images.length > 0 ? "photos" : bullets.length > 0 ? "points" : "text";
          const head = (
            <header className="flow-head">
              <span className="flow-count">{num(i)}</span>
              <h2>{section.heading}</h2>
            </header>
          );
          const prose = paragraphs.map((paragraph, k) => <p key={k}>{paragraph}</p>);
          return (
            <article
              className={`flow-panel ${stacked ? "is-stacked" : `has-${side}`}`}
              key={section.heading}
            >
              {stacked ? (
                <>
                  <div className="flow-lead">
                    {head}
                    {prose}
                    {bullets.length > 0 && <Points bullets={bullets} />}
                  </div>
                  {renderGallery(section)}
                </>
              ) : (
                <>
                  <div className="flow-lead">
                    {head}
                    {side !== "text" && prose}
                    {side === "photos" && bullets.length > 0 && (
                      <Points bullets={bullets} compact />
                    )}
                  </div>
                  <div className="flow-side">
                    {side === "photos" && renderGallery(section)}
                    {side === "points" && <Points bullets={bullets} />}
                    {side === "text" && prose}
                  </div>
                </>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectFlow;
