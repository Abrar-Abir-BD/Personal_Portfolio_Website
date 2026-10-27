import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

interface ParaElement extends HTMLElement {
  anim?: gsap.core.Animation;
  split?: SplitText;
}

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

let listening = false;

// A rebuilt reveal starts hidden and only plays on the next scroll. When the
// page is re-measured while already past its start (e.g. sitting on About
// after the nav jump, as lazy images load), show it right away instead of
// leaving the text invisible until the reader scrolls again
const showIfPassed = (anim: gsap.core.Animation) => {
  const st = anim.scrollTrigger;
  if (st && st.scroll() >= st.start) anim.progress(1);
};

export default function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Once only: adding it on every call doubled the listeners (and the
  // re-splitting work) on each refresh.
  // Registered before the width check so a window widened past 900px
  // still gets split
  if (!listening) {
    listening = true;
    ScrollTrigger.addEventListener("refresh", () => setSplitText());
    // Lines split before the web font arrives were measured in the narrower
    // fallback font; with the real one a line no longer fits and its last
    // word drops onto a line of its own. Split again once fonts are in
    document.fonts?.ready.then(() => setSplitText());
    document.fonts?.addEventListener("loadingdone", () => setSplitText());
  }
  if (window.innerWidth < 900) return;
  const paras: NodeListOf<ParaElement> = document.querySelectorAll(".para");
  const titles: NodeListOf<ParaElement> = document.querySelectorAll(".title");

  const TriggerStart = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const ToggleAction = "play pause resume reverse";

  paras.forEach((para: ParaElement) => {
    para.classList.add("visible");
    if (para.anim) {
      para.anim.progress(1).kill();
      para.split?.revert();
    }

    para.split = new SplitText(para, {
      type: "lines,words",
      linesClass: "split-line",
    });

    para.anim = gsap.fromTo(
      para.split.words,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.02,
      }
    );
    showIfPassed(para.anim);
  });
  titles.forEach((title: ParaElement) => {
    if (title.anim) {
      title.anim.progress(1).kill();
      title.split?.revert();
    }
    title.split = new SplitText(title, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement,
          toggleActions: ToggleAction,
          start: TriggerStart,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
    showIfPassed(title.anim);
  });
}
