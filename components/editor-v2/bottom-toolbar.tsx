"use client";

import React from "react";
import { ZoomIn, ZoomOut, Ruler, Grid3x3, Magnet, Monitor } from "lucide-react";
import { useEditorStore } from "@/stores/editor-v2/store";

export function BottomToolbar() {
  const {
    zoom,
    setZoom,
    showRulers,
    toggleRulers,
    showGrid,
    toggleGrid,
    snapToGrid,
    toggleSnapToGrid,
    snapToElements,
    toggleSnapToElements,
  } = useEditorStore();

  return (
    <div className="h-12 border-t border-[oklch(0.9200_0.005_20)] bg-white/90 backdrop-blur-sm flex items-center justify-between px-4 gap-4 opacity-50 hover:opacity-100 transition-opacity">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        {/* Zoom Controls */}
        <button
          onClick={() => setZoom(Math.max(25, zoom - 25))}
          className="p-1.5 text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)] rounded transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <div className="px-3 py-1 text-xs font-medium text-[oklch(0.2200_0.015_20)] bg-[oklch(0.9600_0.008_30)] rounded min-w-[4rem] text-center">
          {zoom}%
        </div>
        <button
          onClick={() => setZoom(Math.min(200, zoom + 25))}
          className="p-1.5 text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)] rounded transition-all"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {/* Center Section - Toggles */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleRulers}
          className={`p-2 rounded transition-all ${
            showRulers
              ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
              : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)]"
          }`}
          title="Toggle Rulers"
        >
          <Ruler className="h-4 w-4" />
        </button>
        <button
          onClick={toggleGrid}
          className={`p-2 rounded transition-all ${
            showGrid
              ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
              : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)]"
          }`}
          title="Toggle Grid"
        >
          <Grid3x3 className="h-4 w-4" />
        </button>
        <button
          onClick={toggleSnapToGrid}
          className={`p-2 rounded transition-all ${
            snapToGrid
              ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
              : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)]"
          }`}
          title="Snap to Grid"
        >
          <Magnet className="h-4 w-4" />
        </button>
        <button
          onClick={toggleSnapToElements}
          className={`p-2 rounded transition-all ${
            snapToElements
              ? "bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
              : "text-[oklch(0.5200_0.015_25)] hover:text-[oklch(0.2200_0.015_20)] hover:bg-[oklch(0.9600_0.008_30)]"
          }`}
          title="Snap to Elements"
        >
          <Magnet className="h-4 w-4" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 text-xs text-[oklch(0.5200_0.015_25)]">
        <Monitor className="h-4 w-4" />
        <span>1440 × 1024</span>
      </div>
    </div>
  );
}





