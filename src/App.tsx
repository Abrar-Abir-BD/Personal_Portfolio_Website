import {
  lazy,
  PropsWithChildren,
  startTransition,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import { LoadingProvider } from "./context/LoadingProvider";
import { onNavigate, parseRoute, setAway, SUBPAGE_ID } from "./router";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
const loadProjectPage = () => import("./components/ProjectPage");
const loadArtPage = () => import("./components/ArtPage");
const loadCertificatesPage = () => import("./components/CertificatesPage");
const ProjectPage = lazy(loadProjectPage);
const ArtPage = lazy(loadArtPage);
const CertificatesPage = lazy(loadCertificatesPage);

// Not read from document.title: a page's own copy of index.html (written at
// build time) starts with that page's title
const mainTitle = "Abrar Abir - AI & Robotics Researcher";

// A page shown over the portfolio, scrolling on its own
const Subpage = ({ children }: PropsWithChildren) => {
  const layer = useRef<HTMLDivElement>(null);
  // So the keyboard scrolls this page, not the hidden portfolio behind it
  useEffect(() => layer.current?.focus({ preventScroll: true }), []);
  return (
    <div id={SUBPAGE_ID} className="subpage-layer" ref={layer} tabIndex={-1}>
      {children}
    </div>
  );
};

const App = () => {
  const [path, setPath] = useState(window.location.pathname);
  // As a transition, so the current page stays up while the next one loads
  useEffect(
    () =>
      onNavigate(() =>
        startTransition(() => setPath(window.location.pathname))
      ),
    []
  );
  const route = parseRoute(path);
  const away = route.page !== "main";

  // The portfolio mounts the first time it's shown and then stays, hidden
  // while another page is open
  const [mainShown, setMainShown] = useState(!away);
  if (!away && !mainShown) setMainShown(true);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("subpage-open", away);
    if (!away) document.title = mainTitle;
    setAway(away);
  }, [away]);

  // Fetch the other pages once the portfolio has settled, so they open
  // without a wait
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProjectPage();
      loadArtPage();
      loadCertificatesPage();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Created once: navigating never re-renders the portfolio
  const main = useMemo(
    () => (
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    ),
    []
  );

  return (
    <Suspense>
      {mainShown && main}
      {away && (
        // Keyed by address: each page starts fresh, at the top
        <Subpage key={path}>
          {route.page === "project" ? (
            <ProjectPage slug={route.slug} />
          ) : route.page === "art" ? (
            <ArtPage />
          ) : (
            <CertificatesPage />
          )}
        </Subpage>
      )}
    </Suspense>
  );
};

export default App;
