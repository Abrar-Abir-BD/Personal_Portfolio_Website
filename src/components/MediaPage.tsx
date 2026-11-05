import { useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { landing, media } from "../data/portfolioContent";
import MediaCard from "./MediaCard";
import "./styles/Glass.css";
import "./styles/ProjectPage.css";
import "./styles/MediaPage.css";

// /media: every news item, in the order of media.json
const MediaPage = () => {
  const name = `${landing.firstName} ${landing.lastName}`;

  useEffect(() => {
    document.title = `Featured in Media | ${name}`;
  }, [name]);

  return (
    <div className="project-page media-page">
      <header className="project-page-bar">
        <a href="/" className="project-page-name" data-cursor="disable">
          {name}
        </a>
        <a href="/#media" className="glass-button" data-cursor="disable">
          <MdArrowBack /> Back to portfolio
        </a>
      </header>

      <main className="project-page-main">
        <h1>Featured in Media</h1>
        <p className="project-page-summary">
          News, press releases and features. Select one to read the article.
        </p>
        <div className="media-grid">
          {media.map((item) => (
            <MediaCard item={item} key={item.link} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MediaPage;
