import { useEffect, useRef, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { GlassCard, GlassSection } from "./Glass";
import { media } from "../data/portfolioContent";
import "./styles/Sections.css";

// "https://www.tbsnews.net/..." -> "tbsnews.net", shown under each title
const domainOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

// Featured items in one row that slides left and right, like LinkedIn's
// Featured section: preview image on top, then type, title and source
const Media = () => {
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Grey out an arrow once the row can't scroll further that way
  const update = () => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  };
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Each arrow moves the row by one card
  const slide = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".media-card");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  return (
    <GlassSection
      id="media"
      title={
        <>
          Featured in <span>Media</span>
        </>
      }
    >
      {/* Arrows sit on either side; the edges fade where more cards wait */}
      <div
        className={`media-slider ${atStart ? "" : "media-more-left"} ${
          atEnd ? "" : "media-more-right"
        }`}
      >
        <button
          type="button"
          className="media-arrow media-arrow-prev"
          onClick={() => slide(-1)}
          disabled={atStart}
          aria-label="Previous"
          data-cursor="disable"
        >
          <MdChevronLeft />
        </button>
        <button
          type="button"
          className="media-arrow media-arrow-next"
          onClick={() => slide(1)}
          disabled={atEnd}
          aria-label="Next"
          data-cursor="disable"
        >
          <MdChevronRight />
        </button>
        <div className="media-track" ref={track} onScroll={update}>
          {media.map((item, index) => (
            <GlassCard className="media-card" as="article" key={index}>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                <div className="media-thumb">
                  {item.image ? (
                    <img src={item.image} alt="" loading="lazy" />
                  ) : (
                    <span>{item.outlet}</span>
                  )}
                </div>
                <div className="media-body">
                  <p className="media-type">
                    {item.type}
                    {item.date && <span> · {item.date}</span>}
                  </p>
                  <h3>{item.headline}</h3>
                  <p className="media-source">
                    {item.outlet}
                    <span>{domainOf(item.link)}</span>
                  </p>
                </div>
              </a>
            </GlassCard>
          ))}
        </div>
      </div>
    </GlassSection>
  );
};

export default Media;
