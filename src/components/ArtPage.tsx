import { CSSProperties, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MdArrowBack, MdArrowDownward, MdCopyright } from "react-icons/md";
import {
  Artwork,
  art,
  artImage,
  contact,
  landing,
} from "../data/portfolioContent";
import "./styles/ArtPage.css";

gsap.registerPlugin(ScrollTrigger);

const name = `${landing.firstName} ${landing.lastName}`;
// "ABRAR" -> "Abrar" for the script signature
const sentenceCase = (s: string) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const signature = sentenceCase(name);

const total = art.artworks.length;

// Big gold title, split into lines so each can slide up from its own mask.
// Lines are formed from words so short words share a line, as in the PDF.
const titleLines = (title: string) => {
  const words = title.toUpperCase().split(" ");
  const lines: string[] = [];
  for (const word of words) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + word).length <= 11) {
      lines[lines.length - 1] = last + " " + word;
    } else {
      lines.push(word);
    }
  }
  return lines;
};

const Picture = ({
  work,
  file,
  className = "",
  showDate = false,
}: {
  work: Artwork;
  file: string;
  className?: string;
  showDate?: boolean;
}) => (
  <figure
    className={`art-pic ${className} ${
      work.fit === "contain" ? "art-pic-contain" : ""
    }`}
    data-reveal="pic"
  >
    {work.fit === "contain" && (
      // Soft blurred copy fills the space around the whole painting
      <img src={artImage(file, "thumb")} alt="" aria-hidden="true" className="art-pic-backdrop" loading="lazy" />
    )}
    <img
      src={artImage(file)}
      alt={work.title}
      loading="lazy"
      style={{ objectPosition: work.focus }}
      // A painting sized to its own shape has no spare edge to drift into
      data-parallax={work.ratio ? undefined : true}
    />
    {showDate && work.date && (
      <span className="art-date" data-reveal="pop">
        {work.date}
      </span>
    )}
  </figure>
);

const Caption = ({ work, index }: { work: Artwork; index: number }) => (
  <div className="art-caption">
    <p className="art-no" data-reveal="line">
      No. {String(index + 1).padStart(2, "0")} <span>/ {total}</span>
    </p>
    <h2 className="art-title">
      {titleLines(work.title).map((line, i) => (
        <span className="art-title-mask" key={i}>
          <span className="art-title-line">{line}</span>
        </span>
      ))}
    </h2>
    <dl className="art-meta">
      <div data-reveal="line">
        <dt>Medium:</dt> <dd>{work.medium}</dd>
      </div>
      <div data-reveal="line">
        <dt>Theme:</dt> <dd>{work.theme}</dd>
      </div>
      <div data-reveal="line">
        <dt>Description:</dt> <dd>{work.description}</dd>
      </div>
    </dl>
  </div>
);

const Slide = ({ work, index }: { work: Artwork; index: number }) => {
  const [first, ...rest] = work.images;
  const pics = (cls = "") =>
    work.images.map((file, i) => (
      <Picture
        work={work}
        file={file}
        className={cls}
        // As in the PDF, the mosaic's date sits on its last (lower) study
        showDate={
          work.layout === "mosaic" ? i === work.images.length - 1 : i === 0
        }
        key={file}
      />
    ));

  return (
    <section
      className={`art-slide art-${work.layout} ${
        work.ratio ? "art-fit-ratio" : ""
      }`}
      id={work.slug}
      style={
        work.ratio
          ? ({ "--pic-ratio": work.ratio } as CSSProperties)
          : undefined
      }
      data-slide
    >
      {work.layout === "row" && (
        <>
          <div className="art-row-grid">{pics("art-pic-row")}</div>
          <Caption work={work} index={index} />
        </>
      )}
      {work.layout === "mosaic" && (
        <>
          <Caption work={work} index={index} />
          <div className="art-mosaic-grid">{pics("art-pic-mosaic")}</div>
        </>
      )}
      {work.layout === "triptych" && (
        <>
          <Picture work={work} file={first} className="art-pic-side" />
          <Caption work={work} index={index} />
          {rest.map((file) => (
            <Picture
              work={work}
              file={file}
              className="art-pic-side"
              showDate
              key={file}
            />
          ))}
        </>
      )}
      {(work.layout === "overlay-dark" || work.layout === "overlay-light") && (
        <>
          <Picture
            work={work}
            file={first}
            className="art-pic-bleed"
            showDate
          />
          <div className="art-veil">
            <Caption work={work} index={index} />
          </div>
        </>
      )}
      {work.layout === "framed" && (
        <>
          <Caption work={work} index={index} />
          <Picture work={work} file={first} className="art-pic-framed" showDate />
        </>
      )}
      {work.layout === "wide" && (
        <>
          <Picture work={work} file={first} className="art-pic-wide" showDate />
          <Caption work={work} index={index} />
        </>
      )}
      {(work.layout === "text-left" || work.layout === "text-right") && (
        <>
          <Caption work={work} index={index} />
          <Picture work={work} file={first} className="art-pic-half" showDate />
        </>
      )}
    </section>
  );
};

const ArtPage = () => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The portfolio locks body scrolling until its intro runs; this page
    // scrolls normally
    document.body.style.overflowY = "auto";
    document.title = `Art Portfolio | ${signature}`;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Cover: the painting settles in, the title rises, then the whole
        // cover drifts and fades as you scroll away
        gsap.from(".art-cover img", { scale: 1.18, duration: 2.4, ease: "power2.out" });
        gsap.from(".art-cover-title > span", {
          yPercent: 110,
          duration: 1.3,
          ease: "power4.out",
          stagger: 0.15,
          delay: 0.3,
        });
        gsap.from(".art-cover-by, .art-cover-cue", {
          opacity: 0,
          y: 20,
          duration: 1.2,
          delay: 1,
          stagger: 0.2,
        });
        gsap.to(".art-cover img", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: ".art-cover", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".art-cover-inner", {
          yPercent: -40,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: ".art-cover", start: "top top", end: "70% top", scrub: true },
        });

        // One sequence per artwork, in order: the photo is revealed like a
        // curtain lifting (easing down from a slight zoom), and only then do
        // the number, title and details slide down into place one by one
        const reveal = (slide: HTMLElement, details: string) => {
          const pics = slide.querySelectorAll<HTMLElement>("[data-reveal='pic']");
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: slide, start: "top 72%" },
          });
          tl.from(pics, {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.5,
            ease: "power3.inOut",
            stagger: 0.18,
          })
            .from(
              slide.querySelectorAll("[data-reveal='pic'] img"),
              { scale: 1.3, duration: 2, ease: "power2.out", stagger: 0.18 },
              "<"
            )
            .from(
              slide.querySelectorAll("[data-reveal='pop']"),
              { scale: 0.5, opacity: 0, duration: 0.8, ease: "back.out(1.8)" },
              "-=0.9"
            )
            // Details only start once the photo is mostly revealed
            .from(
              slide.querySelectorAll(".art-no"),
              { y: -24, opacity: 0, duration: 0.8 },
              "-=0.7"
            )
            .from(
              slide.querySelectorAll(".art-title-line"),
              { yPercent: -110, duration: 1.1, ease: "power4.out", stagger: 0.12 },
              "-=0.5"
            )
            .from(
              slide.querySelectorAll(details),
              { y: -28, opacity: 0, duration: 0.9, stagger: 0.14 },
              "-=0.6"
            );
        };
        gsap.utils
          .toArray<HTMLElement>("[data-slide]")
          .forEach((slide) => reveal(slide, ".art-meta > div"));

        // Subtle parallax: each artwork drifts slower than the page. The
        // scrub lag (in seconds) smooths the drift instead of tracking every
        // wheel tick exactly
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }
          );
        });

        // The artist panel
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".art-artist", start: "top 65%" },
          })
          .from(".art-artist-photo", {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.5,
            ease: "power3.inOut",
          })
          .from(".art-artist-photo img", { scale: 1.3, duration: 2, ease: "power2.out" }, "<")
          .from(
            ".art-artist-panel > *",
            { y: -32, opacity: 0, duration: 0.9, stagger: 0.12 },
            "-=1"
          );
        gsap.from(".art-closing-inner > *", {
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: ".art-closing", start: "top 55%" },
        });
      });

      // Reading progress line along the top
      gsap.to(".art-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.3 },
      });
    }, root);

    // Images load lazily and change the page height: re-measure as they do
    const imgs = root.current?.querySelectorAll("img") ?? [];
    const refresh = () => ScrollTrigger.refresh();
    imgs.forEach((img) => img.addEventListener("load", refresh, { once: true }));

    // Arriving from the main page with #slug: go straight to that artwork
    const target = window.location.hash
      ? document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      : null;
    if (target) requestAnimationFrame(() => target.scrollIntoView());

    return () => {
      imgs.forEach((img) => img.removeEventListener("load", refresh));
      ctx.revert();
    };
  }, []);

  return (
    <div className="art-page" ref={root}>
      <div className="art-progress" aria-hidden="true"></div>
      <header className="art-bar">
        <a href="/#art" className="art-bar-back" data-cursor="disable">
          <MdArrowBack /> Main Portfolio
        </a>
        <span className="art-bar-title">Art Portfolio</span>
      </header>

      {/* Cover: full-bleed watercolour, like the first page of the PDF */}
      <section className="art-cover">
        <img src={artImage("cover")} alt="River landscape in watercolour" />
        <div className="art-cover-inner">
          <h1 className="art-cover-title">
            <span>Art Portfolio</span>
          </h1>
          <p className="art-cover-by">by {signature}</p>
        </div>
        <span className="art-cover-cue">
          Scroll to enter <MdArrowDownward />
        </span>
      </section>

      {/* The artist */}
      <section className="art-artist">
        <figure className="art-pic art-artist-photo" data-reveal="pic">
          <img
            src={artImage("artist")}
            alt={`${signature} painting at an easel`}
            data-parallax
          />
        </figure>
        <div className="art-artist-panel">
          <h2 className="art-artist-title">
            The Artist
            <span className="art-signature">{signature}</span>
          </h2>
          <p className="art-artist-label">Skills:</p>
          <ul className="art-skills">
            {art.artist.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          {art.artist.bio.map((paragraph, i) => (
            <p className="art-bio" key={i}>
              {paragraph}
            </p>
          ))}
          <p className="art-contact">
            Contact me:{" "}
            <a href={`mailto:${art.artist.email}`} data-cursor="disable">
              {art.artist.email}
            </a>
          </p>
        </div>
      </section>

      {art.artworks.map((work, index) => (
        <div key={work.slug}>
          <Slide work={work} index={index} />
        </div>
      ))}

      {/* Closing, like the last page of the PDF */}
      <section className="art-closing">
        <img src={artImage("thank-you")} alt="Riverbank in watercolour" data-parallax />
        <div className="art-closing-inner">
          <h2>Thank you</h2>
          <p className="art-cover-by">{signature}</p>
        </div>
        {/* Footer laid out like the main site's Contact section */}
        <footer className="art-footer">
          <div className="art-footer-col">
            <p className="art-contact-label">Email</p>
            <a href={`mailto:${contact.email}`} data-cursor="disable">
              {contact.email}
            </a>
            <p className="art-contact-label">Phone</p>
            <a
              href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
              data-cursor="disable"
            >
              {contact.phone}
            </a>
          </div>
          <div className="art-footer-col">
            <p className="art-contact-label">Navigate</p>
            <a href="/#art" className="art-closing-button" data-cursor="disable">
              <MdArrowBack /> Back to main portfolio
            </a>
          </div>
          <div className="art-footer-col art-closing-credit">
            <p>
              Designed and Developed <br /> by <span>{signature}</span>
            </p>
            <p className="art-closing-year">
              <MdCopyright /> {contact.copyrightYear}
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default ArtPage;
