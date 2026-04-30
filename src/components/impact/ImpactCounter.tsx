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
            
            if (progress < 1) {
              setCount(current);
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  const displayValue = decimals > 0 
    ? count.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.floor(count).toLocaleString("id-ID");

  return (
    <div
      ref={ref}
      className={`${color} rounded-3xl p-6 border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between h-full`}
    >
      <div>
        <div className="text-3xl mb-3">{icon}</div>
        <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight flex items-baseline gap-1 whitespace-nowrap truncate">
          {prefix}{displayValue}{suffix && <span className="text-lg font-medium text-muted">{suffix.trim()}</span>}
        </p>
      </div>
      <p className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-[2px] mt-4 leading-relaxed">
        {label}
      </p>
    </div>
  );
}
