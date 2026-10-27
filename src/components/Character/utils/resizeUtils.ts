import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  const workTrigger = ScrollTrigger.getById("work");
  // The character's own timelines (see setCharTimeline)
  const charSections = [".landing-section", ".about-section", ".whatIDO"].map(
    (selector) => document.querySelector(selector)
  );
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger != workTrigger) {
      // Reset the character's animations to their start first, so the
      // rebuilt timelines record its original pose, not wherever it is now
      trigger.kill(charSections.includes(trigger.trigger as Element));
    }
  });
  setCharTimeline(character, camera);
  setAllTimeline();
}
