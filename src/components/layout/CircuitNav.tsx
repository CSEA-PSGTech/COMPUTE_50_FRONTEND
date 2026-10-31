import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NavLinkItem } from '../../types/common';

interface CircuitNavProps {
  items: NavLinkItem[];
  className?: string;
  /** Smaller labels for the mobile bar. */
  compact?: boolean;
}

const TRACE_Y = 14; // trace centre line (px from top)
const JOG_RISE = 5; // height of the little PCB-style jog between nodes
const JOG_HALF = 9; // half-width of the jog's flat top

interface Trace {
  d: string;
  total: number;
  nodeX: number[];
  nodeLen: number[]; // distance along the trace at which each node sits
}

// One continuous path starting at the first node (Home) and ending at the last node (Profile/Hackathon).
// Lengths are summed while building, so the animation never has to measure the DOM.
const buildTrace = (width: number, count: number): Trace | null => {
  if (width <= 0 || count <= 0) return null;
  const slot = width / count;
  const nodeX: number[] = [];
  for (let i = 0; i < count; i++) {
    nodeX.push(slot * (i + 0.5));
  }

  // Start directly at the first node
  const pts: Array<[number, number]> = [[nodeX[0], TRACE_Y]];
  const nodePt: number[] = [0];

  for (let i = 0; i < count - 1; i++) {
    const m = slot * (i + 1);
    pts.push(
      [m - JOG_HALF - JOG_RISE, TRACE_Y],
      [m - JOG_HALF, TRACE_Y - JOG_RISE],
      [m + JOG_HALF, TRACE_Y - JOG_RISE],
      [m + JOG_HALF + JOG_RISE, TRACE_Y],
      [nodeX[i + 1], TRACE_Y],
    );
    nodePt.push(pts.length - 1);
  }

  const cumulative = [0];
  for (let i = 1; i < pts.length; i++) {
    cumulative.push(cumulative[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return {
    d: `M${pts.map((p) => `${p[0]} ${p[1]}`).join(' L')}`,
    total: cumulative[cumulative.length - 1],
    nodeX,
    nodeLen: nodePt.map((i) => cumulative[i]),
  };
};

// Slightly under-damped spring: the pulse settles with a tiny, satisfying overshoot.
const STIFFNESS = 140;
const DAMPING = 2 * Math.sqrt(STIFFNESS) * 0.88;

export const CircuitNav: React.FC<CircuitNavProps> = ({ items, className = '', compact = false }) => {
  const { pathname } = useLocation();
  const [width, setWidth] = useState(0);
  const [pingKey, setPingKey] = useState(0);

  const navRef = useRef<HTMLElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<Array<SVGCircleElement | null>>([]);
  const motion = useRef({ pos: 0, vel: 0, total: 0, raf: 0 });

  const activeIndex = items.findIndex((it) =>
    it.path === '/' ? pathname === '/' : pathname.startsWith(it.path),
  );

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry?.contentRect) {
        setWidth(Math.round(entry.contentRect.width));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const trace = useMemo(() => buildTrace(width, items.length), [width, items.length]);

  // The animation runs outside React: per frame it only touches a few SVG attributes,
  // so there are no re-renders and the pulse holds the display's full refresh rate.
  useLayoutEffect(() => {
    const base = baseRef.current;
    const lit = litRef.current;
    const head = headRef.current;
    if (!trace || !base || !lit || !head) return;

    const m = motion.current;
    if (m.total > 0 && m.total !== trace.total) m.pos *= trace.total / m.total; // keep place on resize
    m.total = trace.total;

    const target = activeIndex >= 0 ? trace.nodeLen[activeIndex] : 0;
    const from = m.pos;
    const lastLit: boolean[] = [];

    const paint = (p: number) => {
      const at = Math.min(Math.max(p, 0), trace.total);
      lit.style.strokeDasharray = `${at} ${trace.total}`;
      const pt = base.getPointAtLength(at);
      head.setAttribute('transform', `translate(${pt.x} ${pt.y})`);

      if (activeIndex < 0) {
        head.style.opacity = '0';
        lit.style.opacity = '0';
      } else {
        head.style.opacity = '1';
        lit.style.opacity = '1';
      }

      nodeRefs.current.forEach((c, i) => {
        if (!c) return;
        const on = activeIndex >= 0 && at >= trace.nodeLen[i] - 0.5;
        if (lastLit[i] === on) return;
        lastLit[i] = on;
        c.style.fill = on ? 'var(--accent)' : 'var(--bg-main)';
        c.style.stroke = on ? 'var(--accent)' : 'var(--text-secondary)';
      });
    };

    cancelAnimationFrame(m.raf);
    paint(m.pos);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      m.pos = target;
      m.vel = 0;
      paint(target);
      return;
    }

    let last = 0;
    const step = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 1 / 30) : 1 / 60;
      last = t;
      m.vel += (STIFFNESS * (target - m.pos) - DAMPING * m.vel) * dt;
      m.pos += m.vel * dt;
      if (Math.abs(target - m.pos) < 0.15 && Math.abs(m.vel) < 0.5) {
        m.pos = target;
        m.vel = 0;
        paint(target);
        if (activeIndex >= 0 && Math.abs(target - from) > 1) setPingKey((k) => k + 1);
        return;
      }
      paint(m.pos);
      m.raf = requestAnimationFrame(step);
    };
    m.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(m.raf);
  }, [trace, activeIndex]);

  useEffect(() => () => cancelAnimationFrame(motion.current.raf), []);

  return (
    <nav ref={navRef} aria-label="Primary" className={`relative h-14 ${className}`}>
      {trace && (
        <svg
          aria-hidden="true"
          width={width}
          height={TRACE_Y * 2}
          viewBox={`0 0 ${width} ${TRACE_Y * 2}`}
          className="absolute left-0 top-0 overflow-visible pointer-events-none"
        >
          <path ref={baseRef} d={trace.d} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--border-color)' }} />
          <path ref={litRef} d={trace.d} fill="none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--accent)', strokeDasharray: `0 ${trace.total}` }} />
          {trace.nodeX.map((x, i) => (
            <circle
              key={i}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              cx={x}
              cy={TRACE_Y}
              r={3.5}
              strokeWidth={1.5}
              style={{ fill: 'var(--bg-main)', stroke: 'var(--text-secondary)' }}
            />
          ))}
          {pingKey > 0 && activeIndex >= 0 && (
            <circle key={pingKey} className="circuit-ping" cx={trace.nodeX[activeIndex]} cy={TRACE_Y} r={5} />
          )}
          <g ref={headRef}>
            <circle r={9} style={{ fill: 'var(--accent)' }} opacity={0.18} />
            <circle r={4.5} style={{ fill: 'var(--accent)' }} />
          </g>
        </svg>
      )}

      <ul className="absolute inset-0 m-0 flex list-none p-0">
        {items.map((item, i) => {
          const active = i === activeIndex;
          return (
            <li key={item.path} className="relative flex-1">
              <Link
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className="group absolute inset-0 flex items-end justify-center rounded-lg pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-[5px] h-[18px] w-[18px] -translate-x-1/2 scale-50 rounded-full border border-[var(--accent)]/60 opacity-0 transition duration-200 group-hover:scale-100 group-hover:opacity-100"
                />
                <span
                  className={`transition-colors ${compact ? 'text-[11px] font-semibold tracking-wide' : 'text-[13px] font-medium'} ${
                    active ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

