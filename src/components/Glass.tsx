import { PointerEvent, PropsWithChildren, ReactNode } from "react";
import "./styles/Glass.css";

type GlassCardProps = PropsWithChildren<{
  className?: string;
  as?: "div" | "article" | "li";
}>;

// Moves the specular highlight to follow the pointer.
const trackLight = (e: PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

export const GlassCard = ({
  className = "",
  as: Tag = "div",
  children,
}: GlassCardProps) => {
  return (
    <Tag className={`glass ${className}`} onPointerMove={trackLight}>
      {children}
    </Tag>
  );
};

type GlassSectionProps = PropsWithChildren<{
  id: string;
  title: ReactNode;
  subtitle?: string;
  className?: string;
}>;

export const GlassSection = ({
  id,
  title,
  subtitle,
  className = "",
  children,
}: GlassSectionProps) => {
  return (
    <section className={`glass-section ${className}`} id={id}>
      <div className="glass-orb glass-orb-1"></div>
      <div className="glass-orb glass-orb-2"></div>
      <div className="glass-section-in section-container">
        <div className="glass-section-head">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
};

export const GlassImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="glass-image">
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span>Add image</span>}
    </div>
  );
};
