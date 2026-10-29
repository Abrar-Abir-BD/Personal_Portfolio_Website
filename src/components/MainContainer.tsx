import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar, { scrollToSection } from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Skills from "./Skills";
import Experience from "./Experience";
import Awards from "./Awards";
import Projects from "./Projects";
import Research from "./Research";
import ArtPortfolio from "./ArtPortfolio";
import Certificates from "./Certificates";
import Media from "./Media";
import Moments from "./Moments";
import setSplitText from "./utils/splitText";
import { useLoading } from "../context/LoadingProvider";
import { onAwayChange } from "../router";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  const { finishLoading } = useLoading();

  useEffect(() => {
    // Show the page as soon as its fonts are in (at most a second's wait)
    Promise.race([
      document.fonts?.ready,
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]).then(finishLoading);
    // Split once here; after that ScrollTrigger's own (debounced) refresh on
    // resize re-splits the text, so a resize event only checks the layout
    setSplitText();
    const resizeHandler = () => setIsDesktopView(window.innerWidth > 1024);
    window.addEventListener("resize", resizeHandler);
    // Back from another page by a link to a section (/#projects): go there.
    // (Back by the browser's button stays where the visitor left off)
    const stopListening = onAwayChange((away, jumpToHash) => {
      if (!away && jumpToHash && window.location.hash) {
        requestAnimationFrame(() => scrollToSection(window.location.hash, false));
      }
    });
    return () => {
      window.removeEventListener("resize", resizeHandler);
      stopListening();
    };
  }, [finishLoading]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <Landing>{!isDesktopView && children}</Landing>
            <About />
            {/* Part of the 3D character's scroll animation: keep right after About */}
            <WhatIDo />
            <Projects />
            <Research />
            <Awards />
            <Experience />
            <Skills />
            <ArtPortfolio />
            <Certificates />
            <Media />
            <Moments />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
