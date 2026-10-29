import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import "../components/styles/IntroVeil.css";

interface LoadingType {
  isLoading: boolean;
  // Lifts the veil and plays the page's intro; called once the fonts are in
  finishLoading: () => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

// Settles when the page is revealed. The 3D character loads on its own and
// waits for this before fading in, so its intro is never played unseen
let reveal: () => void = () => {};
export const revealed = new Promise<void>((resolve) => (reveal = resolve));

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const started = useRef(false);

  // A brief veil only hides the page until its fonts are ready, so the
  // text never flashes unstyled; nothing waits for the 3D model
  const finishLoading = useCallback(() => {
    if (started.current) return;
    started.current = true;
    import("../components/utils/initialFX").then((module) => {
      module.initialFX?.();
      setLeaving(true);
      reveal();
      setTimeout(() => setIsLoading(false), 500);
    });
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, finishLoading }}>
      {isLoading && (
        <div className={`intro-veil ${leaving ? "intro-veil-out" : ""}`}>
          <span>Abrar Abir</span>
        </div>
      )}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
