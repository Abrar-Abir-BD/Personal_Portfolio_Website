import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter, { disposeModel } from "./utils/character";
import setLighting from "./utils/lighting";
import { revealed } from "../../context/LoadingProvider";
import { isAway } from "../../router";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { killCharTimeline, setCharTimeline } from "../utils/GsapScroll";
import { prefersReducedMotion } from "../utils/reducedMotion";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasDiv.current) {
      const rect = canvasDiv.current.getBoundingClientRect();
      const container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      // A fresh scene per run. React runs this effect twice in development;
      // with a shared scene, the first run's model (loaded after that run
      // was cleaned up) stayed in it as a second, frozen character
      const scene = new THREE.Scene();
      let disposed = false;
      // Reduced motion: the character holds the intro's final pose, with no
      // idle loops or head tracking (scrolling still moves it, as you scroll)
      const still = prefersReducedMotion();

      // No 3D (no WebGL, or the model failed to load): the page carries on
      // without the character. The "What I do" cards normally wait for its
      // scroll timeline to show them
      const showPageWithoutCharacter = () => {
        const container = canvasDiv.current?.parentElement;
        if (container) container.style.display = "none";
        document
          .querySelector<HTMLElement>(".what-box-in")
          ?.style.setProperty("display", "flex");
      };

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });
      } catch (error) {
        console.error("WebGL is not available:", error);
        showPageWithoutCharacter();
        return;
      }
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
      let screenLight: THREE.Object3D | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter()
        .then((gltf) => {
        // Finished loading after this run was cleaned up
        if (gltf && disposed) disposeModel(gltf.scene);
        if (gltf && !disposed) {
          setCharTimeline(gltf.scene, camera);
          const animations = setAnimations(gltf);
          if (hoverDivRef.current) {
            animations.hover(gltf, hoverDivRef.current);
          }
          mixer = animations.mixer;
          const character = gltf.scene;
          scene.add(character);
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          // Loaded in the background; its intro (rising out of the dark as
          // the lights come up) waits until the page is showing
          revealed.then(() => {
            if (disposed) return;
            pageShowing = true;
            light.turnOnLights();
            animations.startIntro();
            if (still) {
              const intro = gltf.animations.find(
                (clip) => clip.name === "introAnimation"
              );
              mixer.update(intro?.duration ?? 0);
            }
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
      })
        .catch((error) => {
          if (!disposed) {
            console.error("Failed to load character:", error);
            showPageWithoutCharacter();
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

      // Slow device check: time the first frames after the page is revealed;
      // if the machine can't keep up, render the 3D at standard resolution
      // and switch the page to its lighter effects (low-power class, see
      // index.css). Fast machines never trigger this.
      let pageShowing = false,
        checkFrames = 0,
        checkDone = false;
      const frameTimes: number[] = [];
      const checkPerformance = (delta: number) => {
        if (checkDone || !pageShowing || document.hidden) return;
        // skip the first second while the intro and shaders settle
        if ((checkFrames += 1) <= 60) return;
        frameTimes.push(delta);
        if (frameTimes.length < 90) return;
        checkDone = true;
        // The typical frame, not the average: a few long startup hitches on
        // an otherwise smooth machine pushed the average over the limit
        frameTimes.sort((a, b) => a - b);
        const msPerFrame = frameTimes[45] * 1000;
        if (msPerFrame > 26) {
          renderer.setPixelRatio(1);
          document.documentElement.classList.add("low-power");
        }
      };

      let frame = 0;
      const animate = () => {
        frame = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        // Nothing to draw while another page covers the portfolio
        if (!visible || isAway()) return;
        checkPerformance(delta);
        if (headBone) {
          if (!still)
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
        if (mixer && !still) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        disposed = true;
        killCharTimeline();
        cancelAnimationFrame(frame);
        observer.disconnect();
        clearTimeout(debounce);
        clearTimeout(resizeTimer);
        disposeModel(scene);
        scene.environment?.dispose();
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
