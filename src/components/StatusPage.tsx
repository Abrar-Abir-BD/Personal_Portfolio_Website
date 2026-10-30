import { useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { landing } from "../data/portfolioContent";
import "./styles/Glass.css";
import "./styles/ProjectPage.css";

// /deploy-check shows when the running copy of the site was built, so a
// deploy can be confirmed by the time changing. Any other unknown address
// gets the 404
const StatusPage = ({ page }: { page: "deploy-check" | "not-found" }) => {
  const name = `${landing.firstName} ${landing.lastName}`;
  const deploy = page === "deploy-check";

  useEffect(() => {
    document.title = `${deploy ? "Deploy check" : "Page not found"} | ${name}`;
  }, [deploy, name]);

  return (
    <div className="project-page">
      <header className="project-page-bar">
        <a href="/" className="project-page-name" data-cursor="disable">
          {name}
        </a>
        <a href="/" className="glass-button" data-cursor="disable">
          <MdArrowBack /> Home
        </a>
      </header>
      <main className="project-page-main">
        <p className="project-page-meta">{deploy ? "Deploy check" : "404"}</p>
        <h1>{deploy ? "This build is live" : "Page not found"}</h1>
        <p className="project-page-summary">
          {deploy ? (
            <>
              Built <b>{new Date(__BUILD_TIME__).toLocaleString()}</b>
              <br />
              <code>{__BUILD_TIME__}</code>
            </>
          ) : (
            <>
              Nothing lives at <code>{window.location.pathname}</code>.
            </>
          )}
        </p>
      </main>
    </div>
  );
};

export default StatusPage;
