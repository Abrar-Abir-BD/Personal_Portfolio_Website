import { GlassCard, GlassImage, GlassSection } from "./Glass";
import { artworks } from "../data/portfolioContent";
import "./styles/Sections.css";

const ArtPortfolio = () => {
  return (
    <GlassSection
      id="art"
      title={
        <>
          Art <span>Portfolio</span>
        </>
      }
      subtitle="A gallery of my creative work."
    >
      <div className="art-grid">
        {artworks.map((art, index) => (
          <GlassCard className="art-card" key={index}>
            <GlassImage src={art.image} alt={art.title} />
            <div className="art-info">
              <h3>{art.title}</h3>
              <p>
                {art.medium} · {art.year}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </GlassSection>
  );
};

export default ArtPortfolio;
