import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ProjectAnatomy as Anatomy } from "../data/portfolioContent";
import "./styles/ProjectAnatomy.css";

// Below this width there's no room for labels on both sides, so the parts
// become numbered dots with a list underneath
const COMPACT_BELOW = 760;
// Widest the photo gets, as a share of the row, and its tallest
const IMAGE_SHARE = 0.46;
const IMAGE_MAX_HEIGHT = 470;
// Space between the labels and the photo, and between stacked labels
const GUTTER = 36;
const STACK_GAP = 10;
// Half the height of a label's first line, where its leader line meets it
// (.anatomy-name's line-height)
const NAME_MID = 10;

type Item = { top: number; width: number; left: number; path: string; px: number; py: number };
type Geometry = {
  width: number;
  height: number;
  image: { left: number; top: number; width: number; height: number };
  items: Item[];
};

const ProjectAnatomy = ({
  anatomy,
  image,
  title,
}: {
  anatomy: Anatomy;
  image: string;
  title: string;
}) => {
  const stage = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const labelEls = useRef<(HTMLLIElement | null)[]>([]);
  const lastWidth = useRef(0);
  const [compact, setCompact] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const labels = anatomy.labels.map((label) => ({
    ...label,
    side: label.side === "left" || label.side === "right"
      ? label.side
      : label.x < 50
        ? "left"
        : "right",
  }));
  // Parts appear top to bottom, whichever side they're on
  const rank = labels
    .map((label, i) => ({ y: label.y, i }))
    .sort((a, b) => a.y - b.y)
    .reduce<number[]>((acc, { i }, order) => {
      acc[i] = order;
      return acc;
    }, []);

  const layOut = useCallback(
    (force = false) => {
      const box = stage.current;
      const img = photo.current;
      if (!box || !img || !img.naturalWidth) return;
      const W = box.clientWidth;
      if (!force && W === lastWidth.current) return;
      lastWidth.current = W;

      const isCompact = W < COMPACT_BELOW;
      setCompact(isCompact);
      if (isCompact) return;

      const aspect = img.naturalWidth / img.naturalHeight;
      const w = Math.min(W * IMAGE_SHARE, IMAGE_MAX_HEIGHT * aspect);
      const h = w / aspect;
      const imgLeft = (W - w) / 2;
      const colW = imgLeft - GUTTER;

      // Each label's height at its column's width, measured before placing
      const heights = labels.map((_, i) => {
        const el = labelEls.current[i];
        if (!el) return 44;
        el.style.width = `${colW}px`;
        return el.offsetHeight;
      });

      // Stack each side's labels near their parts without overlapping
      const tops: number[] = [];
      for (const side of ["left", "right"]) {
        let floor = 0;
        labels
          .map((label, i) => ({ label, i }))
          .filter(({ label }) => label.side === side)
          .sort((a, b) => a.label.y - b.label.y)
          .forEach(({ label, i }) => {
            const want = (label.y / 100) * h - NAME_MID;
            const top = Math.max(want, floor);
            tops[i] = top;
            floor = top + heights[i] + STACK_GAP;
          });
      }

      const items = labels.map((label, i) => {
        const px = imgLeft + (label.x / 100) * w;
        const py = (label.y / 100) * h;
        const ly = tops[i] + NAME_MID;
        const isLeft = label.side === "left";
        // From the part, a 45° run to the label's height, then straight across
        const start = isLeft ? imgLeft - GUTTER + 10 : imgLeft + w + GUTTER - 10;
        const dy = Math.abs(ly - py);
        const elbow = isLeft
          ? Math.max(start, px - dy)
          : Math.min(start, px + dy);
        return {
          top: tops[i],
          width: colW,
          left: isLeft ? 0 : imgLeft + w + GUTTER,
          path: `M${px} ${py} L${elbow} ${ly} L${start} ${ly}`,
          px,
          py,
        };
      });

      const height = Math.max(h, ...items.map((item, i) => item.top + heights[i]));
      setGeo({ width: W, height, image: { left: imgLeft, top: 0, width: w, height: h }, items });
    },
    // The labels only change with the project
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [anatomy]
  );

  // Lay out again whenever the row changes width
  useLayoutEffect(() => {
    const box = stage.current;
    if (!box) return;
    const observer = new ResizeObserver(() => layOut());
    observer.observe(box);
    return () => observer.disconnect();
  }, [layOut]);

  // ...once the photo has loaded, after switching modes, and once the
  // fonts are in (they change how tall the labels are)
  useLayoutEffect(() => {
    if (loaded) layOut(true);
  }, [loaded, compact, layOut]);
  useEffect(() => {
    document.fonts?.ready.then(() => layOut(true));
  }, [layOut]);

  // A cached photo can finish loading before React attaches onLoad
  useEffect(() => {
    if (photo.current?.complete && photo.current.naturalWidth) setLoaded(true);
  }, []);

  // Play the reveal the first time the figure scrolls into view
  useEffect(() => {
    const box = stage.current;
    if (!box) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const ready = loaded && (compact || geo !== null);
  const classes = [
    "anatomy",
    compact ? "is-compact" : "is-wide",
    ready && inView ? "is-shown" : "",
    active !== null ? "has-active" : "",
  ].join(" ");

  const delay = (i: number) => ({ "--d": `${0.8 + rank[i] * 0.14}s` }) as React.CSSProperties;

  return (
    <section className="project-page-section anatomy-section">
      <div
        ref={stage}
        className={classes}
        style={!compact && geo ? { height: geo.height } : undefined}
      >
        <div
          className="anatomy-photo"
          style={
            !compact && geo
              ? {
                  position: "absolute",
                  left: geo.image.left,
                  top: geo.image.top,
                  width: geo.image.width,
                  height: geo.image.height,
                }
              : undefined
          }
        >
          <img
            ref={photo}
            src={image}
            alt={`${title}, with its main parts labelled`}
            onLoad={() => setLoaded(true)}
          />
          {compact &&
            labels.map((label, i) => (
              <span
                className={`anatomy-badge${active === i ? " is-active" : ""}`}
                style={{ left: `${label.x}%`, top: `${label.y}%`, ...delay(i) }}
                key={i}
                aria-hidden="true"
              >
                {i + 1}
              </span>
            ))}
        </div>

        {!compact && (
          <svg
            className="anatomy-lines"
            width={geo?.width ?? 0}
            height={geo?.height ?? 0}
            aria-hidden="true"
          >
            {geo?.items.map((item, i) => (
              <g
                className={active === i ? "anatomy-part is-active" : "anatomy-part"}
                style={delay(i)}
                key={i}
              >
                <path d={item.path} pathLength={1} />
                <circle className="anatomy-ring" cx={item.px} cy={item.py} r={5} />
                <circle className="anatomy-dot" cx={item.px} cy={item.py} r={4.5} />
                <circle
                  className="anatomy-hit"
                  cx={item.px}
                  cy={item.py}
                  r={14}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                />
              </g>
            ))}
          </svg>
        )}

        <ul className="anatomy-labels">
          {labels.map((label, i) => {
            const item = geo?.items[i];
            return (
              <li
                ref={(el) => {
                  labelEls.current[i] = el;
                }}
                className={[
                  "anatomy-label",
                  `on-${label.side}`,
                  active === i ? "is-active" : "",
                ].join(" ")}
                style={{
                  ...delay(i),
                  ...(!compact && item
                    ? { top: item.top, left: item.left, width: item.width }
                    : {}),
                }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                key={i}
              >
                {compact && <span className="anatomy-num">{i + 1}</span>}
                <span className="anatomy-text">
                  <strong className="anatomy-name">{label.name}</strong>
                  {label.note && <span className="anatomy-note">{label.note}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ProjectAnatomy;
