import { FaEnvelope, FaGithub, FaLinkedinIn } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { contact } from "../data/portfolioContent";
import { useEffect } from "react";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    const cleanups: (() => void)[] = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;
      let frame = 0;

      // Eases the icon towards the pointer, then rests until it moves again
      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        const moving =
          Math.abs(mouseX - currentX) + Math.abs(mouseY - currentY) > 0.1;
        frame = moving ? requestAnimationFrame(updatePosition) : 0;
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
        if (!frame) frame = requestAnimationFrame(updatePosition);
      };

      document.addEventListener("mousemove", onMouseMove);
      updatePosition();

      cleanups.push(() => {
        cancelAnimationFrame(frame);
        document.removeEventListener("mousemove", onMouseMove);
      });
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href={contact.github} target="_blank" aria-label="GitHub">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href={contact.linkedin} target="_blank" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href={`mailto:${contact.email}`} aria-label="Email">
            <FaEnvelope />
          </a>
        </span>
      </div>
    </div>
  );
};

export default SocialIcons;
