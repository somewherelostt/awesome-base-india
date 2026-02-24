"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { founders, type Founder } from "@/lib/data";

function FounderNode({
  founder,
  x,
  y,
  delay,
}: {
  founder: Founder;
  x: number;
  y: number;
  delay: number;
}) {
  return (
    <motion.a
      href={`https://x.com/${founder.twitter}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group absolute flex flex-col items-center gap-2"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.15 }}
    >
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent/30 bg-accent/10 text-sm font-bold text-accent transition-all group-hover:border-accent group-hover:bg-accent group-hover:text-white sm:h-16 sm:w-16">
          {founder.avatar}
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-background">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      </div>
      <div className="pointer-events-none text-center opacity-0 transition-opacity group-hover:opacity-100">
        <p className="whitespace-nowrap text-xs font-semibold text-foreground">{founder.name}</p>
        <p className="whitespace-nowrap text-xs text-muted-foreground">{founder.project}</p>
      </div>
    </motion.a>
  );
}

export function FoundersCircle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, 700);
        setDimensions({ width: size, height: size });
      }
    }
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;
  const outerRadius = Math.min(dimensions.width, dimensions.height) * 0.42;
  const innerRadius = outerRadius * 0.55;

  const outerFounders = founders.slice(0, 8);
  const innerFounders = founders.slice(8);

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-[700px]" style={{ height: dimensions.height }}>
      <svg
        className="pointer-events-none absolute inset-0"
        width={dimensions.width}
        height={dimensions.height}
      >
        <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke="currentColor" strokeWidth="1" className="text-border" strokeDasharray="4 4" />
        <circle cx={cx} cy={cy} r={innerRadius} fill="none" stroke="currentColor" strokeWidth="1" className="text-border" strokeDasharray="4 4" />
      </svg>

      <motion.div
        className="absolute flex flex-col items-center justify-center rounded-full bg-accent text-white"
        style={{
          left: cx,
          top: cy,
          transform: "translate(-50%, -50%)",
          width: innerRadius * 0.7,
          height: innerRadius * 0.7,
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg width="28" height="28" viewBox="0 0 111 111" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H0C2.35281 87.8625 26.0432 110.034 54.921 110.034Z"
            fill="currentColor"
          />
        </svg>
        <span className="mt-1 text-xs font-semibold">India</span>
      </motion.div>

      {outerFounders.map((founder, i) => {
        const angle = (2 * Math.PI * i) / outerFounders.length - Math.PI / 2;
        const x = cx + outerRadius * Math.cos(angle);
        const y = cy + outerRadius * Math.sin(angle);
        return (
          <FounderNode
            key={founder.id}
            founder={founder}
            x={x}
            y={y}
            delay={0.3 + i * 0.08}
          />
        );
      })}

      {innerFounders.map((founder, i) => {
        const angle = (2 * Math.PI * i) / innerFounders.length - Math.PI / 2;
        const x = cx + innerRadius * Math.cos(angle);
        const y = cy + innerRadius * Math.sin(angle);
        return (
          <FounderNode
            key={founder.id}
            founder={founder}
            x={x}
            y={y}
            delay={0.5 + i * 0.08}
          />
        );
      })}
    </div>
  );
}

function FounderCard({ founder }: { founder: Founder }) {
  return (
    <motion.a
      href={`https://x.com/${founder.twitter}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-border bg-background p-4 transition-all hover:border-accent/30 hover:shadow-md"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent transition-colors group-hover:bg-accent group-hover:text-white">
        {founder.avatar}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{founder.name}</p>
        <p className="truncate text-sm text-muted-foreground">{founder.project} &middot; {founder.role}</p>
      </div>
      <div className="shrink-0 text-muted-foreground transition-colors group-hover:text-accent">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    </motion.a>
  );
}

export function FoundersList() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {founders.map((founder) => (
        <FounderCard key={founder.id} founder={founder} />
      ))}
    </div>
  );
}
