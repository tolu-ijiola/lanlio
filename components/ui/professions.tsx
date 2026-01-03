"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const ProfessionalsCard = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: {
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "150s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "200s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "280s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  overflow-hidden bg-primary/10 text-primary-foreground [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] transform -skew-y-1",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative w-fit max-w-full rounded-full shrink-0 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-4 py-1.5 dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
            key={`${item.title}-${idx}`}
          >
            <blockquote className=" text-primary text-sm">
            {item.title}
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
