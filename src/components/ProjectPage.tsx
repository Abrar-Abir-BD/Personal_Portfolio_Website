import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdArrowBack,
  MdArrowOutward,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
} from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import { GlassCard } from "./Glass";
import ProjectAnatomy from "./ProjectAnatomy";
import ProjectFlow from "./ProjectFlow";
import {
  awards as allAwards,
  landing,
  projects,
  type ProjectImage,
} from "../data/portfolioContent";
import { subpageScroller } from "../router";
import "./styles/ProjectPage.css";
// The full-size photo viewer looks the same as the certificates' one
import "./styles/CertificatesPage.css";

// "Category · Status · Year", skipping any left blank
const metaOf = (parts: string[]) => parts.filter(Boolean).join(" · ");

// The video id in a YouTube link (watch?v=, youtu.be/, shorts/ or embed/)
const youTubeId = (url: string) =>
  url.match(
    /(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/
  )?.[1];

// Hands a loaded photo's real shape to its button as --ar, so the gallery can
// size it without cropping or letterboxing it
const fitPhoto = (img: HTMLImageElement) => {
  if (!img.naturalWidth || !img.naturalHeight) return;
  img
    .closest<HTMLElement>(".project-page-photo")
    ?.style.setProperty("--ar", (img.naturalWidth / img.naturalHeight).toFixed(4));
};

const ProjectPage = ({ slug }: { slug: string }) => {
  const project = projects.find((p) => p.slug === slug);
  const name = `${landing.firstName} ${landing.lastName}`;

  // Every photo on the page, in order, so the viewer can step through them
  const photos: ProjectImage[] =
    project?.sections?.flatMap((section) => section.images ?? []) ?? [];
  // Index into `photos` of the one open in the viewer, or null
  const [open, setOpen] = useState<number | null>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const count = photos.length;
  const show = useCallback((index: number | null) => setOpen(index), []);

  useEffect(() => {
    document.title = project ? `${project.title} | ${name}` : name;
  }, [project, name]);

  // Opening moves focus into the viewer; closing hands it back to the photo
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    viewer.current?.querySelector<HTMLElement>(".certs-viewer-close")?.focus();
    return () => opener?.focus();
  }, [isOpen]);

  // Esc closes, the arrow keys step through the photos, and Tab stays inside
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" && viewer.current) {
        const buttons = viewer.current.querySelectorAll("button");
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        const at = document.activeElement;
        const inside = viewer.current.contains(at);
        if (e.shiftKey && (at === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (at === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "Escape") show(null);
      if (e.key === "ArrowRight") show((open + 1) % count);
      if (e.key === "ArrowLeft") show((open - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    // The page behind the viewer holds still
    const page = subpageScroller();
    if (page) page.style.overflowY = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      if (page) page.style.overflowY = "";
    };
  }, [open, count, show]);

  const current = open === null ? null : photos[open];
  const videos = (project?.videos ?? [])
    .map(youTubeId)
    .filter((id): id is string => Boolean(id));
  // Awards it won and projects to suggest, in the order the project lists them
  const won = (project?.awards ?? [])
    .map((event) => allAwards.find((award) => award.event === event))
    .filter((award): award is (typeof allAwards)[number] => Boolean(award));
  const related = (project?.related ?? [])
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is (typeof projects)[number] => Boolean(p));
  // "none" in projects.json means the project has no code to show
  const hasCode = Boolean(project?.code) && project?.code !== "none";
  const hasAnatomy = (project?.anatomy?.labels.length ?? 0) > 0;
  const hasDetails =
    (project?.description.length ?? 0) > 0 ||
    (project?.sections?.length ?? 0) > 0;

  return (
    <div className="project-page project-detail">
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
          {/* Title beside the floating photo; or, when the project has a
              labelled photo, the title alone with that photo below it */}
          <div className={hasAnatomy ? "project-page-hero no-media" : "project-page-hero"}>
            <div className="project-page-intro">
              {metaOf([project.category, project.status, project.year]) && (
                <p className="project-page-meta">
                  {metaOf([project.category, project.status, project.year])}
                </p>
              )}
              <h1>{project.title}</h1>
              <p className="project-page-summary">{project.summary}</p>
            </div>

            {/* Floating photo on a soft glow, like the cards on the main page */}
            {!hasAnatomy && (
              <div className="project-page-media">
                {project.image ? (
                  <img src={project.image} alt={project.title} />
                ) : (
                  <span>Add image</span>
                )}
              </div>
            )}
          </div>

          {/* The photo with its parts labelled, in place of the plain one */}
          {project.anatomy && hasAnatomy && (
            <ProjectAnatomy
              anatomy={project.anatomy}
              image={project.image}
              title={project.title}
              key={project.slug}
            />
          )}

          {/* The write-up, with the video beside it */}
          {(project.description.length > 0 || videos.length > 0) && (
            <section
              className={
                videos.length > 0
                  ? "project-page-overview has-video"
                  : "project-page-overview"
              }
            >
              {project.description.length > 0 && (
                <div className="project-page-body">
                  {project.description.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              )}
              {videos.length > 0 && (
                <div className="project-page-videos">
                  {videos.map((id) => (
                    <div className="project-page-video" key={id}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
                        title={`${project.title} video`}
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* The sections, one under the other, with a pinned track of nodes */}
          {(project.sections?.length ?? 0) > 0 && (
            <ProjectFlow
              sections={project.sections ?? []}
              key={`flow-${project.slug}`}
              renderGallery={(section) => {
                const images = section.images ?? [];
                return (
                  <div
                    className={
                      section.phone
                        ? "project-page-gallery project-page-phones"
                        : "project-page-gallery"
                    }
                  >
                    {images.map((image) => (
                      <button
                        type="button"
                        className="project-page-photo"
                        onClick={() => show(photos.indexOf(image))}
                        data-cursor="disable"
                        key={image.src}
                      >
                        <span className="project-page-photo-frame">
                          <img
                            src={image.src}
                            alt={image.caption}
                            loading="lazy"
                            ref={(img) => {
                              if (img?.complete) fitPhoto(img);
                            }}
                            onLoad={(e) => fitPhoto(e.currentTarget)}
                          />
                        </span>
                        <span className="project-page-photo-caption">
                          {image.caption}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              }}
            />
          )}

          {won.length > 0 && (
            <section className="project-page-section">
              <div className="project-page-section-head">
                <h2>Recognition</h2>
                <a href="/#awards" className="project-page-more" data-cursor="disable">
                  All awards <MdArrowOutward />
                </a>
              </div>
              <div className="project-page-awards">
                {won.map((award) => {
                  const link = award.links[0]?.url;
                  const external = link !== undefined && !link.startsWith("/");
                  const body = (
                    <>
                      {award.image && (
                        <span className="project-page-award-photo">
                          <img src={award.image} alt="" loading="lazy" />
                        </span>
                      )}
                      <span className="project-page-award-text">
                        <strong>{award.title}</strong>
                        <span>{award.event}</span>
                        <em>{[award.location, award.year].filter(Boolean).join(" · ")}</em>
                      </span>
                    </>
                  );
                  return link ? (
                    <a
                      href={link}
                      className="glass project-page-award"
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer" : undefined}
                      data-cursor="disable"
                      key={award.event}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="glass project-page-award" key={award.event}>
                      {body}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="project-page-section">
              <h2>Related projects</h2>
              <div className="project-page-related">
                {related.map((other) => (
                  <a
                    href={`/projects/${other.slug}`}
                    className="glass project-page-related-card"
                    data-cursor="disable"
                    key={other.slug}
                  >
                    <span className="project-page-related-photo">
                      {other.image && <img src={other.image} alt="" loading="lazy" />}
                    </span>
                    <span className="project-page-related-text">
                      <strong>{other.title}</strong>
                      <span>{other.summary}</span>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {!hasDetails && (
            // Filled in later from "description" / "sections" in projects.json
            <GlassCard className="project-page-soon">
              <h2>More details coming soon</h2>
              <p>
                A full write-up of this project, covering the problem, how it
                was built and the results, will be added here.
              </p>
            </GlassCard>
          )}

          {(project.links.length > 0 || hasCode) && (
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
              {hasCode && (
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

      {current && open !== null && (
        <div
          ref={viewer}
          className="certs-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          onClick={() => show(null)}
        >
          <button
            type="button"
            className="certs-viewer-close"
            onClick={() => show(null)}
            aria-label="Close"
            data-cursor="disable"
          >
            <MdClose />
          </button>
          {count > 1 && (
            <button
              type="button"
              className="certs-viewer-arrow certs-viewer-prev"
              onClick={(e) => {
                e.stopPropagation();
                show((open - 1 + count) % count);
              }}
              aria-label="Previous photo"
              data-cursor="disable"
            >
              <MdChevronLeft />
            </button>
          )}
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.caption} />
            <figcaption>
              <strong>{current.caption}</strong>
            </figcaption>
          </figure>
          {count > 1 && (
            <button
              type="button"
              className="certs-viewer-arrow certs-viewer-next"
              onClick={(e) => {
                e.stopPropagation();
                show((open + 1) % count);
              }}
              aria-label="Next photo"
              data-cursor="disable"
            >
              <MdChevronRight />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
