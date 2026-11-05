import {
  MdArrowForward,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { GlassSection } from "./Glass";
import MediaCard from "./MediaCard";
import { media } from "../data/portfolioContent";
import { useSlider } from "./utils/useSlider";
import "./styles/Sections.css";

// Featured items in one row that slides left and right, like LinkedIn's
// Featured section; they are also listed together on their own page (/media)
const Media = () => {
  const { track, atStart, atEnd, update, slide } = useSlider(".media-card");

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
          {media.map((item) => (
            <MediaCard item={item} key={item.link} />
          ))}
        </div>
      </div>
      <div className="projects-more">
        <a href="/media" className="glass-button" data-cursor="disable">
          View all news <MdArrowForward />
        </a>
      </div>
    </GlassSection>
  );
};

export default Media;
