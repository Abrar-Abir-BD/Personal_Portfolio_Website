import { lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const ProjectPage = lazy(() => import("./components/ProjectPage"));
const ArtPage = lazy(() => import("./components/ArtPage"));
import { LoadingProvider } from "./context/LoadingProvider";

// /projects/<slug> opens that project's own page (a full page load, so the
// 3D scene and smooth scrolling never need tearing down)
const projectSlug = window.location.pathname.match(
  /^\/projects\/([^/]+)\/?$/
)?.[1];

// /art opens the full art portfolio as its own page
const isArtPage = /^\/art\/?$/.test(window.location.pathname);

const App = () => {
  if (isArtPage) {
    return (
      <Suspense>
        <ArtPage />
      </Suspense>
    );
  }
  if (projectSlug) {
    return (
      <Suspense>
        <ProjectPage slug={decodeURIComponent(projectSlug)} />
      </Suspense>
    );
  }
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
