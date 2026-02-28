"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import "./chroma-grid.css";
import type { Project } from "@/lib/data";

interface ChromaGridProps {
  projects: Project[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  limit?: number;
}

export function ChromaGrid({
  projects,
  className = "",
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  limit,
}: ChromaGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<((value: number) => void) | null>(null);
  const setY = useRef<((value: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const getCategoryColor = (category: string): { border: string; gradient: string } => {
    const colorMap: Record<string, { border: string; gradient: string }> = {
      AI: {
        border: "#FF6B35",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(255, 107, 53, 0.3) 100%)",
      },
      Consumer: {
        border: "#EC4899",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(236, 72, 153, 0.3) 100%)",
      },
      DeFi: {
        border: "#0052FF",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(0, 82, 255, 0.3) 100%)",
      },
      Gaming: {
        border: "#F59E0B",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(245, 158, 11, 0.3) 100%)",
      },
      Infra: {
        border: "#06B6D4",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(6, 182, 212, 0.3) 100%)",
      },
      "Mini-apps": {
        border: "#8B5CF6",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(139, 92, 246, 0.3) 100%)",
      },
      NFT: {
        border: "#A855F7",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(168, 85, 247, 0.3) 100%)",
      },
      DAO: {
        border: "#D946EF",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(217, 70, 239, 0.3) 100%)",
      },
      Identity: {
        border: "#0EA5E9",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(14, 165, 233, 0.3) 100%)",
      },
      Social: {
        border: "#10B981",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.3) 100%)",
      },
      Payments: {
        border: "#14B8A6",
        gradient: "linear-gradient(180deg, transparent 0%, rgba(20, 184, 166, 0.3) 100%)",
      },
    };
    return colorMap[category] || { border: "#0052FF", gradient: "linear-gradient(180deg, transparent 0%, rgba(0, 82, 255, 0.3) 100%)" };
  };

  const items = (limit ? projects.slice(0, limit) : projects).map((p) => {
    const colors = getCategoryColor(p.category);
    return {
      image: (p.logo.startsWith("http") || p.logo.startsWith("/")) ? p.logo : `https://avatar.vercel.sh/${p.id}?size=300`,
      title: p.name,
      subtitle: p.category,
      handle: `@${p.founderTwitterHandle || p.founderTwitter}`,
      location: p.batch,
      borderColor: colors.border,
      gradient: colors.gradient,
      url: p.url,
    };
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as (value: number) => void;
    setY.current = gsap.quickSetter(el, "--y", "px") as (value: number) => void;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true,
    });
  };

  const handleCardClick = (url: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--rows": rows,
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={
            {
              "--card-border": c.borderColor || "transparent",
              "--card-gradient": c.gradient,
              cursor: c.url ? "pointer" : "default",
            } as React.CSSProperties
          }
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
}
