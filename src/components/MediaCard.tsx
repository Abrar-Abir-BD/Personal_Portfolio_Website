import { GlassCard } from "./Glass";
import { MediaFeature } from "../data/portfolioContent";
import "./styles/Sections.css";

// "https://www.tbsnews.net/..." -> "tbsnews.net", shown under each title
const domainOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

// One news item, opening the article: preview image on top, then type, title
// and source. Used by the main page's row and by the /media page
const MediaCard = ({ item }: { item: MediaFeature }) => (
  <GlassCard className="media-card" as="article">
    <a href={item.link} target="_blank" rel="noreferrer" data-cursor="disable">
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
);

export default MediaCard;
