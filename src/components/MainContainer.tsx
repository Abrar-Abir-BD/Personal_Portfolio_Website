import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Skills from "./Skills";
import Experience from "./Experience";
import Awards from "./Awards";
import Projects from "./Projects";
import Research from "./Research";
import ArtPortfolio from "./ArtPortfolio";
import Media from "./Media";
import Moments from "./Moments";
import setSplitText from "./utils/splitText";

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

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
