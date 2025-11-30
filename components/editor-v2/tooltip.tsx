"use client";

import React, { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ children, content, side = "bottom" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs font-medium text-white bg-[oklch(0.2200_0.015_20)] rounded shadow-lg whitespace-nowrap pointer-events-none ${sideClasses[side]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-[oklch(0.2200_0.015_20)] rotate-45 ${
              side === "top"
                ? "top-full left-1/2 -translate-x-1/2 -mt-1"
                : side === "bottom"
                ? "bottom-full left-1/2 -translate-x-1/2 -mb-1"
                : side === "left"
                ? "left-full top-1/2 -translate-y-1/2 -ml-1"
                : "right-full top-1/2 -translate-y-1/2 -mr-1"
            }`}
          />
        </div>
      )}
    </div>
  );
}

