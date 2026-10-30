import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>((resolve, reject) => {
      loader.load(
        "/models/character.glb",
        async (gltf) => {
          try {
            const character = gltf.scene;
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.frustumCulled = true;
                // See-through parts (glasses lens, stubble): draw after the
                // solid meshes without hiding what's behind them, and nudge
                // them forward so they don't flicker against the skin
                const { material } = child;
                if (
                  !Array.isArray(material) &&
                  material.transparent &&
                  material.opacity < 1
                ) {
                  material.depthWrite = false;
                  material.polygonOffset = true;
                  material.polygonOffsetFactor = -1;
                  material.polygonOffsetUnits = -1;
                  child.renderOrder = 1;
                  child.castShadow = false;
                }
              }
            });
            character.getObjectByName("footR")!.position.y = 3.36;
            character.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
            resolve(gltf);
          } catch (error) {
            console.error("Error preparing GLTF model:", error);
            reject(error);
          }
        },
        undefined,
        (error) => {
          console.error("Error loading GLTF model:", error);
          reject(error);
        }
      );
    });
  };

  return { loadCharacter };
};

export default setCharacter;
