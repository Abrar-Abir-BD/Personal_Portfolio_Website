import { MdArrowForward } from "react-icons/md";
import { GlassSection } from "./Glass";
import { certificates, certificateSlug } from "../data/portfolioContent";
import "./styles/Sections.css";

// The top certificates, framed side by side like documents on a wall;
// every certificate is on its own page (/certificates)
const featured = certificates.filter((cert) => cert.featured);

const Certificates = () => {
  return (
    <GlassSection
      id="certificates"
      title={
        <>
          My <span>Certificates</span>
        </>
      }
    >
      <div className="cert-showcase">
        {featured.map((cert) => (
          // Opens this certificate full size on the certificates page
          <a
            href={`/certificates#${certificateSlug(cert)}`}
            className="cert-item"
            data-cursor="disable"
            key={cert.image}
          >
            <div className="cert-frame">
              <img src={cert.thumb} alt={cert.title} loading="lazy" />
            </div>
            <h3>{cert.title}</h3>
            <p className="cert-issuer">Issued by {cert.issuer}</p>
            {cert.date && <p className="cert-date">{cert.date}</p>}
          </a>
        ))}
      </div>
      <div className="projects-more">
        <a
          href="/certificates"
          className="glass-button"
          data-cursor="disable"
        >
          View all certificates <MdArrowForward />
        </a>
      </div>
    </GlassSection>
  );
};

export default Certificates;
