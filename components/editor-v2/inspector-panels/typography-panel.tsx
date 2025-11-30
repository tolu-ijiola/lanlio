"use client";

import React from "react";
import { ComponentData } from "@/lib/editor-state";
import { useEditorStore } from "@/stores/editor-v2/store";
import { AlignLeft, AlignCenter, AlignRight, Type, Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { Tooltip } from "../tooltip";

export function TypographyPanel({ component }: { component: ComponentData }) {
  const { updateComponent, designPalette, setDesignPalette } = useEditorStore();

  if (component.type !== "header" && component.type !== "text" && component.type !== "profile") {
    return (
      <div className="text-sm text-[oklch(0.5200_0.015_25)]">
        Typography settings not available for this component type.
      </div>
    );
  }

  const isHeader = component.type === "header";
  const headerLevel = (component as any).headerLevel || "h2";
  const fontSize = (component as any).fontSize || (isHeader ? "2rem" : "1rem");
  const fontWeight = (component as any).fontWeight || (isHeader ? "700" : "400");

  return (
    <div className="space-y-4">
      {/* Header-specific settings - Separated Section */}
      {isHeader && (
        <>
          <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
                Header Settings
              </h3>
              <span className="text-xs text-[oklch(0.5200_0.015_25)] bg-[oklch(0.9600_0.008_30)] px-2 py-0.5 rounded">
                Header Only
              </span>
            </div>
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Heading Tag</label>
              <select
              value={headerLevel}
              onChange={(e) =>
                updateComponent(component.id, { ...component, headerLevel: e.target.value } as any)
              }
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            >
              <option value="h1">H1 - Largest</option>
              <option value="h2">H2 - Large</option>
              <option value="h3">H3 - Medium</option>
              <option value="h4">H4 - Small</option>
              <option value="h5">H5 - Smaller</option>
              <option value="h6">H6 - Smallest</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Size Preset</label>
            <div className="grid grid-cols-3 gap-2">
              {["1.5rem", "2rem", "2.5rem", "3rem", "3.5rem", "4rem"].map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    updateComponent(component.id, { ...component, fontSize: size } as any)
                  }
                  className={`px-2 py-1.5 text-xs border rounded transition-colors ${
                    fontSize === size
                      ? "border-[oklch(0.6500_0.22_25)] bg-[oklch(0.6500_0.22_25)]/10 text-[oklch(0.6500_0.22_25)]"
                      : "border-[oklch(0.9200_0.005_20)] hover:border-[oklch(0.6500_0.22_25)]/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            </div>
          </div>
          
          {/* Divider between header and general typography */}
          <div className="border-t border-[oklch(0.9200_0.005_20)] my-4"></div>
        </>
      )}

      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
          Font
        </h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Family</label>
            <select
              value={designPalette.fontFamily}
              onChange={(e) =>
                setDesignPalette({ ...designPalette, fontFamily: e.target.value })
              }
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            >
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Size</label>
            <input
              type="text"
              value={fontSize}
              onChange={(e) =>
                updateComponent(component.id, { ...component, fontSize: e.target.value } as any)
              }
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
              placeholder={isHeader ? "2rem" : "16px"}
            />
          </div>
          <div>
            <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Weight</label>
            <select
              value={fontWeight}
              onChange={(e) =>
                updateComponent(component.id, { ...component, fontWeight: e.target.value } as any)
              }
              className="w-full px-2 py-1.5 text-sm border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
            >
              <option value="400">Regular</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[oklch(0.9200_0.005_20)] p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Type className="h-4 w-4 text-[oklch(0.5200_0.015_25)]" />
          <h3 className="text-xs font-semibold text-[oklch(0.2200_0.015_20)] uppercase tracking-wide">
            Color
          </h3>
        </div>
        <div>
          <label className="block text-xs text-[oklch(0.5200_0.015_25)] mb-1.5">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(component as any).styles?.color || designPalette.titleColor}
              onChange={(e) => {
                const styles = (component as any).styles || {};
                updateComponent(component.id, { ...component, styles: { ...styles, color: e.target.value } } as any);
              }}
              className="w-12 h-10 rounded-lg border border-[oklch(0.9200_0.005_20)] cursor-pointer"
            />
            <input
              type="text"
              value={(component as any).styles?.color || designPalette.titleColor}
              onChange={(e) => {
                const styles = (component as any).styles || {};
                updateComponent(component.id, { ...component, styles: { ...styles, color: e.target.value } } as any);
              }}
              className="flex-1 px-3 py-2 text-sm font-mono border border-[oklch(0.9200_0.005_20)] rounded focus:outline-none focus:ring-2 focus:ring-[oklch(0.6500_0.22_25)]"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

