import { MdArrowForward } from "react-icons/md";
import { GlassSection } from "./Glass";
import { art, artImage } from "../data/portfolioContent";
import "./styles/Sections.css";

// A few selected pieces; the full collection lives on its own page (/art)
const featured = art.artworks.filter((work) => work.featured).slice(0, 4);

const ArtPortfolio = () => {
  return (
    <GlassSection
      id="art"
      title={
        <>
          Art <span>Portfolio</span>
        </>
      }
      subtitle={art.intro}
    >
      <div className="art-preview">
        {featured.map((work, index) => (
          <a
            href={`/art#${work.slug}`}
            className="art-preview-item"
            data-cursor="disable"
            key={work.slug}
          >
            <div className="art-preview-frame">
              <img
                src={artImage(work.images[0], "thumb")}
                alt={work.title}
                loading="lazy"
              />
            </div>
            <span className="art-preview-no">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{work.title}</h3>
            <p>{work.medium}</p>
          </a>
        ))}
      </div>
      <div className="projects-more">
        <a href="/art" className="glass-button" data-cursor="disable">
          Explore the full collection <MdArrowForward />
        </a>
      </div>
    </GlassSection>
  );
};

export default ArtPortfolio;
