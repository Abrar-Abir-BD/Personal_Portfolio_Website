import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { killCharTimeline, setCharTimeline } from "../utils/GsapScroll";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      // A fresh scene per run. React runs this effect twice in development;
      // with a shared scene, the first run's model (loaded after that run
      // was cleaned up) stayed in it as a second, frozen character
      const scene = new THREE.Scene();
      let disposed = false;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      // Sharp on Retina, but never more than 2x: on high-DPI Windows laptops
      // (250-300% scaling) full density means 6-9x the pixels every frame
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      const progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf && !disposed) {
          setCharTimeline(gltf.scene, camera);
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          const character = gltf.scene;
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
              // Lands as the loader leaves (see the timers in Loading.tsx)
            }, 2000);
          });
          onResize = () => {
            clearTimeout(resizeTimer);
            // Rebuilding the scroll timelines is heavy: once the drag ends
            resizeTimer = setTimeout(
              () => handleResize(renderer, camera, canvasDiv, character),
              200
            );
          };
          window.addEventListener("resize", onResize);
        }
      });

      let onResize: (() => void) | undefined;
      let resizeTimer: number | undefined;

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      // One shared handler: adding the same function again is a no-op, so
      // repeated touches don't pile up listeners
      const onTouchMove = (e: TouchEvent) =>
        handleTouchMove(e, (x, y) => (mouse = { x, y }));
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", onTouchMove, { passive: true });
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      // Only draw while the character is on screen; once it has scrolled away
      // the GPU is free for the rest of the page
      let visible = true;
      // (a sliver must actually be visible: when the character slides away it
      // stops exactly at the screen edge, which still counts as "touching")
      const observer = new IntersectionObserver(
        ([entry]) => (visible = entry.intersectionRatio > 0.005),
        { threshold: [0, 0.01, 0.1] }
      );
      observer.observe(canvasDiv.current);

      // Slow device check: time the first frames after the character
      // appears; if the machine can't keep up, render the 3D at standard
      // resolution and switch the page to its lighter effects (low-power
      // class, see index.css). Fast machines never trigger this.
      let checkFrames = 0,
        checkTime = 0,
        checkDone = false;
      const checkPerformance = (delta: number) => {
        if (checkDone || !headBone || document.hidden) return;
        // skip the first second while the intro and shaders settle
        if ((checkFrames += 1) <= 60) return;
        checkTime += delta;
        if (checkFrames < 150) return;
        checkDone = true;
        const msPerFrame = (checkTime / 90) * 1000;
        if (msPerFrame > 26) {
          renderer.setPixelRatio(1);
          document.documentElement.classList.add("low-power");
        }
      };

      let frame = 0;
      const animate = () => {
        frame = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (!visible) return;
        checkPerformance(delta);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        disposed = true;
        progress.stop();
        killCharTimeline();
        cancelAnimationFrame(frame);
        observer.disconnect();
        clearTimeout(debounce);
        clearTimeout(resizeTimer);
        scene.clear();
        renderer.dispose();
        if (onResize) window.removeEventListener("resize", onResize);
        if (canvasDiv.current?.contains(renderer.domElement)) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        document.removeEventListener("mousemove", onMouseMove);
        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
