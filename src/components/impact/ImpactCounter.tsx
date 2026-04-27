"use client";

import { useEffect, useRef, useState } from "react";

interface ImpactCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  label: string;
  icon: string;
  color: string;
}

export default function ImpactCounter({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  duration = 2200,
  label,
  icon,
  color,
}: ImpactCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * end;
            setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, decimals]);

  return (
    <div
      ref={ref}
      className={`${color} rounded-3xl p-6 sm:p-8 border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500`}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <p className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
        {prefix}{count.toLocaleString("id-ID")}{suffix}
      </p>
      <p className="text-xs sm:text-sm font-medium text-muted uppercase tracking-wider mt-2">
        {label}
      </p>
    </div>
  );
}
