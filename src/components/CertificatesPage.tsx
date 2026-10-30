import { useCallback, useEffect, useRef, useState } from "react";
import {
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
} from "react-icons/md";
import {
  Certificate,
  certificates,
  certificateSlug,
  landing,
} from "../data/portfolioContent";
import { subpageScroller } from "../router";
import "./styles/Glass.css";
import "./styles/ProjectPage.css";
// The framed look of the main page's certificates (.cert-item)
import "./styles/Sections.css";
import "./styles/CertificatesPage.css";

// Groups in this order; a type not listed here is added at the end
const ORDER = ["Award", "Appreciation", "Participation", "Course"];
const GROUP_TITLES: Record<string, string> = {
  Award: "Awards",
  Appreciation: "Appreciation",
  Participation: "Participation",
  Course: "Courses",
};
const types = [
  ...ORDER.filter((t) => certificates.some((c) => c.type === t)),
  ...new Set(certificates.map((c) => c.type).filter((t) => !ORDER.includes(t))),
];
// The viewer steps through the certificates in the order they're shown
const shown = types.flatMap((t) => certificates.filter((c) => c.type === t));

// Issuing authority, then the date when there is one
const Details = ({ cert }: { cert: Certificate }) => (
  <>
    <span className="certs-issuer">Issued by {cert.issuer}</span>
    {cert.date && <span className="certs-date">{cert.date}</span>}
  </>
);

const CertificatesPage = () => {
  const name = `${landing.firstName} ${landing.lastName}`;
  // Index into `shown` of the certificate open in the viewer, or null
  const [open, setOpen] = useState<number | null>(null);
  const viewer = useRef<HTMLDivElement>(null);

  const show = useCallback((index: number | null) => {
    setOpen(index);
    // Keep the open certificate in the address, so it can be linked to
    const hash = index === null ? "" : `#${certificateSlug(shown[index])}`;
    // (keeping the entry's state: it says whether Back leads to the portfolio)
    history.replaceState(history.state, "", `${location.pathname}${hash}`);
  }, []);

  useEffect(() => {
    document.title = `Certificates | ${name}`;
    // /certificates#<slug>, from the main page's carousel, opens that one
    const slug = decodeURIComponent(location.hash.slice(1));
    const index = shown.findIndex((c) => certificateSlug(c) === slug);
    if (index >= 0) setOpen(index);
  }, [name]);

  // Opening moves focus into the viewer; closing hands it back to the card
  // that opened it (stepping between certificates doesn't count)
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    viewer.current?.querySelector<HTMLElement>(".certs-viewer-close")?.focus();
    return () => opener?.focus();
  }, [isOpen]);

  // Esc closes the viewer, the arrow keys step through the certificates,
  // and Tab cycles through its buttons without leaving it
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
      if (e.key === "ArrowRight") show((open + 1) % shown.length);
      if (e.key === "ArrowLeft") show((open - 1 + shown.length) % shown.length);
    };
    window.addEventListener("keydown", onKey);
    // The page behind the viewer holds still
    const page = subpageScroller();
    if (page) page.style.overflowY = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      if (page) page.style.overflowY = "";
    };
  }, [open, show]);

  const current = open === null ? null : shown[open];

  return (
    <div className="project-page certs-page">
      <header className="project-page-bar">
        <a href="/" className="project-page-name" data-cursor="disable">
          {name}
        </a>
        <a href="/#certificates" className="glass-button" data-cursor="disable">
          <MdArrowBack /> Back to portfolio
        </a>
      </header>

      <main className="project-page-main">
        <h1>Certificates</h1>
        <p className="project-page-summary">
          From competitions, talks, programmes and courses. Select one to see it
          full size.
        </p>

        {types.map((type) => (
          <section className="certs-group" key={type}>
            <h2>{GROUP_TITLES[type] ?? type}</h2>
            <div className="certs-grid">
              {certificates
                .filter((cert) => cert.type === type)
                .map((cert) => (
                  // Framed like the main page's certificates, no card
                  <button
                    type="button"
                    className="cert-item certs-item"
                    onClick={() => show(shown.indexOf(cert))}
                    data-cursor="disable"
                    key={cert.image}
                  >
                    <div className="cert-frame">
                      <img src={cert.thumb} alt="" loading="lazy" />
                    </div>
                    <h3>{cert.title}</h3>
                    <p className="cert-issuer">Issued by {cert.issuer}</p>
                    {cert.date && <p className="cert-date">{cert.date}</p>}
                  </button>
                ))}
            </div>
          </section>
        ))}
      </main>

      {current && open !== null && (
        <div
          ref={viewer}
          className="certs-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
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
          <button
            type="button"
            className="certs-viewer-arrow certs-viewer-prev"
            onClick={(e) => {
              e.stopPropagation();
              show((open - 1 + shown.length) % shown.length);
            }}
            aria-label="Previous certificate"
            data-cursor="disable"
          >
            <MdChevronLeft />
          </button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={current.image} alt={current.title} />
            <figcaption>
              <strong>{current.title}</strong>
              <Details cert={current} />
            </figcaption>
          </figure>
          <button
            type="button"
            className="certs-viewer-arrow certs-viewer-next"
            onClick={(e) => {
              e.stopPropagation();
              show((open + 1) % shown.length);
            }}
            aria-label="Next certificate"
            data-cursor="disable"
          >
            <MdChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
