"use client";

import React from "react";
import { ComponentData } from "@/lib/editor-state";

interface LayoutContainerProps {
  data: ComponentData;
  children?: React.ReactNode;
  isPreviewMode: boolean;
  onUpdate: (data: ComponentData) => void;
}

// Single Column Layout
export function SingleColumnLayout({ data, children, isPreviewMode }: LayoutContainerProps) {
  const styles = (data as any).styles || {};
  return (
    <div
      className="w-full"
      style={{
        padding: styles.padding || "0",
        margin: styles.margin || "0",
        backgroundColor: styles.backgroundColor || "transparent",
        ...styles,
      }}
    >
      {children || (
        <div className="min-h-[200px] border-2 border-dashed border-[oklch(0.9200_0.005_20)] rounded-lg flex items-center justify-center text-sm text-[oklch(0.5200_0.015_25)]">
          Drop components here
        </div>
      )}
    </div>
  );
}

// Double Column Layout
export function DoubleColumnLayout({ data, children, isPreviewMode }: LayoutContainerProps) {
  const styles = (data as any).styles || {};
  const direction = (data as any).direction || "horizontal";
  const gap = styles.gap || "1rem";

  return (
    <div
      className={`w-full ${direction === "horizontal" ? "flex flex-row" : "flex flex-col"}`}
      style={{
        padding: styles.padding || "0",
        margin: styles.margin || "0",
        backgroundColor: styles.backgroundColor || "transparent",
        gap: gap,
        ...styles,
      }}
    >
      <div className="flex-1 min-h-[200px] border-2 border-dashed border-[oklch(0.9200_0.005_20)] rounded-lg flex items-center justify-center text-sm text-[oklch(0.5200_0.015_25)]">
        Column 1
      </div>
      <div className="flex-1 min-h-[200px] border-2 border-dashed border-[oklch(0.9200_0.005_20)] rounded-lg flex items-center justify-center text-sm text-[oklch(0.5200_0.015_25)]">
        Column 2
      </div>
      {children}
    </div>
  );
}

// Four Column Layout
export function FourColumnLayout({ data, children, isPreviewMode }: LayoutContainerProps) {
  const styles = (data as any).styles || {};
  const direction = (data as any).direction || "horizontal";
  const gap = styles.gap || "1rem";

  return (
    <div
      className={`w-full ${direction === "horizontal" ? "flex flex-row" : "flex flex-col"}`}
      style={{
        padding: styles.padding || "0",
        margin: styles.margin || "0",
        backgroundColor: styles.backgroundColor || "transparent",
        gap: gap,
        ...styles,
      }}
    >
      {[1, 2, 3, 4].map((col) => (
        <div
          key={col}
          className="flex-1 min-h-[200px] border-2 border-dashed border-[oklch(0.9200_0.005_20)] rounded-lg flex items-center justify-center text-sm text-[oklch(0.5200_0.015_25)]"
        >
          Column {col}
        </div>
      ))}
      {children}
    </div>
  );
}





