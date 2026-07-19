"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export interface PillNavItem {
  id: string;
  label: string;
  count?: number;
}

export interface PillNavProps {
  items: PillNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  activePillBg?: string;
  activePillText?: string;
  initialLoadAnimation?: boolean;
}

export function PillNav({
  items,
  activeId,
  onSelect,
  className = "",
  ease = "power3.out",
  baseColor = "#141517",
  pillColor = "#1b1c1f",
  hoveredPillTextColor = "#08090a",
  pillTextColor = "#fafafa",
  activePillBg = "#e5a100",
  activePillText = "#08090a",
  initialLoadAnimation = false,
}: PillNavProps) {
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
  const navItemsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (w === 0 || h === 0) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const hoverLabel = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (initialLoadAnimation && navItemsRef.current) {
      gsap.set(navItemsRef.current, { opacity: 0, y: -5 });
      gsap.to(navItemsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease,
      });
    }

    return () => window.removeEventListener("resize", onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const cssVars = {
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": pillTextColor,
    "--nav-h": "38px",
    "--pill-pad-x": "16px",
    "--pill-gap": "4px",
  } as React.CSSProperties;

  return (
    <div className={`w-full overflow-x-auto no-scrollbar py-1 ${className}`}>
      <nav
        className="w-max flex items-center box-border"
        aria-label="Category Navigation"
        style={cssVars}
      >
        <div
          ref={navItemsRef}
          className="relative flex items-center rounded-full p-[3px]"
          style={{
            height: "var(--nav-h)",
            background: baseColor,
            border: "1px solid var(--color-hairline, #232428)",
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-0 h-full"
            style={{ gap: "var(--pill-gap)" }}
          >
            {items.map((item, i) => {
              const isActive = activeId === item.id;

              const pillStyle: React.CSSProperties = {
                background: isActive ? activePillBg : "var(--pill-bg)",
                color: isActive ? activePillText : "var(--pill-text)",
                paddingLeft: "var(--pill-pad-x)",
                paddingRight: "var(--pill-pad-x)",
              };

              const hoverCircleBg = isActive ? "#cfa00e" : activePillBg;
              const hoverTextColor = activePillText;

              return (
                <li key={item.id} role="none" className="flex h-full">
                  <button
                    type="button"
                    role="menuitem"
                    aria-selected={isActive}
                    onClick={() => onSelect(item.id)}
                    className="relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-medium text-[13px] whitespace-nowrap cursor-pointer transition-all duration-200"
                    style={pillStyle}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    <span
                      className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                      style={{
                        background: hoverCircleBg,
                        willChange: "transform",
                      }}
                      aria-hidden="true"
                      ref={(el) => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    <span className="label-stack relative inline-flex items-center gap-1.5 z-[2]">
                      <span
                        className="pill-label relative z-[2] inline-block leading-none"
                        style={{ willChange: "transform" }}
                      >
                        {item.label}
                        {item.count !== undefined && (
                          <span className="ml-1.5 text-[11px] opacity-70 font-mono">
                            ({item.count})
                          </span>
                        )}
                      </span>
                      <span
                        className="pill-label-hover absolute left-0 top-0 z-[3] inline-block leading-none"
                        style={{
                          color: hoverTextColor,
                          willChange: "transform, opacity",
                        }}
                        aria-hidden="true"
                      >
                        {item.label}
                        {item.count !== undefined && (
                          <span className="ml-1.5 text-[11px] opacity-70 font-mono">
                            ({item.count})
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default PillNav;
